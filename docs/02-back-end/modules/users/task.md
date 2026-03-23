# 📝 Task List: Users Module

- [x] 1. Khởi tạo `backend/controllers/users.js` với skeleton các methods.
- [x] 2. Viết logic `getProfile` (Chỉ lấy info cơ bản cho logged in user, loại trừ hash password).
- [x] 3. Viết logic `updateProfile` (Cập nhật các field fullName, phone, avatar, address an toàn).
- [x] 4. Viết logic `changePassword` (Bcrypt compare old, update new password hooks).
- [x] 5. Viết logic admin `getUsers` (Tích hợp Schema find + Pagination theo standard params page/limit).
- [x] 6. Viết logic `toggleUserStatus` (Bao hàm EC-41: Cannot lock admin own account).
- [x] 7. Khai báo endpoint trong `backend/routes/users.routes.js`. Thêm middleware bắt buộc.
- [x] 8. Test bộ APIs Users bằng REST client / Postman.
