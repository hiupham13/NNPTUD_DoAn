# 🛠️ Implementation Plan — D5: Users + Categories + Collections

> **Ngày**: D5 — 24/03/2026
> **Modules**: Users, Categories (Brands), Collections (BST)
> **Tham chiếu**: 
> - [`users-module.md`](../users/users-module.md)
> - [`categories-module.md`](../categories/categories-module.md)
> - [`business-rules.md`](../../../01-system-design/business-rules.md) — BR-07, BR-08, BR-16→BR-20

---

## 1. MỤC TIÊU

Sau khi hoàn thành D5:
- ✅ Customer: xem/sửa profile, đổi mật khẩu
- ✅ Admin: danh sách users (pagination), khoá/mở khoá user
- ✅ CRUD Categories (Brands): auto-slug, delete protection (EC-01)
- ✅ CRUD Collections (BST): auto-slug, soft delete option (BR-19, BR-20)
- ✅ Test tất cả APIs

---

## 2. BUSINESS RULES ÁP DỤNG

### Users
| BR | Rule | Xử lý |
|:---|:-----|:------|
| BR-07 | Admin không tự khoá chính mình | Check `req.user.userId !== req.params.id` |
| BR-08 | User bị khoá → 403 | Middleware auth.js đã xử lý |

### Categories (Brands)
| BR | Rule | Xử lý |
|:---|:-----|:------|
| BR-16 | Không xoá category có products active | EC-01: `Product.countDocuments()` trước |
| BR-17 | Name unique | Schema unique constraint |
| BR-18 | Slug auto-gen từ name | Pre-save hook slugify |

### Collections
| BR | Rule | Xử lý |
|:---|:-----|:------|
| BR-19 | Xoá collection → set products.collectionRef = null | `Product.updateMany()` |
| BR-20 | isActive flag để ẩn/hiện | Filter `isActive: true` cho public |

---

## 3. FILES CẦN TẠO / SỬA

| File | Action | Nội dung |
|:-----|:-------|:--------|
| `controllers/user.controller.js` | 🆕 | getProfile, updateProfile, changePassword, getUsers, toggleStatus |
| `controllers/category.controller.js` | 🆕 | getAll, getBySlug, create, update, delete |
| `controllers/collection.controller.js` | 🆕 | getAll, getBySlug, create, update, delete |
| `routes/users.routes.js` | ✏️ | 5 routes |
| `routes/categories.routes.js` | ✏️ | 5 routes |
| `routes/collections.routes.js` | ✏️ | 5 routes |

---

## 4. API CONTRACTS

### 4A. Users

#### GET `/api/v1/users/profile` — Customer
```json
// Headers: Authorization: Bearer <token>
// Response 200
{ "success": true, "data": { "user": { "_id", "username", "email", "fullName", "phone", "avatar", "address", "role" } } }
```

#### PUT `/api/v1/users/profile` — Customer
```json
// Request
{ "fullName": "Nguyễn Văn A", "phone": "0901234567", "address": { "street": "123 Nguyễn Huệ", "ward": "P. Bến Nghé", "district": "Q.1", "city": "TP.HCM" } }
// Response 200
{ "success": true, "message": "Cập nhật profile thành công", "data": { "user": {...} } }
```

#### PUT `/api/v1/users/change-password` — Customer
```json
// Request
{ "currentPassword": "123456", "newPassword": "newpass123" }
// Response 200
{ "success": true, "message": "Đổi mật khẩu thành công" }
// Error 401
{ "success": false, "message": "Mật khẩu hiện tại không đúng" }
```

#### GET `/api/v1/users` — Admin
```json
// Query: ?page=1&limit=10&search=nguyen
// Response 200
{ "success": true, "data": { "users": [...], "pagination": { "total", "page", "limit", "totalPages" } } }
```

#### PUT `/api/v1/users/:id/toggle-status` — Admin
```json
// Response 200
{ "success": true, "message": "Đã khoá tài khoản user", "data": { "user": { "_id", "isActive": false } } }
// Error 400 (BR-07)
{ "success": false, "message": "Không thể khoá chính mình" }
```

### 4B. Categories (Brands)

#### GET `/api/v1/categories` — Public
```json
// Response 200
{ "success": true, "data": { "categories": [{ "_id", "name", "slug", "image", "description", "productCount" }] } }
```

#### GET `/api/v1/categories/:slug` — Public
```json
// Response 200
{ "success": true, "data": { "category": { "_id", "name", "slug", "image", "description" } } }
```

#### POST `/api/v1/categories` — Admin
```json
// Request
{ "name": "Patek Philippe", "description": "...", "image": "url" }
// Response 201 (slug auto-gen)
{ "success": true, "message": "Tạo danh mục thành công", "data": { "category": { "_id", "name", "slug": "patek-philippe", ... } } }
```

#### DELETE `/api/v1/categories/:id` — Admin
```json
// Error 400 (EC-01)
{ "success": false, "message": "Danh mục đang có 5 sản phẩm, không thể xoá" }
```

### 4C. Collections (BST) — Tương tự Categories

---

## 5. THỨ TỰ THỰC HIỆN

```
1. Users controller + routes (5 APIs)
2. Categories controller + routes (5 APIs)  
3. Collections controller + routes (5 APIs)
4. Test tất cả APIs
5. Cập nhật docs
```

---

## 6. TIÊU CHÍ HOÀN THÀNH

### Users
- [ ] GET profile → trả user info (no password)
- [ ] PUT profile → cập nhật fullName, phone, address
- [ ] Change password → verify current PW, hash new PW
- [ ] GET users (admin) → pagination + search
- [ ] Toggle status → khoá/mở khoá (BR-07: không tự khoá mình)

### Categories
- [ ] GET all → kèm productCount
- [ ] GET by slug → chi tiết
- [ ] POST create → auto-slug (BR-18)
- [ ] PUT update → update slug nếu đổi name
- [ ] DELETE → protection check (BR-16, EC-01)

### Collections
- [ ] CRUD tương tự Categories
- [ ] DELETE → set products.collectionRef = null (BR-19)
- [ ] isActive filter cho public (BR-20)
