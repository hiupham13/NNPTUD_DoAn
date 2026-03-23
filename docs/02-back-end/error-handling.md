# ⚠️ Error Handling

> Centralized error handling strategy.

---

## Error Handler Middleware

```javascript
// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi server';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} đã tồn tại`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Giá trị không hợp lệ cho ${err.path}`;
  }

  res.status(statusCode).json({ success: false, message });
};
```

## Custom Error Class

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Usage
throw new AppError('Sản phẩm không tồn tại', 404);
throw new AppError('Không có quyền truy cập', 403);
```

## Error Types

| Status | Nghĩa | Ví dụ |
|:-------|:------|:------|
| 400 | Bad Request | Validation failed, invalid input |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | RBAC denied, user locked |
| 404 | Not Found | Product/User/Order not found |
| 409 | Conflict | Duplicate email, username |
| 500 | Server Error | Unexpected error |
