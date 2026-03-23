# 📝 Task List: Module D8 (VNPay & System Polish)

## Phase 1: Môi trường & Helpers
- [x] 1. Thêm 3 tham số `VNP_TMNCODE`, `VNP_HASHSECRET`, `VNP_URL`, `VNP_RETURNURL` vào file `backend/.env`.
- [x] 2. Sử dụng lệnh `npm install node-cron moment qs` trong backend.
- [x] 3. Khởi tạo Helper file `backend/utils/vnpay.js` chịu trách nhiệm SortObject key alphabet và sinh mã băm SHA512.

## Phase 2: Refactor Checkout Order
- [x] 1. Mở `backend/controllers/orders.js` - Hàm `createOrder`.
- [x] 2. Nếu khách chọn VNPay, sinh chuỗi URL truyền đúng định dạng `vnp_Amount = total * 100`, `vnp_OrderInfo`, `vnp_IpAddr` (IP Fake localhost hoặc IP thật).
- [x] 3. Đính kèm `paymentUrl` dưới khối Object JSON Res trả về.

## Phase 3: Thuật toán Xác Thực Thanh Toán
- [x] 1. Tạo controller `backend/controllers/payments.js`.
- [x] 2. Viết API `vnpayReturn` đáp ứng Redirect (GET).
- [x] 3. Viết API `vnpayIPN` đáp ứng Server-to-Server (GET/POST tuỳ Spec của VNPay, thường là GET). So sánh Checksum -> Cập nhật Order status -> Sinh bản ghi vào `Payment` Schema. Xử lý Logic EC-44 Tránh trùng lặp Transaction.
- [ ] 4. Móc nối Route tại `backend/routes/payments.routes.js`. Đăng ký vào Server App.

## Phase 4: Kế toán Dọn Rác (Cron Sweeper)
- [ ] 1. Tạo file `backend/cron/orderCleanup.js`.
- [ ] 2. Import Mongoose Model `Order`, `Inventory`.
- [ ] 3. Khai báo hàm lập lịch `cron.schedule('*/5 * * * *')` - Lọc các Order có `createdAt < Date.now - 15m`.
- [ ] 4. Lặp qua các Order bị treo -> Huỷ đơn -> Trả Kho.
- [ ] 5. Require CronJob vào file `backend/app.js`.

## Phase 5: Hồi tiếp Polish Testing
- [ ] 1. Viết bộ `d8.integration.test.js` chuyên dụng Mock Fake Callback IPN của VNPay.
- [ ] 2. Cập nhật CheckBoxes và Tiến Độ toàn Backend. Sẵn sàng báo cáo.
