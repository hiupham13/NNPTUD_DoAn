# Kế hoạch triển khai Module D8 (Thanh toán VNPay & CronJob Dọn Rác)

## 📌 Mục tiêu
Hoàn tất mảnh ghép cuối cùng của Backend API: Xử lý giao dịch điện tử và Đảm bảo bảo mật toàn vẹn trạng thái. Hệ thống sẽ tích hợp thẳng bộ công cụ **Mã hoá SHA512 VNPay**. Kèm theo đó là một "Kế toán ảo" (CronJob) chạy dọn dẹp Database mỗi phút để xả hàng những đơn hàng ảo bị treo (Pending) trên cổng thanh toán quá 15 phút.

## 🚀 Luồng thiết kế và Kỹ thuật tối ưu (Theo thoả thuận A/B)
1. **Phương Án B (Gộp API Checkout gốc)**:
   - Trong `POST /api/v1/orders` (D7), khi khách hàng chọn thanh toán VNPay, Frontend sẽ nhận được không chỉ `Order Data` mà kèm luôn `paymentUrl`. Khách sẽ tự động bị `window.location.replace` hoặc mở iframe tới trang Sandbox của VNPay. Đỡ tốn 1 Request/Round-trip cho Server.
2. **Snapshot An Toàn (User Request)**:
   - Toàn bộ Schema `Order` đã thực hiện Snapshot đứt đoạn đối với Sản phẩm gốc (Giá trị `price`, `title`, `salePrice`, `discount`...). Lịch sử hiển thị trên VNPay IPN Return hoặc trong Lịch sử mua hàng đều dựa hoàn toàn vào mảng Snapshot này. Admin xoá hay thay đổi Giá sản phẩm trong tương lai là Vô Hại với Order của Khách.
3. **Quản lý Vòng Đời IPN Webhook (EC-42, EC-44)**:
   - `vnpay-return`: Chỉ để hiển thị giao diện UI Frontend (Thành công/Thất bại). KHÔNG dùng để thay đổi Database (Vì Hacker có thể Fake Return URL).
   - `vnpay-ipn`: Bắt buộc IPN gửi ngầm từ Server VNPay -> Node.js Server. Node.js check `HashSecret` chuẩn xác rổ mới sửa `status: paymentMethod = success, Order.isPaid = true`.
4. **Node-Cron Sweeper (Dọn rác Orders)**:
   - Một File Job Schedule tự động chạy mỗi 1 phút dưới Background. Quét các đơn `pending` qua cổng VNPay mà thời gian `createdAt` vượt quá tuổi thọ 15 phút. Hệ thống tự cập nhật `status: cancelled` đồng thời gọi logic phục hồi Kho Hàng `Inventory.reserved -= qty`.

## 📂 Trình tự Files cần tạo / sửa
### 1. Phục vụ Cấu hình Môi trường
- Cập nhật `backend/.env` đưa vào thông tin Sandbox VNPay thật.
- Cài đặt dependency: `moment`, `qs`, `node-cron`.

### 2. Thiết lập Helper VNPay Core
- Bổ sung `backend/utils/vnpay.js`: Chứa hàm tạo Checksum sha512 bằng thư viện `crypto` và sắp xếp bộ param chữ cái A-Z theo quy chuẩn khắt khe của NHNN Sandbox VNPay.

### 3. Nâng cấp Core Orders (Phương Án B)
- Cập nhật `backend/controllers/orders.js`: Trích xuất hàm `generateVNPayUrl` nhúng trực tiếp vào trong `createOrder`. Nếu Method là `vnpay`, trả luôn link.

### 4. Cấu trúc Payments Module (IPN)
- Khởi tạo File xử lý `backend/controllers/payments.js`, `backend/routes/payments.routes.js`.
- Cung cấp: Xử lý Endpoint Server-to-Server chốt hạ Trạng thái DB. Tạo mới bản ghi tham chiếu vào bảng `Payments` để phục vụ đối soát tài chính kế toán (`paymentSchema`).

### 5. Khởi động Kế toán (Cron)
- Khởi tạo File `backend/cron/orderCleanup.js` với Rule Quét 1 phút 1 lần.
- Đăng kí Cron Trigger thẳng bên trong gốc `backend/app.js`.

## 📑 Tiêu chí hoàn thành (DoD)
- Mã hoá Checksum vượt qua Validation của VNPay Sandbox v2.
- Testing Integration bắt gọn được luồng `Pending -> Cancelled` nếu treo quá 15 phút để bảo vệ Tồn kho.
