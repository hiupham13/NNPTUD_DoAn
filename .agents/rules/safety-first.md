---
description: Quy tắc an toàn — KHÔNG xoá, KHÔNG ghi đè, KHÔNG thay đổi gì khi chưa được user chấp thuận.
globs: ["**/*"]
alwaysApply: true
---

# 🛡️ QUY TẮC AN TOÀN — BẮT BUỘC TUÂN THỦ

## 1. LUÔN HỎI TRƯỚC KHI HÀNH ĐỘNG

### 1.1. KHÔNG tự động xoá file / code
- ❌ **CẤM** tự xoá file, xoá thư mục, xoá đoạn code mà không hỏi user.
- ❌ **CẤM** dùng lệnh `rm`, `del`, `Remove-Item` hoặc bất kỳ lệnh xoá nào mà chưa được user chấp thuận.
- ✅ Nếu cần xoá → Liệt kê rõ file/code sẽ xoá → Hỏi user → Chờ xác nhận → Mới thực hiện.

### 1.2. KHÔNG tự động ghi đè file có sẵn
- ❌ **CẤM** ghi đè (overwrite) file đã tồn tại mà không hỏi user.
- ✅ Trước khi tạo file mới → Kiểm tra file đã tồn tại chưa.
- ✅ Nếu file đã tồn tại → Thông báo cho user và hỏi: _"File [tên file] đã tồn tại. Bạn muốn ghi đè hay tạo file mới với tên khác?"_

### 1.3. KHÔNG tự động cài đặt package
- ❌ **CẤM** chạy `npm install`, `npm uninstall`, `pip install` hoặc lệnh cài đặt package mà không hỏi user.
- ✅ Liệt kê packages cần cài → Hỏi user → Chờ xác nhận → Mới chạy lệnh.

### 1.4. KHÔNG tự động chạy lệnh nguy hiểm
- ❌ **CẤM** chạy lệnh thay đổi database (drop, delete, migrate) mà không hỏi user.
- ❌ **CẤM** chạy lệnh thay đổi git (push, force push, reset, rebase) mà không hỏi user.
- ❌ **CẤM** chạy lệnh ảnh hưởng hệ thống (cài phần mềm, thay đổi env system) mà không hỏi user.

## 2. QUY TRÌNH XÁC NHẬN

Khi cần thực hiện hành động có ảnh hưởng, tuân theo quy trình:

```
1. Mô tả rõ hành động sẽ thực hiện
2. Liệt kê file/code/data bị ảnh hưởng
3. Giải thích lý do cần thực hiện
4. Hỏi user: "Bạn đồng ý thực hiện không?"
5. CHỜ user phản hồi
6. Chỉ thực hiện khi user đồng ý rõ ràng
```

## 3. CÁC HÀNH ĐỘNG AN TOÀN (Không cần hỏi)
- ✅ Đọc file, đọc code (read-only)
- ✅ Liệt kê thư mục
- ✅ Tìm kiếm code (grep, search)
- ✅ Phân tích, giải thích code
- ✅ Chạy lệnh read-only (`ls`, `dir`, `cat`, `type`, `git status`, `git log`)
- ✅ Tạo file MỚI (file chưa tồn tại) khi user yêu cầu rõ ràng
