---
name: payment_integration
description: Integration Dev — Tích hợp cổng thanh toán (VNPay, MoMo, ZaloPay), xử lý callback, verify transaction.
---

# 💳 Payment Integration — E-Commerce NNPTUD

## 1. VAI TRÒ
- Tích hợp cổng thanh toán online (VNPay, MoMo, ZaloPay).
- Xử lý payment flow: create → redirect → callback → verify.
- Cập nhật trạng thái đơn hàng sau thanh toán.
- Đảm bảo bảo mật giao dịch.

## 2. PHƯƠNG THỨC THANH TOÁN

### 2.1. Supported Methods
| Method | Mã | Mô tả | Độ ưu tiên |
|:-------|:---|:------|:-----------|
| COD | `cod` | Thanh toán khi nhận hàng | 🔴 Cao |
| Bank Transfer | `banking` | Chuyển khoản ngân hàng | 🟡 TB |
| VNPay | `vnpay` | Cổng thanh toán VNPay | 🟡 TB |
| MoMo | `momo` | Ví MoMo | 🟢 Thấp |
| ZaloPay | `zalopay` | Ví ZaloPay | 🟢 Thấp |

### 2.2. Payment Flow
```
Customer → Checkout → Chọn phương thức
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
        COD           VNPay/MoMo       Banking
          │               │                │
          │         Create Payment URL      │
          │               │                │
          │         Redirect to Gateway     │
          │               │                │
          │         Customer Pays           │
          │               │                │
          │         Gateway Callback        │
          │               │                │
          ▼               ▼                ▼
    Order: PENDING   Order: CONFIRMED   Order: PENDING
    isPaid: false    isPaid: true       isPaid: false (manual verify)
```

## 3. VNPAY INTEGRATION

### 3.1. Environment Variables
```env
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/result
VNPAY_IPN_URL=http://localhost:3000/api/v1/payments/vnpay-ipn
```

### 3.2. Backend Implementation
```javascript
// routes/payments.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const querystring = require('qs');

// Create VNPay payment URL
router.post('/create-vnpay', authMiddleware, async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;
    
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    const date = new Date();
    const createDate = formatDate(date, 'yyyyMMddHHmmss');
    const txnRef = `${orderId}_${Date.now()}`;

    let vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay requires amount * 100
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.ip,
      vnp_CreateDate: createDate,
    };

    // Sort params & create signature
    vnpParams = sortObject(vnpParams);
    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnpParams.vnp_SecureHash = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnpParams, { encode: false })}`;

    res.json({ success: true, data: { paymentUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// VNPay IPN (Instant Payment Notification)
router.get('/vnpay-ipn', async (req, res) => {
  try {
    const vnpParams = req.query;
    const secureHash = vnpParams.vnp_SecureHash;
    
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sortedParams = sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const responseCode = vnpParams.vnp_ResponseCode;
      if (responseCode === '00') {
        // Payment success — update order
        const orderId = vnpParams.vnp_TxnRef.split('_')[0];
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paidAt: new Date(),
          status: 'confirmed',
          'payment.transactionId': vnpParams.vnp_TransactionNo,
          'payment.bankCode': vnpParams.vnp_BankCode,
        });
        res.json({ RspCode: '00', Message: 'Confirm Success' });
      } else {
        res.json({ RspCode: '00', Message: 'Confirm Success' });
      }
    } else {
      res.json({ RspCode: '97', Message: 'Invalid Checksum' });
    }
  } catch (error) {
    res.json({ RspCode: '99', Message: 'Unknown error' });
  }
});

// Helper functions
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => { sorted[key] = obj[key]; });
  return sorted;
}

function formatDate(date, format) {
  const pad = (n) => (n < 10 ? '0' + n : n);
  return format
    .replace('yyyy', date.getFullYear())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('dd', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()));
}

module.exports = router;
```

### 3.3. Frontend — Payment Component
```tsx
// pages/Checkout/PaymentMethods.tsx
const PaymentMethods = ({ onSelect, selected }) => {
  const methods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '🚚' },
    { id: 'vnpay', label: 'Thanh toán qua VNPay', icon: '💳' },
    { id: 'banking', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  ];

  return (
    <div className="payment-methods">
      <h3>Phương thức thanh toán</h3>
      {methods.map(method => (
        <label key={method.id} className={`method ${selected === method.id ? 'active' : ''}`}>
          <input
            type="radio"
            name="payment"
            value={method.id}
            checked={selected === method.id}
            onChange={() => onSelect(method.id)}
          />
          <span>{method.icon} {method.label}</span>
        </label>
      ))}
    </div>
  );
};
```

## 4. PAYMENT SCHEMA
```javascript
// Thêm vào Order schema hoặc tạo riêng
payment: {
  method: {
    type: String,
    enum: ['cod', 'vnpay', 'momo', 'zalopay', 'banking'],
    required: true
  },
  transactionId: String,
  bankCode: String,
  amount: Number,
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: Date
}
```

## 5. SECURITY CHECKLIST
- [ ] Verify checksum/signature cho mọi callback
- [ ] Verify amount match với order
- [ ] Idempotency — Handle duplicate callbacks
- [ ] Log mọi transaction
- [ ] HTTPS only cho production
- [ ] Env variables cho secrets (KHÔNG hardcode)
- [ ] Rate limiting cho payment endpoints

## 6. TESTING
```
# VNPay Sandbox:
Card Number: 9704198526191432198
Card Name: NGUYEN VAN A
Issue Date: 07/15
OTP: 123456
```
