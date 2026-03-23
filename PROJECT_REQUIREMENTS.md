# ⌚ PROJECT REQUIREMENTS — Luxury Watch E-Commerce

> Đồ án môn NNPTUD — Website bán đồng hồ cao cấp (Fullstack)

---

## 1. THÔNG TIN DỰ ÁN

| Mục | Chi tiết |
|:----|:---------|
| **Tên dự án** | Luxury Watch Store |
| **Mô tả** | Website thương mại điện tử bán đồng hồ cao cấp |
| **Môn học** | Nguyên Nhân Phát Triển Ứng Dụng (NNPTUD) |
| **Developer** | Solo (1 người) |
| **Codebase gốc** | Cung cấp bởi giảng viên (Node.js + Express + MongoDB) |
| **Ngày bắt đầu** | 23/03/2026 |
| **Deadline** | 06/04/2026 |
| **Tổng thời gian** | 14 ngày |

---

## 2. TECH STACK

| Layer | Công nghệ | Version |
|:------|:----------|:--------|
| Runtime | Node.js | 20.19.x LTS |
| Backend | Express.js | ~4.16.1 |
| ODM | Mongoose | ^9.1.5 |
| Database | MongoDB | 8.0.5 |
| Frontend | React + Vite | ^19.1.0 / ^6.3.0 |
| Language | TypeScript | ^5.8.0 |
| Routing | React Router | ^7.5.0 |
| State | Zustand + TanStack Query | ^5.0.0 / ^5.75.0 |
| Forms | React Hook Form + Zod | ^7.55.0 / ^3.24.0 |
| HTTP | Axios | ^1.8.0 |
| CSS Framework | TailwindCSS | ^4.1.0 |
| Image Storage | Cloudinary | SDK ^2.x |
| Container | Docker + Docker Compose | 29.2.1 / v5.0.2 |
| Payment | VNPay Sandbox | API v2.1.0 |

---

## 3. ACTORS

| Actor | Mô tả | Quyền |
|:------|:------|:------|
| **Guest** | Khách vãng lai | Xem sản phẩm, tìm kiếm, lọc, đăng ký, đăng nhập |
| **Customer** | Khách đã đăng nhập | Giỏ hàng, đặt hàng, thanh toán VNPay, đánh giá, profile |
| **Admin** | Quản trị viên | CRUD sản phẩm/danh mục, quản lý đơn hàng/users, upload, dashboard |

---

## 4. BUSINESS DOMAIN — ĐỒNG HỒ LUXURY

| Khái niệm nghiệp vụ | Mapping |
|:---------------------|:--------|
| Thương hiệu (Rolex, Omega, Casio, Seiko,...) | `Categories` (brands) |
| Đồng hồ | `Products` (watches) |
| Giá bán (VNĐ) | `Products.price` |
| Loại máy (Automatic, Quartz, Mechanical, Solar) | `Products.movement` |
| Giới tính (Nam, Nữ, Unisex) | `Products.gender` |
| Chất liệu dây (Da, Thép, Titanium, Silicone) | `Products.strapMaterial` |
| Kích thước mặt (mm) | `Products.caseSize` |
| Chống nước (ATM/Bar) | `Products.waterResistance` |
| Xuất xứ (Thuỵ Sĩ, Nhật, Đức,...) | `Products.origin` |
| Bộ sưu tập (Summer 2026, Classic Gold,...) | `Collections` |
| Giá gốc / Giá sale | `Products.originalPrice` / `Products.price` |
| Mã giảm giá | `Coupons` |

---

## 5. DANH SÁCH CHỨC NĂNG

### Module 1: Authentication
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-AUTH-01 | Đăng ký tài khoản | Guest | 🔴 P1 | ☐ TODO |
| F-AUTH-02 | Đăng nhập (JWT) | Guest | 🔴 P1 | ☐ TODO |
| F-AUTH-03 | Đăng xuất | Customer | 🔴 P1 | ☐ TODO |
| F-AUTH-04 | Quên mật khẩu (gửi email reset link) | Guest | 🔴 P1 | ☐ TODO |
| F-AUTH-05 | Reset mật khẩu (qua email token) | Guest | 🔴 P1 | ☐ TODO |
| F-AUTH-06 | Đổi mật khẩu (khi đã đăng nhập) | Customer | 🟡 P2 | ☐ TODO |

### Module 2: Users
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-USER-01 | Xem profile cá nhân | Customer | 🔴 P1 | ☐ TODO |
| F-USER-02 | Cập nhật profile | Customer | 🟡 P2 | ☐ TODO |
| F-USER-03 | Upload avatar | Customer | 🟡 P2 | ☐ TODO |
| F-USER-04 | Xem danh sách users (Admin) | Admin | 🔴 P1 | ☐ TODO |
| F-USER-05 | Khoá / Mở khoá user (Admin) | Admin | 🟡 P2 | ☐ TODO |

### Module 3: Categories (Thương hiệu đồng hồ)
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-CAT-01 | Xem danh sách thương hiệu | Guest | 🔴 P1 | ☐ TODO |
| F-CAT-02 | Thêm thương hiệu (Admin) | Admin | 🔴 P1 | ☐ TODO |
| F-CAT-03 | Sửa thương hiệu (Admin) | Admin | 🔴 P1 | ☐ TODO |
| F-CAT-04 | Xoá thương hiệu — soft delete (Admin) | Admin | 🔴 P1 | ☐ TODO |

### Module 4: Products (Đồng hồ)
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-PROD-01 | Xem danh sách đồng hồ | Guest | 🔴 P1 | ☐ TODO |
| F-PROD-02 | Tìm kiếm đồng hồ (theo tên) | Guest | 🔴 P1 | ☐ TODO |
| F-PROD-03 | Lọc theo thương hiệu | Guest | 🔴 P1 | ☐ TODO |
| F-PROD-04 | Lọc theo khoảng giá | Guest | 🔴 P1 | ☐ TODO |
| F-PROD-05 | Lọc theo giới tính (Nam/Nữ/Unisex) | Guest | 🔴 P1 | ☐ TODO |
| F-PROD-06 | Lọc theo loại máy (Automatic/Quartz) | Guest | 🟡 P2 | ☐ TODO |
| F-PROD-07 | Sắp xếp (giá, mới nhất, tên) | Guest | 🟡 P2 | ☐ TODO |
| F-PROD-08 | Phân trang sản phẩm | Guest | 🔴 P1 | ☐ TODO |
| F-PROD-09 | Xem chi tiết đồng hồ | Guest | 🔴 P1 | ☐ TODO |
| F-PROD-10 | Thêm đồng hồ mới (Admin) | Admin | 🔴 P1 | ☐ TODO |
| F-PROD-11 | Sửa đồng hồ (Admin) | Admin | 🔴 P1 | ☐ TODO |
| F-PROD-12 | Xoá đồng hồ — soft delete (Admin) | Admin | 🔴 P1 | ☐ TODO |
| F-PROD-13 | Upload hình đồng hồ lên Cloudinary (Admin) | Admin | 🔴 P1 | ☐ TODO |
| F-PROD-14 | Lọc theo bộ sưu tập | Guest | 🟡 P2 | ☐ TODO |

### Module 4b: Collections (Bộ sưu tập)
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-COL-01 | Xem danh sách bộ sưu tập | Guest | 🟡 P2 | ☐ TODO |
| F-COL-02 | Thêm bộ sưu tập (Admin) | Admin | 🟡 P2 | ☐ TODO |
| F-COL-03 | Sửa bộ sưu tập (Admin) | Admin | 🟡 P2 | ☐ TODO |
| F-COL-04 | Xoá bộ sưu tập (Admin) | Admin | 🟡 P2 | ☐ TODO |

### Module 5: Cart (Giỏ hàng)
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-CART-01 | Thêm đồng hồ vào giỏ | Customer | 🔴 P1 | ☐ TODO |
| F-CART-02 | Xem giỏ hàng | Customer | 🔴 P1 | ☐ TODO |
| F-CART-03 | Cập nhật số lượng | Customer | 🔴 P1 | ☐ TODO |
| F-CART-04 | Xoá sản phẩm khỏi giỏ | Customer | 🔴 P1 | ☐ TODO |
| F-CART-05 | Tính tổng tiền | Customer | 🔴 P1 | ☐ TODO |

### Module 6: Orders (Đơn hàng)
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-ORD-01 | Tạo đơn hàng (checkout) | Customer | 🔴 P1 | ☐ TODO |
| F-ORD-02 | Nhập địa chỉ giao hàng | Customer | 🔴 P1 | ☐ TODO |
| F-ORD-03 | Chọn phương thức thanh toán (COD / VNPay) | Customer | 🔴 P1 | ☐ TODO |
| F-ORD-04 | Xem lịch sử đơn hàng | Customer | 🔴 P1 | ☐ TODO |
| F-ORD-05 | Xem chi tiết đơn hàng | Customer | 🔴 P1 | ☐ TODO |
| F-ORD-06 | Huỷ đơn hàng | Customer | 🟡 P2 | ☐ TODO |
| F-ORD-07 | Quản lý đơn hàng (Admin) | Admin | 🔴 P1 | ☐ TODO |
| F-ORD-08 | Cập nhật trạng thái đơn (Admin) | Admin | 🔴 P1 | ☐ TODO |

### Module 7: Payments (Thanh toán)
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-PAY-01 | Thanh toán COD | Customer | 🔴 P1 | ☐ TODO |
| F-PAY-02 | Thanh toán VNPay Sandbox | Customer | 🔴 P1 | ☐ TODO |
| F-PAY-03 | VNPay return URL (verify kết quả) | System | 🔴 P1 | ☐ TODO |
| F-PAY-04 | VNPay IPN callback | System | 🔴 P1 | ☐ TODO |
| F-PAY-05 | Lưu lịch sử thanh toán | System | 🟡 P2 | ☐ TODO |

### Module 8: Inventory (Tồn kho)
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-INV-01 | Xem tồn kho (Admin) | Admin | 🟡 P2 | ☐ TODO |
| F-INV-02 | Cập nhật tồn kho (Admin) | Admin | 🟡 P2 | ☐ TODO |
| F-INV-03 | Tự động trừ kho khi đặt hàng | System | 🔴 P1 | ☐ TODO |
| F-INV-04 | Hoàn kho khi huỷ đơn | System | 🟡 P2 | ☐ TODO |

### Module 9: Upload
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-UPL-01 | Upload single image | Admin | 🔴 P1 | ☐ TODO |
| F-UPL-02 | Upload multiple images | Admin | 🟡 P2 | ☐ TODO |
| F-UPL-03 | Validate file type & size (jpg, png, webp ≤ 5MB) | System | 🔴 P1 | ☐ TODO |

### Module 10: Admin Dashboard
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-DASH-01 | Tổng doanh thu | Admin | 🟡 P2 | ☐ TODO |
| F-DASH-02 | Số đơn hàng theo trạng thái | Admin | 🟡 P2 | ☐ TODO |
| F-DASH-03 | Số users mới | Admin | 🟡 P2 | ☐ TODO |
| F-DASH-04 | Top đồng hồ bán chạy | Admin | 🟡 P2 | ☐ TODO |

### Module 11: Coupons (Mã giảm giá)
| # | Chức năng | Actor | Priority | Status |
|:--|:----------|:------|:---------|:-------|
| F-CPN-01 | Tạo mã giảm giá (Admin) | Admin | 🟡 P2 | ☐ TODO |
| F-CPN-02 | Xem danh sách mã giảm giá (Admin) | Admin | 🟡 P2 | ☐ TODO |
| F-CPN-03 | Áp mã giảm giá khi checkout | Customer | 🟡 P2 | ☐ TODO |
| F-CPN-04 | Xoá / Vô hiệu mã giảm giá (Admin) | Admin | 🟡 P2 | ☐ TODO |

---

## 6. YÊU CẦU PHI CHỨC NĂNG

### Performance
- API response < 500ms
- Tất cả list API hỗ trợ pagination
- Index MongoDB cho queries thường dùng
- Upload file ≤ 5MB

### Security
- JWT token, expire 24h
- Bcrypt hash password (≥ 6 ký tự)
- RBAC (admin, customer)
- Validate tất cả input (express-validator)
- CORS chỉ allow frontend origin
- Sanitize input chống NoSQL injection

### Code Quality
- Response format chuẩn `{ success, data, message, pagination }`
- Try-catch + centralized error handler
- Soft delete (`isDeleted` flag)
- TypeScript strict mode (frontend)
- Responsive design (mobile-first)

---

## 7. ORDER STATUS FLOW

```
  PENDING ──→ CONFIRMED ──→ PROCESSING ──→ SHIPPING ──→ DELIVERED ──→ COMPLETED
     │                                                       │
     ▼                                                       ▼
  CANCELLED                                              RETURNED
  (chỉ khi PENDING/CONFIRMED)
```

| Status | Mô tả | Ai thao tác |
|:-------|:------|:------------|
| `pending` | Vừa đặt hàng | System (auto) |
| `confirmed` | Admin xác nhận | Admin |
| `processing` | Đang chuẩn bị hàng | Admin |
| `shipping` | Đang giao hàng | Admin |
| `delivered` | Đã giao thành công | Admin |
| `completed` | Hoàn thành | System (auto after 7 days) |
| `cancelled` | Đã huỷ | Customer (khi pending/confirmed) / Admin |
| `returned` | Trả hàng | Admin |

---

## 8. VNPAY SANDBOX INTEGRATION

| Mục | Chi tiết |
|:----|:---------|
| Môi trường | Sandbox (test) |
| API Version | 2.1.0 |
| Endpoint | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
| Flow | Customer checkout → Redirect VNPay → Thanh toán → Return URL → Verify |

### VNPay Flow:
```
Customer → Chọn VNPay → Backend tạo payment URL → Redirect sang VNPay
                                                          │
VNPay → Khách thanh toán → Redirect về Return URL ←───────┘
                                │
                    Backend verify → Cập nhật Order status (isPaid=true)
                                │
                    IPN callback → Xác nhận lần nữa (server-to-server)
```

---

## 9. FORGOT PASSWORD FLOW

```
Guest → Nhập email → Backend gửi email chứa reset link (token)
                           │
         Guest click link → Frontend form đổi mật khẩu mới
                           │
         Submit → Backend verify token + cập nhật password
```

| Quy tắc | Chi tiết |
|:---------|:---------|
| Reset token | Random string / JWT, expire sau 15 phút |
| Email service | Nodemailer (SMTP Gmail hoặc Mailtrap) |
| Validation | Password mới ≥ 6 ký tự |

---

## 10. PRODUCT FILTER SYSTEM

### Filter Parameters:
| Parameter | Type | Mô tả | Query |
|:----------|:-----|:------|:------|
| `search` | string | Tìm theo tên | `$regex` |
| `category` | ObjectId | Lọc theo thương hiệu | exact match |
| `gender` | enum | Nam / Nữ / Unisex | exact match |
| `movement` | enum | Automatic / Quartz / Mechanical / Solar | exact match |
| `minPrice` | number | Giá tối thiểu | `$gte` |
| `maxPrice` | number | Giá tối đa | `$lte` |
| `collection` | ObjectId | Lọc theo bộ sưu tập | exact match |
| `sort` | string | Sắp xếp: `price_asc`, `price_desc`, `newest`, `name` | `.sort()` |
| `page` | number | Trang hiện tại (default: 1) | `.skip()` |
| `limit` | number | Số items/trang (default: 12) | `.limit()` |

### Ví dụ API call:
```
GET /api/v1/products?search=rolex&gender=male&minPrice=5000000&maxPrice=50000000&sort=price_asc&page=1&limit=12
```

---

## 11. KẾ HOẠCH TRIỂN KHAI — 14 NGÀY

### Timeline Overview
```
23/03 ─── 25/03 ─── 30/03 ─── 03/04 ─── 05/04 ── 06/04
  │ Phase 1 │   Phase 2   │   Phase 3   │ Phase 4│ Submit
  │ 3 ngày  │   5 ngày    │   4 ngày    │ 2 ngày │
  │ Setup   │   Backend   │   Frontend  │ Polish │
```

### PHASE 1: FOUNDATION (23/03 → 25/03) — 3 ngày

| Ngày | Task |
|:-----|:-----|
| D1 (23/03) | ✅ Setup Agent Skills, Rules, Workflow, Tech Stack |
| D2 (24/03) | Setup project structure, Docker Compose, .env, init frontend |
| D3 (25/03) | Database design (Watch schemas), seed data (brands + watches) |

### PHASE 2: BACKEND API (26/03 → 30/03) — 5 ngày

| Ngày | Modules |
|:-----|:--------|
| D4 (26/03) | Auth (Register, Login, Forgot Password, Reset Password) + Roles |
| D5 (27/03) | Users CRUD + Categories (Brands) CRUD |
| D6 (28/03) | Products (Watches) CRUD + Upload + Filter/Search/Sort |
| D7 (29/03) | Cart + Orders + Inventory (trừ kho auto) |
| D8 (30/03) | VNPay Sandbox integration + Error handling + API hoàn thiện |

### PHASE 3: FRONTEND REACT (31/03 → 03/04) — 4 ngày

| Ngày | Pages |
|:-----|:------|
| D9 (31/03) | Project setup + Layout + Auth pages (Login, Register, Forgot PW) |
| D10 (01/04) | Home + Product List (filter/search/sort) + Product Detail |
| D11 (02/04) | Cart + Checkout (COD + VNPay) + Order History |
| D12 (03/04) | Admin: Dashboard + Product CRUD + Order Manage + User Manage |

### PHASE 4: POLISH (04/04 → 05/04) — 2 ngày

| Ngày | Task |
|:-----|:-----|
| D13 (04/04) | Code review, testing, bug fix, UI polish |
| D14 (05/04) | Seed data final, README, docs, chuẩn bị nộp |

---

## 12. MODULE MAP

### Backend Files
| Module | Schema | Route | Controller |
|:-------|:-------|:------|:-----------|
| Auth | (users) | `auth.js` | `auth.controller.js` |
| Users | `users.js` | `users.js` | `users.controller.js` |
| Roles | `roles.js` | `roles.js` | `roles.controller.js` |
| Categories | `categories.js` 🆕 | `categories.js` | `categories.controller.js` 🆕 |
| Products | `products.js` | `products.js` | `products.controller.js` 🆕 |
| Cart | `cart.js` | `carts.js` | `carts.controller.js` 🆕 |
| Orders | `orders.js` 🆕 | `orders.js` 🆕 | `orders.controller.js` 🆕 |
| Payments | `payments.js` | `payments.js` 🆕 | `payments.controller.js` 🆕 |
| Inventory | `inventories.js` | `inventories.js` | `inventories.controller.js` 🆕 |
| Upload | — | `upload.js` | `upload.controller.js` 🆕 |
| Collections | `collections.js` 🆕 | `collections.js` 🆕 | `collections.controller.js` 🆕 |
| Coupons | `coupons.js` 🆕 | `coupons.js` 🆕 | `coupons.controller.js` 🆕 |

### Frontend Routes
| Route | Page | Access |
|:------|:-----|:-------|
| `/` | Home | Public |
| `/products` | Product List + Filter | Public |
| `/products/:slug` | Product Detail | Public |
| `/login` | Login | Guest only |
| `/register` | Register | Guest only |
| `/forgot-password` | Forgot Password | Guest only |
| `/reset-password/:token` | Reset Password | Guest only |
| `/cart` | Cart | Customer |
| `/checkout` | Checkout | Customer |
| `/orders` | Order History | Customer |
| `/orders/:id` | Order Detail | Customer |
| `/profile` | Profile | Customer |
| `/admin` | Dashboard | Admin |
| `/admin/products` | Product CRUD | Admin |
| `/admin/orders` | Order Management | Admin |
| `/admin/users` | User Management | Admin |
| `/admin/categories` | Category Management | Admin |
| `/admin/collections` | Collection Management | Admin |
| `/admin/coupons` | Coupon Management | Admin |

---

## 13. CODEBASE GỐC GIẢNG VIÊN

### Thư mục giữ nguyên (ý nghĩa):
- `schemas/` → Khai báo Mongoose Models
- `routes/` → Định nghĩa API endpoints
- `controllers/` → Xử lý business logic
- `utils/` → Hàm tiện ích
- `uploads/` → Lưu file uploaded

### Thư mục cần tạo thêm:
- `middlewares/` → Auth, Role, Validate, Error handler
- `config/` → Database, CORS, constants
- `seeders/` → Seed data
- `frontend/` → Toàn bộ React app

---

> ⚠️ File được cập nhật liên tục. Khi hoàn thành chức năng → đổi `☐ TODO` → `✅ DONE`
