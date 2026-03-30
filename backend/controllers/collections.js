const Collection = require('../schemas/collections');
const Product = require('../schemas/products');
const xlsx = require('xlsx');
const AppError = require('../utils/AppError');

// @desc    Get all active collections
// @route   GET /api/v1/collections
// @access  Public
exports.getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ isActive: true, isDeleted: false })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get collection by slug
// @route   GET /api/v1/collections/:slug
// @access  Public
exports.getCollectionBySlug = async (req, res, next) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug, isDeleted: false })
      .select('-__v');

    if (!collection) {
      return next(new AppError('Không tìm thấy Bộ sưu tập', 404));
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create collection
// @route   POST /api/v1/collections
// @access  Private/Admin
exports.createCollection = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    const collection = await Collection.create({
      name,
      description,
      image,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'Tạo bộ sưu tập thành công',
      data: collection,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Tên bộ sưu tập đã tồn tại', 400));
    }
    next(error);
  }
};

// @desc    Update collection
// @route   PUT /api/v1/collections/:id
// @access  Private/Admin
exports.updateCollection = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    let collection = await Collection.findById(req.params.id);
    if (!collection || collection.isDeleted) {
      return next(new AppError('Không tìm thấy Bộ sưu tập', 404));
    }

    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (image !== undefined) collection.image = image;
    if (isActive !== undefined) collection.isActive = isActive;

    await collection.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật bộ sưu tập thành công',
      data: collection,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Tên bộ sưu tập đã tồn tại', 400));
    }
    next(error);
  }
};

// @desc    Delete collection (soft delete + EC-02)
// @route   DELETE /api/v1/collections/:id
// @access  Private/Admin
exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection || collection.isDeleted) {
      return next(new AppError('Không tìm thấy Bộ sưu tập', 404));
    }

    // EC-02: Remove reference from Products (Set product.collectionRef = null)
    await Product.updateMany(
      { collectionRef: collection._id },
      { $set: { collectionRef: null } }
    );

    collection.isDeleted = true;
    collection.isActive = false;
    await collection.save();

    res.status(200).json({
      success: true,
      message: 'Xóa bộ sưu tập và gỡ liên kết sản phẩm thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import collections from Excel
// @route   POST /api/v1/collections/import-excel
// @access  Private/Admin
exports.importCollectionsFromExcel = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return next(new AppError('Không tìm thấy file tải lên', 400));
    }
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (data.length === 0) return next(new AppError('File Excel rỗng', 400));
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
       const row = data[i];
       const name = row['Tên Bộ Sưu Tập'] || row['name'];
       const desc = row['Mô tả'] || row['description'] || '';
       const image = row['Hình Ảnh (URL)'] || row['image'] || '';
       
       if (!name) {
         errorCount++;
         errors.push(`Dòng ${i+2}: Thiếu tên`);
         continue;
       }
       
       try {
         let collection = await Collection.findOne({ name: name.trim() });
         if (collection) {
            collection.description = desc || collection.description;
            collection.image = image || collection.image;
            collection.isActive = true;
            collection.isDeleted = false;
            await collection.save();
         } else {
            await Collection.create({ name: name.trim(), description: desc, image: image, isActive: true });
         }
         successCount++;
       } catch (err) {
         errorCount++;
         errors.push(`Dòng ${i+2}: ${err.message}`);
       }
    }
    
    res.status(200).json({ success: true, message: `Thành công: ${successCount}. Lỗi: ${errorCount}`, data: {successCount, errorCount, errors} });
  } catch (error) { next(error); }
};
