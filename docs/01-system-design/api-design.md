# 📡 API Design

> REST API Endpoints cho Luxury Watch Store.
> Base URL: `/api/v1`

---

## Response Format

```json
// Success
{ "success": true, "data": {...}, "message": "...", "pagination": {...} }

// Error
{ "success": false, "message": "...", "errors": [...] }
```

---

## 1. Auth — `/api/v1/auth`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| POST | `/auth/register` | Public | Đăng ký |
| POST | `/auth/login` | Public | Đăng nhập → JWT |
| POST | `/auth/logout` | Customer | Đăng xuất (client xoá token) |
| POST | `/auth/forgot-password` | Public | Gửi email reset link |
| POST | `/auth/reset-password/:token` | Public | Đổi mật khẩu mới |

## 2. Users — `/api/v1/users`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| GET | `/users/profile` | Customer | Xem profile |
| PUT | `/users/profile` | Customer | Cập nhật profile |
| PUT | `/users/change-password` | Customer | Đổi mật khẩu |
| GET | `/users` | Admin | Danh sách users (pagination) |
| PUT | `/users/:id/toggle-status` | Admin | Khoá / Mở khoá |

## 3. Categories — `/api/v1/categories`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| GET | `/categories` | Public | Danh sách brands |
| GET | `/categories/:slug` | Public | Chi tiết brand |
| POST | `/categories` | Admin | Thêm brand |
| PUT | `/categories/:id` | Admin | Sửa brand |
| DELETE | `/categories/:id` | Admin | Xoá brand (⚠️ delete protection) |

## 4. Collections — `/api/v1/collections`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| GET | `/collections` | Public | Danh sách BST |
| POST | `/collections` | Admin | Thêm BST |
| PUT | `/collections/:id` | Admin | Sửa BST |
| DELETE | `/collections/:id` | Admin | Xoá BST (soft) |

## 5. Products — `/api/v1/products`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| GET | `/products` | Public | Danh sách (filter/search/sort/pagination) |
| GET | `/products/:slug` | Public | Chi tiết sản phẩm |
| POST | `/products` | Admin | Thêm sản phẩm |
| PUT | `/products/:id` | Admin | Sửa sản phẩm |
| DELETE | `/products/:id` | Admin | Xoá sản phẩm (soft delete) |

**Query Parameters (GET `/products`):**

| Param | Type | Ví dụ |
|:------|:-----|:------|
| `search` | string | `?search=rolex` |
| `category` | ObjectId | `?category=6612...` |
| `collection` | ObjectId | `?collection=6613...` |
| `gender` | enum | `?gender=male` |
| `movement` | enum | `?movement=automatic` |
| `minPrice` | number | `?minPrice=5000000` |
| `maxPrice` | number | `?maxPrice=50000000` |
| `sort` | string | `?sort=price_asc` |
| `page` | number | `?page=1` |
| `limit` | number | `?limit=12` |

## 6. Cart — `/api/v1/cart`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| GET | `/cart` | Customer | Xem giỏ hàng |
| POST | `/cart` | Customer | Thêm SP vào giỏ |
| PUT | `/cart/:productId` | Customer | Cập nhật qty |
| DELETE | `/cart/:productId` | Customer | Xoá SP khỏi giỏ |

## 7. Orders — `/api/v1/orders`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| POST | `/orders` | Customer | Tạo đơn hàng (checkout + SNAPSHOT) |
| GET | `/orders` | Customer | Lịch sử đơn hàng |
| GET | `/orders/:id` | Customer | Chi tiết đơn |
| PUT | `/orders/:id/cancel` | Customer | Huỷ đơn (pending/confirmed) |
| GET | `/admin/orders` | Admin | Tất cả đơn hàng |
| PUT | `/admin/orders/:id/status` | Admin | Cập nhật trạng thái |

## 8. Payments — `/api/v1/payments`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| POST | `/payments/create-vnpay-url` | Customer | Tạo URL thanh toán VNPay |
| GET | `/payments/vnpay-return` | Public | VNPay redirect về (verify) |
| POST | `/payments/vnpay-ipn` | System | VNPay IPN callback |

## 9. Coupons — `/api/v1/coupons`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| GET | `/coupons` | Admin | Danh sách mã |
| POST | `/coupons` | Admin | Tạo mã |
| PUT | `/coupons/:id` | Admin | Sửa mã |
| DELETE | `/coupons/:id` | Admin | Xoá mã (soft) |
| POST | `/coupons/validate` | Customer | Kiểm tra mã hợp lệ |

## 10. Upload — `/api/v1/upload`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| POST | `/upload` | Admin | Upload 1 ảnh → Cloudinary |
| POST | `/upload/multiple` | Admin | Upload nhiều ảnh |

## 11. Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| GET | `/dashboard/stats` | Admin | Tổng quan (revenue, orders, users) |
| GET | `/dashboard/top-products` | Admin | Top SP bán chạy |

---

## HTTP Status Codes

| Code | Ý nghĩa | Khi nào |
|:-----|:--------|:-------|
| 200 | OK | GET, PUT thành công |
| 201 | Created | POST tạo mới thành công |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Chưa đăng nhập / token invalid |
| 403 | Forbidden | Không có quyền (RBAC) |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Duplicate (email, username) |
| 500 | Server Error | Lỗi server |
