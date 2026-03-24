# 📝 Profile Page — Tasks

> **Ngày**: D11 — ✅ HOÀN THÀNH (24/03/2026)
> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)

---

## Tasks

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| P.1 | Tạo `services/userService.ts` (getProfile, updateProfile, changePassword) | 🔴 | ✅ | 3 API functions |
| P.2 | Tạo `hooks/useUser.ts` (useProfile, useUpdateProfile, useChangePassword) | 🔴 | ✅ | TanStack query + mutations, enabled: !!token |
| P.3 | Tạo `ProfilePage.tsx` — Layout 2 sections | 🔴 | ✅ | Profile info + change password |
| P.4 | ProfilePage — Section 1: Xem/sửa thông tin (fullName, phone, address) | 🔴 | ✅ | Address: street, ward, district, city |
| P.5 | ProfilePage — Read-only fields (email, username, role, joinDate) | 🔴 | ✅ | Display only, muted style |
| P.6 | ProfilePage — Section 2: Đổi mật khẩu form | 🟡 | ✅ | 3 password inputs + validation |
| P.7 | ProfilePage — Update authStore sau khi sửa profile | 🔴 | ✅ | setUser() partial update |
| P.8 | ProfilePage — Toast notifications (success/error) | 🟡 | ✅ | react-hot-toast |
| P.9 | ProfilePage — CSS (Luxury style, centered, responsive) | 🔴 | ✅ | `ProfilePage.css`, padding-top: 100px |
| P.10 | Cập nhật routing (`App.tsx`) | 🔴 | ✅ | `/profile`, protected |
| P.11 | Cập nhật docs | 🔴 | ✅ | ✅ |

---

> Tổng: **11 tasks** — ✅ **11/11 DONE**
