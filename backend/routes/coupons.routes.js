const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupons');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.use(auth);

// Customer có thể validate mã
router.post('/validate', couponController.validateCoupon);

// Chỉ Admin mới được quản lý
router.use(authorize('admin'));
router.get('/', couponController.getCoupons);
router.post('/', couponController.createCoupon);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
