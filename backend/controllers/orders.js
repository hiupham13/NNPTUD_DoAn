const mongoose = require('mongoose');
const Order = require('../schemas/orders');
const Cart = require('../schemas/cart');
const Inventory = require('../schemas/inventories');
const Coupon = require('../schemas/coupons');
const AppError = require('../utils/AppError');
const { buildVNPayUrl } = require('../utils/vnpay');

// Hàm Helper Tự Sinh Mã Đơn format `ORD-YYYYMMDD-XXXX`
const generateOrderCode = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // 20260324
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase(); // A7F2
  return `ORD-${dateStr}-${randomStr}`;
};

// @desc    Tạo đơn hàng Mới (Checkout) - Snapshot & Mongoose Transaction
// @route   POST /api/v1/orders
// @access  Private/Customer
exports.createOrder = async (req, res, next) => {

  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    // 1. Fetch Cart của user + filter out missing products
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new AppError('Giỏ hàng trống', 400);
    }
    const filteredItems = cart.items.filter(item => item.product && !item.product.isDeleted && item.product.isActive);
    if (filteredItems.length === 0) {
      throw new AppError('Tất cả sản phẩm trong giỏ đã ngừng bán', 400);
    }

    let totalAmount = 0;
    const orderItemsSnapshot = [];

    // 2. Loop qua từng món trong Giỏ -> Validate Stock -> Tính Subtotal -> Lập Snapshot
    for (const item of filteredItems) {
      const dbProduct = item.product;
      const quantity = item.quantity;

      // Kéo Kho
      const inv = await Inventory.findOne({ product: dbProduct._id });
      if (!inv || (inv.stock - inv.reserved) < quantity) {
        throw new AppError(`Sản phẩm '${dbProduct.name}' không đủ số lượng tồn kho`, 400);
      }

      // Snapshot Data
      const priceAtPurchase = dbProduct.salePrice;
      const subTotal = priceAtPurchase * quantity;
      
      orderItemsSnapshot.push({
        product: dbProduct._id,
        title: dbProduct.name,
        sku: dbProduct.sku,
        slug: dbProduct.slug || '',
        price: priceAtPurchase,
        originalPrice: dbProduct.originalPrice,
        discountPercent: dbProduct.discountPercent,
        image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : '',
        movement: dbProduct.movement || '',
        gender: dbProduct.gender || '',
        quantity: quantity,
        subtotal: subTotal
      });

      totalAmount += subTotal;

      // Trừ Kho và Khóa hàng (Reserved++)
      inv.reserved += quantity;
      await inv.save();
    }

    // 3. Phí Vận Chuyển: Rule Freeship >= 50M
    let shippingFee = 50000;
    if (totalAmount >= 50000000) {
      shippingFee = 0;
    }

    // 4. Validate Coupon nếu có (áp dụng lên totalAmount)
    let discount = 0;
    let couponRecord = null;
    let finalCode = '';

    if (couponCode) {
      couponRecord = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, isDeleted: false });
      if (!couponRecord || new Date() > new Date(couponRecord.expiresAt)) {
        throw new AppError('Mã giảm giá không tồn tại hoặc đã hết hạn', 400);
      }
      if (couponRecord.maxUses && couponRecord.usedCount >= couponRecord.maxUses) {
        throw new AppError('Mã đã hết lượt dùng', 400);
      }
      if (totalAmount < couponRecord.minOrderAmount) {
        throw new AppError(`Đơn hàng tối thiểu phải từ ${couponRecord.minOrderAmount.toLocaleString()}`, 400);
      }

      if (couponRecord.discountType === 'percent') {
        discount = Math.round(totalAmount * (couponRecord.discountValue / 100));
        if (couponRecord.maxDiscount) discount = Math.min(discount, couponRecord.maxDiscount);
      } else {
        discount = couponRecord.discountValue;
      }
      discount = Math.min(discount, totalAmount); // không giảm lố
      
      // Update usage
      couponRecord.usedCount += 1;
      await couponRecord.save();
      finalCode = couponRecord.code;
    }

    // 5. Build Final Amount
    const finalAmount = totalAmount + shippingFee - discount;

    // 6. Lưu Order Record theo định dạng Schema
    const newOrder = await Order.create([{
      orderCode: generateOrderCode(),
      user: req.user.userId,
      items: orderItemsSnapshot,
      shippingAddress,
      shippingFee,
      coupon: couponRecord ? couponRecord._id : null,
      couponCode: finalCode,
      discount,
      totalAmount,
      finalAmount,
      paymentMethod,
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending' // Chặn Pending của COD, COD->Confirm. VNpay->Pending
    }]);

    // 7. Clear the Cart.
    cart.items = []; // Xoá sạch (Vì FCFS)
    await cart.save();

    // 8. Tạo VNPay URL Nếu Khách Chọn
    let paymentUrl = '';
    if (paymentMethod === 'vnpay') {
      paymentUrl = buildVNPayUrl(newOrder[0], req);
    }

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: newOrder[0],
      paymentUrl: paymentUrl || undefined
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy lịch sử Đơn của User Đang Đăng nhập
// @route   GET /api/v1/orders
// @access  Private/Customer
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.userId, isDeleted: false })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin lấy full list đơn
// @route   GET /api/v1/orders/admin
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật status / Huỷ đơn
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin|Customer (Quyền sẽ kiểm tra bên trong)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, cancelReason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order || order.isDeleted) return next(new AppError('Đơn hàng không tồn tại', 404));

    // Phân quyền bảo vệ: Nếu là Customer, chỉ có thể set cancel (Huỷ) khi đang `pending` or `confirmed`
    if (req.user.role !== 'admin') {
      if (order.user.toString() !== req.user.userId.toString()) {
        return next(new AppError('Bạn không có quyền sửa đơn của người khác', 403));
      }
      if (status !== 'cancelled') {
        return next(new AppError('Hành động không hợp lệ với tư cách Khách hàng', 400));
      }
      if (!['pending', 'confirmed'].includes(order.status)) {
        return next(new AppError('Đơn hàng đã được xử lý, không thể huỷ tự do', 400));
      }
    }

    // Flow đổi sang "cancelled" -> Trả kho
    if (status === 'cancelled' && order.status !== 'cancelled') {
      order.status = 'cancelled';
      order.cancelledAt = new Date();
      order.cancelReason = cancelReason || 'User/Admin cancelled';

      // Trả Trạng thái giam hàng (Trừ Reserved)
      for (const item of order.items) {
        if (item.product) { 
           await Inventory.updateOne(
             { product: item.product },
             { $inc: { reserved: -item.quantity } } 
           );
        }
      }

      // Trả lại lượt Coupon nếu có
      if (order.coupon) {
         await Coupon.updateOne(
           { _id: order.coupon },
           { $inc: { usedCount: -1 } }
         );
      }
    } else if (status === 'completed' && order.status !== 'completed') {
      order.status = 'completed';
      // Trừ cứng Stock và xoá Reserved, tăng SoldCount
      for (const item of order.items) {
        if (item.product) { 
           await Inventory.updateOne(
             { product: item.product },
             { $inc: { reserved: -item.quantity, stock: -item.quantity, soldCount: item.quantity } } 
           );
        }
      }
    } else {
      order.status = status; // admin freely update
    }

    await order.save();
    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: order });

  } catch (error) {
    next(error);
  }
};
