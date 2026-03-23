const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const auth = require('../middlewares/auth');

// Toàn bộ thao tác giỏ hàng đều yêu cầu đăng nhập
router.use(auth);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:productId', cartController.updateCartItem);
router.delete('/:productId', cartController.removeCartItem);

module.exports = router;
