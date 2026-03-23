const Coupon = require('../schemas/coupons');
const AppError = require('../utils/AppError');

// @desc    Lấy d/s coupon
// @route   GET /api/v1/coupons
// @access  Private/Admin
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo mã giảm giá
// @route   POST /api/v1/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo mã thành công', data: coupon });
  } catch (error) {
    if (error.code === 11000) return next(new AppError('Mã Code đã tồn tại', 400));
    next(error);
  }
};

// @desc    Sửa mã giảm giá
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return next(new AppError('Không tìm thấy mã giảm giá', 404));
    
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) return next(new AppError('Mã Code đã tồn tại', 400));
    next(error);
  }
};

// @desc    Xoá mã (Soft Delete)
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new AppError('Không tìm thấy mã giảm giá', 404));

    coupon.isDeleted = true;
    coupon.isActive = false;
    await coupon.save();

    res.status(200).json({ success: true, message: 'Xóa mã thành công' });
  } catch (error) {
    next(error);
  }
};

// @desc    Khách hàng nhập kiểm tra mã
// @route   POST /api/v1/coupons/validate
// @access  Private/Customer
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return next(new AppError('Vui lòng nhập mã', 400));

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return next(new AppError('Mã không tồn tại hoặc đã bị khóa', 404));

    if (new Date() > new Date(coupon.expiresAt)) {
      return next(new AppError('Mã giảm giá đã hết hạn', 400));
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return next(new AppError('Mã đã hết lượt sử dụng', 400));
    }

    if (orderAmount < coupon.minOrderAmount) {
      return next(new AppError(`Đơn hàng tối thiểu phải từ ${coupon.minOrderAmount.toLocaleString()} VNĐ`, 400));
    }

    // Calc discount
    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = Math.round(orderAmount * (coupon.discountValue / 100));
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else {
      discountAmount = coupon.discountValue;
    }

    // Không giảm quá số tiền
    discountAmount = Math.min(discountAmount, orderAmount);

    res.status(200).json({
      success: true,
      message: 'Áp dụng mã thành công',
      data: {
        couponId: coupon._id,
        code: coupon.code,
        discountAmount,
      }
    });

  } catch (error) {
    next(error);
  }
};
