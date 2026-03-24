const Cart = require('../schemas/cart');
const Product = require('../schemas/products');
const AppError = require('../utils/AppError');

// Helper Lấy/Tạo giỏ hàng
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name slug price salePrice originalPrice images sku isDeleted isActive'
  });
  
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Filter out products that are physically missing or isDeleted
  cart.items = cart.items.filter(item => item.product && !item.product.isDeleted && item.product.isActive);
  await cart.save();

  return cart;
};

// @desc    Lấy giỏ hàng của user
// @route   GET /api/v1/cart
// @access  Private/Customer
exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.userId);
    
    // Tính tổng tạm (Toàn bộ giá sẽ tính theo cấu hình real-time từ DB Product)
    const cartTotal = cart.items.reduce((acc, item) => {
      return acc + (item.product.salePrice * item.quantity);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        cartTotal
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Thêm sản phẩm vào giỏ
// @route   POST /api/v1/cart
// @access  Private/Customer
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.isDeleted || !product.isActive) {
      return next(new AppError('Sản phẩm không tồn tại hoặc đã ngừng bán', 404));
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) cart = await Cart.create({ user: req.user.userId, items: [] });

    // Tìm xem SP đã có trong giỏ chưa
    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      // Có rồi thì cộng dồn EC-16
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Chưa có thì thêm mới
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ success: true, message: 'Đã thêm vào giỏ', data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật số lượng item
// @route   PUT /api/v1/cart/:productId
// @access  Private/Customer
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return next(new AppError('Giỏ hàng trống', 404));
    
    const itemIndex = cart.items.findIndex(p => p.product.toString() === req.params.productId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        // EC-21: Quantity 0 auto remove
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
      res.status(200).json({ success: true, data: cart });
    } else {
      return next(new AppError('Không tìm thấy sản phẩm trong giỏ', 404));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Bỏ 1 item khỏi giỏ
// @route   DELETE /api/v1/cart/:productId
// @access  Private/Customer
exports.removeCartItem = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return next(new AppError('Giỏ hàng trống', 404));

    cart.items = cart.items.filter(p => p.product.toString() !== req.params.productId);
    await cart.save();

    res.status(200).json({ success: true, message: 'Đã xoá khỏi giỏ', data: cart });
  } catch (error) {
    next(error);
  }
};
