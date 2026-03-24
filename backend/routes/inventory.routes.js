const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.use(auth);
router.use(authorize('admin'));

router.get('/', inventoryController.getInventory);
router.put('/:id', inventoryController.updateStock);

module.exports = router;
