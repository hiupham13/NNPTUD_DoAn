# 📋 KẾ HOẠCH TỔNG QUAN — Luxury Watch Store

> **Dự án**: Website E-Commerce bán đồng hồ cao cấp
> **Thời gian**: 14 ngày (23/03/2026 → 06/04/2026)
> **Developer**: Solo
> **Tasks chi tiết**: Xem file [`task.md`](./task.md)

---

## 1. TIMELINE TỔNG QUAN

```
23/03 ────── 25/03 ────────── 30/03 ──────────── 03/04 ──── 05/04 ── 06/04
  │  Phase 1  │    Phase 2    │     Phase 3      │  Phase 4  │ Submit │
  │  3 ngày   │    5 ngày     │     4 ngày       │  2 ngày   │        │
  │ Foundation│  Backend API  │  Frontend React  │  Polish   │  📦    │
```

---

## 2. PHASE 1: FOUNDATION (23/03 → 25/03) — 3 ngày ✅ DONE

### 🎯 Mục tiêu
Thiết lập nền tảng dự án: cấu trúc thư mục, agent workflow, database design, Docker, seed data.

### Modules liên quan
| Module | Nội dung | Priority |
|:-------|:---------|:---------|
| Project Setup | Skills, Rules, Workflow, Tech Stack | 🔴 P1 |
| System Design | Database design, ER diagram, Edge cases, Business rules | 🔴 P1 |
| Docker | docker-compose.yml (MongoDB + Backend + Frontend) | 🔴 P1 |
| Environment | .env files, Cloudinary config, VNPay config | 🔴 P1 |
| Seed Data | Roles, Categories (brands), Collections, sample Products | 🔴 P1 |
| Frontend Init | Vite + React + TS + TailwindCSS + project structure | 🔴 P1 |

### Ngày chi tiết
| Ngày | Task chính | Deliverable | Status |
|:-----|:-----------|:------------|:-------|
| **D1** (23/03) | Setup Agent Skills, Rules, Workflow, Docs | `.agents/`, `docs/`, requirements | ✅ |
| **D2** (23/03) | Docker, Backend config, Frontend init | `docker-compose.yml`, `frontend/`, `.env` | ✅ |
| **D3** (23/03) | Schemas, Seed data, Middleware | `schemas/`, `seeders/`, `middlewares/` | ✅ |

### ✅ Tiêu chí hoàn thành Phase 1 — ALL DONE
- [x] Docker Compose chạy được (MongoDB 8 container `luxury-watch-db`)
- [x] Frontend init thành công (Vite 8 + React 19 + TS + TailwindCSS v4)
- [x] Tất cả Mongoose schemas đã tạo (10 models, viết lại hoàn toàn)
- [x] Seed data chạy được (2 roles, 2 users, 8 brands, 4 BST, 15 watches, 3 coupons)
- [x] Database design doc hoàn chỉnh (45 edge cases)
- [x] `.env` file cấu hình đầy đủ (Mailtrap, Cloudinary, VNPay)
- [x] Middleware đầy đủ (auth JWT, role RBAC, validate, errorHandler)

> 📝 Phase 1 hoàn thành sớm 2 ngày! (D1-D3 xong cùng ngày 23/03)

---

## 3. PHASE 2: BACKEND API (26/03 → 30/03) — 5 ngày

### 🎯 Mục tiêu
Hoàn thiện toàn bộ REST API backend: Auth, CRUD, Business Logic, VNPay.

### Modules liên quan
| Module | Nội dung | Priority | Ngày |
|:-------|:---------|:---------|:-----|
| Auth | Register, Login, Logout, Forgot/Reset PW, JWT | 🔴 P1 | D4 |
| Roles | Seed admin/customer, RBAC middleware | 🔴 P1 | D4 |
| Users | Profile, CRUD (Admin), Lock/Unlock | 🔴 P1 | D5 |
| Categories | Brands CRUD, delete protection | 🔴 P1 | D5 |
| Collections | BST CRUD, soft delete | 🟡 P2 | D5 |
| Products | CRUD + watch fields, filter/search/sort, pagination | 🔴 P1 | D6 |
| Upload | Cloudinary integration, validate file | 🔴 P1 | D6 |
| Cart | Add, View, Update qty, Remove, validate | 🔴 P1 | D7 |
| Orders | Checkout (SNAPSHOT), status flow, cancel, inventory auto | 🔴 P1 | D7 |
| Inventory | Stock tracking, auto decrement, restore on cancel | 🔴 P1 | D7 |
| Coupons | CRUD, validate, apply at checkout | 🟡 P2 | D7 |
| Payments | VNPay Sandbox, COD, IPN callback, return URL | 🔴 P1 | D8 |
| Error Handling | Centralized error handler, validation middleware | 🔴 P1 | D8 |

### Ngày chi tiết
| Ngày | Task chính | APIs |
|:-----|:-----------|:-----|
| **D4** (26/03) | Auth + Roles + Middleware | `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| **D5** (27/03) | Users + Categories + Collections | `GET/PUT /users/profile`, `CRUD /categories`, `CRUD /collections` |
| **D6** (28/03) | Products + Upload | `CRUD /products`, `GET /products?filter`, `POST /upload` |
| **D7** (29/03) | Cart + Orders + Inventory + Coupons | `CRUD /cart`, `POST /orders`, `PUT /orders/:id/status`, `CRUD /coupons` |
| **D8** (30/03) | VNPay + Error handling + API polish | `POST /payments/vnpay`, `GET /payments/vnpay-return`, `POST /payments/vnpay-ipn` |

### ✅ Tiêu chí hoàn thành Phase 2
- [ ] Tất cả API endpoints hoạt động (Postman tested)
- [ ] Auth flow hoàn chỉnh (register → login → JWT → protected routes)
- [ ] CRUD hoạt động cho: Categories, Collections, Products, Users, Coupons
- [ ] Cart → Checkout → Order flow chạy end-to-end
- [ ] Order SNAPSHOT hoạt động (thay đổi product không ảnh hưởng order)
- [ ] VNPay Sandbox tạo được URL thanh toán + verify return
- [ ] Inventory auto: đặt hàng trừ kho, huỷ hoàn kho
- [ ] Delete protection: không xoá category có products active
- [ ] Error handling centralized, validation middleware
- [ ] Forget/Reset password qua email

---

## 4. PHASE 3: FRONTEND REACT (31/03 → 03/04) — 4 ngày

### 🎯 Mục tiêu
Xây dựng giao diện React hoàn chỉnh theo design system Luxury/Editorial.

### Modules liên quan
| Module | Nội dung | Priority | Ngày |
|:-------|:---------|:---------|:-----|
| Layout | Header, Footer, Sidebar (Admin), Responsive | 🔴 P1 | D9 |
| Design System | Tailwind config, fonts, colors, components base | 🔴 P1 | D9 |
| Auth Pages | Login, Register, Forgot PW, Reset PW | 🔴 P1 | D9 |
| Home Page | Hero, Featured, Collections, CTA | 🔴 P1 | D10 |
| Product List | Grid, Filter sidebar, Search, Sort, Pagination | 🔴 P1 | D10 |
| Product Detail | Gallery, Specs, Add to cart, Related products | 🔴 P1 | D10 |
| Cart Page | Cart items, Qty update, Remove, Summary | 🔴 P1 | D11 |
| Checkout Page | Shipping form, Coupon, Payment select, VNPay | 🔴 P1 | D11 |
| Order Pages | History list, Detail, Status tracking | 🔴 P1 | D11 |
| Profile Page | View/Edit profile, Change password | 🟡 P2 | D11 |
| Admin Dashboard | Stats cards, Revenue chart, Recent orders | 🟡 P2 | D12 |
| Admin Products | CRUD table, Upload images, Filter | 🔴 P1 | D12 |
| Admin Orders | Order list, Status update, Detail view | 🔴 P1 | D12 |
| Admin Users | User list, Lock/Unlock | 🟡 P2 | D12 |
| Admin Categories | Brand CRUD | 🔴 P1 | D12 |
| Admin Collections | BST CRUD | 🟡 P2 | D12 |
| Admin Coupons | Coupon CRUD | 🟡 P2 | D12 |

### Ngày chi tiết
| Ngày | Task chính | Pages |
|:-----|:-----------|:------|
| **D9** (31/03) | Setup + Layout + Design System + Auth | Layout, Login, Register, Forgot PW |
| **D10** (01/04) | Customer: Browse & Shop | Home, Product List, Product Detail |
| **D11** (02/04) | Customer: Buy & Pay | Cart, Checkout, Orders, Profile |
| **D12** (03/04) | Admin: Manage everything | Dashboard, Products, Orders, Users, Categories, Coupons |

### ✅ Tiêu chí hoàn thành Phase 3
- [ ] Design system Luxury/Editorial triển khai đúng (Playfair + Inter, warm palette, gold accent)
- [ ] Grayscale images → slow color reveal hoạt động
- [ ] Auth flow frontend hoàn chỉnh (login/register/forgot pw)
- [ ] Home page có hero, featured products, collections
- [ ] Product list: filter, search, sort, pagination hoạt động
- [ ] Cart → Checkout → VNPay redirect hoạt động
- [ ] Admin CRUD tables cho Products, Orders, Users, Categories
- [ ] Responsive: Mobile + Tablet + Desktop
- [ ] State management: Zustand + TanStack Query
- [ ] Forms: React Hook Form + Zod validation

---

## 5. PHASE 4: POLISH & SUBMIT (04/04 → 05/04) — 2 ngày

### 🎯 Mục tiêu
Testing, bug fix, UI polish, documentation, chuẩn bị nộp.

### Modules liên quan
| Module | Nội dung | Priority |
|:-------|:---------|:---------|
| Testing | API testing (Postman), functional testing | 🔴 P1 |
| Bug Fix | Fix bugs phát hiện từ testing | 🔴 P1 |
| UI Polish | Animation, responsive fix, edge case UI | 🟡 P2 |
| Seed Data | Final data (đủ brands, 20+ watches) | 🔴 P1 |
| Documentation | README, docs update, code comments | 🔴 P1 |
| Code Review | Security check, performance check | 🟡 P2 |

### Ngày chi tiết
| Ngày | Task chính |
|:-----|:-----------|
| **D13** (04/04) | Code review, testing toàn bộ flows, bug fix, UI polish |
| **D14** (05/04) | Final seed data, README hoàn chỉnh, docs, chuẩn bị nộp |

### ✅ Tiêu chí hoàn thành Phase 4
- [ ] Toàn bộ CRUD flows test pass
- [ ] Checkout flow end-to-end pass (COD + VNPay)
- [ ] Edge cases đã xử lý (delete protection, snapshot, stock validation)
- [ ] Seed data đầy đủ (brands, collections, 20+ products, sample orders)
- [ ] README.md hoàn chỉnh (hướng dẫn setup, chạy, APIs)
- [ ] Docker Compose chạy 1 lệnh
- [ ] Responsive trên mobile/tablet/desktop

---

## 6. MODULES TỔNG HỢP — DEPENDENCY MAP

```
                     ┌─────────┐
                     │  Roles  │  (Seed trước)
                     └────┬────┘
                          │
                     ┌────┴────┐
                     │  Auth   │  → JWT Token
                     └────┬────┘
                          │
                     ┌────┴────┐
                     │  Users  │  → Profile, Admin manage
                     └────┬────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
   ┌──────┴──────┐ ┌─────┴─────┐ ┌───────┴───────┐
   │ Categories  │ │Collections│ │   Coupons     │
   │  (Brands)   │ │   (BST)   │ │  (Giảm giá)  │
   └──────┬──────┘ └─────┬─────┘ └───────┬───────┘
          │               │               │
          └───────┬───────┘               │
                  │                       │
           ┌──────┴──────┐                │
           │  Products   │                │
           │  + Upload   │                │
           │  + Filter   │                │
           └──────┬──────┘                │
                  │                       │
           ┌──────┴──────┐                │
           │ Inventories │                │
           └──────┬──────┘                │
                  │                       │
           ┌──────┴──────┐                │
           │    Cart     │                │
           └──────┬──────┘                │
                  │                       │
           ┌──────┴──────┐────────────────┘
           │   Orders    │  (+ Coupons + Snapshot)
           └──────┬──────┘
                  │
           ┌──────┴──────┐
           │  Payments   │  (VNPay + COD)
           └──────┬──────┘
                  │
           ┌──────┴──────┐
           │  Dashboard  │  (Aggregation)
           └─────────────┘
```

### Thứ tự phát triển (Dependency order):
1. **Roles** → seed trước, không phụ thuộc gì
2. **Auth** → phụ thuộc Roles
3. **Users** → phụ thuộc Auth
4. **Categories** → không phụ thuộc (ngoài Auth middleware)
5. **Collections** → không phụ thuộc (ngoài Auth middleware)
6. **Products + Upload** → phụ thuộc Categories, Collections
7. **Inventories** → phụ thuộc Products (auto tạo khi tạo product)
8. **Cart** → phụ thuộc Products, Users
9. **Coupons** → không phụ thuộc (ngoài Auth middleware)
10. **Orders** → phụ thuộc Cart, Products, Inventories, Coupons (SNAPSHOT)
11. **Payments** → phụ thuộc Orders
12. **Dashboard** → phụ thuộc Orders, Users, Products (queries)

---

## 7. RISK & MITIGATION

| # | Rủi ro | Mức độ | Giải pháp |
|:--|:-------|:-------|:----------|
| R1 | Không kịp deadline 14 ngày | 🔴 Cao | Ưu tiên P1, bỏ P2 nếu cần |
| R2 | VNPay Sandbox không hoạt động | 🟡 TB | Có COD fallback, mock VNPay response |
| R3 | Cloudinary quota hết | 🟢 Thấp | Dùng default image, upgrade nếu cần |
| R4 | Docker issues trên máy local | 🟡 TB | Chạy trực tiếp Node + MongoDB local |
| R5 | Edge cases không lường trước | 🟡 TB | Đã phân tích 45 edge cases trong DB design |

### Nếu thiếu thời gian — Cắt giảm theo thứ tự:
1. ❌ Admin Dashboard (P2) → thay bằng list đơn giản
2. ❌ Collections CRUD (P2) → product không bắt buộc thuộc BST
3. ❌ Coupons (P2) → checkout không có giảm giá
4. ❌ Upload multiple images (P2) → chỉ upload 1 hình
5. ⚠️ VNPay (P1 nhưng có COD backup) → chỉ dùng COD

---

## 8. KẾT QUẢ MONG ĐỢI

### Sản phẩm cuối:
- ✅ Website E-Commerce bán đồng hồ cao cấp, chạy trên Docker
- ✅ Giao diện Luxury / Editorial chuyên nghiệp
- ✅ Đầy đủ CRUD, Auth, Cart → Checkout → Payment
- ✅ Admin quản lý sản phẩm, đơn hàng, users
- ✅ VNPay Sandbox tích hợp
- ✅ Responsive Mobile + Desktop
- ✅ README + Docs đầy đủ

### File tracking:
- **Kế hoạch tổng quan**: [`ke-hoach.md`](./ke-hoach.md) (file này)
- **Task chi tiết**: [`task.md`](./task.md)
- **Yêu cầu dự án**: [`PROJECT_REQUIREMENTS.md`](./PROJECT_REQUIREMENTS.md)
- **Database design**: [`docs/01-system-design/database-design.md`](./docs/01-system-design/database-design.md)
- **Design system**: [`docs/03-frontend/design-system.md`](./docs/03-frontend/design-system.md)

---

> ⚠️ File được cập nhật liên tục theo tiến độ thực tế.
> Khi hoàn thành Phase/Module → tick ✅ tiêu chí tương ứng.
