# 📝 TASK LIST — Luxury Watch Store

> **Tham chiếu**: [`ke-hoach.md`](./ke-hoach.md) — Kế hoạch tổng quan
> **Cập nhật**: Khi hoàn thành task → đổi `☐` → `✅`, ghi ngày hoàn thành

---

## LEGEND

| Icon | Ý nghĩa |
|:-----|:--------|
| ☐ | TODO — Chưa bắt đầu |
| 🔄 | IN PROGRESS — Đang làm |
| ✅ | DONE — Hoàn thành |
| ❌ | SKIPPED — Bỏ qua (thiếu thời gian) |
| 🚫 | BLOCKED — Bị chặn bởi task khác |
| 🔴 | Priority 1 — Bắt buộc |
| 🟡 | Priority 2 — Nên có |

---

## PHASE 1: FOUNDATION (23/03 → 25/03)

### D1 — 23/03 (Ngày 1) ✅ HOÀN THÀNH
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 1.1 | Setup Agent Skills (14 skills) | 🔴 | ✅ | `.agents/skills/` |
| 1.2 | Setup Agent Rules + Workflow | 🔴 | ✅ | `.agents/rules/`, `.agents/workflows/` |
| 1.3 | Tạo cấu trúc `docs/` (6 thư mục, 61 files) | 🔴 | ✅ | `docs/00-05` |
| 1.4 | Viết `PROJECT_REQUIREMENTS.md` | 🔴 | ✅ | 12 modules, 65+ chức năng |
| 1.5 | Viết `PROJECT_ARCHITECTURE_TEMPLATE.md` | 🔴 | ✅ | Cấu trúc thư mục |
| 1.6 | Di chuyển backend files vào `backend/` | 🔴 | ✅ | app.js, schemas, routes... |
| 1.7 | Chốt Design System (Luxury/Editorial) | 🔴 | ✅ | `prompt_ui_root.md`, skill updated |
| 1.8 | Database Design + Edge Cases (45 cases) | 🔴 | ✅ | `database-design.md` |
| 1.9 | Viết `README.md` tổng quan | 🔴 | ✅ | Architecture, flows, tech stack |
| 1.10 | Viết `ke-hoach.md` + `task.md` | 🔴 | ✅ | File này |
| 1.11 | Điền nội dung docs (38/61 files) | 🔴 | ✅ | API design, flowcharts, business rules... |
| 1.12 | Quyết định 2 layouts (Customer + Admin) | 🔴 | ✅ | CSS isolation, routing |
| 1.13 | Tạo `PROGRESS.md` + workflow `daily-start` | 🔴 | ✅ | Quick view + onboarding |
| 1.14 | Cập nhật workflow `global.md` (9 bước) | 🔴 | ✅ | Thêm module planning |
| 1.15 | Restructure modules → thư mục con | 🔴 | ✅ | 9 BE modules + 12 FE pages |
| 1.16 | Tạo D2 implementation_plan + task | 🔴 | ✅ | `docs/00-project-init/` |
| 1.17 | Xác nhận quyết định kỹ thuật D2 | 🔴 | ✅ | Docker, rewrite code, Mailtrap |

### D2 — 24/03 (Ngày 2)
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 2.1 | Tạo `docker-compose.yml` (MongoDB + Backend + Frontend) | 🔴 | ☐ | |
| 2.2 | Tạo `backend/.env` + `backend/.env.example` | 🔴 | ☐ | DB, JWT, Cloudinary, VNPay |
| 2.3 | Tạo `backend/config/database.js` (MongoDB connection) | 🔴 | ☐ | |
| 2.4 | Tạo `backend/config/cloudinary.js` | 🔴 | ☐ | |
| 2.5 | Tạo `backend/config/cors.js` | 🔴 | ☐ | |
| 2.6 | Cập nhật `backend/app.js` (middleware, routes, error handler) | 🔴 | ☐ | |
| 2.7 | Init Frontend: `npx create-vite frontend` | 🔴 | ☐ | React + TS |
| 2.8 | Setup TailwindCSS v4 cho frontend | 🔴 | ☐ | |
| 2.9 | Setup Tailwind config (fonts, colors, design tokens) | 🔴 | ☐ | Playfair + Inter, warm palette |
| 2.10 | Tạo `frontend/.env` (`VITE_API_URL`) | 🔴 | ☐ | |
| 2.11 | Install packages Backend (bcrypt, jsonwebtoken, cors...) | 🔴 | ☐ | |
| 2.12 | Install packages Frontend (axios, zustand, react-query...) | 🔴 | ☐ | |
| 2.13 | Verify Docker Compose chạy thành công | 🔴 | ☐ | |

### D3 — 25/03 (Ngày 3)
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 3.1 | Tạo/Cập nhật schema `categories.js` | 🔴 | ☐ | Brands: name, slug, image |
| 3.2 | Tạo schema `collections.js` | 🟡 | ☐ | BST: name, slug |
| 3.3 | Cập nhật schema `products.js` (thêm watch fields) | 🔴 | ☐ | movement, gender, category→ObjectId |
| 3.4 | Tạo schema `orders.js` (SNAPSHOT items) | 🔴 | ☐ | orderItemSchema + orderSchema |
| 3.5 | Tạo schema `coupons.js` | 🟡 | ☐ | code, discountType, value |
| 3.6 | Cập nhật schema `payments.js` (ref→order, VNPay fields) | 🔴 | ☐ | |
| 3.7 | Sửa `inventories.js` (timestamps typo) | 🔴 | ☐ | timestamp → timestamps |
| 3.8 | Tạo `backend/seeders/seed.js` | 🔴 | ☐ | Roles, Categories, Collections |
| 3.9 | Tạo seed data: 8 brands + 4 collections | 🔴 | ☐ | |
| 3.10 | Tạo seed data: 10-15 sample watches | 🔴 | ☐ | |
| 3.11 | Tạo seed data: admin user + customer user | 🔴 | ☐ | |
| 3.12 | Chạy seed → verify database | 🔴 | ☐ | |
| 3.13 | Tạo `backend/middlewares/auth.js` (JWT verify stub) | 🔴 | ☐ | |
| 3.14 | Tạo `backend/middlewares/role.js` (RBAC stub) | 🔴 | ☐ | |
| 3.15 | Cập nhật `docs/01-system-design/` sau Phase 1 | 🔴 | ☐ | |

---

## PHASE 2: BACKEND API (26/03 → 30/03)

### D4 — 26/03 (Ngày 4) — Auth + Roles
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 4.1 | `POST /api/v1/auth/register` | 🔴 | ☐ | Validate, hash pw, assign role customer |
| 4.2 | `POST /api/v1/auth/login` | 🔴 | ☐ | Verify pw, generate JWT |
| 4.3 | `POST /api/v1/auth/logout` | 🔴 | ☐ | Client-side token remove |
| 4.4 | `POST /api/v1/auth/forgot-password` | 🔴 | ☐ | Generate token, send email (Nodemailer) |
| 4.5 | `POST /api/v1/auth/reset-password/:token` | 🔴 | ☐ | Verify token, update password |
| 4.6 | Middleware `auth.js` — JWT verify | 🔴 | ☐ | req.user |
| 4.7 | Middleware `role.js` — RBAC check | 🔴 | ☐ | authorize('admin') |
| 4.8 | Middleware `errorHandler.js` — centralized | 🔴 | ☐ | |
| 4.9 | Middleware `validate.js` — express-validator | 🔴 | ☐ | |
| 4.10 | Config Nodemailer (Gmail/Mailtrap) | 🔴 | ☐ | |
| 4.11 | Test Auth APIs (Postman) | 🔴 | ☐ | |
| 4.12 | Cập nhật `docs/02-back-end/auth.md` | 🔴 | ☐ | |

### D5 — 27/03 (Ngày 5) — Users + Categories + Collections
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 5.1 | `GET /api/v1/users/profile` | 🔴 | ☐ | |
| 5.2 | `PUT /api/v1/users/profile` | 🟡 | ☐ | |
| 5.3 | `PUT /api/v1/users/change-password` | 🟡 | ☐ | |
| 5.4 | `GET /api/v1/users` (Admin) | 🔴 | ☐ | Pagination |
| 5.5 | `PUT /api/v1/users/:id/toggle-status` (Admin) | 🟡 | ☐ | Lock/Unlock |
| 5.6 | `GET /api/v1/categories` | 🔴 | ☐ | Public |
| 5.7 | `POST /api/v1/categories` (Admin) | 🔴 | ☐ | Auto-gen slug |
| 5.8 | `PUT /api/v1/categories/:id` (Admin) | 🔴 | ☐ | |
| 5.9 | `DELETE /api/v1/categories/:id` (Admin) | 🔴 | ☐ | ⚠️ Delete protection (EC-01) |
| 5.10 | `CRUD /api/v1/collections` | 🟡 | ☐ | Similar to categories |
| 5.11 | Test Users + Categories APIs (Postman) | 🔴 | ☐ | |
| 5.12 | Cập nhật `docs/02-back-end/` | 🔴 | ☐ | |

### D6 — 28/03 (Ngày 6) — Products + Upload
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 6.1 | `GET /api/v1/products` (filter/search/sort/pagination) | 🔴 | ☐ | Query builder |
| 6.2 | `GET /api/v1/products/:slug` | 🔴 | ☐ | Product detail |
| 6.3 | `POST /api/v1/products` (Admin) | 🔴 | ☐ | + auto create Inventory |
| 6.4 | `PUT /api/v1/products/:id` (Admin) | 🔴 | ☐ | |
| 6.5 | `DELETE /api/v1/products/:id` (Admin) | 🔴 | ☐ | Soft delete (EC-03, EC-04) |
| 6.6 | `POST /api/v1/upload` (Cloudinary) | 🔴 | ☐ | Validate type + size |
| 6.7 | `POST /api/v1/upload/multiple` | 🟡 | ☐ | |
| 6.8 | Filter: search, category, gender, movement, price range | 🔴 | ☐ | |
| 6.9 | Filter: collection, sort, pagination | 🟡 | ☐ | |
| 6.10 | Test Products + Upload APIs (Postman) | 🔴 | ☐ | |
| 6.11 | Cập nhật `docs/02-back-end/products.md` | 🔴 | ☐ | |

### D7 — 29/03 (Ngày 7) — Cart + Orders + Inventory + Coupons
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 7.1 | `GET /api/v1/cart` | 🔴 | ☐ | Populate + filter deleted products |
| 7.2 | `POST /api/v1/cart` (add item) | 🔴 | ☐ | Check stock (EC-18) |
| 7.3 | `PUT /api/v1/cart/:productId` (update qty) | 🔴 | ☐ | Validate qty (EC-20) |
| 7.4 | `DELETE /api/v1/cart/:productId` | 🔴 | ☐ | |
| 7.5 | `POST /api/v1/orders` (Checkout) ⭐ | 🔴 | ☐ | SNAPSHOT + validate all + inventory |
| 7.6 | `GET /api/v1/orders` (Customer history) | 🔴 | ☐ | |
| 7.7 | `GET /api/v1/orders/:id` | 🔴 | ☐ | |
| 7.8 | `PUT /api/v1/orders/:id/cancel` | 🟡 | ☐ | EC-23: chỉ pending/confirmed |
| 7.9 | `GET /api/v1/admin/orders` (Admin) | 🔴 | ☐ | Filter by status, pagination |
| 7.10 | `PUT /api/v1/admin/orders/:id/status` (Admin) | 🔴 | ☐ | EC-24: status chỉ đi tiến |
| 7.11 | Inventory auto: trừ kho khi đặt (EC-29) | 🔴 | ☐ | |
| 7.12 | Inventory auto: hoàn kho khi huỷ (EC-27) | 🟡 | ☐ | |
| 7.13 | `CRUD /api/v1/coupons` (Admin) | 🟡 | ☐ | |
| 7.14 | Apply coupon at checkout (EC-33→37) | 🟡 | ☐ | |
| 7.15 | Test Cart + Orders APIs (Postman) | 🔴 | ☐ | |
| 7.16 | Cập nhật `docs/02-back-end/` | 🔴 | ☐ | |

### D8 — 30/03 (Ngày 8) — VNPay + Polish
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 8.1 | `POST /api/v1/payments/create-vnpay-url` | 🔴 | ☐ | HMAC-SHA512, redirect URL |
| 8.2 | `GET /api/v1/payments/vnpay-return` | 🔴 | ☐ | Verify hash, update order |
| 8.3 | `POST /api/v1/payments/vnpay-ipn` | 🔴 | ☐ | Server-to-server callback |
| 8.4 | VNPay: Xử lý timeout (EC-42) | 🟡 | ☐ | |
| 8.5 | VNPay: Xử lý duplicate IPN (EC-44) | 🟡 | ☐ | |
| 8.6 | Review + fix tất cả API error responses | 🔴 | ☐ | Chuẩn format response |
| 8.7 | Review delete protection hoạt động (EC-01→09) | 🔴 | ☐ | |
| 8.8 | Review SNAPSHOT hoạt động (EC-10→13) | 🔴 | ☐ | |
| 8.9 | API documentation tổng hợp | 🟡 | ☐ | |
| 8.10 | Postman Collection export | 🟡 | ☐ | |
| 8.11 | Cập nhật `docs/02-back-end/` | 🔴 | ☐ | |
| 8.12 | Cập nhật `PROJECT_REQUIREMENTS.md` (tick DONE) | 🔴 | ☐ | |

---

## PHASE 3: FRONTEND REACT (31/03 → 03/04)

### D9 — 31/03 (Ngày 9) — Setup + Layout + Auth Pages
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 9.1 | Setup React Router v7 | 🔴 | ☐ | |
| 9.2 | Setup Zustand store (auth, cart) | 🔴 | ☐ | |
| 9.3 | Setup TanStack Query (queryClient) | 🔴 | ☐ | |
| 9.4 | Setup Axios instance (baseURL, interceptors) | 🔴 | ☐ | |
| 9.5 | Tạo Layout: Header (Logo, Nav, Cart icon, User) | 🔴 | ☐ | Luxury style |
| 9.6 | Tạo Layout: Footer | 🔴 | ☐ | |
| 9.7 | Tạo Layout: Admin Sidebar | 🔴 | ☐ | |
| 9.8 | Paper Noise Texture overlay (global) | 🟡 | ☐ | SVG noise 2% opacity |
| 9.9 | Visible Grid Lines (desktop only) | 🟡 | ☐ | 4 vertical lines |
| 9.10 | Page: Login | 🔴 | ☐ | Form + validation |
| 9.11 | Page: Register | 🔴 | ☐ | |
| 9.12 | Page: Forgot Password | 🔴 | ☐ | |
| 9.13 | Page: Reset Password | 🔴 | ☐ | |
| 9.14 | Auth guard (ProtectedRoute, GuestRoute) | 🔴 | ☐ | |
| 9.15 | Cập nhật `docs/03-frontend/` | 🔴 | ☐ | |

### D10 — 01/04 (Ngày 10) — Home + Products
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 10.1 | Page: Home — Hero section (oversized typography) | 🔴 | ☐ | text-9xl, grayscale image |
| 10.2 | Page: Home — Stats section (inverted dark) | 🟡 | ☐ | |
| 10.3 | Page: Home — Featured Products grid | 🔴 | ☐ | Grayscale → color hover |
| 10.4 | Page: Home — Featured Collections | 🟡 | ☐ | |
| 10.5 | Page: Home — CTA section | 🟡 | ☐ | |
| 10.6 | Component: ProductCard (grayscale, hover animation) | 🔴 | ☐ | 1500ms transition |
| 10.7 | Page: Product List + Filter sidebar | 🔴 | ☐ | Brand, Gender, Price, Movement |
| 10.8 | Component: Search bar | 🔴 | ☐ | |
| 10.9 | Component: Sort dropdown | 🟡 | ☐ | |
| 10.10 | Component: Pagination | 🔴 | ☐ | |
| 10.11 | Page: Product Detail — Image gallery | 🔴 | ☐ | |
| 10.12 | Page: Product Detail — Specs + Description | 🔴 | ☐ | Drop cap intro |
| 10.13 | Page: Product Detail — Add to cart + Qty selector | 🔴 | ☐ | |
| 10.14 | Page: Product Detail — Related products | 🟡 | ☐ | |
| 10.15 | Cập nhật `docs/03-frontend/` | 🔴 | ☐ | |

### D11 — 02/04 (Ngày 11) — Cart + Checkout + Orders
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 11.1 | Page: Cart — Items list, qty update, remove | 🔴 | ☐ | |
| 11.2 | Page: Cart — Summary (subtotal, shipping, total) | 🔴 | ☐ | |
| 11.3 | Handle deleted products in cart (EC-03) | 🔴 | ☐ | "SP không còn tồn tại" |
| 11.4 | Page: Checkout — Shipping address form | 🔴 | ☐ | React Hook Form + Zod |
| 11.5 | Page: Checkout — Coupon input + apply | 🟡 | ☐ | |
| 11.6 | Page: Checkout — Payment method select (COD/VNPay) | 🔴 | ☐ | |
| 11.7 | Page: Checkout — Order summary + Confirm | 🔴 | ☐ | |
| 11.8 | VNPay redirect flow + return page | 🔴 | ☐ | |
| 11.9 | Page: Order History (list) | 🔴 | ☐ | |
| 11.10 | Page: Order Detail (snapshot data) | 🔴 | ☐ | |
| 11.11 | Page: Profile (view/edit) | 🟡 | ☐ | |
| 11.12 | Cập nhật `docs/03-frontend/` | 🔴 | ☐ | |

### D12 — 03/04 (Ngày 12) — Admin Pages
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 12.1 | Page: Admin Dashboard — Stats cards | 🟡 | ☐ | Revenue, Orders, Users, Products |
| 12.2 | Page: Admin Products — CRUD table | 🔴 | ☐ | |
| 12.3 | Page: Admin Products — Create/Edit form + Upload | 🔴 | ☐ | Cloudinary upload |
| 12.4 | Page: Admin Orders — List + Status update | 🔴 | ☐ | |
| 12.5 | Page: Admin Orders — Detail view | 🔴 | ☐ | Snapshot data |
| 12.6 | Page: Admin Users — List + Lock/Unlock | 🟡 | ☐ | |
| 12.7 | Page: Admin Categories — CRUD | 🔴 | ☐ | |
| 12.8 | Page: Admin Collections — CRUD | 🟡 | ☐ | |
| 12.9 | Page: Admin Coupons — CRUD | 🟡 | ☐ | |
| 12.10 | Page: Admin Inventory — View/Update stock | 🟡 | ☐ | |
| 12.11 | Cập nhật `docs/03-frontend/` | 🔴 | ☐ | |

---

## PHASE 4: POLISH & SUBMIT (04/04 → 05/04)

### D13 — 04/04 (Ngày 13) — Testing + Bug Fix
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 13.1 | Test: Auth flow end-to-end | 🔴 | ☐ | Register → Login → JWT |
| 13.2 | Test: CRUD all modules | 🔴 | ☐ | |
| 13.3 | Test: Cart → Checkout → COD | 🔴 | ☐ | |
| 13.4 | Test: Cart → Checkout → VNPay | 🔴 | ☐ | |
| 13.5 | Test: Order status flow (pending → completed) | 🔴 | ☐ | |
| 13.6 | Test: Cancel order → hoàn kho | 🔴 | ☐ | |
| 13.7 | Test: Delete protection (category, product) | 🔴 | ☐ | |
| 13.8 | Test: SNAPSHOT (đổi giá → order cũ không đổi) | 🔴 | ☐ | |
| 13.9 | Test: Forgot/Reset password | 🔴 | ☐ | |
| 13.10 | Bug fix từ testing | 🔴 | ☐ | |
| 13.11 | UI polish: responsive mobile | 🟡 | ☐ | |
| 13.12 | UI polish: animations, transitions | 🟡 | ☐ | |

### D14 — 05/04 (Ngày 14) — Documentation + Submit
| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| 14.1 | Seed data final: 8 brands, 4 collections, 20+ watches | 🔴 | ☐ | |
| 14.2 | Seed data: sample orders, coupons | 🟡 | ☐ | |
| 14.3 | README.md hoàn chỉnh (setup, chạy, demo) | 🔴 | ☐ | |
| 14.4 | Cập nhật tất cả `docs/` files | 🔴 | ☐ | |
| 14.5 | `PROJECT_REQUIREMENTS.md` — tick tất cả DONE | 🔴 | ☐ | |
| 14.6 | Code cleanup (remove console.log, comments) | 🟡 | ☐ | |
| 14.7 | `.gitignore` review | 🔴 | ☐ | |
| 14.8 | Docker Compose test: 1 lệnh chạy all | 🔴 | ☐ | |
| 14.9 | Final review toàn bộ | 🔴 | ☐ | |

---

## THỐNG KÊ

### Tổng tasks theo Phase
| Phase | Tổng | P1 🔴 | P2 🟡 | Done ✅ |
|:------|:-----|:------|:------|:-------|
| Phase 1 (D1-D3) | 45 | 37 | 8 | 17 |
| Phase 2 (D4-D8) | 46 | 36 | 10 | 0 |
| Phase 3 (D9-D12) | 47 | 33 | 14 | 0 |
| Phase 4 (D13-D14) | 21 | 16 | 5 | 0 |
| **TỔNG** | **159** | **122** | **37** | **17** |

### Tiến độ tổng
```
Phase 1: ████████░░ 38% (17/45) ── D1 DONE ✅
Phase 2: ░░░░░░░░░░  0% (0/46)
Phase 3: ░░░░░░░░░░  0% (0/47)
Phase 4: ░░░░░░░░░░  0% (0/21)
─────────────────────────────
OVERALL:  ██░░░░░░░░ 11% (17/159)
```

---

> ⚠️ File được cập nhật liên tục. Khi hoàn thành task → đổi `☐` → `✅`
> 📋 Xem [`ke-hoach.md`](./ke-hoach.md) cho kế hoạch tổng quan
> 📋 Xem [`PROJECT_REQUIREMENTS.md`](./PROJECT_REQUIREMENTS.md) cho danh sách chức năng
