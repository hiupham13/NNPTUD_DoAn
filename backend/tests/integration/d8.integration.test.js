const request = require('supertest');
const app = require('../../app');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');
const Order = require('../../schemas/orders');
const Inventory = require('../../schemas/inventories');
const Payment = require('../../schemas/payments');
const jwt = require('jsonwebtoken');

// Thay vì gọi VNPAY utils logic, sinh ra mock object checksum ok
const crypto = require('crypto');
const qs = require('qs');

const generateToken = (userId, roleName) => {
  return jwt.sign({ userId, roleName }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
};

// Helper tạo 1 query URL có hash chuẩn với SECRET giả lập
function createValidVNPayMockQuery(secretKey, params) {
  const vnp_Params = { ...params };
  const strKeys = Object.keys(vnp_Params).sort();
  const sorted = {};
  for(let i = 0; i < strKeys.length; i++){
      sorted[strKeys[i]] = encodeURIComponent(vnp_Params[strKeys[i]]).replace(/%20/g, '+');
  }
  const signData = qs.stringify(sorted, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  return vnp_Params;
}

describe('D8 Integration Tests - VNPay Payments', () => {
  let customerUser, token, testOrder, testSecret;

  beforeAll(() => {
    process.env.VNP_HASHSECRET = 'TESTSECRET123';
    testSecret = process.env.VNP_HASHSECRET;
    // Bật cleanup cron chạy manual kịch bản
    process.env.NODE_ENV = 'test'; 
  });

  beforeEach(async () => {
    const custRole = await Role.create({ name: 'customer' });
    customerUser = await User.create({
      username: 'cust_vnpay', email: 'vnpay@test.com', password: 'password123', role: custRole._id, isActive: true
    });
    token = generateToken(customerUser._id, 'customer');

    // Tạo đơn nháp Order
    testOrder = await Order.create({
      orderCode: 'ORD-TEST-1234',
      user: customerUser._id,
      items: [{
        product: null,
        title: 'Watch test',
        sku: 'TEST-SKU',
        quantity: 1,
        price: 100000,
        subtotal: 100000
      }],
      shippingAddress: { fullName: 'A', phone: '1', address: 'A' },
      shippingFee: 0,
      totalAmount: 100000,
      finalAmount: 100000,
      paymentMethod: 'vnpay',
      status: 'pending' // Chờ thanh toán
    });
  });

  describe('Server-to-Server IPN Workflow', () => {
    it('Should reject Invalid Checksum', async () => {
      const res = await request(app).get('/api/v1/payments/vnpay-ipn?vnp_Amount=10000000&vnp_TxnRef=ORD-TEST-1234&vnp_SecureHash=fakeHash');
      expect(res.body.RspCode).toBe('97');
      expect(res.body.Message).toBe('Invalid Checksum');
    });

    it('Should confirm successful payment when RspCode 00 and exact Amount', async () => {
      // Amount truyền vào cho VNPay *= 100
      const validQuery = createValidVNPayMockQuery(testSecret, {
        vnp_Amount: '10000000', // 100,000 * 100
        vnp_TxnRef: 'ORD-TEST-1234',
        vnp_ResponseCode: '00',
        vnp_TransactionNo: '13579',
        vnp_BankCode: 'VNPAY'
      });

      const res = await request(app).get('/api/v1/payments/vnpay-ipn').query(validQuery);

      expect(res.status).toBe(200);
      expect(res.body.RspCode).toBe('00');
      
      // DB Assert
      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder.isPaid).toBe(true);
      expect(updatedOrder.status).toBe('processing');

      const paymentRecord = await Payment.findOne({ order: testOrder._id });
      expect(paymentRecord).not.toBeNull();
      expect(paymentRecord.status).toBe('success');
      expect(paymentRecord.vnpayTransactionId).toBe('13579');
    });

    it('Should block duplicate exact IPN (EC-44)', async () => {
      // First update manually
      testOrder.isPaid = true;
      testOrder.status = 'processing';
      await testOrder.save();

      const validQuery = createValidVNPayMockQuery(testSecret, {
        vnp_Amount: '10000000',
        vnp_TxnRef: 'ORD-TEST-1234',
        vnp_ResponseCode: '00'
      });

      const res = await request(app).get('/api/v1/payments/vnpay-ipn').query(validQuery);
      
      // VNPay require ack code `02` for Already Confirmed
      expect(res.body.RspCode).toBe('02');
    });

    it('Should cancel Order if VNPay throws error other than 00 (e.g. 24 user cancel card)', async () => {
      // Gán Inventory giả lập xem có nhả hàng ko
      const fakeProduct = await require('../../schemas/products').create({
        name: 'Casio', sku: 'CASIO-01', price: 1000, category: new (require('mongoose').Types.ObjectId)()
      });
      await Inventory.create({ product: fakeProduct._id, stock: 5, reserved: 2 });
      
      testOrder.items[0].product = fakeProduct._id;
      testOrder.items[0].quantity = 2; // Đang giam 2 cái
      await testOrder.save();

      const validQuery = createValidVNPayMockQuery(testSecret, {
        vnp_Amount: '10000000',
        vnp_TxnRef: 'ORD-TEST-1234',
        vnp_ResponseCode: '24' // Hủy thanh toán màn hình VNP
      });

      const res = await request(app).get('/api/v1/payments/vnpay-ipn').query(validQuery);
      
      expect(res.body.RspCode).toBe('00'); // Vẫn OK để VNPay ngừng spam Webhook
      
      const dbOrder = await Order.findById(testOrder._id);
      expect(dbOrder.status).toBe('cancelled');
      
      const invAfter = await Inventory.findOne({ product: fakeProduct._id });
      expect(invAfter.reserved).toBe(0); // Trả lại 2 cái => 2 - 2 = 0
    });
  });
});
