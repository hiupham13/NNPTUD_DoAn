# 👤 Use Cases

> Đặc tả Use Case cho Luxury Watch Store.

---

## Actors

| Actor | Mô tả | Quyền |
|:------|:------|:------|
| **Guest** | Khách vãng lai | Xem SP, tìm kiếm, đăng ký |
| **Customer** | Khách hàng đã đăng nhập | Guest + mua hàng, profile |
| **Admin** | Quản trị viên | Quản lý toàn hệ thống |

---

## Use Case List

### UC-GROUP-1: Authentication

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-01 | Đăng ký | Guest | Tạo tài khoản mới (username, email, password) |
| UC-02 | Đăng nhập | Guest | Nhập username/password → nhận JWT token |
| UC-03 | Đăng xuất | Customer | Xoá token phía client |
| UC-04 | Quên mật khẩu | Guest | Nhập email → nhận link reset |
| UC-05 | Đặt mật khẩu mới | Guest | Click link → nhập password mới |

### UC-GROUP-2: Product Browsing

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-06 | Xem danh sách SP | Guest/Customer | Danh sách watches, phân trang |
| UC-07 | Lọc sản phẩm | Guest/Customer | Lọc theo brand, gender, movement, giá, BST |
| UC-08 | Tìm kiếm SP | Guest/Customer | Tìm theo tên, mô tả |
| UC-09 | Xem chi tiết SP | Guest/Customer | Xem hình, specs, giá, mô tả |

### UC-GROUP-3: Shopping

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-10 | Thêm vào giỏ hàng | Customer | Chọn SP + quantity → thêm cart |
| UC-11 | Xem giỏ hàng | Customer | Danh sách items, tổng tiền |
| UC-12 | Cập nhật số lượng | Customer | Tăng/giảm qty trong cart |
| UC-13 | Xoá khỏi giỏ hàng | Customer | Xoá 1 item khỏi cart |
| UC-14 | Checkout | Customer | Điền shipping, chọn payment, xác nhận |
| UC-15 | Áp dụng mã giảm giá | Customer | Nhập coupon code → validate → áp dụng |
| UC-16 | Thanh toán VNPay | Customer | Redirect VNPay → thanh toán → return |
| UC-17 | Thanh toán COD | Customer | Chọn COD → tạo đơn pending |

### UC-GROUP-4: Order Management (Customer)

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-18 | Xem lịch sử đơn hàng | Customer | Danh sách đơn + status |
| UC-19 | Xem chi tiết đơn | Customer | Snapshot items, shipping, payment |
| UC-20 | Huỷ đơn hàng | Customer | Chỉ khi pending/confirmed |

### UC-GROUP-5: User Profile

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-21 | Xem profile | Customer | Xem thông tin cá nhân |
| UC-22 | Cập nhật profile | Customer | Sửa fullName, phone, address, avatar |
| UC-23 | Đổi mật khẩu | Customer | Nhập current PW + new PW |

### UC-GROUP-6: Admin — Product Management

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-24 | Xem danh sách SP (Admin) | Admin | Table view, filter, pagination |
| UC-25 | Thêm sản phẩm mới | Admin | Form + upload hình Cloudinary |
| UC-26 | Sửa sản phẩm | Admin | Edit form + update images |
| UC-27 | Xoá sản phẩm | Admin | Soft delete (isDeleted=true) |
| UC-28 | Quản lý tồn kho | Admin | Xem/update stock |

### UC-GROUP-7: Admin — Category & Collection

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-29 | CRUD Categories (Brands) | Admin | Thêm/sửa/xoá brands |
| UC-30 | CRUD Collections (BST) | Admin | Thêm/sửa/xoá bộ sưu tập |

### UC-GROUP-8: Admin — Orders & Users

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-31 | Xem tất cả đơn hàng | Admin | Filter by status, pagination |
| UC-32 | Cập nhật trạng thái đơn | Admin | pending→confirmed→...→completed |
| UC-33 | Xem chi tiết đơn (Admin) | Admin | Snapshot data, payment info |
| UC-34 | Quản lý users | Admin | List, khoá/mở khoá |
| UC-35 | CRUD Coupons | Admin | Tạo/sửa/xoá mã giảm giá |

### UC-GROUP-9: Admin — Dashboard

| UC ID | Tên | Actor | Mô tả |
|:------|:----|:------|:------|
| UC-36 | Xem Dashboard | Admin | Tổng quan: revenue, orders, users, top SP |

---

## Use Case Diagram (ASCII)

```
                    Luxury Watch Store System
┌──────────────────────────────────────────────────────┐
│                                                      │
│    Guest                   Customer                  │
│    ┌───┐                   ┌───┐                     │
│    │ G │                   │ C │                     │
│    └─┬─┘                   └─┬─┘                     │
│      │                       │                       │
│      ├── UC-01 Đăng ký       ├── UC-10 Thêm giỏ     │
│      ├── UC-02 Đăng nhập     ├── UC-14 Checkout      │
│      ├── UC-04 Quên PW       ├── UC-18 Lịch sử đơn  │
│      ├── UC-06 Xem SP        ├── UC-20 Huỷ đơn      │
│      ├── UC-07 Lọc SP        ├── UC-22 Profile       │
│      ├── UC-08 Tìm kiếm      │                       │
│      └── UC-09 Chi tiết SP    │                       │
│                               │                       │
│                          Admin ┌───┐                  │
│                               │ A │                  │
│                               └─┬─┘                  │
│                                 │                    │
│                    ├── UC-25 Thêm SP                 │
│                    ├── UC-29 CRUD Categories         │
│                    ├── UC-32 Update order status      │
│                    ├── UC-34 Quản lý users           │
│                    ├── UC-35 CRUD Coupons            │
│                    └── UC-36 Dashboard               │
│                                                      │
└──────────────────────────────────────────────────────┘
```
