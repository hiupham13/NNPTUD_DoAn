---
description: Quy trình làm việc khi nhận yêu cầu Frontend — Đảm bảo hiểu rõ yêu cầu + đọc docs + kiểm tra BE trước khi code FE.
---

# 🎨 WORKFLOW FRONTEND — Quy Trình Làm Việc Với FE

> Khi nhận bất kỳ yêu cầu nào liên quan đến Frontend (tạo page, component, fix UI, tích hợp API...),
> Agent **BẮT BUỘC** tuân thủ luồng này theo đúng thứ tự.

---

## BƯỚC 1: NHẬN & XÁC NHẬN YÊU CẦU

```
- Đọc kỹ yêu cầu của user.
- Xác định rõ scope: tạo mới page/component? Fix bug? Chỉnh UI? Tích hợp API?
- Xác định module liên quan: Auth, Products, Cart, Orders, Admin...
```

---

## BƯỚC 2: HỎI LÀM RÕ (NẾU CẦN)

```
- Nếu yêu cầu chưa rõ ràng hoặc có nhiều cách hiểu → HỎI USER trước.
- Ví dụ hỏi:
  • "Bạn muốn dùng modal hay trang riêng cho form này?"
  • "Component này cần responsive mobile không?"
  • "Có cần kết nối API ngay hay làm UI tĩnh trước?"
- KHÔNG được giả định và tự làm nếu chưa chắc chắn.
- Chờ user xác nhận rồi mới tiến hành.
```

---

## BƯỚC 3: CHỌN SKILLS PHÙ HỢP

```
Tuỳ vào yêu cầu, đọc SKILL.md tương ứng:

| Yêu cầu                        | Skill cần đọc                                    |
|:--------------------------------|:--------------------------------------------------|
| Code giao diện React            | react_typescript_expert                           |
| Thiết kế UI/UX, styling         | ui_ux_designer                                    |
| Tích hợp API backend            | react_typescript_expert + nodejs_express_expert    |
| Fix bug liên quan BE            | nodejs_express_expert                             |
| Tạo module CRUD mới (full stack)| fullstack_module_generator                        |
| Review code                     | code_review_agent                                 |

→ Đọc SKILL.md TRƯỚC khi bắt tay code.
```

---

## BƯỚC 4: ĐỌC DOCS TÀI LIỆU FE

```
Đọc các tài liệu core theo thứ tự:

1. Design System (BẮT BUỘC):
   → docs/03-frontend/design-system.md
   → Nắm: color palette, typography, animation timing, key patterns

2. Components Library:
   → docs/03-frontend/components.md
   → Nắm: UI components đã có (Button, Input, Card...), CSS isolation rules

3. Routing:
   → docs/03-frontend/routing.md
   → Nắm: 2 layouts, route guards, route paths

4. Page docs (nếu có):
   → docs/03-frontend/pages/<module>/<page>.md
   → Nắm: trạng thái hiện tại, kế hoạch, sections đã/chưa làm

5. Code FE hiện tại:
   → frontend/src/pages/ (pages đã tạo)
   → frontend/src/components/ (components đã có)
   → frontend/src/services/ (API services)
   → frontend/src/stores/ (Zustand stores)
   → frontend/src/types/ (TypeScript types)
```

---

## BƯỚC 5: ĐỌC BE — NGHIỆP VỤ LIÊN QUAN

```
Đọc Backend để hiểu rõ luồng dữ liệu:

1. Schema (data model):
   → backend/schemas/<module>.js
   → Nắm: fields, types, required, enums, indexes, pre-save hooks

2. Controller (business logic):
   → backend/controllers/<module>.js hoặc <module>.controller.js
   → Nắm: validation rules, response format, error codes, edge cases

3. Routes:
   → backend/routes/<module>.routes.js
   → Nắm: endpoints, HTTP methods, middleware chain (auth, role, validate)

4. Docs BE (nếu có):
   → docs/02-back-end/modules/<module>/
   → Nắm: implementation plan, test cases, business rules
```

---

## BƯỚC 6: ĐÁNH GIÁ BE

```
Sau khi đọc BE, đánh giá:

✅ BE OK — hoạt động tốt, response format rõ ràng:
   → Tiến sang BƯỚC 7 (Code FE)

⚠️ BE CÓ VẤN ĐỀ — phát hiện bug, mismatch, thiếu field:
   → Đưa ra nguyên nhân CỤ THỂ (file nào, dòng nào, field nào)
   → Góp ý fix hoặc mở rộng
   → Hỏi user: "BE cần sửa trước, bạn muốn fix theo hướng nào?"
   → Chờ user xác nhận → Fix BE trước → Rồi mới code FE

📋 BE CHƯA CÓ API cần thiết:
   → Thông báo user: "API này chưa có, cần tạo trước"
   → Đề xuất endpoint, request/response format
   → Chờ xác nhận → Tạo BE → Rồi mới code FE
```

---

## BƯỚC 7: LẬP KẾ HOẠCH MODULE (BẮT BUỘC)

> **Tham khảo cấu trúc**: `docs/02-back-end/modules/<module>/` — mỗi module BE đều có
> `implementation_plan.md` + `task.md`. FE áp dụng pattern tương tự.

```
TRƯỚC KHI CODE, BẮT BUỘC tạo 2 file:

1. implementation_plan.md:
   → Vị trí: docs/03-frontend/pages/<module>/implementation_plan.md
   → Nội dung:
     • Mục tiêu module/page
     • Files cần tạo / sửa (thứ tự thực hiện)
     • Components cần tạo
     • API endpoints sẽ kết nối (method, path, request/response format)
     • Design patterns áp dụng (từ design-system.md)
     • Edge cases & ràng buộc
     • Dependencies (packages, components, stores)

2. task.md:
   → Vị trí: docs/03-frontend/pages/<module>/task.md
   → Nội dung:
     • Danh sách tasks chi tiết, có checkbox ☐
     • Chia phase nếu cần (Phase 1: Types+Services, Phase 2: Components, Phase 3: Pages)
     • Mỗi task ghi rõ: file tạo/sửa, mô tả ngắn

3. GỬI CHO USER PREVIEW:
   → ⚠️ BẮT BUỘC chờ user xác nhận kế hoạch trước khi code
   → User có thể yêu cầu chỉnh sửa kế hoạch
   → Chỉ khi user OK → mới chuyển sang BƯỚC 8
```

---

## BƯỚC 8: CODE FE (THEO KẾ HOẠCH)

```
Thực hiện theo đúng task.md đã được user approve:

1. Tạo Types (nếu cần):
   → frontend/src/types/<module>.ts
   → Khớp với BE schema fields + response format

2. Tạo API Service (nếu cần):
   → frontend/src/services/<module>Service.ts
   → Dùng Axios instance từ services/api.ts
   → Khớp với BE routes + response format

3. Tạo Hooks (nếu cần):
   → frontend/src/hooks/use<Module>.ts
   → TanStack Query hooks: useQuery, useMutation

4. Tạo Components:
   → frontend/src/components/<module>/
   → Dùng UI components đã có (Button, Input...)
   → Tuân thủ Design System (colors, typography, animations)

5. Tạo/Sửa Pages:
   → frontend/src/pages/<layout>/<Page>.tsx
   → React Hook Form + Zod cho forms
   → TanStack Query cho data fetching

6. Cập nhật Routing (nếu cần):
   → frontend/src/App.tsx
   → Thêm Route + import page mới

7. UI TIẾNG VIỆT:
   → ⚠️ BẮT BUỘC: Mọi label, placeholder, button, message = Tiếng Việt
   → Chỉ giữ tiếng Anh cho: tên thương hiệu, technical terms

8. Cập nhật task.md:
   → Mỗi task hoàn thành → đổi ☐ → ✅
```

---

## BƯỚC 9: KIỂM TRA & CẬP NHẬT DOCS & BÁO CÁO

```
Sau khi code xong:

1. Kiểm tra:
   → Code có compile không? (TypeScript errors?)
   → Route đã đăng ký trong App.tsx?
   → API service khớp BE response format?
   → UI đúng Design System? (fonts, colors, animations, border-radius: 0)
   → Toàn bộ text = Tiếng Việt?

2. Cập nhật DOCS CHI TIẾT:
   → docs/03-frontend/pages/<module>/<page>.md
   → Cập nhật trạng thái: TODO → DONE
   → Ghi rõ: layout, sections, API kết nối, dependencies
   → Cập nhật task.md: tick ✅ tất cả tasks đã xong

3. Cập nhật DOCS TỔNG QUAN:
   → docs/03-frontend/components.md (nếu tạo component mới)
   → docs/03-frontend/routing.md (nếu thêm route mới)
   → PROGRESS.md (cập nhật progress bar + completed tasks)
   → task.md (root) — tick ✅ các tasks tương ứng

4. Báo cáo cho user:
   → Tóm tắt: đã làm gì, files nào tạo/sửa
   → Lưu ý: cần test thêm gì không
```

---

## SƠ ĐỒ TỔNG QUAN (9 BƯỚC)

```
  Nhận yêu cầu FE
       │
       ▼
  ┌──────────────┐
  │ B1: Xác nhận │  ← Đọc kỹ, xác định scope + module
  │ yêu cầu     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ B2: Hỏi      │  ← Nếu chưa rõ → HỎI USER, chờ xác nhận
  │ làm rõ?     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ B3: Đọc      │  ← SKILL.md phù hợp
  │ Skills      │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ B4: Đọc      │  ← design-system, components, routing, page docs
  │ Docs FE     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ B5: Đọc BE   │  ← schemas, controllers, routes, docs BE
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ B6: Đánh giá │  ← OK? Bug? Thiếu API?
  │ BE          │
  └──────┬───────┘
         │
    ┌────┴────┐
    │         │
  BE lỗi   BE OK
    │         │
    ▼         ▼
  Fix BE   ┌──────────────────┐
  trước    │ B7: LẬP KẾ HOẠCH │  ← Tạo implementation_plan.md + task.md
    │      │ (user preview)   │
    └──→   └──────┬───────────┘
                  │
                  ▼ (user approve)
           ┌──────────────┐
           │ B8: CODE FE   │  ← Types → Service → Hooks → Components → Pages
           │ (theo plan)  │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────────┐
           │ B9: KIỂM TRA     │  ← Compile, Design System, Tiếng Việt
           │ + Cập nhật Docs  │  ← Docs chi tiết + Docs tổng quan
           │ + Báo cáo user   │
           └──────────────────┘
```

---

> ⚠️ **QUAN TRỌNG**: 
> - KHÔNG BAO GIỜ nhảy thẳng vào code FE mà chưa đọc docs + kiểm tra BE.
> - KHÔNG BAO GIỜ code mà chưa tạo kế hoạch + được user approve.
> - Luồng này giúp tránh lặp lại lỗi mismatch field names, response format, thiếu API như đã gặp.
