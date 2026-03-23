# Test Cases: Collections Module

> Kiểm tra quản lý Bộ Sưu Tập (BST) và xử lý liên kết linh hoạt.

### Tóm tắt các Cases cần Pass

| # | Test Case | API | Header/Token | Expected Output | Automation Test |
|:--|:----------|:----|:-------------|:----------------|:------:|
| 1 | Truy cập BST bằng Slug | `GET /api/v1/collections/:slug` | None (Public) | HTTP 200 - Trả Data BST | ✅ |
| 2 | Admin tạo BST mới | `POST /api/v1/collections` | `Bearer Token <Admin>` | HTTP 201 - BST Mới được lưu | ✅ |
| 3 | User tạo BST mới | `POST /api/v1/collections` | `Bearer Token <Customer>` | HTTP 403 Forbidden | ✅ |
| 4 | Admin xóa BST (trống) | `DELETE /api/v1/collections/:id` | `Bearer Token <Admin>` | HTTP 200 - Update Flag `isDeleted = true` | ✅ |
| 5 | **EC-02**: Admin xóa BST đang có gắn SP | `DELETE /api/v1/collections/:id` | `Bearer Token <Admin>` | Xóa BST, gỡ `product.collectionRef = null` không gây crash Products | ✅ |
