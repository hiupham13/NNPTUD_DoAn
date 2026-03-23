---
description: Quy tắc giao tiếp — Ngôn ngữ, format trả lời, cách thảo luận với user.
globs: ["**/*"]
alwaysApply: true
---

# 💬 QUY TẮC GIAO TIẾP

## 1. NGÔN NGỮ

### 1.1. Giao tiếp với user
- ✅ **Tiếng Việt** là mặc định.
- ✅ Chuyển sang tiếng Anh nếu user dùng tiếng Anh.
- ✅ Giải thích thuật ngữ kỹ thuật bằng tiếng Việt khi cần.

### 1.2. Code & Comments
- ✅ Tên biến, hàm, class: **Tiếng Anh** (`getProductById`, `isDeleted`).
- ✅ Code comments: **Tiếng Anh** (ngắn gọn).
- ✅ UI labels, messages cho người dùng: **Tiếng Việt** (`"Thêm vào giỏ"`, `"Đăng nhập thành công"`).
- ✅ API error messages: **Tiếng Việt** (`"Không tìm thấy sản phẩm"`, `"Vui lòng đăng nhập"`).

## 2. FORMAT TRẢ LỜI

### 2.1. Khi trả lời câu hỏi
```
1. Trả lời ngắn gọn, đi thẳng vào vấn đề
2. Dùng bullet points hoặc bảng nếu có nhiều thông tin
3. Kèm code example nếu liên quan đến code
4. KHÔNG viết dài dòng, lan man
```

### 2.2. Khi đề xuất thay đổi code
```
1. Mô tả ngắn gọn thay đổi sẽ làm
2. Liệt kê files bị ảnh hưởng
3. Giải thích lý do (nếu không hiển nhiên)
4. Hỏi user xác nhận
5. Thực hiện sau khi được chấp thuận
```

### 2.3. Khi gặp vấn đề / không chắc chắn
- ✅ Nói rõ: _"Tôi không chắc chắn về phần này, bạn xác nhận giúp..."_
- ✅ Đưa ra các phương án (option A, B) để user chọn.
- ❌ **CẤM** tự đoán và thực hiện khi không chắc chắn.

## 3. KHÔNG TẠO FILE TÀI LIỆU TỰ ĐỘNG

- ❌ **CẤM** tự tạo file markdown báo cáo, phân tích, tổng hợp.
  - Ví dụ: `analysis-report.md`, `project-summary.md`, `code-review.md`
- ✅ Nội dung phân tích/tổng hợp → **Hiển thị trực tiếp trong chat**.
- ✅ Chỉ tạo file khi user **yêu cầu rõ ràng**: _"lưu thành file"_, _"tạo file"_, _"ghi ra file"_.
- ✅ Nếu nội dung dài, hỏi: _"Nội dung khá dài, bạn muốn tôi lưu thành file không?"_

## 4. KHI NHẬN YÊU CẦU MỚI

Quy trình xử lý mỗi yêu cầu:

```
1. Hiểu rõ yêu cầu (hỏi lại nếu chưa rõ)
2. Kiểm tra skills liên quan → Đọc SKILL.md
3. Đọc code/file liên quan trong codebase
4. Đề xuất phương án (ngắn gọn)
5. Chờ user chấp thuận
6. Thực hiện
7. Tóm tắt kết quả
```
