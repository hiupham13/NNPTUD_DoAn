# 📝 Task List — D3: Schemas + Seed Data + Middleware

> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)
> **Ngày**: D3 — 23/03/2026
> **Trạng thái**: ✅ HOÀN THÀNH

---

## PHASE A: Schemas — Viết lại ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| A1 | Schema `roles.js` — viết lại | 🔴 | ✅ | `schemas/roles.js` |
| A2 | Schema `users.js` — viết lại (thêm resetPW, avatar, address) | 🔴 | ✅ | `schemas/users.js` |
| A3 | Schema `categories.js` — tạo mới (brands) | 🔴 | ✅ | `schemas/categories.js` |
| A4 | Schema `collections.js` — tạo mới (BST) | 🟡 | ✅ | `schemas/collections.js` |
| A5 | Schema `products.js` — viết lại (watch fields) | 🔴 | ✅ | `schemas/products.js` |
| A6 | Schema `cart.js` — viết lại | 🔴 | ✅ | `schemas/cart.js` |
| A7 | Schema `orders.js` — tạo mới (SNAPSHOT) | 🔴 | ✅ | `schemas/orders.js` |
| A8 | Schema `coupons.js` — tạo mới | 🟡 | ✅ | `schemas/coupons.js` |
| A9 | Schema `payments.js` — viết lại (ref order, VNPay) | 🔴 | ✅ | `schemas/payments.js` |
| A10 | Schema `inventories.js` — viết lại (fix timestamps) | 🔴 | ✅ | `schemas/inventories.js` |
| A11 | Xoá `reservations.js` (không dùng) | 🔴 | ✅ | Đã xoá |

---

## PHASE B: Middleware — Code đầy đủ ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| B1 | Middleware `auth.js` — JWT verify → req.user | 🔴 | ✅ | `middlewares/auth.js` |
| B2 | Middleware `role.js` — authorize('admin') | 🔴 | ✅ | `middlewares/role.js` |
| B3 | Middleware `validate.js` — express-validator runner | 🔴 | ✅ | `middlewares/validate.js` |
| B4 | Review `errorHandler.js` — bổ sung | 🔴 | ✅ | `middlewares/errorHandler.js` |

---

## PHASE C: Utils ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| C1 | Util `generateOrderCode.js` — ORD-YYYYMMDD-XXXX | 🟡 | ✅ | `utils/generateOrderCode.js` |

---

## PHASE D: Seed Data ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| D1 | Tạo `seeders/seed.js` — script chính | 🔴 | ✅ | `seeders/seed.js` |
| D2 | Seed: 2 roles (admin, customer) | 🔴 | ✅ | |
| D3 | Seed: admin user + customer user | 🔴 | ✅ | |
| D4 | Seed: 8 brands (Rolex, Omega, Casio...) | 🔴 | ✅ | |
| D5 | Seed: 4 collections (Classic Gold, Sport...) | 🟡 | ✅ | |
| D6 | Seed: 15 watches (dữ liệu thực tế, giá 5tr-500tr) | 🔴 | ✅ | |
| D7 | Seed: inventories auto (stock random 3-20) | 🔴 | ✅ | |
| D8 | Seed: 3 coupons (WELCOME10, SAVE50K, VIP20) | 🟡 | ✅ | |
| D9 | Chạy seed → verify data MongoDB | 🔴 | ✅ | 49 documents |

---

## PHASE E: Verify + Update ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| E1 | Cập nhật `app.js` — register routes mới | 🔴 | ✅ | 12 routes registered |
| E2 | `npm start` → verify chạy OK | 🔴 | ✅ | MongoDB connected |
| E3 | Verify data trong MongoDB | 🔴 | ✅ | All 7 collections |
| E4 | Cập nhật docs | 🟡 | ✅ | Đang cập nhật |
| E5 | Cập nhật `task.md` (root) | 🔴 | ✅ | Đang cập nhật |
| E6 | Cập nhật `PROGRESS.md` | 🔴 | ✅ | Đang cập nhật |

---

## PROGRESS

```
Phase A: ██████████ 100% (11/11) ✅
Phase B: ██████████ 100% (4/4) ✅
Phase C: ██████████ 100% (1/1) ✅
Phase D: ██████████ 100% (9/9) ✅
Phase E: ██████████ 100% (6/6) ✅
────────────────────────────────
TOTAL:   ██████████ 100% (31/31) ✅
```

## GHI CHÚ KỸ THUẬT
- Mongoose 9: `pre()` hooks không dùng `next()` → bỏ callback
- Mongoose 9: `collection` là reserved word → rename `collectionRef`
- `dropDatabase()` trước khi seed để clear stale indexes
- Placeholder images: `picsum.photos/seed/<name>/800/800`
