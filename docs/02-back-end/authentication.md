# 🔐 Authentication

> Luồng xác thực người dùng.

---

## JWT Strategy

- **Algorithm**: HS256
- **Expire**: 24 hours
- **Payload**: `{ userId, role }`
- **Store**: Client-side (localStorage hoặc cookie)

## Flow

```
Register → Hash password (bcrypt, salt 10) → Save user → Return success
Login    → Find user → Compare password → Generate JWT → Return token
Protected→ Header: Authorization: Bearer <token> → Verify → req.user
```

## Endpoints

| Method | Endpoint | Access | Body |
|:-------|:---------|:-------|:-----|
| POST | `/auth/register` | Public | `{ username, email, password, fullName }` |
| POST | `/auth/login` | Public | `{ username, password }` |
| POST | `/auth/forgot-password` | Public | `{ email }` |
| POST | `/auth/reset-password/:token` | Public | `{ password }` |

## Forgot Password Flow

1. User gửi email → Server check user tồn tại
2. Generate random token + expire (15 phút)
3. Save token vào user record
4. Gửi email chứa link: `FRONTEND_URL/reset-password/:token`
5. User click link → nhập password mới
6. Server verify token + expire → update password → clear token

## Security Rules

- Password hash bằng bcrypt (salt 10 rounds)
- JWT secret từ `.env` (không hardcode)
- Forgot password: luôn trả "Đã gửi email" (dù email không tồn tại) — bảo mật
- Token hết hạn → yêu cầu gửi lại
