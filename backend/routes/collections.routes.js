const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collections');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Public routes
router.get('/', collectionController.getCollections);
router.get('/:slug', collectionController.getCollectionBySlug);

// Admin routes
router.use(auth);
router.use(authorize('admin'));

router.post('/', [
  body('name').notEmpty().withMessage('Tên bộ sưu tập là bắt buộc').trim()
], validate, collectionController.createCollection);

router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Tên bộ sưu tập không được để trống').trim()
], validate, collectionController.updateCollection);

router.delete('/:id', collectionController.deleteCollection);

module.exports = router;
