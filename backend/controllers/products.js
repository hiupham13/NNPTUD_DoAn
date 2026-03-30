const Product = require('../schemas/products');
const Inventory = require('../schemas/inventories');
const Category = require('../schemas/categories');
const Collection = require('../schemas/collections');
const xlsx = require('xlsx');
const AppError = require('../utils/AppError');
// @desc    Get all products with searching, filtering, sorting and pagination
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { 
      search, category, collection, gender, movement, 
      minPrice, maxPrice, sort, page, limit
    } = req.query;

    let query = { isDeleted: false };

    // Xử lý Search bằng Text Index (full text Mongoose) hoặc Regex (phụ trợ name)
    if (search) {
      // C1: dùng $text nếu DB setup index đầy đủ, C2: dùng regex dễ tính (mix cả title, description)
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Xử lý Filter cơ bản
    if (category) query.category = category;
    if (collection) query.collectionRef = collection;
    if (gender) query.gender = gender;
    if (movement) query.movement = movement;

    // Xử lý Lọc giá
    if (minPrice || maxPrice) {
      query.salePrice = {};
      if (minPrice) query.salePrice.$gte = Number(minPrice);
      if (maxPrice) query.salePrice.$lte = Number(maxPrice);
    }

    // Xử lý Sorting
    let sortObj = { createdAt: -1 }; // Mặc định mới nhất
    if (sort) {
      if (sort === 'price_asc') sortObj = { salePrice: 1 };
      if (sort === 'price_desc') sortObj = { salePrice: -1 };
      if (sort === 'newest') sortObj = { createdAt: -1 };
    }

    // Xử lý Phân trang Paging
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const startIndex = (pageNum - 1) * limitNum;

    // Execute queries
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('collectionRef', 'name slug')
      .select('-__v')
      .sort(sortObj)
      .skip(startIndex)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/v1/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isDeleted: false })
      .populate('category', 'name slug')
      .populate('collectionRef', 'name slug')
      .select('-__v');

    if (!product) {
      return next(new AppError('Không tìm thấy sản phẩm', 404));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID (Admin)
// @route   GET /api/v1/products/id/:id
// @access  Private/Admin
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false })
      .populate('category', 'name slug')
      .populate('collectionRef', 'name slug')
      .select('-__v');

    if (!product) {
      return next(new AppError('Không tìm thấy sản phẩm', 404));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    // EC-32: Auto create Inventory with 0 stock
    await Inventory.create({
      product: product._id,
      stock: 0,
      reserved: 0,
      soldCount: 0
    });

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product
    });
  } catch (error) {
    // Handling Duplicate sku or name validation
    if (error.code === 11000) {
      return next(new AppError('Mã SKU hoặc Tên sản phẩm đã tồn tại', 400));
    }
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted) {
      return next(new AppError('Không tìm thấy sản phẩm', 404));
    }

    // Lưu từng field được cung cấp để pre('save') middleware tính toán giảm giá
    const updatableFields = [
      'name', 'sku', 'description', 'price', 'originalPrice', 'discountPercent',
      'images', 'category', 'collectionRef', 'movement', 'gender', 'caseMaterial',
      'caseSize', 'strapMaterial', 'waterResistance', 'features', 'isFeatured',
      'isNewProduct', 'isActive'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin sản phẩm thành công',
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Mã SKU hoặc Tên sản phẩm bị trùng lặp', 400));
    }
    next(error);
  }
};

// @desc    Soft Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted) {
      return next(new AppError('Không tìm thấy sản phẩm', 404));
    }

    // EC-04, EC-05: Product có trong Orders hay Inventory không ảnh hưởng nhiều, cứ Soft delete.
    product.isDeleted = true;
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete Bulk Products
// @route   POST /api/v1/products/bulk-delete
// @access  Private/Admin
exports.bulkDeleteProducts = async (req, res, next) => {
  try {
    const { productIds } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return next(new AppError('Vui lòng chọn ít nhất một sản phẩm để xóa', 400));
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { isDeleted: true, isActive: false } }
    );

    res.status(200).json({
      success: true,
      message: `Xóa ${productIds.length} sản phẩm thành công`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import products from Excel
// @route   POST /api/v1/products/import-excel
// @access  Private/Admin
exports.importProductsFromExcel = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return next(new AppError('Không tìm thấy file tải lên', 400));
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      return next(new AppError('File Excel rỗng', 400));
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    const categories = await Category.find({});
    const collections = await Collection.find({});

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const name = row['Tên SP'] || row['name'];
      const price = row['Giá'] || row['price'];
      const brandName = row['Thương Hiệu'] || row['brand'] || row['category'];
      const collectionName = row['Bộ Sưu Tập'] || row['collection'];
      const stock = row['Số lượng'] || row['stock'] || 0;
      const imagesStr = row['Hình Ảnh (URL)'] || row['images'] || '';
      const gender = row['Giới Tính'] || row['gender'] || 'male';
      const movement = row['Loại Máy'] || row['movement'] || 'automatic';
      const description = row['Mô tả'] || row['description'] || '';

      if (!name || price === undefined || !brandName) {
        errorCount++;
        errors.push(`Dòng ${i + 2}: Thiếu Tên, Giá hoặc Thương Hiệu.`);
        continue;
      }

      try {
        // Resolve Category (Rule 3A)
        let category = categories.find(c => c.name.toLowerCase() === brandName.trim().toLowerCase());
        if (!category) {
          category = await Category.create({ name: brandName.trim() });
          categories.push(category);
        }

        // Resolve Collection (Optional)
        let collectionId = null;
        if (collectionName) {
          let collection = collections.find(c => c.name.toLowerCase() === collectionName.trim().toLowerCase());
          if (!collection) {
            collection = await Collection.create({ name: collectionName.trim() });
            collections.push(collection);
          }
          collectionId = collection._id;
        }
        
        let images = [];
        if (imagesStr && typeof imagesStr === 'string') {
           images = imagesStr.split(',').map(u => u.trim()).filter(u => u.startsWith('http'));
        }

        const productData = {
          name: name.trim(),
          price: Number(price),
          category: category._id,
          gender: gender.toLowerCase(),
          movement: movement.toLowerCase(),
        };
        
        if (description) productData.description = description;
        if (collectionId) productData.collectionRef = collectionId;
        if (images.length > 0) productData.images = images;
        if (row['SKU'] || row['sku']) productData.sku = row['SKU'] || row['sku'];
        productData.caseMaterial = '';
        if (row['Kính'] || row['glass']) productData.caseMaterial += 'Kính: ' + (row['Kính'] || row['glass']) + ' ';
        if (row['Vỏ'] || row['case']) productData.caseMaterial += 'Vỏ: ' + (row['Vỏ'] || row['case']);
        productData.caseMaterial = productData.caseMaterial.trim();
        if (row['Dây'] || row['strap']) productData.strapMaterial = row['Dây'] || row['strap'];
        if (row['Chống Nước'] || row['waterResistance']) productData.waterResistance = row['Chống Nước'] || row['waterResistance'];
        
        // Find existing product (Rule 1A)
        let product;
        if (row['SKU'] || row['sku']) {
           product = await Product.findOne({ sku: row['SKU'] || row['sku'] });
        } else {
           product = await Product.findOne({ name: name.trim() });
        }

        if (product) {
           Object.assign(product, productData);
           await product.save();
        } else {
           if (!productData.sku) productData.sku = `UP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
           product = await Product.create(productData);
        }

        // Overwrite Inventory (Rule 2A)
        let inventory = await Inventory.findOne({ product: product._id });
        if (inventory) {
           inventory.stock = Number(stock) >= 0 ? Number(stock) : 0;
           await inventory.save();
        } else {
           await Inventory.create({
              product: product._id,
              stock: Number(stock) >= 0 ? Number(stock) : 0,
              reserved: 0,
              soldCount: 0
           });
        }
        successCount++;
      } catch (err) {
        errorCount++;
        errors.push(`Dòng ${i + 2}: ${err.message}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Đã xử lý xong. Thành công: ${successCount}. Lỗi: ${errorCount}`,
      data: { successCount, errorCount, errors }
    });

  } catch (error) {
    next(error);
  }
};
