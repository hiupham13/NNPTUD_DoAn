const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.use(auth);

// Admin routes (đặt TRƯỚC /:id để tránh bị match nhầm)
router.get('/admin', authorize('admin'), orderController.getAllOrders);

// Customer routes
router.post('/', orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.updateOrderStatus);

// Admin status update
router.put('/:id/status', authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
