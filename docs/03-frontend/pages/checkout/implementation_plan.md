# 💳 Checkout Page — Implementation Plan

> **Ngày**: D11 — 25/03/2026
> **File tạo**: `frontend/src/pages/customer/CheckoutPage.tsx` + `.css`
> **Route**: `/checkout` — Protected (Customer)
> **Phụ thuộc**: Cart API, Orders API, Coupons API, Payments API (BE D7-D8 ✅)

---

## 1. TỔNG QUAN

Trang thanh toán cho phép customer nhập địa chỉ giao hàng, áp dụng mã giảm giá, chọn phương thức thanh toán (COD / VNPay), xem tóm tắt đơn hàng, và xác nhận đặt hàng.

## 2. CẦN TẠO MỚI

### 2.1. Types
```
frontend/src/types/order.ts
```
- `Order`, `OrderItem` (snapshot fields), `OrderStatus`
- `CreateOrderPayload`: { shippingAddress, paymentMethod, couponCode? }
- `ShippingAddress`: { fullName, phone, address, city, district, ward, note? }

### 2.2. Service
```
frontend/src/services/orderService.ts
frontend/src/services/couponService.ts
frontend/src/services/paymentService.ts
```
- `createOrder(payload)` → `POST /api/v1/orders`
- `validateCoupon(code)` → `POST /api/v1/coupons/validate`
- `createVnpayUrl(orderId)` → `POST /api/v1/payments/create-vnpay-url`

### 2.3. Hook
```
frontend/src/hooks/useOrders.ts
```
- `useCreateOrder()` — mutation
- `useValidateCoupon()` — mutation

### 2.4. Pages
```
frontend/src/pages/customer/CheckoutPage.tsx + .css
frontend/src/pages/customer/VnpayReturnPage.tsx + .css
```

## 3. LAYOUT

```
┌──────────────────────────────────────────────────────┐
│  THANH TOÁN                                          │
├──────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐ ┌────────────────┐ │
│  │ THÔNG TIN GIAO HÀNG          │ │ ĐƠN HÀNG      │ │
│  │ ┌─ Họ và tên ──────────────┐ │ │ ┌────┐ SP1 x2 │ │
│  │ ├─ Số điện thoại ──────────┤ │ │ │img │ 15.0tr  │ │
│  │ ├─ Địa chỉ ───────────────┤ │ │ └────┘         │ │
│  │ ├─ Thành phố / Quận / Phường│ │ │ ┌────┐ SP2 x1 │ │
│  │ ├─ Ghi chú ───────────────┤ │ │ │img │ 8.5tr   │ │
│  │ └─────────────────────────┘ │ │ └────┘         │ │
│  │                              │ │ ─────────────  │ │
│  │ MÃ GIẢM GIÁ                  │ │ Tạm tính      │ │
│  │ ┌──────────────┐ [ÁP DỤNG]  │ │ Giảm giá       │ │
│  │ └──────────────┘             │ │ Phí vận chuyển │ │
│  │ ✅ Giảm 10% (-1.500.000₫)    │ │ ─────────────  │ │
│  │                              │ │ TỔNG CỘNG      │ │
│  │ PHƯƠNG THỨC THANH TOÁN       │ │                │ │
│  │ ○ COD (Thanh toán khi nhận)  │ │ [XÁC NHẬN     │ │
│  │ ○ VNPay (Thẻ ATM/Visa/QR)   │ │  ĐẶT HÀNG]    │ │
│  └──────────────────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## 4. FORM VALIDATION (React Hook Form + Zod)

```typescript
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z.string().regex(/^(0[3-9])\d{8}$/, 'Số điện thoại không hợp lệ'),
  address: z.string().min(5, 'Vui lòng nhập địa chỉ'),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  note: z.string().optional(),
  paymentMethod: z.enum(['cod', 'vnpay']),
});
```

## 5. CHECKOUT FLOW

```
1. Customer vào /checkout
2. Load cart data (redirect nếu cart trống)
3. Nhập thông tin giao hàng (form validation)
4. (Tùy chọn) Nhập mã giảm giá → POST /coupons/validate
5. Chọn thanh toán: COD hoặc VNPay
6. Bấm "Xác nhận đặt hàng"
7.a. COD → POST /orders → Redirect /orders/:id (success)
7.b. VNPay → POST /orders → POST /payments/create-vnpay-url → Redirect sang VNPay
8. VNPay return → /payments/vnpay-return → VnpayReturnPage (success / fail)
```

## 6. VNPAY RETURN PAGE

```
┌────────────────────────────────┐
│  ✅ THANH TOÁN THÀNH CÔNG       │
│  Đơn hàng: #ORD-20260325-001  │
│  Số tiền: 15.000.000 ₫        │
│                                │
│  [XEM ĐƠN HÀNG]  [VỀ TRANG CHỦ] │
└────────────────────────────────┘
```

## 7. EDGE CASES

| EC | Mô tả | Xử lý FE |
|:---|:------|:---------|
| Cart trống | Vào /checkout khi cart empty | Redirect → /cart với toast |
| Coupon invalid | Mã không hợp lệ / hết hạn | Hiện error dưới input |
| Coupon applied | Mã hợp lệ | Hiện badge thành công + số tiền giảm |
| Stock không đủ | BE trả 400 khi checkout | Hiện toast + highlight SP |
| VNPay timeout | Payment quá thời gian | VnpayReturnPage hiện fail state |
| VNPay success | Hash verify OK | Hiện success + link xem đơn |

## 8. DESIGN (Luxury)

- Form inputs: Bottom border only, focus → gold
- Radio buttons: Custom styled (circle + label)
- Coupon input: Inline với button "Áp dụng"
- Order summary: border-left, sticky
- Nút "Xác nhận": Primary gold slide, full width trong summary

---

> 📋 Xem chi tiết tasks: [`task.md`](./task.md)
