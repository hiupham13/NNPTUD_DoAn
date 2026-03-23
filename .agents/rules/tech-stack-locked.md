---
description: Quy tắc Tech Stack — KHÔNG thay đổi công nghệ đã chọn trừ khi user yêu cầu.
globs: ["**/*"]
alwaysApply: true
---

# 🔧 QUY TẮC TECH STACK — KHÔNG THAY ĐỔI

## 1. TECH STACK CỐ ĐỊNH

### Backend
| Thành phần | Công nghệ | KHÔNG được đổi sang |
|:-----------|:----------|:-------------------|
| Runtime | **Node.js 20+** | ❌ Deno, Bun |
| Framework | **Express.js 4.x** | ❌ Fastify, Koa, NestJS, Hapi |
| ODM | **Mongoose 9.x** | ❌ Prisma, TypeORM, Sequelize |
| Auth | **jsonwebtoken (JWT)** | ❌ Passport.js (trừ khi user yêu cầu) |
| Validation | **express-validator** | ❌ Joi, Yup, Zod (backend) |
| Upload | **multer** | ❌ formidable, busboy |
| Password | **bcrypt** | ❌ argon2 (trừ khi user yêu cầu) |

### Frontend
| Thành phần | Công nghệ | KHÔNG được đổi sang |
|:-----------|:----------|:-------------------|
| Library | **React 19** | ❌ Vue, Angular, Svelte |
| Build Tool | **Vite** | ❌ Webpack, Parcel, Turbopack |
| Language | **TypeScript** | ❌ JavaScript thuần |
| Routing | **React Router v6/v7** | ❌ TanStack Router |
| HTTP Client | **Axios** | ❌ fetch thuần (trừ logic đơn giản), ky, got |
| State (Global) | **Zustand** | ❌ Redux, MobX, Jotai, Recoil |
| State (Server) | **TanStack Query** | ❌ SWR, Apollo |
| Forms | **React Hook Form + Zod** | ❌ Formik |

### Database
| Thành phần | Công nghệ | KHÔNG được đổi sang |
|:-----------|:----------|:-------------------|
| Database | **MongoDB 7** | ❌ PostgreSQL, MySQL, SQLite |
| ODM | **Mongoose** | ❌ MongoDB Native Driver (trừ aggregation đặc biệt) |

### DevOps
| Thành phần | Công nghệ | KHÔNG được đổi sang |
|:-----------|:----------|:-------------------|
| Container | **Docker + Docker Compose** | ❌ Podman, Kubernetes (quá phức tạp cho đồ án) |
| Node image | **node:20-alpine** | ❌ Các image khác (trừ lý do đặc biệt) |

## 2. QUY TẮC

### 2.1. Không tự ý thêm framework/library lớn
- ❌ **CẤM** thêm CSS framework (TailwindCSS, Bootstrap, MUI,...) mà không hỏi user.
- ❌ **CẤM** thêm ORM/ODM thay thế (Prisma, TypeORM,...).
- ❌ **CẤM** thêm state management thay thế (Redux, MobX,...).
- ✅ Nếu muốn đề xuất thêm library → Giải thích lý do + hỏi user trước.

### 2.2. Được phép thêm (không cần hỏi)
- ✅ Utility nhỏ: `lodash`, `dayjs`, `uuid`, `slugify`, `validator`.
- ✅ Dev tools: `prettier`, `eslint`, `husky`, `lint-staged`.
- ✅ Testing: `jest`, `supertest`, `mongodb-memory-server`.
- ✅ Security: `helmet`, `cors`, `express-rate-limit`, `express-mongo-sanitize`.
- ✅ Type packages: `@types/*`.

### 2.3. Khi user hỏi "dùng X được không?"
- Nếu X nằm trong tech stack → ✅ Xác nhận và hướng dẫn.
- Nếu X thay thế tech stack → ⚠️ Giải thích sự khác biệt, hỏi user có chắc muốn đổi không.
- Nếu X bổ sung (không thay thế) → ✅ Đánh giá ưu/nhược và đề xuất.

## 3. CODE STYLE

### Backend (Node.js)
- CommonJS (`require()`) — giữ nguyên theo codebase giảng viên.
- Chỉ chuyển sang ES Modules (`import/export`) nếu user yêu cầu.
- Dùng `let`/`const`, **KHÔNG** dùng `var`.
- `async/await` thay cho callbacks.

### Frontend (React + TS)
- ES Modules (`import/export`).
- Functional components + Hooks (KHÔNG dùng Class components).
- TypeScript strict — KHÔNG dùng `any`.
- Arrow functions cho components nhỏ, named function cho pages.
