const router = require('express').Router();
const validate = require('../middlewares/validate');
const authController = require('../controllers/auth.controller');

// POST /api/v1/auth/register
router.post(
  '/register',
  authController.registerValidation,
  validate,
  authController.register
);

// POST /api/v1/auth/login
router.post(
  '/login',
  authController.loginValidation,
  validate,
  authController.login
);

// POST /api/v1/auth/forgot-password
router.post(
  '/forgot-password',
  authController.forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

// POST /api/v1/auth/reset-password/:token
router.post(
  '/reset-password/:token',
  authController.resetPasswordValidation,
  validate,
  authController.resetPassword
);

module.exports = router;
