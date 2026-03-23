# 📝 Task List — D2: Project Setup

> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)
> **Ngày**: D2 — 24/03/2026

---

## PHASE A: Docker + MongoDB (15 phút)

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| A1 | Tạo `docker-compose.yml` (MongoDB 8 service) | 🔴 | ☐ | `docker-compose.yml` |
| A2 | Tạo `.dockerignore` | 🟡 | ☐ | `.dockerignore` |
| A3 | Chạy `docker-compose up -d` | 🔴 | ☐ | — |
| A4 | Verify MongoDB container running | 🔴 | ☐ | — |

---

## PHASE B: Backend Restructure (45 phút)

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| B1 | Backup code GV → `_backup_gv/` | 🔴 | ☐ | `backend/_backup_gv/` |
| B2 | Tạo `backend/.env.example` | 🔴 | ☐ | `backend/.env.example` |
| B3 | Tạo `backend/config/database.js` | 🔴 | ☐ | `backend/config/database.js` |
| B4 | Tạo `backend/config/cloudinary.js` | 🔴 | ☐ | `backend/config/cloudinary.js` |
| B5 | Tạo `backend/config/cors.js` | 🔴 | ☐ | `backend/config/cors.js` |
| B6 | Tạo `backend/utils/AppError.js` | 🔴 | ☐ | `backend/utils/AppError.js` |
| B7 | Tạo `backend/middlewares/errorHandler.js` | 🔴 | ☐ | `backend/middlewares/errorHandler.js` |
| B8 | Viết lại `backend/app.js` (clean) | 🔴 | ☐ | `backend/app.js` |
| B9 | Sửa `backend/package.json` (thêm deps) | 🔴 | ☐ | `backend/package.json` |
| B10 | Chạy `npm install` | 🔴 | ☐ | — |
| B11 | Chạy `npm start` → verify connect MongoDB | 🔴 | ☐ | — |
| B12 | Test health check: GET `/api/v1/` | 🔴 | ☐ | — |

---

## PHASE C: Frontend Init (30 phút)

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| C1 | Init: `npx create-vite frontend --template react-ts` | 🔴 | ☐ | `frontend/` |
| C2 | Install TailwindCSS v4 | 🔴 | ☐ | — |
| C3 | Setup `tailwind.config.ts` (fonts, colors, extend) | 🔴 | ☐ | `frontend/tailwind.config.ts` |
| C4 | Setup `src/index.css` (Tailwind + fonts + tokens) | 🔴 | ☐ | `frontend/src/index.css` |
| C5 | Tạo `frontend/.env` | 🔴 | ☐ | `frontend/.env` |
| C6 | Clean `App.tsx` (placeholder luxury page) | 🟡 | ☐ | `frontend/src/App.tsx` |
| C7 | Install packages (axios, zustand, react-query, zod...) | 🟡 | ☐ | — |
| C8 | Chạy `npm run dev` → verify dev server | 🔴 | ☐ | — |

---

## PHASE D: Git + Verify (10 phút)

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| D1 | Cập nhật `.gitignore` | 🔴 | ☐ | `.gitignore` |
| D2 | Verify CORS: FE fetch BE thành công | 🔴 | ☐ | — |
| D3 | Cập nhật docs (nếu có thay đổi) | 🟡 | ☐ | `docs/` |

---

## THỐNG KÊ

| Phase | Tasks | Priority 🔴 |
|:------|:------|:-----------|
| A: Docker | 4 | 3 |
| B: Backend | 12 | 11 |
| C: Frontend | 8 | 5 |
| D: Git + Verify | 3 | 2 |
| **TỔNG** | **27** | **21** |
| Estimate | **~1.5 giờ** | |

---

## PROGRESS

```
Phase A: ░░░░░░░░░░  0% (0/4)
Phase B: ░░░░░░░░░░  0% (0/12)
Phase C: ░░░░░░░░░░  0% (0/8)
Phase D: ░░░░░░░░░░  0% (0/3)
────────────────────────────────
TOTAL:   ░░░░░░░░░░  0% (0/27)
```
