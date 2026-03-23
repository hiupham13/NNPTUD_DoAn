---
name: security_performance
description: Security + Performance Auditor — Review bảo mật API, JWT best practices, rate limiting, XSS/CSRF protection, optimize MongoDB queries.
---

# 🔒 Security & Performance — E-Commerce NNPTUD

## 1. VAI TRÒ
- Review bảo mật API (authentication, authorization, input validation).
- Implement security best practices (CORS, Helmet, Rate Limiting).
- Optimize MongoDB queries và Express performance.
- Audit code để tìm vulnerabilities.

## 2. SECURITY CHECKLIST

### 2.1. Authentication & Authorization
| # | Item | Cách implement | Status |
|:--|:-----|:---------------|:-------|
| 1 | JWT Token | Sign với secret key mạnh, expire 24h | ☐ |
| 2 | Password hashing | bcrypt với salt rounds >= 10 | ☐ |
| 3 | RBAC | Role-based middleware check | ☐ |
| 4 | Token refresh | Refresh token mechanism | ☐ |
| 5 | Logout invalidation | Token blacklist hoặc Redis | ☐ |

### 2.2. Input Validation & Sanitization
```javascript
// Dùng express-validator
const { body, param, query, validationResult } = require('express-validator');

const validateProduct = [
  body('title').trim().notEmpty().withMessage('Tên sản phẩm là bắt buộc')
    .isLength({ max: 200 }).withMessage('Tên không quá 200 ký tự'),
  body('price').isFloat({ min: 0 }).withMessage('Giá phải >= 0'),
  body('sku').trim().notEmpty().withMessage('SKU là bắt buộc'),
  body('category').trim().notEmpty().withMessage('Danh mục là bắt buộc'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }
    next();
  }
];
```

### 2.3. OWASP Top 10 Protection
| Threat | Mitigation |
|:-------|:-----------|
| **Injection (NoSQL)** | Validate input, dùng Mongoose (auto-escape), không dùng `$where` |
| **Broken Auth** | JWT + bcrypt, rate limit login, account lockout |
| **Data Exposure** | Không return password/secrets, dùng `.select('-password')` |
| **XSS** | Sanitize output, CSP headers, `helmet()` |
| **CSRF** | SameSite cookies, CORS config |
| **Insecure Deserialization** | Validate JSON input |
| **Broken Access Control** | RBAC middleware, verify ownership |
| **Security Misconfiguration** | Helmet headers, hide X-Powered-By |
| **Insufficient Logging** | Log auth failures, payment events |
| **SSRF** | Validate URLs, whitelist domains |

### 2.4. Security Middleware Setup
```javascript
// app.js — Security middlewares
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Helmet — Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau'
  }
});
app.use('/api/', limiter);

// Strict rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // only 10 login attempts per 15 min
});
app.use('/api/v1/auth/login', authLimiter);

// Prevent NoSQL injection
app.use(mongoSanitize());

// Limit request body size
app.use(express.json({ limit: '10mb' }));
```

## 3. PERFORMANCE OPTIMIZATION

### 3.1. MongoDB Query Optimization
```javascript
// ❌ BAD — fetch all then filter in JS
let data = await Product.find({});
let result = data.filter(e => !e.isDeleted && e.price >= minPrice);

// ✅ GOOD — filter in MongoDB query
let result = await Product.find({
  isDeleted: false,
  price: { $gte: minPrice, $lte: maxPrice },
  title: { $regex: titleQ, $options: 'i' }
})
.skip((page - 1) * limit)
.limit(limit)
.lean(); // .lean() for read-only queries (faster)

// ✅ GOOD — Use projection (select only needed fields)
await Product.find({}, 'title price images slug')
  .lean();

// ✅ GOOD — Use countDocuments with same filter
const total = await Product.countDocuments(filter);
```

### 3.2. Index Management
```javascript
// Check existing indexes
db.products.getIndexes();

// Create compound index for common queries
db.products.createIndex({ category: 1, isDeleted: 1, price: 1 });

// Text index for search
db.products.createIndex({ title: 'text', description: 'text' });

// Explain query to check index usage
db.products.find({ category: 'phones' }).explain('executionStats');
```

### 3.3. Express Performance
```javascript
// Compression
const compression = require('compression');
app.use(compression());

// Static file caching
app.use('/uploads', express.static('uploads', {
  maxAge: '7d', // Cache static files for 7 days
  etag: true
}));

// Response caching headers
const cacheMiddleware = (duration) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${duration}`);
  next();
};

// Cache product listing for 5 min
router.get('/products', cacheMiddleware(300), productCtrl.getAll);
```

### 3.4. MongoDB Connection Optimization
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,        // Connection pool size
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 4. PERFORMANCE CHECKLIST
| # | Item | Impact |
|:--|:-----|:-------|
| 1 | Indexes cho query thường dùng | 🔴 Cao |
| 2 | `.lean()` cho read-only queries | 🟡 TB |
| 3 | Pagination cho list APIs | 🔴 Cao |
| 4 | Select chỉ fields cần thiết | 🟡 TB |
| 5 | Compression middleware | 🟡 TB |
| 6 | Connection pooling | 🟡 TB |
| 7 | Avoid N+1 query (dùng populate hoặc aggregate) | 🔴 Cao |
| 8 | Cache static assets | 🟢 Thấp |
| 9 | Lazy loading images (Frontend) | 🟡 TB |
| 10 | Bundle splitting (Vite) | 🟡 TB |

## 5. LOGGING & MONITORING
```javascript
// utils/logger.js
const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  },
  error: (message, error = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  },
  // Log cho security events
  security: (event, data = {}) => {
    console.log(`[SECURITY] ${new Date().toISOString()} - ${event}`, data);
  }
};

// Usage
logger.security('LOGIN_FAILED', { username, ip: req.ip });
logger.security('PAYMENT_CALLBACK', { orderId, status });
```

## 6. PACKAGES CẦN THIẾT
```json
{
  "helmet": "^8.x",
  "cors": "^2.x",
  "express-rate-limit": "^7.x",
  "express-mongo-sanitize": "^2.x",
  "compression": "^1.x"
}
```
