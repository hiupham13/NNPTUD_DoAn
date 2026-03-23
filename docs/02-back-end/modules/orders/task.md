# 📝 Task List: Module D7 (Cart, Orders, Coupons, Inventory)

## Phase 1: Mở Rộng Sản Phẩm (EC-32 + Rule 1)
- [x] 1. Cập nhật Schema `backend/schemas/products.js` hoặc Controller `products.js` bổ sung `Inventory.create` để tự động tạo ra Kho chứa = 0 khi tạo mới một Sản phẩm (Admin API).

## Phase 2: Cart (Giỏ Hàng Nháp)
- [x] 1. Tạo file điều khiển `backend/controllers/cart.js`.
- [x] 2. Định nghĩa hàm `getCart` (Lấy giỏ hàng, populate ảnh và giá SalePrice, filter sản phẩm Bị Xóa `isDeleted: false`).
- [x] 3. Định nghĩa hàm `addToCart` (Xử lý gộp Quantity nếu đã tồn tại).
- [x] 4. Định nghĩa hàm `updateCartItem` (Tăng/giảm tay số lượng).
- [x] 5. Định nghĩa hàm `removeCartItem`.
- [x] 6. Định nghĩa API routes `backend/routes/cart.routes.js` và đăng ký tại `app.js`.

## Phase 3: Coupons (Khuyến Mãi & Voucher)
- [x] 1. Tạo file điều khiển `backend/controllers/coupons.js`.
- [x] 2. Định nghĩa nhóm API Admin: Tạo Mã, Lấy d/s Mã, Sửa Mã, Xoá Mã.
- [x] 3. Định nghĩa API Customer: `applyCoupon` / Validate xem mã có thể sử dụng (còn hạn, đủ minAmount, maxUses).
- [x] 4. Định nghĩa API routes `backend/routes/coupons.routes.js` và đăng ký tại `app.js`.

## Phase 4: Orders & Checkout (Lõi Hệ Thống 🌟)
- [x] 1. Tạo Helpers/Utils sinh Object SNAPSHOT Data & Random 4 ký tự hóa đơn. 
- [x] 2. Tạo file điều khiển `backend/controllers/orders.js`.
- [x] 3. Định nghĩa API `checkout` bằng **Mongoose Transactions**:
  - Load Cart user. Verify Cart rỗng (Error).
  - Loop check Tồn Kho (Inventory). Error liền nếu quá SL.
  - Check mã Giảm Giá (Coupon) và số tiền Freeship (>50M VNĐ).
  - Snapshot 100% dữ liệu Items thành Mảng tĩnh.
  - Update Trừ Kho / Cộng Reserved (Inventory).
  - Update Lượt dùng (Coupons).
  - Clear rỗng Giỏ Hàng (Cart).
  - Sinh Order Record mới.
- [ ] 4. Định nghĩa hàm Lịch Sử Cá Nhân (Customer) và Danh Sách Đơn Hệ Thống (Admin).
- [ ] 5. Định nghĩa hàm Chuyển Đổi Trạng Thái Status / Hủy Đơn (Admin/Customer). Nhớ Logic Hoàn Kho khi Hủy.
- [ ] 6. Tạo Test cases Integration (Jest mock).
