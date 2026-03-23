# Test Cases — Products & Upload Module (D6)

> Trạng thái: ✅ Đã PASS qua Integration Test (`tests/integration/d6.integration.test.js`)

## 1. Cloudinary Upload Testing
| Case ID | Tính năng | Input Test | Expected Output | Ghi chú / Edge Case |
|:---:|:---|:---|:---|:---|
| `UPL-01` | Upload 1 hình ảnh chuẩn | File `.jpg` 2MB | `success: true`, trả về URL Cloudinary chứa `luxury-watch-store` | Kì vọng ảnh resize 800x800 crop fill |
| `UPL-02` | File Size Limit | File `.png` 6MB | Lỗi 400: `Dung lượng file tối đa là 5MB` | Multer giới hạn 5MB |
| `UPL-03` | Gọi upload nhưng thiếu file | Bỏ trống body/form-data | Lỗi 400: `Vui lòng cung cấp file ảnh` | |
| `UPL-04` | Upload sai định dạng | Upload file `.pdf` | Lỗi 400: `chỉ tải lên file hình ảnh` | Extension check |

## 2. Products CRUD Testing
| Case ID | Tính năng | Input Test | Expected Output | Ghi chú / Edge Case |
|:---:|:---|:---|:---|:---|
| `PROD-01` | Tạo Product ko có Discount | `originalPrice = 5tr`, `discount = 0` | Tạo thành công. Data: `price = 5M`, `salePrice = 5M` | Test physical hooks MongoDB |
| `PROD-02` | Tạo Product CÓ Discount | `originalPrice = 100M`, `discount = 10` | Tạo thành công. Data: `price = 90M`, `salePrice = 90M` | `salePrice` được dùng thay Virtual |
| `PROD-03` | Tên SP trùng lặp | Nhập tên đã có | Lỗi 400: Unique name (code 11000) | Bắt lỗi Mongoose |
| `PROD-04` | SKU trùng lặp | Nhập SKU đã có | Lỗi 400: Mongoose Index (code 11000) | |

## 3. Lọc nâng cao (Search & Filtering)
| Case ID | Tính năng | Input Test | Expected Output | Ghi chú / Edge Case |
|:---:|:---|:---|:---|:---|
| `FLT-01` | Mongoose $text Search | `?search=Omeg` | Danh sách SP chứa từ khoá Omega hoặc sku chứa Omega | |
| `FLT-02` | Lọc nhiều tiêu chí kết hợp | `?gender=male&movement=automatic` | Danh sách đồng hồ nam tự động | |
| `FLT-03` | Lọc khoảng giá (Range) | `?minPrice=1500&maxPrice=5000` | Danh sách SP có `salePrice` trong cấu hình min/max | Truy vấn trực tiếp field `salePrice` đã được hook save |
| `FLT-04` | Phân trang (Pagination) | `?page=2&limit=10` (Db có 15 dòng) | Trả về 5 records `page=2`. `totalPages=2` | |
| `FLT-05` | Sắp xếp (Sort) | `?sort=price_asc` | Danh sách trả về tăng dần theo giá | |

## 4. Delete Protection (Soft Delete)
| Case ID | Tính năng | Input Test | Expected Output | Ghi chú / Tiêu chuẩn |
|:---:|:---|:---|:---|:---|
| `DEL-01` | Admin xoá Product | DELETE `/products/id` | Soft delete `isDeleted = true`, `isActive = false` | EC-04/05: Không chèn cứng Database, an toàn cho Orders & Inventory |
| `GET-01` | User Fetch danh sách | GET `/products` | Chỉ trả về list các Product `isDeleted = false` | Middleware Mongoose `pre('find')` hoạt động ẩn |
