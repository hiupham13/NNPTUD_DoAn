# 📐 Flowcharts

> Sơ đồ luồng nghiệp vụ chính của hệ thống.

---

## 1. Customer Purchase Flow

```
Guest/Customer
     │
     ▼
┌──────────┐    ┌────────────┐    ┌──────────────┐
│ Duyệt SP │───→│ Xem chi    │───→│ Thêm vào     │
│ + Filter  │    │ tiết SP    │    │ giỏ hàng     │
└──────────┘    └────────────┘    └──────┬───────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │  Xem giỏ     │
                                  │  hàng        │
                                  └──────┬───────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │  Checkout    │
                                  │  - Địa chỉ   │
                                  │  - Coupon?    │
                                  │  - Thanh toán │
                                  └──────┬───────┘
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                              ▼                     ▼
                       ┌────────────┐        ┌────────────┐
                       │    COD     │        │   VNPay    │
                       │ Order:    │        │ Redirect → │
                       │ pending   │        │ Thanh toán │
                       └────────────┘        └──────┬─────┘
                                                    │
                                              ┌─────┴─────┐
                                              │           │
                                              ▼           ▼
                                        ┌──────────┐ ┌──────────┐
                                        │ Thành    │ │ Thất     │
                                        │ công    │ │ bại      │
                                        │isPaid=  │ │ Retry/   │
                                        │ true    │ │ COD      │
                                        └──────────┘ └──────────┘
```

## 2. Order Status Flow

```
  PENDING ──→ CONFIRMED ──→ PROCESSING ──→ SHIPPING ──→ DELIVERED ──→ COMPLETED
     │            │                                          │
     ▼            ▼                                          ▼
  CANCELLED   CANCELLED                                  RETURNED
  (Customer/  (Admin)                                    (Admin)
   Admin)

  Khi CANCELLED → Hoàn kho (stock += qty)
  Khi RETURNED  → Hoàn kho (stock += qty, soldCount -= qty)
```

## 3. Checkout Flow (Backend — SNAPSHOT)

```
POST /api/v1/orders
        │
        ▼
  ┌─────────────┐  No
  │ Cart empty? │──────→ Error: "Giỏ hàng trống"
  └──────┬──────┘
         │ Yes (có items)
         ▼
  ┌─────────────┐  No
  │ Product     │──────→ Error: "SP không tồn tại"
  │ tồn tại?    │        + Loại khỏi cart
  └──────┬──────┘
         │ Yes
         ▼
  ┌─────────────┐  No
  │ Stock >=    │──────→ Error: "SP đã hết hàng"
  │ quantity?   │
  └──────┬──────┘
         │ Yes
         ▼
  ┌─────────────┐  Invalid
  │ Coupon      │──────→ Error: "Mã hết hạn/hết lượt"
  │ hợp lệ?    │
  └──────┬──────┘
         │ Valid / None
         ▼
  ┌─────────────────────────────────┐
  │ ⚡ SNAPSHOT product data:       │
  │ title, sku, price, image,      │
  │ categoryName, movement, gender │
  └──────────────┬──────────────────┘
                 │
                 ▼
  ┌──────────────────────┐
  │ Create Order         │
  │ Update Inventory     │
  │ Apply Coupon         │
  │ Clear Cart           │
  └──────────┬───────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  ┌────────┐  ┌──────────┐
  │  COD   │  │  VNPay   │
  │ Done   │  │ Create   │
  │        │  │ URL →    │
  │        │  │ Redirect │
  └────────┘  └──────────┘
```

## 4. VNPay Payment Flow

```
Customer ──→ Chọn VNPay ──→ Backend tạo payment URL
                                     │
                                     ▼
                            VNPay Sandbox Page
                            (Khách nhập thẻ test)
                                     │
                              ┌──────┴───────┐
                              │              │
                              ▼              ▼
                         Thành công     Thất bại
                              │              │
                              ▼              ▼
                     Return URL          Return URL
                     (verify hash)       (verify hash)
                              │              │
                              ▼              ▼
                     Payment: paid    Payment: failed
                     Order: isPaid    Order: pending
                              │
                              ▼
                     IPN Callback (backup)
                     Server-to-server verify
```

## 5. Forgot Password Flow

```
Guest ──→ Nhập email ──→ Backend check user
                              │
                       ┌──────┴───────┐
                       │              │
                       ▼              ▼
                   User found    Not found
                       │              │
                       ▼              ▼
               Generate token   "Đã gửi email"
               Save to DB       (vẫn trả success
               Send email       để bảo mật)
                       │
                       ▼
               Email chứa link:
               /reset-password/:token
                       │
                       ▼
               Guest click link
               Nhập password mới
                       │
                       ▼
               Backend verify token
               (chưa hết hạn 15 phút?)
                       │
                ┌──────┴───────┐
                │              │
                ▼              ▼
            Valid          Expired
            Update PW      "Link hết hạn"
            Clear token
```

## 6. Admin Product Delete Flow

```
Admin ──→ Delete Product
               │
               ▼
        ┌──────────────┐
        │ Soft delete   │
        │ isDeleted =   │
        │ true          │
        └──────┬───────┘
               │
               ▼
        Cart có SP này?
        → Khi GET cart sẽ filter
        → Hiện "SP không còn tồn tại"
               │
               ▼
        Order có SP này?
        → KHÔNG ảnh hưởng
        → Order đã có SNAPSHOT
```
