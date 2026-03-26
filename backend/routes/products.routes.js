const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Public routes
router.get('/', productController.getProducts);
router.get('/id/:id', auth, authorize('admin'), productController.getProductById);
router.get('/:slug', productController.getProductBySlug);

// Admin routes
router.use(auth);
router.use(authorize('admin'));

router.post('/', [
  body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc').trim(),
  body('sku').notEmpty().withMessage('Mã SKU là bắt buộc').trim(),
  body('price').isNumeric().withMessage('Giá bán phải là số hợp lệ').notEmpty(),
  body('category').notEmpty().withMessage('Mã danh mục không được để trống')
], validate, productController.createProduct);

router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Tên không được rỗng'),
  body('price').optional().isNumeric().withMessage('Giá phải là số hợp lệ')
], validate, productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

const multer = require('multer');
const uploadExcel = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
router.post('/import-excel', uploadExcel.single('file'), productController.importProductsFromExcel);

module.exports = router;
