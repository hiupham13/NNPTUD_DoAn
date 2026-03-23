const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../schemas/users');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Vui lòng đăng nhập để tiếp tục', 401));
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user still exists and is active
    const user = await User.findById(decoded.userId).populate('role', 'name');
    if (!user) {
      return next(new AppError('Tài khoản không tồn tại', 401));
    }
    if (!user.isActive) {
      return next(new AppError('Tài khoản đã bị khoá', 403));
    }

    // Attach user to request
    req.user = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role.name,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token không hợp lệ', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token đã hết hạn, vui lòng đăng nhập lại', 401));
    }
    next(error);
  }
};

module.exports = auth;
