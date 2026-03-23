const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

// Admin only (Require Authentication & Authorization)
router.use(auth);
router.use(authorize('admin'));

// Route upload 1 file với field 'image'
router.post('/', upload.single('image'), uploadController.uploadSingle);

// Route upload nhiều files (Tối đa 5 file, input name là 'images')
router.post('/multiple', upload.array('images', 5), uploadController.uploadMultiple);

// Bắt lỗi File Upload Error riêng của Multer trên Route (chặn crash server)
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Dung lượng file tối đa là 5MB' });
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `Lỗi tải file: ${err.message}` });
  }
  next(err); // Nhường cho Global Error Handler
});

module.exports = router;
