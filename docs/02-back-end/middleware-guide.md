# 🔧 Middleware Guide

> Danh sách middleware trong hệ thống.

---

## Middleware Stack (app.js)

```javascript
app.use(cors(corsConfig));           // CORS
app.use(express.json());             // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use('/api/v1', routes);          // Routes
app.use(errorHandler);               // Error handler (cuối cùng)
```

## Custom Middleware

### 1. `authenticate` — JWT Verification
- **File**: `middlewares/auth.js`
- **Chức năng**: Verify JWT token từ `Authorization: Bearer <token>`
- **Output**: `req.user = { userId, role }`
- **Error**: 401 nếu thiếu/invalid token

### 2. `authorize(...roles)` — RBAC
- **File**: `middlewares/role.js`
- **Chức năng**: Check `req.user.role` có trong danh sách cho phép
- **Usage**: `authorize('admin')`
- **Error**: 403 nếu không đủ quyền

### 3. `validate(validations)` — Input Validation
- **File**: `middlewares/validate.js`
- **Chức năng**: Chạy express-validator rules
- **Error**: 400 + danh sách lỗi validation

### 4. `errorHandler` — Centralized Error
- **File**: `middlewares/errorHandler.js`
- **Chức năng**: Xử lý tất cả errors (Mongoose, JWT, custom)
- **Chi tiết**: Xem [error-handling.md](./error-handling.md)

### 5. `uploadMiddleware` — File Upload
- **File**: `middlewares/upload.js`
- **Chức năng**: Multer middleware cho upload file
- **Config**: memory storage, max 5MB, jpeg/png/webp only

## Áp dụng theo Route

```javascript
// Public: không middleware
router.get('/products', getProducts);

// Customer: authenticate
router.post('/cart', authenticate, addToCart);

// Admin: authenticate + authorize
router.post('/products', authenticate, authorize('admin'), createProduct);

// Upload: authenticate + authorize + upload
router.post('/upload', authenticate, authorize('admin'), uploadMiddleware, uploadImage);
```
