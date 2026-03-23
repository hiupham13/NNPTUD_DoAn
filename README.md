# ⌚ Luxury Watch Store

> **Website thương mại điện tử bán đồng hồ cao cấp** — Đồ án môn NNPTUD

---

## 📋 Giới Thiệu

Luxury Watch Store là hệ thống e-commerce chuyên bán đồng hồ cao cấp theo mô hình **B2C** (Business to Customer). Hệ thống cung cấp trải nghiệm mua sắm đồng hồ trực tuyến với đầy đủ chức năng: duyệt sản phẩm, lọc theo nhiều tiêu chí, giỏ hàng, đặt hàng, thanh toán trực tuyến qua VNPay và quản trị hệ thống.

### Mục Tiêu
- Xây dựng website bán đồng hồ chuyên nghiệp, giao diện hiện đại
- Đầy đủ chức năng CRUD, Authentication, Authorization, Upload
- Tích hợp thanh toán VNPay Sandbox
- Hệ thống lọc sản phẩm đa tiêu chí (thương hiệu, giá, giới tính, loại máy)
- Chương trình giảm giá / khuyến mãi
- Quản lý theo bộ sưu tập (Collection)

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│  ┌───────────────────────┐    ┌──────────────────────────┐  │
│  │   Customer Website    │    │     Admin Dashboard      │  │
│  │   React + Vite + TS   │    │     React + Vite + TS    │  │
│  │   TailwindCSS         │    │     TailwindCSS          │  │
│  └───────────┬───────────┘    └─────────────┬────────────┘  │
│              │          Axios / HTTP         │               │
└──────────────┼──────────────────────────────┼───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER                            │
│                    Node.js + Express.js                      │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Routes   │→│Controller│→│  Service  │→│   Schema    │  │
│  │          │  │  Logic   │  │  Layer    │  │  (Mongoose) │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Middlewares: Auth (JWT) │ RBAC │ Validate │ Upload  │    │
│  └─────────────────────────────────────────────────────┘    │
└──────┬──────────────────────────┬───────────────────────────┘
       │                          │
       ▼                          ▼
┌──────────────┐          ┌──────────────────┐
│   MongoDB    │          │   Cloudinary     │
│   Database   │          │   Image Storage  │
│   (Mongoose) │          │                  │
└──────────────┘          └──────────────────┘
       │
       │  Payment Gateway
       ▼
┌──────────────────┐
│   VNPay Sandbox  │
│   (Redirect)     │
└──────────────────┘
```

---

## 📊 Luồng Nghiệp Vụ

### 1. Luồng Khách Hàng Mua Hàng

```
Guest truy cập website
    │
    ├─→ Duyệt sản phẩm (xem danh sách, tìm kiếm, lọc)
    │       │
    │       ├─ Lọc theo: Thương hiệu │ Giá │ Giới tính │ Loại máy │ Bộ sưu tập
    │       ├─ Sắp xếp: Giá tăng/giảm │ Mới nhất │ Tên A-Z
    │       └─ Xem chi tiết đồng hồ (thông số kỹ thuật, hình ảnh, giá)
    │
    ├─→ Đăng ký tài khoản ──→ Đăng nhập (JWT Token)
    │
    └─→ [Đã đăng nhập — Customer]
            │
            ├─→ Thêm vào giỏ hàng (chọn số lượng)
            │       │
            │       └─→ Xem giỏ hàng (cập nhật SL, xoá, tính tổng)
            │
            ├─→ Checkout (đặt hàng)
            │       │
            │       ├─ Nhập địa chỉ giao hàng
            │       ├─ Áp mã giảm giá (nếu có)
            │       ├─ Phí ship: 50.000₫ (cố định)
            │       │
            │       └─ Chọn thanh toán:
            │           ├─ COD (thanh toán khi nhận hàng)
            │           └─ VNPay (redirect → thanh toán → callback verify)
            │
            ├─→ Xem lịch sử đơn hàng
            │       └─ Chi tiết đơn hàng (sản phẩm, giá, trạng thái)
            │
            ├─→ Huỷ đơn hàng (chỉ khi Pending/Confirmed)
            │
            ├─→ Quên mật khẩu (nhập email → nhận link reset → đổi PW mới)
            │
            └─→ Cập nhật profile
```

### 2. Luồng Admin Quản Trị

```
Admin đăng nhập
    │
    ├─→ Dashboard (tổng quan)
    │       ├─ Tổng doanh thu
    │       ├─ Số đơn hàng theo trạng thái
    │       ├─ Số khách hàng
    │       └─ Top đồng hồ bán chạy
    │
    ├─→ Quản lý Sản phẩm (Đồng hồ)
    │       ├─ Thêm mới (nhập thông tin + upload ảnh lên Cloudinary)
    │       ├─ Sửa thông tin + hình ảnh
    │       ├─ Xoá (soft delete: isDeleted = true)
    │       └─ Gán Bộ sưu tập / Giảm giá
    │
    ├─→ Quản lý Danh mục (Thương hiệu)
    │       └─ CRUD: Rolex, Omega, Casio, Seiko, ...
    │
    ├─→ Quản lý Bộ sưu tập (Collection)
    │       └─ CRUD: "Summer 2026", "Classic Gold", "Sport Series", ...
    │
    ├─→ Quản lý Đơn hàng
    │       └─ Xem danh sách → Cập nhật trạng thái
    │           Pending → Confirmed → Processing → Shipping → Delivered → Completed
    │
    ├─→ Quản lý Khuyến mãi
    │       └─ Tạo mã giảm giá (coupon code, % hoặc VNĐ, hạn sử dụng)
    │
    ├─→ Quản lý Người dùng
    │       └─ Xem danh sách → Khoá / Mở khoá tài khoản
    │
    └─→ Quản lý Tồn kho
            └─ Xem / Cập nhật số lượng tồn kho theo sản phẩm
```

### 3. Luồng Trạng Thái Đơn Hàng

```
                        ┌──────────┐
                        │ PENDING  │ ← Khách đặt hàng
                        └────┬─────┘
                             │
                  ┌──────────┼──────────┐
                  ▼                     ▼
            ┌───────────┐        ┌───────────┐
            │ CONFIRMED │        │ CANCELLED │
            └─────┬─────┘        └───────────┘
                  │
                  ▼
            ┌────────────┐
            │ PROCESSING │ ← Admin chuẩn bị hàng
            └─────┬──────┘
                  │
                  ▼
            ┌───────────┐
            │ SHIPPING  │ ← Đang giao hàng
            └─────┬─────┘
                  │
                  ▼
            ┌───────────┐
            │ DELIVERED │ ← Giao thành công
            └─────┬─────┘
                  │
           ┌──────┼──────┐
           ▼             ▼
     ┌───────────┐ ┌──────────┐
     │ COMPLETED │ │ RETURNED │
     └───────────┘ └──────────┘
```

### 4. Luồng Thanh Toán VNPay

```
Customer chọn VNPay
    │
    ▼
Backend tạo Payment URL (hash HMAC-SHA512)
    │
    ▼
Redirect → VNPay Gateway (Sandbox)
    │
    ▼
Khách nhập thông tin thẻ test → Xác nhận
    │
    ├──→ Thành công → Redirect Return URL → Backend verify → isPaid = true
    │
    └──→ Thất bại → Redirect Return URL → Thông báo lỗi
    
    VNPay IPN callback → Server-to-server verify (đảm bảo chính xác)
```

---

## 🗄️ Database Entities

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Users     │     │    Roles     │     │  Categories  │
│──────────────│     │──────────────│     │  (Brands)    │
│ username     │────→│ name         │     │──────────────│
│ email        │     │ description  │     │ name         │
│ password     │     └──────────────┘     │ slug         │
│ fullName     │                          │ image        │
│ avatar       │                          │ description  │
│ role ────────│──→ Roles._id             └──────┬───────┘
│ status       │                                 │
│ resetToken   │     ┌──────────────┐            │
│ resetExpires │     │ Collections  │            │
└──────┬───────┘     │──────────────│            │
       │             │ name         │            │
       │             │ slug         │            │
       │             │ description  │            │
       │             │ image        │            │
       │             │ isActive     │            │
       │             └──────┬───────┘            │
       │                    │                    │
       │             ┌──────┴────────────────────┴───────┐
       │             │           Products                │
       │             │          (Watches)                 │
       │             │───────────────────────────────────│
       │             │ title, sku, slug                  │
       │             │ price, originalPrice              │
       │             │ discountPercent                   │
       │             │ category ──→ Categories._id       │
       │             │ collection ──→ Collections._id    │
       │             │ images[] (Cloudinary URLs)        │
       │             │ movement (Automatic/Quartz/...)   │
       │             │ gender (male/female/unisex)       │
       │             │ strapMaterial (leather/steel/...) │
       │             │ caseSize (mm)                     │
       │             │ waterResistance (ATM)             │
       │             │ origin (Thuỵ Sĩ/Nhật/...)        │
       │             │ description, isDeleted            │
       │             └──────────┬────────────────────────┘
       │                        │
  ┌────┴────────┐        ┌─────┴──────┐      ┌──────────────┐
  │    Cart     │        │ Inventories│      │   Coupons    │
  │─────────────│        │────────────│      │──────────────│
  │ user ───────│→       │ product ───│→     │ code         │
  │ items[]     │        │ stock      │      │ discountType │
  │  ├ product  │        │ sold       │      │ discountValue│
  │  ├ quantity │        └────────────┘      │ minOrder     │
  │  └ price    │                            │ maxUses      │
  └─────────────┘                            │ usedCount    │
       │                                     │ expiresAt    │
       ▼                                     │ isActive     │
  ┌─────────────┐                            └──────┬───────┘
  │   Orders    │                                   │
  │─────────────│                                   │
  │ user ───────│→ Users._id                        │
  │ orderCode   │                                   │
  │ items[]     │                                   │
  │  ├ product  │                                   │
  │  ├ title    │                                   │
  │  ├ price    │                                   │
  │  └ quantity │                                   │
  │ shippingAddr│                                   │
  │ shippingFee │ ← 50.000đ (cố định)              │
  │ coupon ─────│──→ Coupons._id                    │
  │ discount    │                                   │
  │ totalAmount │                                   │
  │ finalAmount │                                   │
  │ paymentMethod│ (cod / vnpay)                    │
  │ isPaid      │                                   │
  │ status      │ (pending → ... → completed)       │
  └──────┬──────┘                                   │
         │                                          │
         ▼                                          │
  ┌──────────────┐                                  │
  │   Payments   │                                  │
  │──────────────│                                  │
  │ order ───────│→ Orders._id                      │
  │ method       │ (vnpay / cod)                    │
  │ amount       │                                  │
  │ vnpayTxnRef  │                                  │
  │ vnpayData    │                                  │
  │ status       │ (pending / success / failed)     │
  └──────────────┘                                  │
```

---

## 🛠️ Tech Stack

| Layer | Công nghệ | Version |
|:------|:----------|:--------|
| **Runtime** | Node.js | 20.19.x LTS |
| **Backend** | Express.js | ~4.16.1 |
| **Database** | MongoDB + Mongoose | 8.0.5 / ^9.1.5 |
| **Frontend** | React + Vite + TypeScript | ^19.1.0 / ^6.3.0 / ^5.8.0 |
| **Styling** | TailwindCSS | ^4.1.0 |
| **State** | Zustand + TanStack Query | ^5.0.0 / ^5.75.0 |
| **Forms** | React Hook Form + Zod | ^7.55.0 / ^3.24.0 |
| **HTTP** | Axios | ^1.8.0 |
| **Image** | Cloudinary | SDK ^2.x |
| **Payment** | VNPay Sandbox | API v2.1.0 |
| **Container** | Docker + Docker Compose | 29.2.1 / v5.0.2 |

---

## 📁 Cấu Trúc Dự Án

```
NNPTUD_DoAn/
├── backend/                   # API Server (Node.js + Express)
│   ├── app.js                 # Express entry point
│   ├── package.json
│   ├── bin/www                # HTTP server
│   ├── config/                # Database, Cloudinary, constants
│   ├── schemas/               # Mongoose models
│   ├── routes/                # API route definitions
│   ├── controllers/           # Business logic
│   ├── middlewares/           # Auth, RBAC, Validate, Error handler
│   ├── utils/                 # Helper functions
│   ├── seeders/               # Seed data
│   └── uploads/               # Local upload (backup)
│
├── frontend/                  # Web Client (React + Vite + TS)
│   ├── src/
│   │   ├── api/               # Axios client + API functions
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── store/             # Zustand stores
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Frontend helpers
│   ├── vite.config.ts
│   └── package.json
│
├── docs/                      # Tài liệu dự án
│   ├── 00-project-init/       # Setup, tech stack, conventions
│   ├── 01-system-design/      # Architecture, DB, API, use cases
│   ├── 02-back-end/           # Backend module docs
│   ├── 03-frontend/           # Frontend page docs
│   ├── 04-testing/            # Test cases, QA
│   └── 05-deployment/         # Docker, deploy guide
│
├── PROJECT_REQUIREMENTS.md    # Yêu cầu dự án chi tiết
├── PROJECT_ARCHITECTURE_TEMPLATE.md
├── docker-compose.yml
└── README.md                  # File này
```

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu
- Node.js ≥ 20.x
- MongoDB ≥ 8.x
- Docker + Docker Compose (tuỳ chọn)

### Cài Đặt

```bash
# Clone project
git clone <repository-url>
cd NNPTUD_DoAn
```

### 🐳 Cách 1: Docker — Chạy tất cả (Dành cho GV / người hỗ trợ)

> Chỉ cần Docker Desktop, **không cần cài Node.js**

```bash
# Chạy toàn bộ (MongoDB + Backend + Frontend)
docker-compose --profile full up -d --build

# Seed data
docker-compose --profile full exec backend npm run seed

# Xem logs
docker-compose --profile full logs -f

# Truy cập:
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000/api/v1
```

### 💻 Cách 2: Dev Mode (Dành cho developer)

> Chỉ MongoDB trong Docker, BE + FE chạy trực tiếp (hot reload nhanh)

```bash
# 1. Chạy MongoDB container
docker-compose up -d

# 2. Backend (terminal 1)
cd backend
cp .env.example .env    # Cấu hình env variables
npm install
npm run seed            # Seed data (lần đầu)
npm start               # http://localhost:3000

# 3. Frontend (terminal 2)
cd frontend
npm install
npm run dev             # http://localhost:5173
```

### Tài khoản test
| Role | Email | Password |
|:-----|:------|:---------|
| Admin | admin@luxurywatch.vn | admin123 |
| Customer | customer@gmail.com | 123456 |

---

## 📊 API Endpoints — Tổng Quan

| Method | Endpoint | Mô tả | Auth |
|:-------|:---------|:------|:-----|
| **Auth** ||||
| POST | `/api/v1/auth/register` | Đăng ký | — |
| POST | `/api/v1/auth/login` | Đăng nhập | — |
| POST | `/api/v1/auth/forgot-password` | Quên mật khẩu | — |
| POST | `/api/v1/auth/reset-password` | Reset mật khẩu | — |
| **Products** ||||
| GET | `/api/v1/products` | Danh sách + Filter + Search | — |
| GET | `/api/v1/products/:slug` | Chi tiết sản phẩm | — |
| POST | `/api/v1/products` | Thêm sản phẩm | Admin |
| PUT | `/api/v1/products/:id` | Sửa sản phẩm | Admin |
| DELETE | `/api/v1/products/:id` | Xoá sản phẩm (soft) | Admin |
| **Categories** ||||
| GET | `/api/v1/categories` | Danh sách thương hiệu | — |
| POST | `/api/v1/categories` | Thêm thương hiệu | Admin |
| PUT | `/api/v1/categories/:id` | Sửa thương hiệu | Admin |
| DELETE | `/api/v1/categories/:id` | Xoá thương hiệu | Admin |
| **Collections** ||||
| GET | `/api/v1/collections` | Danh sách bộ sưu tập | — |
| POST | `/api/v1/collections` | Thêm bộ sưu tập | Admin |
| **Cart** ||||
| GET | `/api/v1/cart` | Xem giỏ hàng | Customer |
| POST | `/api/v1/cart` | Thêm vào giỏ | Customer |
| PUT | `/api/v1/cart/:itemId` | Cập nhật số lượng | Customer |
| DELETE | `/api/v1/cart/:itemId` | Xoá khỏi giỏ | Customer |
| **Orders** ||||
| POST | `/api/v1/orders` | Tạo đơn hàng | Customer |
| GET | `/api/v1/orders` | Lịch sử đơn hàng | Customer |
| GET | `/api/v1/orders/:id` | Chi tiết đơn hàng | Customer |
| PATCH | `/api/v1/orders/:id/cancel` | Huỷ đơn | Customer |
| PATCH | `/api/v1/orders/:id/status` | Cập nhật trạng thái | Admin |
| **Payments** ||||
| POST | `/api/v1/payments/vnpay/create` | Tạo VNPay URL | Customer |
| GET | `/api/v1/payments/vnpay/return` | VNPay return | — |
| POST | `/api/v1/payments/vnpay/ipn` | VNPay IPN callback | — |
| **Users** ||||
| GET | `/api/v1/users/profile` | Xem profile | Customer |
| PUT | `/api/v1/users/profile` | Cập nhật profile | Customer |
| GET | `/api/v1/users` | Danh sách users | Admin |
| **Coupons** ||||
| POST | `/api/v1/coupons` | Tạo mã giảm giá | Admin |
| POST | `/api/v1/coupons/apply` | Áp dụng mã giảm giá | Customer |
| **Upload** ||||
| POST | `/api/v1/upload` | Upload ảnh lên Cloudinary | Admin |

---

## 🔑 Environment Variables

```env
# Backend
PORT=3000
MONGODB_URI=mongodb://localhost:27017/luxury-watch-store
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# VNPay Sandbox
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/result

# Frontend
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 👥 Vai Trò Người Dùng

| Role | Quyền |
|:-----|:------|
| **Guest** | Xem sản phẩm, tìm kiếm, lọc, đăng ký, đăng nhập |
| **Customer** | Giỏ hàng, đặt hàng, thanh toán, xem đơn hàng, profile |
| **Admin** | CRUD sản phẩm/danh mục/bộ sưu tập, quản lý đơn hàng/users, dashboard |

---

## 📝 License

Đồ án môn học NNPTUD — Chỉ sử dụng cho mục đích học tập.
