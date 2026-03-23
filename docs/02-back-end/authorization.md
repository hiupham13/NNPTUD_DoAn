# 🛡️ Authorization

> Role-Based Access Control (RBAC).

---

## Roles

| Role | Quyền | Mô tả |
|:-----|:------|:------|
| `customer` | Mua hàng, xem profile, xem đơn | Mặc định khi đăng ký |
| `admin` | Toàn quyền quản trị | Seed data, hoặc admin tạo |

## Middleware

```javascript
// middlewares/auth.js — Verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // { userId, role }
  next();
};

// middlewares/role.js — Check role
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
  }
  next();
};
```

## Route Protection Matrix

| Route | Public | Customer | Admin |
|:------|:-------|:---------|:------|
| GET /products | ✅ | ✅ | ✅ |
| POST /cart | ❌ | ✅ | ✅ |
| POST /orders | ❌ | ✅ | ✅ |
| POST /products | ❌ | ❌ | ✅ |
| DELETE /categories/:id | ❌ | ❌ | ✅ |
| PUT /admin/orders/:id/status | ❌ | ❌ | ✅ |
| GET /dashboard/stats | ❌ | ❌ | ✅ |

## Usage trong Routes

```javascript
// Public
router.get('/products', productController.getAll);

// Customer only
router.post('/cart', authenticate, cartController.addItem);

// Admin only
router.post('/products', authenticate, authorize('admin'), productController.create);
```
