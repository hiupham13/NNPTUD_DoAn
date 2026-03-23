# Kế hoạch triển khai Module D7 (Cart, Orders, Coupons, Inventory)

## 📌 Mục tiêu
Hoàn thiện toàn bộ mạch tuần hoàn thương mại của hệ thống: Khách hàng mua sắm (Cart) -> Áp dụng mã giảm giá (Coupons) -> Tạo Đơn Hàng bằng kỹ thuật **Snapshot Data** (Orders) -> Cập nhật Tồn Kho (Inventories). Luồng xử lý Mongoose Transactions sẽ được áp dụng triệt để nhằm đảm bảo tính toàn vẹn dữ liệu gốc (ACID).

## 🚀 Luồng thiết kế và kỹ thuật tối ưu
1. **Inventory Auto-Creation (`Products` update)**: 
   - Thêm Mongoose hook `post('save')` vào Schema/Controller `Products` để tự động tạo bản ghi Inventory gắn liền với Product vừa được sinh ra (Tránh Lỗi thiếu Data).
2. **First-Come-First-Serve (FCFS)**: 
   - Xử lý Giỏ hàng (Cart) như một dạng "Wishlist tạm". Lúc *Checkout* mới trigger lệnh kiểm tra Tồn Kho và `reserved` hàng thật sự (hạn chế Spam giữ hàng của User).
3. **Mã Đơn Bảo Mật**: 
   - Hàm tiện ích `generateOrderCode` sinh mã theo dạng `ORD-20260324-A7F2` (với 4 ký tự cuối random, che giấu doanh thu hàng ngày với đối thủ).
4. **Freeship Rule Dành Riêng Cho Đồ Luxury**: 
   - Đơn \>= 50,000,000 VNĐ → `shippingFee` = 0.
   - Các Đơn còn lại → `shippingFee` = 50,000 VNĐ.
5. **Kỹ Thuật Snapshot Data**: 
   - Đảm bảo `OrderItems` chép đứt 100% data từ `Product` hiện tại gán vào History (khiến cho việc Admin thay đổi thông tin sản phẩm về sau hoặc Mongoose bị Soft Delete cũng không hề làm thay đổi thông tin Đơn cũ đang được lưu).

## 📂 Trình tự Files cần tạo / sửa
### 1. Phục vụ EC-32 (Auto Inventory)
- Sửa `backend/controllers/products.js`: Thêm khối try-catch bọc `Transaction` hoặc `await Inventory.create()` lúc tạo Product.
- (Hoặc chèn Schema Hook `post('save')` trong `backend/schemas/products.js`).
> *Quyết định*: Đặt trong Controller `products.js` để kiểm soát Error Handler rõ ràng.

### 2. Cấu trúc Cart Module
- Khởi tạo File xử lý `backend/controllers/cart.js`, `backend/routes/cart.routes.js`.
- Cung cấp: Xem Giỏ hàng (populate product), Thêm Item, Cập nhật SL, Xoá Khỏi Giỏ.

### 3. Cấu trúc Coupons Module
- Khởi tạo `backend/controllers/coupons.js`, `backend/routes/coupons.routes.js`.
- Cung cấp: CRUD Mã (Admin), Validate lúc Checkout (Customer/System).

### 4. Cấu trúc Orders Module (Linh hồn D7)
- Khởi tạo `backend/controllers/orders.js`, `backend/routes/orders.routes.js`.
- Cung cấp:
  - `POST /api/v1/orders` (Gom toàn bộ quá trình: Load Cart -> Validate Kho -> Tách Mongoose Transaction -> Giam Kho -> Snapshot Sản Phẩm -> Sinh Code -> Xoá Cart).
  - Lịch sử Đơn / Chi tiết Đơn.
  - Hủy đơn (Cập nhật trả Inventory `reserved`).
  - Cập nhật trạng thái Admin (Giao/Nhận thành công).

## 📑 Tiêu chí hoàn thành (DoD)
1. Đảm bảo Database xử lý qua _Transactions (`session.withTransaction`)_ trên `Checkout` nhằm ngăn chặn thất thoát Kho khi mạng chập chờn hoặc Lỗi Code bất ngờ.
2. Order Model đạt 100% độ bao phủ (Không có Reference trôi nổi gây nát Database về sau).
3. Hoàn thành 100% CheckList Testing cho toàn bộ chu trình 4 Modules.
