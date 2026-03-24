const Inventory = require('../schemas/inventories');
const AppError = require('../utils/AppError');

// @desc    Get all inventory (with product info)
// @route   GET /api/v1/inventory
// @access  Private/Admin
exports.getInventory = async (req, res, next) => {
  try {
    const { search } = req.query;
    let matchStage = {};

    const pipeline = [
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      { $match: { 'productInfo.isDeleted': false } }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'productInfo.name': { $regex: search, $options: 'i' } },
            { 'productInfo.sku': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    pipeline.push({ $sort: { 'productInfo.name': 1 } });

    const items = await Inventory.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock for a product
// @route   PUT /api/v1/inventory/:id
// @access  Private/Admin
exports.updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || stock < 0) {
      return next(new AppError('Số lượng tồn kho phải >= 0', 400));
    }

    const inv = await Inventory.findById(req.params.id);
    if (!inv) {
      return next(new AppError('Không tìm thấy bản ghi tồn kho', 404));
    }

    inv.stock = Number(stock);
    await inv.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật tồn kho thành công',
      data: inv
    });
  } catch (error) {
    next(error);
  }
};
