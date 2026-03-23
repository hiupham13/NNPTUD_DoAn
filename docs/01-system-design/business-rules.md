# 📋 Business Rules

> Quy tắc nghiệp vụ áp dụng cho hệ thống Luxury Watch Store.
> Tham chiếu Edge Cases: [`database-design.md`](./database-design.md) Section 7.

---

## 1. Authentication & Authorization

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-01 | Password tối thiểu 6 ký tự | bcrypt hash, salt 10 rounds |
| BR-02 | Email unique, lowercase | Regex validate format |
| BR-03 | Username unique | Không cho phép trùng |
| BR-04 | JWT expire 24h | Refresh = login lại |
| BR-05 | Reset password token expire 15 phút | Random string + exp date |
| BR-06 | Forgot PW email không tồn tại → vẫn trả success | Bảo mật (EC-40) |
| BR-07 | Admin không tự xoá chính mình | EC-41 |
| BR-08 | User bị khoá (status=false) → 403 Forbidden | Middleware check (EC-38) |

## 2. Products

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-09 | Mỗi product phải thuộc 1 category (brand) | `category` required |
| BR-10 | Product có thể không thuộc collection | `collection` optional (null) |
| BR-11 | Soft delete (`isDeleted=true`) | Không xoá thật khỏi DB |
| BR-12 | Giá bán = `price` (hoặc tính từ originalPrice - discount%) | |
| BR-13 | Tạo product → auto tạo Inventory (stock=0) | EC-32 |
| BR-14 | `title`, `sku`, `slug` phải unique | |
| BR-15 | Slug auto-gen từ title | Dùng slugify |

## 3. Categories (Brands)

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-16 | Không xoá category có products active | EC-01: Check trước khi xoá |
| BR-17 | Name unique | Không 2 brand trùng tên |
| BR-18 | Slug auto-gen từ name | Lowercase, kebab-case |

## 4. Collections

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-19 | Cho phép xoá collection có products | EC-02: Set products.collection = null |
| BR-20 | isActive flag để ẩn/hiện | Không cần xoá |

## 5. Cart

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-21 | 1 user = 1 cart (unique) | |
| BR-22 | Thêm SP đã có → tăng quantity (không tạo mới) | EC-16 |
| BR-23 | Không cho thêm SP đã xoá (isDeleted) | EC-17 |
| BR-24 | Không cho thêm SP hết hàng (stock=0) | EC-18 |
| BR-25 | Quantity = 0 → auto xoá item | EC-21 |
| BR-26 | Cart hiển thị giá **real-time** (không snapshot) | EC-14 |
| BR-27 | GET cart → filter SP đã xoá, hiện thông báo | EC-03 |

## 6. Orders

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-28 | **SNAPSHOT** toàn bộ product info khi tạo order | 12 fields: title, price, image, categoryName... |
| BR-29 | Snapshot tại thời điểm CREATE ORDER (không phải add cart) | EC-15 |
| BR-30 | Đổi giá/tên/hình product → order cũ KHÔNG đổi | EC-10, EC-11, EC-12 |
| BR-31 | Xoá product → order cũ vẫn hiện đầy đủ | EC-04 |
| BR-32 | Xoá category → order cũ vẫn hiện categoryName | EC-13 |
| BR-33 | Order code format: `ORD-YYYYMMDD-XXXX` (unique) | Auto-gen |
| BR-34 | Status chỉ đi tiến, không đi lùi | EC-24 |
| BR-35 | Customer chỉ huỷ khi pending/confirmed | EC-23 |
| BR-36 | Phí ship cố định 50.000₫ | |
| BR-37 | Cancel → hoàn kho + trả lượt coupon | EC-27, EC-36 |
| BR-38 | Return → hoàn kho + giảm soldCount | EC-28 |

## 7. Inventory

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-39 | Available = stock - reserved | |
| BR-40 | Đặt hàng: stock -= qty, reserved += qty | |
| BR-41 | Hoàn thành: reserved -= qty, soldCount += qty | |
| BR-42 | Huỷ: stock += qty, reserved -= qty | |
| BR-43 | 2 người mua cùng lúc → first-come-first-served | EC-29 |

## 8. Coupons

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-44 | Code unique, uppercase | |
| BR-45 | Validate tại thời điểm CREATE ORDER | EC-33, EC-34 |
| BR-46 | Giảm tối đa = totalAmount (finalAmount ≥ shippingFee) | EC-37 |
| BR-47 | Huỷ đơn → usedCount -= 1 | EC-36 |
| BR-48 | Percent type: discountValue ≤ 100 | |

## 9. Payments (VNPay)

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-49 | Verify HMAC-SHA512 cho mọi VNPay return/IPN | EC-45 |
| BR-50 | IPN duplicate → bỏ qua nếu đã paid | EC-44 |
| BR-51 | VNPay timeout → payment failed, order pending | EC-42 |
| BR-52 | COD: isPaid = true khi order completed | EC-26 |

## 10. Upload

| # | Rule | Chi tiết |
|:--|:-----|:--------|
| BR-53 | File types: jpg, jpeg, png, webp | |
| BR-54 | Max size: 5MB | |
| BR-55 | Upload lên Cloudinary, trả về URL | |
