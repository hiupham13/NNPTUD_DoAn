# 📝 Kế hoạch triển khai: Tính năng Import Sản Phẩm bằng Excel

> **Module**: Products & Admin Dashboard
> **Luồng xử lý**: Luồng 1 (Admin upload ảnh lên Cloudinary lấy link trước, chèn link vào Excel, sau đó upload file Excel).

---

## 1. MỤC TIÊU
- Cho phép Admin import hàng loạt sản phẩm từ file Excel (`.xlsx`).
- Tự động map dữ liệu, chuyển đổi chuỗi category/collection sang `ObjectId`.
- Tự động tạo bản ghi `Inventory` tương ứng với số lượng tồn kho nhập vào.
- Báo lỗi rõ ràng nếu file sai định dạng hoặc thiếu trường bắt buộc.

---

## 2. FILES CẦN TẠO / SỬA

### 2.1. Backend
1. **`backend/package.json`**: Cài thêm thư viện `xlsx` (`npm install xlsx`).
2. **`backend/routes/products.routes.js`**: 
   - Định nghĩa Route mới: `POST /import-excel`
   - Sử dụng `upload.single('file')` của Multer.
3. **`backend/controllers/products.js`**:
   - Thêm hàm `importProductsFromExcel`.
   - Logic: Đọc buffer, parse JSON, map columns, tìm Category/Collection theo tên, dùng `Session/Transaction` hoặc `Promise.allSettled` để lưu `Product` và `Inventory`.
4. **Tham khảo Schema**: `Product` (`title`, `price`, `images`, `category`, `collectionRef`, v.v) và `Inventory` (`product`, `stock`).

### 2.2. Frontend
1. **`frontend/package.json`**: Cài thêm thư viện `xlsx` (nếu cần tạo file export template, tạm thời chỉ import thì không bắt buộc).
2. **`frontend/src/services/productAdminService.ts`**:
   - Thêm hàm `importExcel(file: File)`.
3. **`frontend/src/hooks/useProductAdmin.ts`**:
   - Thêm mutation `useImportExcel`.
4. **`frontend/src/pages/admin/product-manage/ProductListPage.tsx`**:
   - Thêm nút "Import Excel" cạnh nút Create.
   - Ẩn input `type="file"` để trigger click.
   - Xử lý onChange event, gọi API, thiết lập Notification Toast (Loading/Success/Error).

---

## 3. ĐỊNH DẠNG FILE EXCEL YÊU CẦU

| Tên SP | Giá | Thương Hiệu | Số lượng | Hình Ảnh (URL) | Giới Tính | Loại Máy | Kính | Vỏ | Dây | Chống Nước |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Rolex Sub | 15000 | Rolex | 10 | https://... | Nam | Automatic | Sapphire | Thép | Thép | 10ATM |

*(Lưu ý: Header của cột cần cố định hoặc match theo tên tương đối)*

---

## 4. CHI TIẾT CÁC TASKS (TASK.MD APPEND)

- [ ] BE-1: Cài đặt package `xlsx`.
- [ ] BE-2: Định nghĩa controller `importProductsFromExcel` xử lý đọc buffer, mapping dữ liệu.
- [ ] BE-3: Logic tìm Category/Collection tương ứng (Hoặc tạo mới nếu chưa có).
- [ ] BE-4: Logic lưu DB `Product` và `Inventory`.
- [ ] BE-5: Đăng ký route `POST /api/v1/products/import-excel`.
- [ ] FE-1: Tạo hàm API gọi backend bằng `FormData`.
- [ ] FE-2: Bổ sung mutation vào hooks.
- [ ] FE-3: Cập nhật giao diện `ProductListPage.tsx` gắn nút upload.
