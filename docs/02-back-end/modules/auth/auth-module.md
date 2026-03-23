# 🔑 Auth Module

> Module xác thực người dùng.

---

## Endpoints

| Method | Endpoint | Access |
|:-------|:---------|:-------|
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |
| POST | `/api/v1/auth/forgot-password` | Public |
| POST | `/api/v1/auth/reset-password/:token` | Public |

## Files

| File | Vai trò |
|:-----|:--------|
| `routes/auth.routes.js` | Route definitions |
| `controllers/auth.controller.js` | Business logic |
| `schemas/users.js` | User schema (GV) |
| `schemas/roles.js` | Role schema (GV) |
| `middlewares/auth.js` | JWT verify |
| `utils/sendEmail.js` | Nodemailer for reset PW |

## Logic chính

### Register
1. Validate input (username, email, password)
2. Check duplicate (username, email)
3. Find role "customer"
4. Hash password (bcrypt, auto by schema pre-save)
5. Create user
6. Return success (không trả password)

### Login
1. Find user by username (populate role)
2. Check user tồn tại + status = true
3. Compare password (bcrypt)
4. Generate JWT (userId, roleName, 24h)
5. Return token + user info

### Forgot Password
1. Find user by email
2. Generate random token + expire 15 minutes
3. Save token to user record
4. Send email with reset link
5. Always return success (bảo mật EC-40)

### Reset Password
1. Find user by token + token chưa expire
2. Hash new password
3. Clear token fields
4. Return success

## Tham chiếu
- [Authentication](../authentication.md)
- [Business Rules](../../01-system-design/business-rules.md) — BR-01 → BR-08
- [Edge Cases](../../01-system-design/database-design.md) — EC-38 → EC-41
