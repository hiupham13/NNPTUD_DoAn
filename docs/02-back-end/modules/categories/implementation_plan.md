# 🗺️ Implementation Plan: Categories Module

## Mục tiêu module
- Quản lý danh sách Category (Thương hiệu đồng hồ: Rolex, Omega...).
- Phục vụ API public cho FE lấy Categories và API internal để chặn sửa xóa gây ảnh hưởng Products.

## Files cần tạo/sửa
1. `backend/controllers/categories.js`: Logic CRUD + Delete Protection.
2. `backend/routes/categories.routes.js`: Router logic và gán Roles admin.

## Dependencies
- MongoDB Category và Product Models (`models/category.js` và `models/product.js`).

## Edge cases cần xử lý
- **EC-01**: (Delete Protection) Kiểm đếm số lượng Products có field `category` ID tham chiếu và mang cờ `isDeleted: false`. Nếu > 0, từ chối xoá và ném lỗi 400.
- Check trùng tên (`name` is unique) khi tạo mới hoặc cập nhật.

## Tiêu chí hoàn thành
- API GET `/categories` public hiển thị toàn bộ active list.
- API POST/PUT/DELETE lock strictly behind `admin` role.
- ⚡ **EC-01** Validation chặn xóa dữ liệu lỗi như đã define trong Business Rules.
