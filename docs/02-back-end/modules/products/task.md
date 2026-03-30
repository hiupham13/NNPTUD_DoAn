# 📝 Task List: Module Upload & Products (Ngày D6)

## Phase 1: Upload (Cloudinary)
- [x] 1. Cài đặt package `cloudinary`, `multer` và `multer-storage-cloudinary`.
- [x] 2. Tạo `backend/config/cloudinary.js` nhận keys từ file `.env`.
- [x] 3. Tạo `backend/middlewares/upload.js` với chế độ 800x800 crop fill 1:1 + validate formats (`jpg`, `png`, `webp`).
- [x] 4. Tạo `backend/controllers/upload.js` cho `/upload` (single) và `/upload/multiple`.
- [x] 5. Móc endpoint tại `backend/routes/upload.routes.js`.

## Phase 2: Products schema fine-tuning
- [x] 1. Thêm property `salePrice` (Number) vào `backend/schemas/products.js` và tính toán bằng hook `pre('save')` gốc tự sinh giá (dùng tính ToSort/ToFilter cực nhẹ).

## Phase 3: Products Controller & Routes
- [x] 1. Tạo file điều khiển `backend/controllers/products.js`.
- [x] 2. Định nghĩa hàm `getProducts` (**Toàn bộ logic Filter Search Paging nằm ở đây**, bắt buộc build Query builder Object cho mongo `$in`, `$gte`, `$lte`, `$regex`).
- [x] 3. Định nghĩa hàm `getProductBySlug` (Populate category, collection).
# 📝 Task List: Module Upload & Products (Ngày D6)

## Phase 1: Upload (Cloudinary)
- [x] 1. Cài đặt package `cloudinary`, `multer` và `multer-storage-cloudinary`.
- [x] 2. Tạo `backend/config/cloudinary.js` nhận keys từ file `.env`.
- [x] 3. Tạo `backend/middlewares/upload.js` với chế độ 800x800 crop fill 1:1 + validate formats (`jpg`, `png`, `webp`).
- [x] 4. Tạo `backend/controllers/upload.js` cho `/upload` (single) và `/upload/multiple`.
- [x] 5. Móc endpoint tại `backend/routes/upload.routes.js`.

## Phase 2: Products schema fine-tuning
- [x] 1. Thêm property `salePrice` (Number) vào `backend/schemas/products.js` và tính toán bằng hook `pre('save')` gốc tự sinh giá (dùng tính ToSort/ToFilter cực nhẹ).

## Phase 3: Products Controller & Routes
- [x] 1. Tạo file điều khiển `backend/controllers/products.js`.
- [x] 2. Định nghĩa hàm `getProducts` (**Toàn bộ logic Filter Search Paging nằm ở đây**, bắt buộc build Query builder Object cho mongo `$in`, `$gte`, `$lte`, `$regex`).
- [x] 3. Định nghĩa hàm `getProductBySlug` (Populate category, collection).
- [x] 4. Định nghĩa hàm `createProduct` (Admin - Lưu ý validate schema đầy đủ).
- [x] 5. Định nghĩa hàm `updateProduct` (Admin - Cập nhật logic `pre('save')` price).
- [x] 6. Định nghĩa hàm `deleteProduct` (Soft delete Admin).
- [x] 7. Móc endpoint tại `backend/routes/products.routes.js` + Cập nhật app.js.
- [x] 8. Kiểm tra End-to-End Postman hoặc Jest để verify Flow 2 module (Upload -> Create Product -> Search).

## Phase 4: Import Excel (Tính năng cộng thêm)
- [x] 1. Cài đặt package `xlsx` (`npm i xlsx`).
- [x] 2. Định nghĩa route `POST /api/v1/products/import` với `upload.single('file')`.
- [x] 3. Viết controller đọc mảng JSON từ buffer, validate và tạo tự động `Product` + `Inventory`.
- [x] 4. Bổ sung Service và Button ở `ProductListPage.tsx` trên Frontend.
