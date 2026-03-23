---
description: Quy tắc đọc hiểu codebase — LUÔN đọc code hiện tại trước khi sửa hoặc tạo mới.
globs: ["**/*"]
alwaysApply: true
---

# 📖 QUY TẮC ĐỌC CODEBASE — BẮT BUỘC

## 1. LUÔN ĐỌC TRƯỚC KHI LÀM

### 1.1. Trước khi sửa file
- ✅ **BẮT BUỘC** đọc toàn bộ file cần sửa trước khi thay đổi.
- ✅ Hiểu rõ logic hiện tại, dependencies, imports.
- ✅ Kiểm tra file nào khác reference đến file này.
- ❌ **CẤM** sửa code mà chưa đọc file gốc.

### 1.2. Trước khi tạo file mới
- ✅ Kiểm tra file đã tồn tại chưa (tránh trùng lặp/ghi đè).
- ✅ Đọc các file cùng thư mục để hiểu pattern, convention đang dùng.
- ✅ Đọc file tương tự (cùng loại) để giữ tính nhất quán.
  - Ví dụ: Tạo route mới → đọc route có sẵn trong `routes/` để theo đúng pattern.

### 1.3. Trước khi trả lời câu hỏi về code
- ✅ Đọc code thực tế, không đoán.
- ✅ Trích dẫn đúng dòng code, tên file khi giải thích.
- ❌ **CẤM** suy đoán code mà không đọc file gốc.

## 2. THỨ TỰ ĐỌC HIỂU

Khi nhận yêu cầu liên quan đến code, tuân theo thứ tự:

```
1. Đọc SKILL liên quan (nếu có) để nắm conventions
2. Đọc file/code hiện tại liên quan đến yêu cầu
3. Đọc các file reference/dependency
4. Hiểu rõ pattern đang dùng trong codebase
5. Đề xuất thay đổi (kèm giải thích)
6. Chờ user chấp thuận
7. Thực hiện thay đổi
```

## 3. CODEBASE GỐC CỦA GIẢNG VIÊN

### Các file GỐC (CẨN THẬN khi sửa):
```
backend/app.js                    # ⚠️ File gốc
backend/bin/www                   # ⚠️ File gốc
backend/schemas/*.js              # ⚠️ Schema gốc
backend/routes/*.js               # ⚠️ Route gốc
backend/controllers/users.js      # ⚠️ Controller gốc
backend/utils/*.js                # ⚠️ Utility gốc
```

### Quy tắc với codebase gốc:
- ✅ **Được phép**: Thêm fields mới vào schema, thêm routes mới, thêm middleware.
- ✅ **Được phép**: Tạo file mới (controller mới, route mới, schema mới).
- ⚠️ **Cần hỏi user**: Sửa đổi logic hiện có trong file gốc.
- ❌ **CẤM**: Xoá code gốc, đổi tên file gốc, thay đổi cấu trúc thư mục gốc.

## 4. KIỂM TRA TRƯỚC KHI COMMIT

Trước khi kết thúc task sửa code, kiểm tra:
- [ ] Đã đọc file gốc trước khi sửa?
- [ ] Code mới có tuân theo pattern hiện tại?
- [ ] Imports/exports có đúng path?
- [ ] Có bị trùng lặp với code đã có không?
- [ ] User đã xác nhận thay đổi chưa?

## 5. CẬP NHẬT TÀI LIỆU SAU KHI LÀM XONG

Sau khi hoàn thành task/phase, **BẮT BUỘC**:
- ✅ Đọc file docs tương ứng trong `docs/`
- ✅ Cập nhật nội dung đã làm vào docs
- ✅ Đổi status trong `PROJECT_REQUIREMENTS.md`: `☐ TODO` → `✅ DONE`

### Mapping:
| Vừa làm xong | Cập nhật docs |
|:-------------|:--------------|
| Setup project | `docs/00-project-init/` |
| Database schema | `docs/01-system-design/database-design.md` |
| API endpoints | `docs/01-system-design/api-design.md` |
| Backend module | `docs/02-back-end/modules/[x]-module.md` |
| Auth / Middleware | `docs/02-back-end/authentication.md` |
| Frontend page | `docs/03-frontend/pages/[x]-page.md` |
| Testing | `docs/04-testing/` |
| Docker / Deploy | `docs/05-deployment/` |
