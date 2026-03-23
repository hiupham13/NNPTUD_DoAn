# Test Cases: Auth Module

> Phục vụ cho tính năng Đăng ký, Đăng nhập, và Quên/Đổi mật khẩu

### Tóm tắt các Cases cần Pass

| # | Test Case | API | Header/Token | Expected Output | Status |
|:--|:----------|:----|:-------------|:----------------|:------:|
| 1 | Register thành công | `POST /api/v1/auth/register` | None | Trả về thông tin user (ẩn password) + Role Customer | ✅ |
| 2 | Register trùng email | `POST /api/v1/auth/register` | None | HTTP 400 - "Email đã được sử dụng" | ✅ |
| 3 | Mật khẩu ngắn < 6 ký tự | `POST /api/v1/auth/register` | None | HTTP 400 - "Mật khẩu tối thiểu 6 ký tự" | ✅ |
| 4 | Login thành công | `POST /api/v1/auth/login` | None | HTTP 200 - Trả về Token và Data User | ✅ |
| 5 | Login sai user/pass | `POST /api/v1/auth/login` | None | HTTP 400 - "Tài khoản hoặc mật khẩu không đúng" | ✅ |
| 6 | Tài khoản bị khóa (isActive: false) | `POST /api/v1/auth/login` | None | HTTP 403 - "Tài khoản của bạn đã bị khóa" | ✅ |
| 7 | Gửi Forgot password (đúng email) | `POST /api/v1/auth/forgot-password` | None | HTTP 200 - Link gửi mail (có token 15p expires) | ✅ |
| 8 | Gửi Forgot password (sai email) | `POST /api/v1/auth/forgot-password` | None | HTTP 200 - Giả vờ gửi thành công để bảo mật Enum Email | ✅ |
| 9 | Đổi password qua token (hết hạn) | `PUT /api/v1/auth/reset-password/:token`| None | HTTP 400 - "Token không hợp lệ hoặc hết hạn" | ✅ |
