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
  body('name')
    .notEmpty().withMessage('Tên sản phẩm là bắt buộc')
    .trim()
    .matches(/^[^~`!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/]+$/).withMessage('Tên sản phẩm không được chứa ký tự đặc biệt'),
  body('sku').notEmpty().withMessage('Mã SKU là bắt buộc').trim(),
  body('price').isNumeric().withMessage('Giá bán phải là số hợp lệ').notEmpty()
    .custom(val => { if (val <= 0) throw new Error('Vui lòng nhập giá hợp lệ'); return true; }),
  body('category').notEmpty().withMessage('Mã danh mục không được để trống')
], validate, productController.createProduct);

router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Tên không được rỗng')
    .matches(/^[^~`!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/]+$/).withMessage('Tên sản phẩm không được chứa ký tự đặc biệt'),
  body('price')
    .optional()
    .isNumeric().withMessage('Giá phải là số hợp lệ')
    .custom(val => { if (val <= 0) throw new Error('Vui lòng nhập giá hợp lệ'); return true; })
], validate, productController.updateProduct);

router.delete('/:id', productController.deleteProduct);
router.post('/bulk-delete', productController.bulkDeleteProducts);

const multer = require('multer');
const uploadExcel = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
router.post('/import-excel', uploadExcel.single('file'), productController.importProductsFromExcel);

module.exports = router;
