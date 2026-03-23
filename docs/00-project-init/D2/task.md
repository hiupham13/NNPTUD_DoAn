# 📝 Task List — D2: Project Setup

> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)
> **Ngày**: D2 — 23/03/2026
> **Trạng thái**: ✅ HOÀN THÀNH

---

## PHASE A: Docker + MongoDB ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| A1 | Tạo `docker-compose.yml` (MongoDB 8 service) | 🔴 | ✅ | `docker-compose.yml` |
| A2 | Tạo `.dockerignore` | 🟡 | ✅ | `.dockerignore` |
| A3 | Chạy `docker-compose up -d` | 🔴 | ✅ | — |
| A4 | Verify MongoDB container running | 🔴 | ✅ | luxury-watch-db |

---

## PHASE B: Backend Restructure ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| B1 | Backup code GV → `_backup_gv/` | 🔴 | ✅ | `backend/_backup_gv/` |
| B2 | Tạo `backend/.env.example` | 🔴 | ✅ | `backend/.env.example` |
| B3 | Tạo `backend/config/database.js` | 🔴 | ✅ | `backend/config/database.js` |
| B4 | Tạo `backend/config/cloudinary.js` | 🔴 | ✅ | `backend/config/cloudinary.js` |
| B5 | Tạo `backend/config/cors.js` | 🔴 | ✅ | `backend/config/cors.js` |
| B6 | Tạo `backend/utils/AppError.js` | 🔴 | ✅ | `backend/utils/AppError.js` |
| B7 | Tạo `backend/middlewares/errorHandler.js` | 🔴 | ✅ | `backend/middlewares/errorHandler.js` |
| B8 | Viết lại `backend/app.js` (clean) | 🔴 | ✅ | `backend/app.js` |
| B9 | Sửa `backend/package.json` (thêm deps) | 🔴 | ✅ | `backend/package.json` |
| B10 | Chạy `npm install` | 🔴 | ✅ | — |
| B11 | Chạy `npm start` → verify connect MongoDB | 🔴 | ✅ | — |
| B12 | Test health check: GET `/api/v1/` | 🔴 | ✅ | `{ success: true }` |

---

## PHASE C: Frontend Init ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| C1 | Init: `npx create-vite frontend --template react-ts` | 🔴 | ✅ | `frontend/` |
| C2 | Install TailwindCSS v4 | 🔴 | ✅ | `@tailwindcss/vite` |
| C3 | Setup `vite.config.ts` (Tailwind plugin + API proxy) | 🔴 | ✅ | `frontend/vite.config.ts` |
| C4 | Setup `src/index.css` (Tailwind + fonts + tokens) | 🔴 | ✅ | `frontend/src/index.css` |
| C5 | Tạo `frontend/.env` | 🔴 | ✅ | `frontend/.env` |
| C6 | Clean `App.tsx` (placeholder luxury page) | 🟡 | ✅ | `frontend/src/App.tsx` |
| C7 | Install packages (axios, zustand, react-query, zod...) | 🟡 | ✅ | 12 packages |
| C8 | Chạy `npm run dev` → verify dev server | 🔴 | ✅ | localhost:5173 |

---

## PHASE D: Git + Verify ✅

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| D1 | Cập nhật `.gitignore` | 🔴 | ✅ | `.gitignore` |
| D2 | Verify CORS: FE fetch BE thành công | 🔴 | ✅ | Vite proxy |
| D3 | Cập nhật docs (nếu có thay đổi) | 🟡 | ✅ | Đang cập nhật |

---

## PROGRESS

```
Phase A: ██████████ 100% (4/4) ✅
Phase B: ██████████ 100% (12/12) ✅
Phase C: ██████████ 100% (8/8) ✅
Phase D: ██████████ 100% (3/3) ✅
────────────────────────────────
TOTAL:   ██████████ 100% (27/27) ✅
```

## GHI CHÚ
- Docker Compose: bỏ `version` (obsolete trong Compose v2+)
- Mongoose 9: `pre()` hooks không dùng `next()` callback nữa
- `collection` là reserved word trong Mongoose → rename thành `collectionRef`
