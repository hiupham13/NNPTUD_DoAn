const crypto = require('crypto');
const { body } = require('express-validator');
const User = require('../schemas/users');
const Role = require('../schemas/roles');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// ============ VALIDATION RULES ============

exports.registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username là bắt buộc')
    .isLength({ min: 3, max: 30 }).withMessage('Username từ 3-30 ký tự'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Mật khẩu là bắt buộc')
    .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
  body('fullName')
    .optional()
    .trim(),
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Mật khẩu là bắt buộc'),
];

exports.forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
];

exports.resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Mật khẩu mới là bắt buộc')
    .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
];

// ============ CONTROLLERS ============

/**
 * POST /api/v1/auth/register
 * Public — Đăng ký tài khoản mới
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check duplicate username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(new AppError('Username đã tồn tại', 409));
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(new AppError('Email đã tồn tại', 409));
    }

    // Find customer role
    const customerRole = await Role.findOne({ name: 'customer' });
    if (!customerRole) {
      return next(new AppError('Lỗi hệ thống: role customer chưa được tạo', 500));
    }

    // Create user (password auto-hashed by pre-save hook)
    const user = await User.create({
      username,
      email,
      password,
      fullName: fullName || '',
      role: customerRole._id,
    });

    // Response (exclude password)
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: 'customer',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/login
 * Public — Đăng nhập
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email })
      .select('+password')
      .populate('role', 'name');

    if (!user) {
      return next(new AppError('Email hoặc mật khẩu không đúng', 401));
    }

    // Check if user is active (BR-08)
    if (!user.isActive) {
      return next(new AppError('Tài khoản đã bị khoá. Vui lòng liên hệ admin.', 403));
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Email hoặc mật khẩu không đúng', 401));
    }

    // Generate JWT
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role.name,
    });

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/forgot-password
 * Public — Gửi email reset password
 * BR-06: Luôn trả success dù email không tồn tại
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const successMessage = 'Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu';

    // Find user
    const user = await User.findOne({ email });

    // BR-06: Luôn trả success (bảo mật)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save to user (BR-05: expire 15 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #2C2C2C; font-family: 'Playfair Display', Georgia, serif;">Luxury Watch Store</h2>
        <hr style="border: none; border-top: 1px solid #C9A96E; margin: 20px 0;" />
        <p>Xin chào <strong>${user.fullName || user.username}</strong>,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn nút bên dưới để tiếp tục:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #C9A96E; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: 600;">
            Đặt lại mật khẩu
          </a>
        </div>
        <p style="color: #888; font-size: 13px;">Link này sẽ hết hạn sau <strong>15 phút</strong>.</p>
        <p style="color: #888; font-size: 13px;">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Đặt lại mật khẩu — Luxury Watch Store',
        html,
      });
    } catch (emailError) {
      // Email fail → clear token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Không thể gửi email. Vui lòng thử lại sau.', 500));
    }

    res.status(200).json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/reset-password/:token
 * Public — Đặt lại mật khẩu bằng token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token from URL to compare with DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token không hợp lệ hoặc đã hết hạn', 400));
    }

    // Update password (auto-hashed by pre-save hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.',
    });
  } catch (error) {
    next(error);
  }
};
