---
name: system_architect
description: System Architect + DevOps — Thiết kế kiến trúc hệ thống, cấu trúc thư mục, Docker Compose, deployment cho dự án E-Commerce.
---

# 🏗️ System Architect — E-Commerce NNPTUD

## 1. VAI TRÒ
- Thiết kế kiến trúc tổng thể hệ thống E-Commerce.
- Định nghĩa cấu trúc thư mục cho cả Backend và Frontend.
- Setup Docker Compose cho môi trường dev/prod.
- Review kiến trúc, đảm bảo tính mở rộng (scalability).

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1. System Architecture Overview
```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │  React + Vite     │  │  Mobile (Future)         │ │
│  │  TypeScript       │  │                          │ │
│  │  Port: 5173       │  │                          │ │
│  └────────┬─────────┘  └──────────────────────────┘ │
└───────────┼─────────────────────────────────────────┘
            │ HTTP/HTTPS (REST API)
┌───────────┼─────────────────────────────────────────┐
│           ▼         SERVER LAYER                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Node.js + Express.js                         │   │
│  │  Port: 3000                                   │   │
│  │  ┌────────┐ ┌────────┐ ┌──────────────────┐  │   │
│  │  │ Routes │→│ Ctrl   │→│ Services/Models  │  │   │
│  │  └────────┘ └────────┘ └──────────────────┘  │   │
│  │  ┌────────────────────────────────────────┐   │   │
│  │  │ Middleware: Auth, Validator, Upload     │   │   │
│  │  └────────────────────────────────────────┘   │   │
│  └──────────────────────┬───────────────────────┘   │
└─────────────────────────┼───────────────────────────┘
                          │ Mongoose ODM
┌─────────────────────────┼───────────────────────────┐
│                         ▼      DATA LAYER            │
│  ┌──────────────────────────────────────────────┐   │
│  │  MongoDB                                      │   │
│  │  Port: 27017                                  │   │
│  │  Database: nnptud-ecommerce                   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 2.2. Backend Architecture Pattern: MVC + Service Layer
```
Request → Route → Middleware → Controller → Service → Model → MongoDB
                                    ↓
                              Response (JSON)
```

### 2.3. Cấu Trúc Thư Mục Backend (Mở rộng từ codebase GV)
```
backend/
├── bin/
│   └── www                      # Entry point (giữ nguyên)
├── app.js                       # Express app setup (giữ nguyên, mở rộng)
├── package.json
├── .env                         # Environment variables
├── .env.example                 # Template cho .env
│
├── config/
│   ├── database.js              # MongoDB connection config
│   ├── cors.js                  # CORS configuration
│   └── constants.js             # App constants
│
├── schemas/                     # Mongoose Schemas (giữ nguyên tên thư mục GV)
│   ├── users.js                 # ✅ Có sẵn
│   ├── products.js              # ✅ Có sẵn
│   ├── roles.js                 # ✅ Có sẵn
│   ├── cart.js                  # ✅ Có sẵn
│   ├── inventories.js           # ✅ Có sẵn
│   ├── payments.js              # ✅ Có sẵn
│   ├── reservations.js          # ✅ Có sẵn
│   ├── categories.js            # 🆕 Cần tạo
│   ├── orders.js                # 🆕 Cần tạo
│   ├── order-items.js           # 🆕 Cần tạo
│   └── reviews.js               # 🆕 Cần tạo
│
├── routes/                      # Route definitions (giữ nguyên tên thư mục GV)
│   ├── index.js                 # ✅ Có sẵn
│   ├── auth.js                  # ✅ Có sẵn
│   ├── users.js                 # ✅ Có sẵn
│   ├── products.js              # ✅ Có sẵn
│   ├── categories.js            # ✅ Có sẵn
│   ├── inventories.js           # ✅ Có sẵn
│   ├── carts.js                 # ✅ Có sẵn
│   ├── roles.js                 # ✅ Có sẵn
│   ├── upload.js                # ✅ Có sẵn
│   ├── orders.js                # 🆕 Cần tạo
│   └── reviews.js               # 🆕 Cần tạo
│
├── controllers/                 # Controller logic (hiện chỉ có users.js)
│   ├── users.js                 # ✅ Có sẵn
│   ├── auth.controller.js       # 🆕 Tách từ routes/auth.js
│   ├── products.controller.js   # 🆕 Tách từ routes/products.js
│   ├── categories.controller.js # 🆕
│   ├── orders.controller.js     # 🆕
│   ├── carts.controller.js      # 🆕
│   ├── inventories.controller.js# 🆕
│   └── reviews.controller.js    # 🆕
│
├── middlewares/                  # Custom middlewares
│   ├── auth.middleware.js        # JWT verification
│   ├── role.middleware.js        # Role-based access control
│   ├── validate.middleware.js    # Request validation
│   └── upload.middleware.js      # File upload (Multer)
│
├── utils/                       # Utility functions (giữ nguyên)
│   ├── authHandler.js.js        # ✅ Có sẵn
│   ├── config.js                # ✅ Có sẵn
│   ├── constants.js             # ✅ Có sẵn
│   ├── sendMailHandler.js       # ✅ Có sẵn
│   ├── uploadHandler.js         # ✅ Có sẵn
│   └── validatorHandler.js      # ✅ Có sẵn
│
├── uploads/                     # Uploaded files (giữ nguyên)
│
└── tests/                       # Test files
    ├── unit/
    └── integration/
```

### 2.4. Cấu Trúc Thư Mục Frontend (Tạo mới)
```
frontend/
├── public/
│   ├── favicon.ico
│   └── assets/                  # Static assets
│
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component + Router
│   ├── vite-env.d.ts
│   │
│   ├── api/                     # API layer
│   │   ├── axiosClient.ts       # Axios instance + interceptors
│   │   ├── auth.api.ts
│   │   ├── products.api.ts
│   │   ├── categories.api.ts
│   │   ├── cart.api.ts
│   │   ├── orders.api.ts
│   │   └── users.api.ts
│   │
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   └── shared/              # Shared business components
│   │       ├── ProductCard.tsx
│   │       ├── CartItem.tsx
│   │       └── ...
│   │
│   ├── pages/                   # Page components
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetail/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Orders/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Profile/
│   │   └── Admin/
│   │       ├── Dashboard/
│   │       ├── ProductManage/
│   │       ├── OrderManage/
│   │       └── UserManage/
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   │
│   ├── store/                   # State management (Zustand or Context)
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── product.types.ts
│   │   ├── user.types.ts
│   │   ├── order.types.ts
│   │   ├── cart.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   └── validation.ts
│   │
│   └── styles/                  # Global styles
│       ├── index.css
│       └── variables.css
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env
```

## 3. DOCKER SETUP

### 3.1. Docker Compose Structure
```
project-root/
├── docker-compose.yml           # Orchestration
├── docker-compose.dev.yml       # Dev overrides
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
└── frontend/
    ├── Dockerfile
    └── .dockerignore
```

### 3.2. Services
| Service | Image | Port | Version | Mô tả |
|:--------|:------|:-----|:--------|:------|
| `mongodb` | mongo:8 | 27017 | **8.0.5** | Database (khớp local) |
| `backend` | node:20-alpine | 3000 | **Node 20.x** | Express API |
| `frontend` | node:20-alpine | 5173 | **Node 20.x** | Vite dev server |

### 3.3. Environment Variables
```env
# Backend (.env)
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/nnptud-ecommerce
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
UPLOAD_DIR=./uploads
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Frontend (.env)
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=NNPTUD E-Commerce
```

## 4. API DESIGN CONVENTIONS

### 4.1. REST API Format
```
Base URL: /api/v1

GET    /api/v1/products           # List (with pagination, filter)
GET    /api/v1/products/:id        # Get by ID
POST   /api/v1/products            # Create
PUT    /api/v1/products/:id        # Update
DELETE /api/v1/products/:id        # Soft Delete

# Nested resources
GET    /api/v1/products/:id/reviews
POST   /api/v1/products/:id/reviews
```

### 4.2. Response Format Chuẩn
```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Thành công",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Error
{
  "success": false,
  "message": "Lỗi cụ thể",
  "errors": [ ... ]
}
```

### 4.3. HTTP Status Codes
| Code | Ý nghĩa |
|:-----|:---------|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (chưa đăng nhập) |
| 403 | Forbidden (không có quyền) |
| 404 | Not Found |
| 500 | Internal Server Error |

## 5. NGUYÊN TẮC KIẾN TRÚC

1. **Giữ nguyên codebase GV** — Không refactor cấu trúc hiện tại, chỉ **mở rộng** thêm.
2. **Separation of Concerns** — Route chỉ khai báo endpoint, Controller xử lý logic, Schema định nghĩa data.
3. **Environment-based Config** — Dùng `.env` cho mọi config, không hardcode.
4. **Consistent Naming** — camelCase cho JS/TS, kebab-case cho file names, UPPER_CASE cho constants.
5. **Error Handling** — Mọi route phải có try-catch, response format chuẩn.
