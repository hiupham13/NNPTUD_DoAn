const AppError = require('../utils/AppError');

// @desc    Upload 1 hình ảnh
// @route   POST /api/v1/upload
// @access  Private/Admin
exports.uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Vui lòng cung cấp file ảnh cần upload', 400));
    }

    res.status(200).json({
      success: true,
      message: 'Upload file thành công',
      data: {
        url: req.file.path, // Cloudinary trả về URL ở `path` qua multer
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload tối đa 5 hình ảnh
// @route   POST /api/v1/upload/multiple
// @access  Private/Admin
exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('Vui lòng chọn ít nhất 1 hình ảnh để upload', 400));
    }

    const imageUrls = req.files.map((file) => file.path);

    res.status(200).json({
      success: true,
      message: 'Upload file thành công',
      data: {
        urls: imageUrls,
      }
    });
  } catch (error) {
    next(error);
  }
};
