const request = require('supertest');
const app = require('../../app');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');
const Category = require('../../schemas/categories');
const Product = require('../../schemas/products');
const Inventory = require('../../schemas/inventories');
const Cart = require('../../schemas/cart');
const Coupon = require('../../schemas/coupons');
const Order = require('../../schemas/orders');
const jwt = require('jsonwebtoken');

const generateToken = (userId, roleName) => {
  return jwt.sign({ userId, roleName }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
};

describe('D7 Integration Tests - Orders & Cart', () => {
  let customerUser, adminUser, customerToken, adminToken, category, product1, product2;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    const adminRole = await Role.create({ name: 'admin', description: 'Admin' });
    const customerRole = await Role.create({ name: 'customer', description: 'Customer' });
    
    adminUser = await User.create({
      username: 'admin1', email: 'admin1@test.com', password: 'password123',
      role: adminRole._id, isActive: true
    });
    adminToken = generateToken(adminUser._id, 'admin');

    customerUser = await User.create({
      username: 'cust1', email: 'cust1@test.com', password: 'password123',
      role: customerRole._id, isActive: true
    });
    customerToken = generateToken(customerUser._id, 'customer');

    category = await Category.create({ name: 'Rolex' });
    
    // Product 1 (50M) - triggers freeship
    product1 = await Product.create({
      name: 'Rolex Submariner', sku: 'R-SUB-101', 
      price: 50000000, salePrice: 50000000, category: category._id
    });
    // Triggers Inventory creation since we updated Product create controller.
    // Wait, testing Product.create directly bypasses Controller. So we create Inventory manually:
    await Inventory.create({ product: product1._id, stock: 10, reserved: 0, soldCount: 0 });

    // Product 2 (1M) - no freeship
    product2 = await Product.create({
      name: 'Casio Vintage', sku: 'C-V-1', 
      price: 1000000, salePrice: 1000000, category: category._id
    });
    await Inventory.create({ product: product2._id, stock: 2, reserved: 0, soldCount: 0 });
  });

  describe('1. Cart Lifecycle', () => {
    it('should add items to cart and calculate correct total', async () => {
      const res = await request(app)
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId: product1._id, quantity: 2 });
      
      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(1);
      
      const getRes = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${customerToken}`);
        
      expect(getRes.status).toBe(200);
      expect(getRes.body.data.cartTotal).toBe(100000000); // 50M * 2
    });

    it('should combine quantity if adding same item', async () => {
      await request(app).post('/api/v1/cart').set('Authorization', `Bearer ${customerToken}`).send({ productId: product2._id, quantity: 1 });
      const res = await request(app).post('/api/v1/cart').set('Authorization', `Bearer ${customerToken}`).send({ productId: product2._id, quantity: 2 });
      
      expect(res.body.data.items[0].quantity).toBe(3);
    });
  });

  describe('2. Coupon Validation', () => {
    it('should apply valid coupon correctly', async () => {
      await Coupon.create({
        code: 'SALE50', discountType: 'fixed', discountValue: 50000,
        expiresAt: new Date(Date.now() + 86400000), isActive: true, minOrderAmount: 0
      });

      const res = await request(app)
        .post('/api/v1/coupons/validate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ code: 'SALE50', orderAmount: 1000000 });

      expect(res.status).toBe(200);
      expect(res.body.data.discountAmount).toBe(50000);
    });
  });

  describe('3. Order & Checkout Workflow', () => {
    it('should fully process checkout: snapshot, inventory deduct, free ship, clear cart', async () => {
      await request(app).post('/api/v1/cart').set('Authorization', `Bearer ${customerToken}`).send({ productId: product1._id, quantity: 1 });

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: { fullName: 'A', phone: '1', address: 'HN' },
          paymentMethod: 'cod'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.items[0].price).toBe(50000000);
      expect(res.body.data.totalAmount).toBe(50000000);
      expect(res.body.data.shippingFee).toBe(0); // Free ship >= 50M
      expect(res.body.data.finalAmount).toBe(50000000);
      expect(res.body.data.status).toBe('confirmed');

      // Check inventory deduct
      const invAfter = await Inventory.findOne({ product: product1._id });
      expect(invAfter.reserved).toBe(1);

      // Check cart is empty
      const cartAfter = await Cart.findOne({ user: customerUser._id });
      expect(cartAfter.items.length).toBe(0);
    });

    it('should throw out-of-stock when trying to over-buy', async () => {
      // product2 stock = 2
      await request(app).post('/api/v1/cart').set('Authorization', `Bearer ${customerToken}`).send({ productId: product2._id, quantity: 3 });

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: { fullName: 'A', phone: '1', address: 'HN' },
          paymentMethod: 'cod'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('không đủ số lượng tồn kho');
    });

    it('Admin can cancel pending/confirmed order and inventory should restore', async () => {
      await request(app).post('/api/v1/cart').set('Authorization', `Bearer ${customerToken}`).send({ productId: product2._id, quantity: 1 });
      const orderRes = await request(app).post('/api/v1/orders').set('Authorization', `Bearer ${customerToken}`)
        .send({ shippingAddress: { fullName: 'A', phone: '1', address: 'HN' }, paymentMethod: 'cod' });
      
      const orderId = orderRes.body.data._id;
      
      // Admin cancel
      const cancelRes = await request(app)
        .put(`/api/v1/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' });

      expect(cancelRes.status).toBe(200);
      expect(cancelRes.body.data.status).toBe('cancelled');

      // Cancelled -> Stock holds true, Reserved minus 1
      const invAfter = await Inventory.findOne({ product: product2._id });
      expect(invAfter.reserved).toBe(0); // Restored from 1
      expect(invAfter.stock).toBe(2); // Physical doesn't change unless completed
    });
  });
});
