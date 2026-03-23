---
description: Luồng làm việc chính của Agent — Đảm bảo đọc Skills → Rules → rồi mới thực hiện code.
---

# 🔄 GLOBAL WORKFLOW — Luồng Làm Việc Agent

> Workflow này áp dụng cho **MỌI** yêu cầu từ user. Agent PHẢI tuân theo từng bước.

---

## BƯỚC 1: HIỂU YÊU CẦU

```
- Đọc kỹ yêu cầu của user
- Nếu yêu cầu chưa rõ → HỎI LẠI trước khi làm
- Xác định yêu cầu thuộc loại nào:
  □ Phân tích / thảo luận (không cần code)
  □ Thiết kế (database, API, kiến trúc)
  □ Code backend (API, logic, middleware)
  □ Code frontend (React page, component)
  □ Tạo module mới (fullstack)
  □ Setup / DevOps (Docker, config)
  □ Testing / QA
  □ Review / Tối ưu
```

---

## BƯỚC 2: ĐỌC SKILLS LIÊN QUAN

```
- Dựa vào loại yêu cầu ở Bước 1, đọc SKILL.md tương ứng:

  Phân tích nghiệp vụ     → .agents/skills/business_analyst/SKILL.md
  Lên kế hoạch / Sprint   → .agents/skills/project_manager/SKILL.md
  Thiết kế kiến trúc       → .agents/skills/system_architect/SKILL.md
  Code API / Backend       → .agents/skills/nodejs_express_expert/SKILL.md
  Thiết kế database        → .agents/skills/mongodb_expert/SKILL.md
  Code frontend            → .agents/skills/react_typescript_expert/SKILL.md
  Tạo module CRUD mới      → .agents/skills/fullstack_module_generator/SKILL.md
  Thiết kế giao diện       → .agents/skills/ui_ux_designer/SKILL.md
  Setup Docker / Deploy    → .agents/skills/docker_devops/SKILL.md
  Viết test                → .agents/skills/api_testing_qa/SKILL.md
  Tích hợp thanh toán      → .agents/skills/payment_integration/SKILL.md
  Review bảo mật / tối ưu  → .agents/skills/security_performance/SKILL.md
  Review code sau khi xong  → .agents/skills/code_review_agent/SKILL.md
  Tạo dữ liệu test / seed  → .agents/skills/mock_data_seeder/SKILL.md

- Có thể đọc NHIỀU skills nếu task liên quan nhiều layer.
- Ví dụ: "Tạo module Orders" → đọc fullstack_module_generator + nodejs_express_expert + mongodb_expert + react_typescript_expert
```

---

## BƯỚC 3: ĐỌC RULES

```
- ĐỌC các rules trong .agents/rules/ trước khi thực hiện:

  🛡️ safety-first.md       → KHÔNG xoá, ghi đè, cài package khi chưa được chấp thuận
  📖 read-before-write.md   → LUÔN đọc code hiện tại trước khi sửa/tạo mới
  🔧 tech-stack-locked.md   → KHÔNG thay đổi tech stack (Node/Express, React/Vite/TS, MongoDB, Docker)
  💬 communication.md       → Giao tiếp tiếng Việt, không tạo file tài liệu tự động
  ✨ code-quality.md        → Naming conventions, response format, soft delete, pagination
  🎯 skill-usage.md         → Mapping yêu cầu → skills cần đọc

- Các quy tắc QUAN TRỌNG NHẤT cần nhớ:
  1. Hỏi user trước khi xoá/ghi đè/cài đặt
  2. Đọc code gốc trước khi sửa
  3. Không đổi tech stack
  4. Giao tiếp tiếng Việt
  5. Tuân theo coding conventions
```

---

## BƯỚC 4: ĐỌC CODEBASE LIÊN QUAN

```
- Đọc các file code hiện tại liên quan đến yêu cầu:
  □ Đọc file cần sửa (nếu sửa code)
  □ Đọc file tương tự (nếu tạo mới — để theo đúng pattern)
  □ Đọc file dependency (imports, references)
  □ Kiểm tra file đã tồn tại chưa (nếu tạo mới)

- Cấu trúc codebase hiện tại:
  backend/app.js        → Express app setup
  backend/bin/www       → Entry point
  backend/schemas/      → Mongoose schemas
  backend/routes/       → Route definitions
  backend/controllers/  → Controller logic
  backend/utils/        → Utilities
  backend/uploads/      → Uploaded files
```

---

## BƯỚC 5: TẠO KẾ HOẠCH MODULE (NẾU BẮT ĐẦU MODULE MỚI)

// turbo
```
- Khi BẮT ĐẦU làm 1 module mới (auth, products, orders...):

  1. ĐỌC mô tả module:
     → docs/02-back-end/modules/<module>/<module>-module.md
     → docs/01-system-design/business-rules.md (rules liên quan)
     → docs/01-system-design/database-design.md (schema + edge cases)
     → docs/01-system-design/api-design.md (endpoints)

  2. TẠO 2 files trong thư mục module:

     docs/02-back-end/modules/<module>/implementation_plan.md
     ├── Mục tiêu module
     ├── Files cần tạo/sửa (theo thứ tự)
     ├── Dependencies (cần gì trước)
     ├── Approach kỹ thuật (giải thích cách triển khai)
     ├── Edge cases cần xử lý (từ database-design.md)
     └── Tiêu chí hoàn thành

     docs/02-back-end/modules/<module>/task.md
     ├── Danh sách task nhỏ (granular)
     ├── Checkbox ☐ / ✅
     ├── Thứ tự thực hiện
     └── Files liên quan cho từng task

  3. Trình bày plan cho user → CHỜ chấp thuận

- Cấu trúc thư mục modules:
  docs/02-back-end/modules/
  ├── auth/
  │   ├── auth-module.md              ← Mô tả tổng quan (đã có)
  │   ├── implementation_plan.md      ← Kế hoạch triển khai (tạo trước khi code)
  │   └── task.md                     ← Tasks chi tiết (tạo trước khi code)
  ├── products/
  │   ├── products-module.md
  │   ├── implementation_plan.md
  │   └── task.md
  └── ...

- Áp dụng tương tự cho frontend modules:
  docs/03-frontend/pages/<page>/
  ├── <page>-page.md                  ← Mô tả tổng quan
  ├── implementation_plan.md          ← Kế hoạch triển khai
  └── task.md                         ← Tasks chi tiết
```

---

## BƯỚC 6: THỰC HIỆN THEO PLAN

// turbo
```
- Thực hiện theo đúng implementation_plan.md đã tạo ở bước 5
- Tuân theo conventions trong SKILL đã đọc
- Tuân theo rules đã đọc
- Tạo/sửa file theo đúng thứ tự logic:
  Backend:  Schema → Controller → Route → Register trong app.js
  Frontend: Types → API → Hooks → Components → Pages
  Fullstack: Backend trước → Frontend sau
- Tick ✅ từng task trong task.md của MODULE khi xong
```

---

## BƯỚC 7: TÓM TẮT KẾT QUẢ

// turbo
```
- Liệt kê files đã tạo/sửa
- Tóm tắt thay đổi chính
- Gợi ý bước tiếp theo (nếu có)
- Hỏi user có cần gì thêm không
```

---

## BƯỚC 8: CẬP NHẬT TASK MODULE

// turbo
```
- Cập nhật task.md CỦA MODULE:
  □ Tick ✅ tasks đã hoàn thành
  □ Ghi notes nếu có thay đổi so với plan
```

---

## BƯỚC 9: CẬP NHẬT FILES TỔNG QUAN

// turbo
```
- SAU KHI hoàn thành module → CẬP NHẬT các file tổng quan ở ROOT + DOCS:

  1. task.md (ROOT)
     → Tick ✅ tasks tương ứng ở cấp dự án

  2. PROGRESS.md (ROOT)
     → Cập nhật progress bar, completed list, ngày hiện tại

  3. ke-hoach.md (ROOT)
     → Tick tiêu chí hoàn thành phase (nếu có)

  4. PROJECT_REQUIREMENTS.md (ROOT)
     → Tick ✅ chức năng đã xong

  5. docs/ tương ứng:
     → Cập nhật module-module.md (nếu có thay đổi so với plan)
     → Cập nhật docs khác nếu liên quan

- Mapping module → docs cần update:
  Setup project / Docker        → docs/00-project-init/ + docs/05-deployment/
  Thiết kế database / API       → docs/01-system-design/
  Code Backend module [X]       → docs/02-back-end/modules/[x]/
  Code Auth / Middleware         → docs/02-back-end/authentication.md, authorization.md
  Code Frontend page [X]        → docs/03-frontend/pages/[x]/
  Code Frontend setup            → docs/03-frontend/project-structure.md, routing.md
  Testing                        → docs/04-testing/
  Seed data                      → docs/02-back-end/seed-data.md
```

---

## SƠ ĐỒ TỔNG QUAN

```
  ┌──────────────────┐
  │  1. Hiểu yêu cầu │
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │  2. Đọc SKILLS    │ ← Đọc SKILL.md liên quan
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │  3. Đọc RULES     │ ← Đọc rules trong .agents/rules/
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │  4. Đọc CODEBASE  │ ← Đọc code hiện tại liên quan
  └────────┬─────────┘
           ▼
  ┌────────────────────────────────────────┐
  │  5. TẠO KẾ HOẠCH MODULE               │ ← 🆕 Tạo implementation_plan.md
  │     (nếu bắt đầu module mới)          │     + task.md cho module
  │     → Trình bày plan → CHỜ chấp thuận │
  └────────┬───────────────────────────────┘
           ▼
  ┌──────────────────┐
  │  6. Thực hiện     │ ← Theo plan, tick task module
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │  7. Tóm tắt       │ → Báo cáo kết quả
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │  8. Update task   │ → Tick ✅ task.md MODULE
  │     MODULE        │
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │  9. Update files  │ → PROGRESS.md, task.md (root),
  │     TỔNG QUAN     │   ke-hoach.md, PROJECT_REQUIREMENTS
  └──────────────────┘
```

---

## LƯU Ý QUAN TRỌNG

1. **KHÔNG BỎ QUA** bước 2 và 3 — Luôn đọc skills + rules trước khi code.
2. **KHÔNG NHẢY** thẳng đến bước 6 — Phải trải qua bước 5 (tạo plan + chờ chấp thuận).
3. **NGOẠI TRỪ** khi user nói rõ "cứ làm đi" hoặc "tự quyết định" → có thể bỏ qua chờ.
4. Nếu yêu cầu chỉ là **hỏi/thảo luận** (không phải code) → chỉ cần bước 1 + 7.
5. **Module planning** (bước 5) chỉ tạo 1 LẦN khi bắt đầu module mới — không tạo lại nếu đã có.

