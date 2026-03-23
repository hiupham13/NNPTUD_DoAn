# 🛠️ Implementation Plan — D3: Schemas + Seed Data + Middleware

> **Ngày**: D3 — 25/03/2026
> **Mục tiêu**: Viết lại toàn bộ schemas, tạo seed data thực tế, code middleware đầy đủ
> **Phụ thuộc**: D2 phải hoàn thành (Docker MongoDB running, backend config ready)

---

## 1. MỤC TIÊU

Sau khi hoàn thành D3:
- ✅ 11 Mongoose schemas viết lại hoàn toàn
- ✅ Seed data: 2 roles, 1 admin, 1 customer, 8 brands, 4 collections, 10-15 watches thực tế, 3 coupons
- ✅ Middleware đầy đủ: auth (JWT), role (RBAC), validate, errorHandler
- ✅ `npm start` chạy OK + seed chạy OK
- ✅ Phase 1 hoàn thành 100%

---

## 2. QUYẾT ĐỊNH KỸ THUẬT

### Schemas — Viết lại hoàn toàn
- Backup code GV đã nằm trong `_backup_gv/` (từ D2)
- Tạo file mới trong `backend/schemas/`, clean code, đúng convention
- Thêm các fields mới theo database-design.md
- Tham chiếu: `docs/01-system-design/database-design.md`

### Seed Data
- Dữ liệu watches **thực tế** (tên model thật)
- Giá: 5.000.000₫ → 500.000.000₫ VNĐ
- Hình: placeholder images (picsum.photos)
- Coupons: 3 mã giảm giá mẫu

### Middleware
- Code **đầy đủ** (không phải stubs)
- JWT verify hoàn chỉnh
- RBAC authorize hoàn chỉnh
- express-validator runner
- Centralized error handler (đã tạo ở D2)

---

## 3. FILES CẦN TẠO / SỬA

### 3.1 Schemas — Viết lại (11 files)
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `schemas/users.js` | ✏️ Viết lại | Thêm resetPasswordToken, resetPasswordExpire, avatar, address |
| `schemas/roles.js` | ✏️ Viết lại | Giữ đơn giản, name + description |
| `schemas/products.js` | ✏️ Viết lại | Thêm watch fields: movement, gender, strapMaterial, caseSize... |
| `schemas/categories.js` | 🆕 Tạo mới | name, slug, image, description |
| `schemas/collections.js` | 🆕 Tạo mới | name, slug, description, isActive |
| `schemas/cart.js` | ✏️ Viết lại | user (unique), items [{product, quantity}] |
| `schemas/orders.js` | 🆕 Tạo mới | SNAPSHOT items, shippingAddress, status flow, coupon |
| `schemas/payments.js` | ✏️ Viết lại | Ref order (thay reservation), VNPay fields |
| `schemas/inventories.js` | ✏️ Viết lại | Fix timestamps typo, thêm reserved, soldCount |
| `schemas/coupons.js` | 🆕 Tạo mới | code, discountType, discountValue, expiresAt, maxUses |
| `schemas/reservations.js` | ❌ Xoá | Thay bằng orders.js |

### 3.2 Middleware (4 files)
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `middlewares/auth.js` | 🆕 Tạo mới | JWT verify → req.user = {userId, role} |
| `middlewares/role.js` | 🆕 Tạo mới | authorize('admin') → check req.user.role |
| `middlewares/validate.js` | 🆕 Tạo mới | express-validator runner → return errors |
| `middlewares/errorHandler.js` | ✏️ Cập nhật | Đã tạo D2, review + bổ sung |

### 3.3 Seed Data (1 file + data)
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `seeders/seed.js` | 🆕 Tạo mới | Script seed toàn bộ data |

### 3.4 Utils bổ sung
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `utils/generateOrderCode.js` | 🆕 Tạo mới | ORD-YYYYMMDD-XXXX format |

---

## 4. THỨ TỰ THỰC HIỆN

```
1. Viết schemas cơ bản (roles, users)    → không phụ thuộc gì
2. Viết schemas category, collection      → không phụ thuộc
3. Viết schema products                   → phụ thuộc category, collection
4. Viết schema cart                       → phụ thuộc users, products
5. Viết schemas orders + coupons          → phụ thuộc users, products
6. Viết schema payments                   → phụ thuộc orders
7. Viết schema inventories                → phụ thuộc products
8. Xoá reservations.js (không dùng)
9. Viết middleware auth.js (JWT)
10. Viết middleware role.js (RBAC)
11. Viết middleware validate.js
12. Review errorHandler.js
13. Viết utils (generateOrderCode)
14. Viết seeders/seed.js
15. Chạy seed → verify data trong MongoDB
16. Cập nhật app.js nếu cần (register routes mới)
17. Cập nhật docs
```

---

## 5. SEED DATA CHI TIẾT

### 5.1 Roles (2)
```
admin, customer
```

### 5.2 Users (2)
```
admin    / admin@luxurywatch.vn / admin123   / role: admin
customer / customer@gmail.com   / 123456     / role: customer
```

### 5.3 Categories — 8 brands
```
Rolex, Omega, Casio, Seiko, Citizen, Tissot, Longines, TAG Heuer
```

### 5.4 Collections — 4 BST
```
Classic Gold, Sport Series, Dress Collection, Diver's Edition
```

### 5.5 Products — 10-15 watches (ví dụ)
```
1. Rolex Submariner Date 41mm        — 250.000.000₫ — male — automatic — Diver's
2. Rolex Datejust 36mm               — 180.000.000₫ — unisex — automatic — Classic Gold
3. Omega Seamaster Planet Ocean      — 120.000.000₫ — male — automatic — Sport Series
4. Omega Speedmaster Moonwatch       — 150.000.000₫ — male — mechanical — Classic Gold
5. Casio G-Shock GA-2100             —   5.500.000₫ — male — quartz — Sport Series
6. Casio Edifice EFR-S108D           —   8.200.000₫ — male — quartz — Dress Collection
7. Seiko Presage SRPD37              —  12.000.000₫ — male — automatic — Dress Collection
8. Seiko Prospex SPB143              —  25.000.000₫ — male — automatic — Diver's
9. Citizen Eco-Drive BN0150          —   7.500.000₫ — male — eco-drive — Diver's
10. Tissot PRX Powermatic 80         —  18.000.000₫ — male — automatic — Classic Gold
11. Tissot Le Locle Powermatic 80    —  15.000.000₫ — male — automatic — Dress Collection
12. Longines HydroConquest 41mm      —  28.000.000₫ — male — automatic — Sport Series
13. TAG Heuer Carrera Chronograph    —  85.000.000₫ — male — automatic — Sport Series
14. Omega Constellation 29mm         —  95.000.000₫ — female — quartz — Classic Gold
15. Casio Baby-G BGD-565             —   3.200.000₫ — female — quartz — Sport Series
```

### 5.6 Coupons — 3 mã
```
WELCOME10 — 10% off, min 1.000.000₫, max discount 500.000₫
SAVE50K   — 50.000₫ off (fixed), min 500.000₫
VIP20     — 20% off, min 5.000.000₫, max discount 2.000.000₫
```

### 5.7 Inventories — Auto-create
```
Mỗi product → inventory { stock: random 3-20, reserved: 0, soldCount: 0 }
```

---

## 6. TIÊU CHÍ HOÀN THÀNH D3

- [ ] 10 schemas mới hoạt động (tạo document thành công)
- [ ] reservations.js đã xoá
- [ ] Middleware auth.js: verify JWT → req.user
- [ ] Middleware role.js: authorize('admin') → 403 nếu sai
- [ ] Middleware validate.js: trả lỗi validation
- [ ] Seed chạy thành công: 2 roles, 2 users, 8 brands, 4 BST, 15 watches, 3 coupons
- [ ] MongoDB có đủ data (kiểm tra bằng MongoDB Compass hoặc mongosh)
- [ ] `npm start` không lỗi
- [ ] Phase 1 hoàn thành 100%
