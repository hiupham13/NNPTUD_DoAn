# Test Cases: Categories Module

> Kiểm tra quản lý danh mục / thương hiệu và validation xóa dữ liệu

### Tóm tắt các Cases cần Pass

| # | Test Case | API | Header/Token | Expected Output | Automation Test |
|:--|:----------|:----|:-------------|:----------------|:------:|
| 1 | Lấy danh sách Categories | `GET /api/v1/categories` | None (Public) | HTTP 200 - List of categories `isActive:true` | ✅ |
| 2 | Tạo mới Category | `POST /api/v1/categories` | `Bearer Token <Admin>` | HTTP 201 - Dữ liệu mới được insert | ✅ |
| 3 | Sửa Category | `PUT /api/v1/categories/:id` | `Bearer Token <Admin>` | HTTP 200 - Save thành công, slug pre('save') re-fire tự động | ✅ |
| 4 | Cập nhật trùng tên đang có | `PUT /api/v1/categories/:id` | `Bearer Token <Admin>` | Mongoose bắt lỗi `11000`, trả về HTTP 400 | ✅ |
| 5 | Xóa Category (Không có SP) | `DELETE /api/v1/categories/:id`| `Bearer Token <Admin>` | HTTP 200 - Bị gắn cờ ẩn `isDeleted = true` | ✅ |
| 6 | **EC-01**: Xóa Category chứa Sản phẩm | `DELETE /api/v1/categories/:id`| `Bearer Token <Admin>` | HTTP 400 - "Danh mục chứa n sp hoạt động, không thể xóa" | ✅ |
