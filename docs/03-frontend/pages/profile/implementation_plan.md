# 👤 Profile Page — Implementation Plan

> **Ngày**: D11 — 25/03/2026
> **File tạo**: `frontend/src/pages/customer/ProfilePage.tsx` + `.css`
> **Route**: `/profile` — Protected (Customer)
> **Phụ thuộc**: Users API (BE D5 ✅), authStore

---

## 1. TỔNG QUAN

Trang profile cho phép customer xem thông tin cá nhân, chỉnh sửa profile (tên), và đổi mật khẩu.

## 2. CẦN TẠO MỚI

### 2.1. Service
```
frontend/src/services/userService.ts
```
- `getProfile()` → `GET /api/v1/users/profile`
- `updateProfile(data)` → `PUT /api/v1/users/profile`
- `changePassword(data)` → `PUT /api/v1/users/change-password`

### 2.2. Hook
```
frontend/src/hooks/useUser.ts
```
- `useProfile()` — query: lấy profile
- `useUpdateProfile()` — mutation: cập nhật profile
- `useChangePassword()` — mutation: đổi mật khẩu

### 2.3. Page
```
frontend/src/pages/customer/ProfilePage.tsx + .css
```

## 3. LAYOUT

```
┌──────────────────────────────────────────────────┐
│  HỒ SƠ CÁ NHÂN                                  │
├──────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐ │
│  │ THÔNG TIN CỦA BẠN                            │ │
│  │                                              │ │
│  │ Tên:       [Nguyễn Văn A          ] ←editable│ │
│  │ Email:     admin@example.com  (read-only)    │ │
│  │ Username:  admin123           (read-only)    │ │
│  │ Vai trò:   Customer                         │ │
│  │ Ngày tham gia: 23/03/2026                    │ │
│  │                                              │ │
│  │              [CẬP NHẬT]                       │ │
│  ├──────────────────────────────────────────────┤ │
│  │ ĐỔI MẬT KHẨU                                │ │
│  │                                              │ │
│  │ Mật khẩu hiện tại:  [______________]         │ │
│  │ Mật khẩu mới:       [______________]         │ │
│  │ Xác nhận MK mới:    [______________]         │ │
│  │                                              │ │
│  │              [ĐỔI MẬT KHẨU]                  │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

## 4. FORM VALIDATION (Zod)

### Update Profile
```typescript
const profileSchema = z.object({
  fullName: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
});
```

### Change Password
```typescript
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Tối thiểu 6 ký tự'),
  newPassword: z.string().min(6, 'Tối thiểu 6 ký tự'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});
```

## 5. API MAPPING

| Action | Endpoint | Body |
|:-------|:---------|:-----|
| Xem profile | `GET /users/profile` | — |
| Cập nhật profile | `PUT /users/profile` | `{ fullName }` |
| Đổi mật khẩu | `PUT /users/change-password` | `{ currentPassword, newPassword }` |

## 6. EDGE CASES

| Trường hợp | Xử lý |
|:-----------|:------|
| Đổi MK sai mật khẩu cũ | Hiện error từ BE dưới input |
| Cập nhật profile thành công | Toast success + update authStore |
| MK mới trùng MK cũ | Hiện error |

## 7. DESIGN (Luxury)

- 2 sections: Profile Info + Change Password, separated by border
- Max-width: 640px, center aligned
- Form inputs: Bottom border, focus gold
- Buttons: Secondary style (outline) cho update, Primary cho đổi MK
- Read-only fields: Muted color, không có underline
- Typography: Labels uppercase 0.65rem, values Inter 0.9rem

---

> 📋 Xem chi tiết tasks: [`task.md`](./task.md)
