# 🚀 TIẾN ĐỘ DỰ ÁN — Luxury Watch Store

> **File này để đọc NHANH** mỗi khi mở dự án lên.
> Cập nhật cuối ngày sau khi hoàn thành tasks.

---

## ⏰ THÔNG TIN NHANH

| | |
|:--|:--|
| **Dự án** | Website E-Commerce bán đồng hồ cao cấp |
| **Deadline** | 06/04/2026 |
| **Ngày hiện tại** | D9 — 24/03/2026 ✅ DONE |
| **Phase hiện tại** | Phase 3: Frontend React (D9-D12) — 32% |
| **Phase tiếp** | D10: Home + Products |
| **Trạng thái** | 🟢 Đang giữ đúng tiến độ |

---

## 📊 PROGRESS

```
Phase 1 (Foundation):  ██████████ 100% ✅ DONE
- Phase 2 (Backend API): **100%** ✅ DONE
- Phase 3 (Frontend React): **32%**  ███░░░░░░░  32% ── D9-D12
Phase 4 (Polish):      ░░░░░░░░░░   0% ── D13-D14
──────────────────────────────────────────────────────
OVERALL:               █████░░░░░  45% ── 72/159 tasks
```

---

## ✅ ĐÃ HOÀN THÀNH

### Phase 1: Foundation — 45/45 tasks ✅

#### D1 — 23/03 — Planning & Docs (17 tasks)
- ✅ Agent setup (14 skills, rules, workflows)
- ✅ Docs structure (6 thư mục, 61 files, điền 38 files)
- ✅ PROJECT_REQUIREMENTS.md (12 modules, 65+ chức năng)
- ✅ Design System: Luxury / Editorial
- ✅ Database Design (11 models, 45 edge cases, SNAPSHOT)
- ✅ ke-hoach.md + task.md (159 tasks)
- ✅ 2 Layouts (Customer + Admin, CSS isolation)
- ✅ Workflows (global 9 bước, daily-start)

#### D2 — 23/03 — Project Setup (13 tasks)
- ✅ Docker Compose → MongoDB 8 container `luxury-watch-db`
- ✅ Backend: viết lại `app.js`, config/ (database, cloudinary, cors)
- ✅ Backend: .env + .env.example (Mailtrap, Cloudinary, VNPay)
- ✅ Frontend: Vite + React 19 + TS + TailwindCSS v4
- ✅ Design tokens: Playfair Display + Inter, Luxury palette
- ✅ Packages: dotenv, cors, axios, zustand, react-query, zod...
- ✅ Backup code GV → `_backup_gv/`

#### D3 — 23/03 — Schemas + Seed + Middleware (15 tasks)
- ✅ 10 schemas viết lại hoàn toàn (Mongoose 9 compatible)
- ✅ Middleware đầy đủ: auth (JWT), role (RBAC), validate, errorHandler
- ✅ Seed: 2 roles, 2 users, 8 brands, 4 BST, 15 watches, 15 inventories, 3 coupons
- ✅ API health check: `GET /api/v1` → success

---

#### D4 — 23/03 — Auth Module (12 tasks)
- ✅ Config: mailer.js (Mailtrap), sendEmail.js, generateToken.js
- ✅ Controller: register, login, forgotPassword, resetPassword
- ✅ Routes: 4 POST + validation + validate middleware
- ✅ Test: register, login, duplicate, wrong PW, BR-06 forgot
- ✅ Packages: nodemailer, express-validator

---

### Phase 2: Backend API — (24/46 tasks)
*(D4: Auth, D5: Users, Categories, Collections)*

---

## 📌 VIỆC TIẾP THEO

### D6 — Products + Upload
> Tập trung vào quản lý kho hàng và hình ảnh Cloudinary.

| Task | Priority |
|:-----|:---------|
| - [x] Setup Cloudinary + Upload APIs (single/multiple).
| - [x] Schema `salePrice` physical hook để filter DB tốc độ cao.
| - [x] Products Controller CRUD (phân quyền admin).
| - [x] Lọc/Search Paging nâng cao (Filter Multi-criteria).
| - [x] Integration Test D6.er | 🔴 |
| Testing End-to-End | 🔴 |

### Ngày D7 (24/03): Cart + Orders + Coupons
- [x] Tạo `Cart API` chuẩn FCFS (không giam số lượng cho đến checkout).
- [x] Tự động tạo `Inventory` bằng Hook cho `Products` (EC-32).
- [x] Checkout Snapshot hoá đơn, áp Coupon, trừ Kho cực an toàn.
- [x] Cập nhật / Huỷ / Trả kho đơn hàng cho Admin.
- [x] Test Integration chạy êm ru!

### Ngày D8 (24/03): VNPay Tích Hợp Kép
- [x] Móc API `buildVNPayUrl` ngầm bên trong API Sinh Đơn hàng.
- [x] Thiết lập `CronJob` background dọn rác các đơn VNPay bị người dùng nhấn thoát/ ngâm quá 15 phút.
- [x] `vnpayIPN` Xử lý chuẩn SHA-512, cập nhật chính xác Hoá Đơn Payment sang Database.
- [x] Lọc Dup-Attack (IPN Spam) và Test Integration 100% VNPay Sandbox.

---

## ⚠️ LƯU Ý KỸ THUẬT

| Vấn đề | Giải pháp |
|:-------|:----------|
| Mongoose 9: `pre()` hooks | Không dùng `next()`, dùng async/return |
| Mongoose 9: `collection` reserved | Rename → `collectionRef` |
| Docker Compose: `version` | Obsolete trong v2+, đã bỏ (warning) |
| `dropDatabase()` trước seed | Để clear stale indexes |

---

## 📁 FILES QUAN TRỌNG

| File | Nội dung | Khi nào đọc |
|:-----|:---------|:-----------|
| `PROGRESS.md` | **File này** — tiến độ nhanh | Mỗi ngày đầu tiên |
| `ke-hoach.md` | Kế hoạch 4 phases | Khi cần xem scope |
| `task.md` | 159 tasks chi tiết | Khi cần biết task cụ thể |
| `PROJECT_REQUIREMENTS.md` | Yêu cầu + modules | Khi cần xem tính năng |
| `docs/01-system-design/database-design.md` | DB + Edge Cases | Khi code liên quan DB |
| `docs/03-frontend/design-system.md` | Luxury style | Khi code frontend |

---

> ⚠️ Cập nhật file này **cuối mỗi ngày** hoặc khi hoàn thành major task.
> Xem [`task.md`](./task.md) cho chi tiết từng task.
