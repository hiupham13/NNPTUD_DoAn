# Test Cases: Users Module

> Kiểm tra nghiệp vụ xem/chỉnh sửa thông tin thành viên

### Tóm tắt các Cases cần Pass

| # | Test Case | API | Header/Token | Expected Output | Automation Test |
|:--|:----------|:----|:-------------|:----------------|:------:|
| 1 | Truy cập Profile cá nhân | `GET /api/v1/users/profile` | `Bearer Token <Customer>` | HTTP 200, trả Data (ẩn trường Mật khẩu) | ✅ |
| 2 | Cập nhật tên, SDT, đại chỉ | `PUT /api/v1/users/profile` | `Bearer Token <Customer>` | HTTP 200, Data mới được lưu | ✅ |
| 3 | Đổi mật khẩu - Sai PW cũ | `PUT /api/v1/users/change-password` | `Bearer Token <Customer>` | HTTP 400 - Trả về lỗi | ✅ |
| 4 | Xem danh sách Users (là User) | `GET /api/v1/users` | `Bearer Token <Customer>` | HTTP 403 Forbidden | ✅ |
| 5 | Xem danh sách Users (là Admin) | `GET /api/v1/users` | `Bearer Token <Admin>` | HTTP 200 - Object có `pagination` | ✅ |
| 6 | Khóa User khác (Toggle Status) | `PUT /api/v1/users/:id/toggle-status` | `Bearer Token <Admin>` | HTTP 200 - Status được invert | ✅ |
| 7 | EC-41: Tự khóa chính Admin | `PUT /api/v1/users/:admin_id/toggle-status`| `Bearer Token <Cùng 1 Admin>` | HTTP 400 - Error "Không thể khóa chính mình" | ✅ |
