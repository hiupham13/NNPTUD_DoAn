const Category = require('../schemas/categories');
const Product = require('../schemas/products');
const xlsx = require('xlsx');
const AppError = require('../utils/AppError');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true, isDeleted: false })
      .select('-__v')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/v1/categories/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isDeleted: false })
      .select('-__v');

    if (!category) {
      return next(new AppError('Không tìm thấy thương hiệu', 404));
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, image, description, isActive } = req.body;

    const category = await Category.create({
      name,
      image,
      description,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục (thương hiệu) thành công',
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Tên danh mục này đã tồn tại', 400));
    }
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, image, description, isActive } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return next(new AppError('Không tìm thấy danh mục', 404));
    }

    if (name) category.name = name;
    if (image !== undefined) category.image = image;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Tên danh mục này đã tồn tại', 400));
    }
    next(error);
  }
};

// @desc    Delete (soft-delete) category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return next(new AppError('Không tìm thấy danh mục', 404));
    }

    // EC-01: Delete Protection
    const productCount = await Product.countDocuments({ category: category._id, isDeleted: false });
    if (productCount > 0) {
      return next(new AppError(`Danh mục đang chứa ${productCount} sản phẩm hoạt động. Không thể xóa, vui lòng chuyển danh mục cho các sản phẩm này trước.`, 400));
    }

    category.isDeleted = true;
    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import categories from Excel
// @route   POST /api/v1/categories/import-excel
// @access  Private/Admin
exports.importCategoriesFromExcel = async (req, res, next) => {
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
       const name = row['Tên Thương Hiệu'] || row['name'] || row['Tên Danh Mục'];
       const desc = row['Mô tả'] || row['description'] || '';
       const image = row['Hình Ảnh (URL)'] || row['image'] || '';
       
       if (!name) {
         errorCount++;
         errors.push(`Dòng ${i+2}: Thiếu tên`);
         continue;
       }
       
       try {
         let category = await Category.findOne({ name: name.trim() });
         if (category) {
            category.description = desc || category.description;
            category.image = image || category.image;
            category.isActive = true;
            category.isDeleted = false;
            await category.save();
         } else {
            await Category.create({ name: name.trim(), description: desc, image: image, isActive: true });
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
