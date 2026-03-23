# 🛠️ Implementation Plan — D2: Project Setup

> **Ngày**: D2 — 24/03/2026
> **Mục tiêu**: Setup Docker, Backend config, Init Frontend, verify chạy
> **Approach**: Viết lại code backend hoàn toàn (không dùng code GV trực tiếp)

---

## 1. MỤC TIÊU

Sau khi hoàn thành D2:
- ✅ Docker Compose chạy được MongoDB container
- ✅ Backend Express.js kết nối MongoDB qua `.env`
- ✅ Frontend Vite + React + TS + TailwindCSS v4 chạy dev server
- ✅ CORS configured cho FE ↔ BE
- ✅ Code mới clean, theo coding conventions

---

## 2. QUYẾT ĐỊNH KỸ THUẬT

### Docker
- **MongoDB 8.0** trong container, expose port 27017
- **Volume** `mongo_data` để persist data
- Backend + Frontend chạy **trực tiếp trên máy** (không container) → dễ dev + hot reload
- Docker Compose chỉ chạy MongoDB service

### Backend — Viết lại hoàn toàn
- **Giữ lại**: `package.json` (dependencies), `bin/www` (entry point)
- **Viết lại**: `app.js` (clean setup, dùng .env, CORS, error handler)
- **Tạo mới**: `config/`, `middlewares/`, `utils/AppError.js`
- **Giữ tham khảo**: schemas GV (đọc logic, nhưng tạo file mới hoàn chỉnh)
- **Backup**: Code GV cũ vào `backend/_backup_gv/`

### Frontend
- Vite 6 + React 19 + TypeScript
- TailwindCSS v4 (new config format)
- Google Fonts: Playfair Display + Inter
- Design tokens theo Luxury/Editorial

---

## 3. FILES CẦN TẠO / SỬA

### 3.1 Docker (Root)
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `docker-compose.yml` | 🆕 Tạo | MongoDB 8 service |
| `.dockerignore` | 🆕 Tạo | node_modules, .env, .git |

### 3.2 Backend Config
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `backend/.env.example` | 🆕 Tạo | Template env variables |
| `backend/config/database.js` | 🆕 Tạo | Mongoose connect từ .env |
| `backend/config/cloudinary.js` | 🆕 Tạo | Cloudinary SDK config |
| `backend/config/cors.js` | 🆕 Tạo | CORS whitelist |
| `backend/app.js` | ✏️ Viết lại | Clean setup, dotenv, CORS, routes, error handler |
| `backend/package.json` | ✏️ Sửa | Thêm dotenv, cors, cloudinary |

### 3.3 Backend Middleware + Utils
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `backend/middlewares/errorHandler.js` | 🆕 Tạo | Centralized error handler |
| `backend/utils/AppError.js` | 🆕 Tạo | Custom error class |

### 3.4 Backend Backup
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `backend/_backup_gv/` | 🆕 Tạo | Copy toàn bộ code GV cũ |

### 3.5 Frontend Init
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `frontend/` | 🆕 Tạo | `npx create-vite frontend --template react-ts` |
| `frontend/.env` | 🆕 Tạo | `VITE_API_URL` |
| `frontend/src/index.css` | ✏️ Sửa | Tailwind + design tokens + fonts |
| `frontend/tailwind.config.ts` | ✏️ Sửa | Fonts, colors, extend |
| `frontend/src/App.tsx` | ✏️ Sửa | Clean placeholder |

### 3.6 Git
| File | Action | Nội dung |
|:-----|:-------|:--------|
| `.gitignore` | ✏️ Sửa | Thêm .env, uploads/, mongo_data/ |

---

## 4. THỨ TỰ THỰC HIỆN

```
1. Backup code GV → _backup_gv/
2. Docker Compose (MongoDB)
3. docker-compose up -d → verify MongoDB chạy
4. Backend: .env.example + config/ + middlewares/ + utils/
5. Backend: Viết lại app.js
6. Backend: Install thêm packages (cors, dotenv, cloudinary)
7. Backend: npm start → verify connect MongoDB
8. Frontend: Init Vite + React + TS
9. Frontend: Install + setup TailwindCSS v4
10. Frontend: Design tokens (fonts, colors)
11. Frontend: npm run dev → verify dev server
12. Verify CORS: FE gọi BE thành công
```

---

## 5. DEPENDENCIES

```
Docker Desktop   → phải chạy trước docker-compose
MongoDB (Docker) → phải chạy trước Backend connect
Backend (.env)   → phải tạo trước khi start
Frontend         → độc lập, có thể chạy song song
```

---

## 6. EDGE CASES / LƯU Ý

- MongoDB port 27017 — check không trùng nếu máy đã có MongoDB local
- Backend port 3000 — check không trùng
- Frontend port 5173 — Vite default
- Cloudinary: dùng placeholder values trong .env.example, user tự điền
- VNPay: tương tự, placeholder
- Mailtrap: dùng Mailtrap SMTP credentials

---

## 7. TIÊU CHÍ HOÀN THÀNH D2

- [ ] `docker-compose up -d` → MongoDB container `luxury-watch-db` running
- [ ] `cd backend && npm start` → "Connected to MongoDB" in console
- [ ] `cd frontend && npm run dev` → Vite dev server at localhost:5173
- [ ] Frontend hiển thị page cơ bản (chạy được)
- [ ] Backend trả về response khi GET `/api/v1/` (health check)
- [ ] Code GV backup trong `_backup_gv/`
- [ ] `.env.example` có đủ biến
