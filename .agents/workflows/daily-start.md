---
description: Workflow bắt đầu ngày mới — Agent đọc files theo thứ tự để hiểu dự án + biết hôm nay làm gì.
---

# 🌅 DAILY START — Bắt Đầu Ngày Mới

> Khi bắt đầu ngày mới (hoặc mở lại dự án sau một khoảng thời gian),
> Agent PHẢI đọc theo thứ tự sau để nắm được toàn bộ context.

---

## BƯỚC 1: ĐỌC NHANH TỔNG QUAN (2 phút)

// turbo
```
Đọc file PROGRESS.md ở root:
→ Hiểu ngay: Đang ở Phase nào? Ngày thứ mấy? Hôm nay làm gì?
→ File: PROGRESS.md
```

---

## BƯỚC 2: ĐỌC KẾ HOẠCH (nếu cần thêm context)

// turbo
```
Nếu cần hiểu rõ hơn scope / timeline:
→ Đọc: ke-hoach.md (kế hoạch tổng quan 4 phases)
→ Đọc: task.md (152 tasks chi tiết — xem task nào TODO, nào DONE)
```

---

## BƯỚC 3: ĐỌC DOCS LIÊN QUAN ĐẾN TASK HÔM NAY

// turbo
```
Tuỳ theo task hôm nay, đọc docs tương ứng:

Nếu làm Backend:
  → docs/02-back-end/modules/<module>-module.md
  → docs/01-system-design/database-design.md (nếu liên quan schema)
  → docs/01-system-design/api-design.md (endpoints)
  → docs/01-system-design/business-rules.md (quy tắc nghiệp vụ)

Nếu làm Frontend:
  → docs/03-frontend/project-structure.md (thư mục)
  → docs/03-frontend/routing.md (routes + 2 layouts)
  → docs/03-frontend/design-system.md (Luxury style)
  → docs/03-frontend/components.md (component specs)

Nếu làm Setup/Docker:
  → docs/05-deployment/docker-setup.md
  → docs/05-deployment/environment-variables.md
```

---

## BƯỚC 4: ĐỌC CODE HIỆN TẠI

// turbo
```
Đọc code đã có liên quan đến task:
  → backend/schemas/ (schemas đã tạo)
  → backend/routes/ (routes đã có)
  → backend/controllers/ (controllers đã có)
  → frontend/src/ (components/pages đã tạo)
```

---

## BƯỚC 5: BẮT ĐẦU LÀM VIỆC

```
Sau khi đã hiểu context → followBƯỚC 1→8 trong global.md workflow
→ Hỏi user: "Hôm nay mình bắt đầu với [task X] nhé?"
→ Chờ xác nhận → Thực hiện
```

---

## BƯỚC 6: CUỐI NGÀY — CẬP NHẬT TIẾN ĐỘ

// turbo
```
Sau khi hoàn thành task:
1. Cập nhật task.md: ☐ → ✅ cho tasks đã xong
2. Cập nhật PROGRESS.md: cập nhật progress bar + completed tasks
3. Cập nhật docs/00-project-init/timeline.md: cập nhật tiến độ, đánh dấu module/ngày đã hoàn thành
4. Cập nhật docs/ tương ứng (theo global.md bước 8)
5. Tóm tắt cho user: "Hôm nay đã xong X, Y, Z"
```

---

## SƠ ĐỒ

```
  Mở dự án lên
       │
       ▼
  ┌──────────────┐
  │ PROGRESS.md  │  ← 30 giây, biết ngay đang ở đâu
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ ke-hoach.md  │  ← 2 phút, hiểu scope + timeline
  │ task.md      │  ← 2 phút, biết task TODO hôm nay
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ docs/ liên   │  ← Đọc docs của module hôm nay
  │ quan task    │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Đọc code     │  ← Đọc code hiện tại
  │ hiện tại     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ BẮT ĐẦU LÀM │  ← Follow global.md workflow
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ CUỐI NGÀY:   │  ← Cập nhật PROGRESS.md + task.md
  │ Update tiến  │
  │ độ           │
  └──────────────┘
```
