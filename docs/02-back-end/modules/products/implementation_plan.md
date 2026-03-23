# Kế hoạch triển khai Module Upload

## Mục tiêu
Tổ chức luồng xử lý nhận file bằng `multer`, nén/resize file trước hoặc trong lúc gửi lên `Cloudinary`, sau đó trả URL về cho Client.
Thiết lập API riêng biệt (Phương án A) để tách bạch xử lý Media file và rác database, giúp tái sử dụng cho các form update Avatar, Brand Logo v.v...

## Files cần tạo / sửa (Thứ tự thực hiện)
1. `backend/config/cloudinary.js`: Setup config Cloudinary v2 SDK.
2. `backend/middlewares/upload.js`: Code cấu hình `multer` sử dụng `multer-storage-cloudinary` (sẽ hỗ trợ tự động resize 800x800 + crop + optimize ngay khi upload lên Server Cloudinary).
3. `backend/controllers/upload.js`: Logic xử lý 1 request (`req.file`) hoặc multiple (`req.files`) trả về JSON format chuẩn.
4. `backend/routes/upload.routes.js`: Định nghĩa endpoint.
5. `backend/app.js`: Đăng ký routes.

## Tiêu chí hoàn thành (Bắt buộc)
1. Request size giới hạn 5MB cho ảnh. Mimetype chỉ chấp nhận png, jpeg, jpg, webp.
2. Cloudinary optimize quality `q_auto`, f_auto.
3. Resize 800x800, chế độ `crop: 'fill'` để ảnh đồng hồ luôn có tỷ lệ 1:1, hiển thị đẹp trên Web E-Commerce.

---

# Kế hoạch triển khai Module Products

## Mục tiêu
Dựng APIs phục vụ quản trị toàn diện và filter/search mạnh mẽ cho Sản phẩm (Đồng hồ), có tích hợp Paging phân trang. Triển khai trọn vẹn logic xoá mềm, kết hợp ref Populate.

## Files cần tạo / sửa
1. `backend/controllers/products.js`: Lớp xử lý nghiệp vụ. 
2. `backend/routes/products.routes.js`: API maps cho CRUD.

## Edge cases & Ràng buộc xử lý
1. **EC-10/11/12**: Xử lý logic Snapshot đã nằm ở Module Orders, Product chỉ cần xử lý update và Delete soft an toàn (set `isDeleted: true`).
2. Giá Sale cập nhật qua Virtual không được fetch lúc Sort database, cần tạo Middleware xử lý hook Sale calculation ở cấp query (nếu có sort theo giá sale) - Tức cập nhật giá Sale khi lưu DB để có thể Query `$sort: {salePrice: 1}` (Option 1). Tuy nhiên `product` model chưa có field `salePrice` thực mà là virtual.
**Giải pháp tối ưu**: Thêm `salePrice` là 1 field physical luôn được generate từ pre('save') chứ không chỉ virtual, giúp quá trình Search/Filter/Sort Paging Mongoose cực kì nhẹ nhàng và chính xác. Sẽ update schema.
3. Validate reference `category` bắt buộc tồn tại (Category model có isActive = true).

## Phân trang & Tìm kiếm API (API GET /products)
Thiết lập middleware `queryParser` hoặc filter trực tiếp trong controller:
- `search` → Mongoose `$text` search trên field title, description (indexing `title: text, description: text`).
- Thẻ lọc: `minPrice`, `maxPrice`, `gender`, `movement`, `category`.
- `sort` → String (vd `price_asc`, `created_desc`).

## Dependencies
- Phụ thuộc `Categories` Model, `Collections` Model (đã xong). 
- Module Upload (làm trước để gán `images[]` URL thử nghiệm).
