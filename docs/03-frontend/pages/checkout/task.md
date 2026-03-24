# 📝 Checkout Page — Tasks

> **Ngày**: D11 — ✅ HOÀN THÀNH (24/03/2026)
> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)

---

## Tasks

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| CH.1 | Tạo `types/order.ts` (Order, OrderItem, ShippingAddress, CreateOrderPayload) | 🔴 | ✅ | Interface khớp BE response |
| CH.2 | Tạo `services/orderService.ts` (createOrder, getOrders, getOrderById, cancelOrder) | 🔴 | ✅ | 4 API functions |
| CH.3 | Tạo `services/couponService.ts` (validateCoupon) | 🟡 | ✅ | Merged into orderService |
| CH.4 | Tạo `services/paymentService.ts` (createVnpayUrl) | 🔴 | ✅ | Merged: BE tạo URL trong createOrder |
| CH.5 | Tạo `hooks/useOrders.ts` (useCreateOrder, useValidateCoupon) | 🔴 | ✅ | TanStack mutations |
| CH.6 | Tạo `CheckoutPage.tsx` — Layout grid (form + summary) | 🔴 | ✅ | 2-column desktop |
| CH.7 | CheckoutPage — Shipping address form (auto-fill từ profile) | 🔴 | ✅ | useProfile auto-fill |
| CH.8 | CheckoutPage — Coupon input + áp dụng | 🟡 | ✅ | Inline input + button |
| CH.9 | CheckoutPage — Payment method selector (COD / VNPay) | 🔴 | ✅ | Radio buttons custom |
| CH.10 | CheckoutPage — Order summary (items list + totals) | 🔴 | ✅ | Từ cart data |
| CH.11 | CheckoutPage — "Xác nhận đặt hàng" → create order | 🔴 | ✅ | POST /orders |
| CH.12 | CheckoutPage — COD flow: redirect /orders/:id | 🔴 | ✅ | Navigate on success |
| CH.13 | CheckoutPage — VNPay flow: redirect sang VNPay | 🔴 | ✅ | window.location.href |
| CH.14 | Tạo `VnpayReturnPage.tsx` + `.css` | 🔴 | ✅ | Parse query + call BE verify |
| CH.15 | CheckoutPage — Redirect nếu cart trống | 🔴 | ✅ | useEffect check |
| CH.16 | CheckoutPage — CSS (Luxury style, responsive) | 🔴 | ✅ | `CheckoutPage.css` |
| CH.17 | Cập nhật routing (`App.tsx`) | 🔴 | ✅ | `/checkout`, `/checkout/vnpay-return` |
| CH.18 | Cập nhật docs | 🔴 | ✅ | ✅ |

---

> Tổng: **18 tasks** — ✅ **18/18 DONE**
