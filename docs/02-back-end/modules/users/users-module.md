# 👤 Users Module

> Module quản lý người dùng.

---

## Endpoints

| Method | Endpoint | Access |
|:-------|:---------|:-------|
| GET | `/api/v1/users/profile` | Customer |
| PUT | `/api/v1/users/profile` | Customer |
| PUT | `/api/v1/users/change-password` | Customer |
| GET | `/api/v1/users` | Admin |
| PUT | `/api/v1/users/:id/toggle-status` | Admin |

## Edge Cases
- Admin không tự xoá chính mình (EC-41)
- User bị khoá → 403 (EC-38)
