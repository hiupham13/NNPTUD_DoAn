const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.use(auth);

// Customer routes
router.post('/', orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.put('/:id/cancel', orderController.updateOrderStatus); 

// Admin routes
router.use(authorize('admin'));
router.get('/admin', orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
