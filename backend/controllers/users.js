const User = require('../schemas/users');
const AppError = require('../utils/AppError');

// @desc    Get current logged in user profile
// @route   GET /api/v1/users/profile
// @access  Private (Customer/Admin)
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).populate('role', 'name').select('-__v');
    if (!user) {
      return next(new AppError('Không tìm thấy người dùng', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, avatar, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone, avatar, address },
      { new: true, runValidators: true }
    ).populate('role', 'name').select('-__v');

    if (!user) {
      return next(new AppError('Không tìm thấy người dùng', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/v1/users/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Need to explicitly select password
    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return next(new AppError('Không tìm thấy người dùng', 404));
    }

    // Check old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(new AppError('Mật khẩu hiện tại không đúng', 400));
    }

    // Update new password
    user.password = newPassword;
    await user.save(); // Will trigger pre-save hook to hash password

    // Hide password before returning
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list (with pagination)
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { fullName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('role', 'name')
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Lock/Unlock)
// @route   PUT /api/v1/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    // EC-41: Cannot lock own account
    if (req.params.id === req.user.userId.toString()) {
      return next(new AppError('Bạn không thể thay đổi trạng thái của chính mình', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('Không tìm thấy người dùng', 404));
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Tài khoản đã được ${user.isActive ? 'mở khóa' : 'khóa'} thành công`,
      data: {
        _id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};