const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.use(auth);
router.use(authorize('admin'));

router.get('/stats', adminController.getStats);
router.get('/stats/revenue-chart', adminController.getRevenueChart);
router.get('/stats/orders-chart', adminController.getOrdersChart);

module.exports = router;
