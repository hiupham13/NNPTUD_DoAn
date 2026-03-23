---
name: nodejs_express_expert
description: Backend Developer — Code API Express.js, middleware, authentication, business logic, error handling cho dự án E-Commerce.
---

# ⚡ Node.js Express Expert — E-Commerce NNPTUD

## 1. VAI TRÒ
- Phát triển Backend API bằng Node.js + Express.js.
- Viết middleware, authentication (JWT), authorization (RBAC).
- Xử lý business logic, error handling, validation.
- Tích hợp với MongoDB qua Mongoose.

## 2. TECH STACK
| Thành phần | Công nghệ | Version | Ghi chú |
|:-----------|:----------|:--------|:--------|
| Runtime | Node.js | **20.19.x LTS** | Local: v20.19.4 |
| Package Manager | npm | **10.8.x** | Local: 10.8.2 |
| Framework | Express.js | **~4.16.1** | Giữ nguyên GV, tương thích 4.21 |
| ODM | Mongoose | **^9.1.5** | Giữ nguyên GV, hỗ trợ MongoDB 8 |
| Auth | jsonwebtoken (JWT) | **^9.0.3** | Giữ nguyên GV |
| Password | bcrypt | **^6.0.0** | Giữ nguyên GV |
| Validation | express-validator | **^7.3.1** | Giữ nguyên GV |
| File Upload | multer | **^2.1.1** | Giữ nguyên GV |
| Email | nodemailer | **^8.0.1** | Giữ nguyên GV |
| Slug | slugify | **^1.6.6** | Giữ nguyên GV |
| Excel | exceljs | **^4.4.0** | Giữ nguyên GV |
| Dev | nodemon | **^3.1.11** | Giữ nguyên GV |

## 3. CODE CONVENTIONS

### 3.1. File Naming
```
routes/products.js              # Route file — plural noun
controllers/products.controller.js  # Controller — plural noun + .controller
schemas/products.js             # Schema (giữ nguyên GV) — plural noun
middlewares/auth.middleware.js   # Middleware — feature + .middleware
utils/sendMailHandler.js        # Utility — camelCase
```

### 3.2. Route Pattern
```javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/products.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

// Public routes
router.get('/', productCtrl.getAll);
router.get('/:id', productCtrl.getById);

// Protected routes (require login)
router.post('/', authMiddleware, roleMiddleware('admin'), productCtrl.create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), productCtrl.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), productCtrl.remove);

module.exports = router;
```

### 3.3. Controller Pattern
```javascript
// controllers/products.controller.js
const Product = require('../schemas/products');

const productCtrl = {
  // GET /api/v1/products
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, title, minPrice, maxPrice, category } = req.query;
      
      const filter = { isDeleted: false };
      if (title) filter.title = { $regex: title, $options: 'i' };
      if (category) filter.category = category;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/v1/products/:id
  getById: async (req, res) => {
    try {
      const product = await Product.findOne({ 
        _id: req.params.id, 
        isDeleted: false 
      });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/v1/products
  create: async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // PUT /api/v1/products/:id
  update: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id, req.body, { new: true, runValidators: true }
      );
      if (!product) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      }
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/v1/products/:id (Soft Delete)
  remove: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id, { isDeleted: true }, { new: true }
      );
      if (!product) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      }
      res.json({ success: true, message: 'Xóa sản phẩm thành công' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = productCtrl;
```

### 3.4. Middleware Pattern
```javascript
// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../schemas/users');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('role');
    if (!user || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không hợp lệ'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
```

## 4. ERROR HANDLING

### 4.1. Centralized Error Handler
```javascript
// middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors
    });
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} đã tồn tại`
    });
  }

  // Mongoose Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID không hợp lệ'
    });
  }

  // Default
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi hệ thống'
  });
};

module.exports = errorHandler;
```

## 5. BEST PRACTICES

1. **Luôn dùng `async/await`** thay cho callback.
2. **Mọi controller function phải có `try/catch`** hoặc dùng async wrapper.
3. **Soft delete** — Không bao giờ `deleteOne()` / `deleteMany()`, dùng `isDeleted: true`.
4. **Pagination** — Mọi API list phải hỗ trợ `page`, `limit`.
5. **Filter + Search** — Dùng MongoDB query operators (`$regex`, `$gte`, `$lte`).
6. **Populate** — Dùng Mongoose `populate()` cho reference fields.
7. **Transaction** — Dùng Mongoose `session` + `transaction` khi thao tác nhiều collection.
8. **Env variables** — KHÔNG hardcode credentials, dùng `process.env`.
9. **Input validation** — Validate tất cả input từ client trước khi xử lý.
10. **Response format chuẩn** — `{ success, data, message, pagination }`.
