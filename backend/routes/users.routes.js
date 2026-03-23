const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Customer Routes
router.get('/profile', auth, userController.getProfile);

router.put('/profile', auth, [
  body('fullName').optional().trim(),
  body('phone').optional().trim(),
  body('avatar').optional().trim(),
  body('address').optional()
], validate, userController.updateProfile);

router.put('/change-password', auth, [
  body('oldPassword').notEmpty().withMessage('Vui lòng nhập mật khẩu hiện tại'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải từ 6 ký tự trở lên')
], validate, userController.changePassword);

// Admin Routes
router.get('/', auth, authorize('admin'), userController.getUsers);
router.put('/:id/toggle-status', auth, authorize('admin'), userController.toggleUserStatus);

module.exports = router;
