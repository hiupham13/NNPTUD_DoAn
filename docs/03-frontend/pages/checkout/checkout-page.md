# 💳 Checkout Page

> **Trạng thái**: ⬜ TODO (D11)
> **File code**: `frontend/src/pages/customer/CheckoutPage.tsx` — **chưa tạo**
> **Route**: `/checkout` — Protected (Customer)

---

## Kế hoạch (D11)

- Form địa chỉ giao hàng: React Hook Form + Zod
- Input mã giảm giá + nút "Áp dụng"
- Chọn phương thức thanh toán: COD / VNPay
- Order summary: danh sách SP, subtotal, discount, shipping, tổng
- Button "Xác nhận đặt hàng"
- VNPay: redirect đến cổng thanh toán

### API
- `POST /api/v1/orders` (tạo đơn)
- `POST /api/v1/coupons/apply` (kiểm tra coupon)
- `POST /api/v1/payments/create-vnpay-url` (nếu chọn VNPay)

---

> 📋 Docs sẽ được cập nhật chi tiết sau khi code xong.
