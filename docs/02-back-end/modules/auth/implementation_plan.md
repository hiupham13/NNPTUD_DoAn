# 🛠️ Implementation Plan — D4: Auth + Roles Module

> **Ngày**: D4 — 23/03/2026
> **Module**: Auth (Register, Login, Forgot/Reset Password)
> **Tham chiếu**: 
> - [`auth-module.md`](./auth-module.md)
> - [`authentication.md`](../../authentication.md)
> - [`business-rules.md`](../../../01-system-design/business-rules.md) — BR-01 → BR-08

---

## 1. MỤC TIÊU

Sau khi hoàn thành D4:
- ✅ Register → tạo user với role customer
- ✅ Login → kiểm tra credentials, trả JWT token
- ✅ Forgot Password → gửi email reset link (Mailtrap)
- ✅ Reset Password → verify token, đổi mật khẩu
- ✅ Middleware auth + role đã hoạt động end-to-end
- ✅ Test tất cả APIs bằng Postman / cURL

---

## 2. BUSINESS RULES ÁP DỤNG

| BR | Rule | Xử lý |
|:---|:-----|:------|
| BR-01 | Password tối thiểu 6 ký tự | express-validator check |
| BR-02 | Email unique, lowercase | Schema unique + validator |
| BR-03 | Username unique | Schema unique + validator |
| BR-04 | JWT expire 24h | `process.env.JWT_EXPIRE` |
| BR-05 | Reset token expire 15 phút | Crypto random + Date |
| BR-06 | Forgot PW email không tồn tại → vẫn trả success | Bảo mật |
| BR-08 | User bị khoá → 403 | Middleware auth.js đã xử lý |

---

## 3. FILES CẦN TẠO / SỬA

| File | Action | Nội dung |
|:-----|:-------|:--------|
| `controllers/auth.controller.js` | 🆕 | register, login, forgotPassword, resetPassword |
| `routes/auth.routes.js` | ✏️ | 4 routes POST |
| `config/mailer.js` | 🆕 | Nodemailer transport (Mailtrap) |
| `utils/sendEmail.js` | 🆕 | Helper gửi email |
| `utils/generateToken.js` | 🆕 | JWT sign helper |

### Đã có (từ D3):
- `schemas/users.js` — pre save hash, comparePassword
- `schemas/roles.js` — name enum
- `middlewares/auth.js` — JWT verify
- `middlewares/role.js` — authorize()
- `middlewares/validate.js` — express-validator runner
- `middlewares/errorHandler.js` — centralized error

---

## 4. API CONTRACTS

### POST `/api/v1/auth/register`
```json
// Request
{ "username": "john", "email": "john@gmail.com", "password": "123456", "fullName": "Nguyễn Văn Anh" }

// Response 201
{ "success": true, "message": "Đăng ký thành công", "data": { "user": { "_id", "username", "email", "fullName", "role" } } }

// Error 409
{ "success": false, "message": "Email đã tồn tại" }
```

### POST `/api/v1/auth/login`
```json
// Request
{ "email": "john@gmail.com", "password": "123456" }

// Response 200
{ "success": true, "message": "Đăng nhập thành công", "data": { "token": "jwt...", "user": { "_id", "username", "email", "fullName", "role", "avatar" } } }

// Error 401
{ "success": false, "message": "Email hoặc mật khẩu không đúng" }
```

### POST `/api/v1/auth/forgot-password`
```json
// Request
{ "email": "john@gmail.com" }

// Response 200 (LUÔN TRẢ SUCCESS — BR-06)
{ "success": true, "message": "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu" }
```

### POST `/api/v1/auth/reset-password/:token`
```json
// Request
{ "password": "newpassword123" }

// Response 200
{ "success": true, "message": "Đặt lại mật khẩu thành công" }

// Error 400
{ "success": false, "message": "Token không hợp lệ hoặc đã hết hạn" }
```

---

## 5. THỨ TỰ THỰC HIỆN

```
1. Tạo config/mailer.js (Nodemailer Mailtrap)
2. Tạo utils/sendEmail.js
3. Tạo utils/generateToken.js (JWT sign)
4. Tạo controllers/auth.controller.js
   - register (+ validation)
   - login (+ validation)
   - forgotPassword (+ crypto token)
   - resetPassword (+ verify token)
5. Cập nhật routes/auth.routes.js
6. Test: register → login → forgot → reset
7. Test edge cases: duplicate email, wrong password, expired token
```

---

## 6. VALIDATION RULES

| Endpoint | Field | Rules |
|:---------|:------|:------|
| register | username | required, 3-30 chars, trim |
| register | email | required, valid email, lowercase |
| register | password | required, min 6 chars |
| register | fullName | optional, trim |
| login | email | required, valid email |
| login | password | required |
| forgotPassword | email | required, valid email |
| resetPassword | password | required, min 6 chars |

---

## 7. TIÊU CHÍ HOÀN THÀNH

- [ ] Register: tạo user + auto assign role customer
- [ ] Register: duplicate email/username → 409
- [ ] Login: trả JWT token + user info (no password)
- [ ] Login: email sai → 401 "Email hoặc mật khẩu không đúng"
- [ ] Login: password sai → 401 (cùng message — bảo mật)
- [ ] Login: user bị khoá → 403
- [ ] Forgot: gửi email reset (Mailtrap inbox)
- [ ] Forgot: email không tồn tại → vẫn trả 200 (BR-06)
- [ ] Reset: token hợp lệ → đổi password thành công
- [ ] Reset: token hết hạn → 400
- [ ] Middleware auth: protected route trả 401 nếu no token
- [ ] Middleware role: admin route trả 403 nếu customer
