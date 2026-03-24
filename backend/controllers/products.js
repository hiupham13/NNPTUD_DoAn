const Product = require('../schemas/products');
const Inventory = require('../schemas/inventories');
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
