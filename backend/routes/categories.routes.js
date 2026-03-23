const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Admin routes
router.use(auth);
router.use(authorize('admin'));

router.post('/', [
  body('name').notEmpty().withMessage('Tên danh mục là bắt buộc').trim()
], validate, categoryController.createCategory);

router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Tên danh mục không được để trống').trim()
], validate, categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
