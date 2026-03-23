const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments');

// Các Router này thường gọi từ HTTP Callback của cổng TT, do đó KHÔNG cài Auth Middleware
// IPN Server-To-Server
router.get('/vnpay-ipn', paymentController.vnpayIPN);

// UI URL Trả KQ về trình duyệt
router.get('/vnpay-return', paymentController.vnpayReturn);

module.exports = router;
