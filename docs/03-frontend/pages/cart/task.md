# 📝 Cart Page — Tasks

> **Ngày**: D11 — ✅ HOÀN THÀNH (24/03/2026)
> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)

---

## Tasks

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| C.1 | Tạo `types/cart.ts` (CartItem, Cart, AddToCartPayload) | 🔴 | ✅ | Interface khớp BE response |
| C.2 | Tạo `services/cartService.ts` (getCart, addToCart, updateCartItem, removeCartItem) | 🔴 | ✅ | 4 API functions |
| C.3 | Tạo `hooks/useCart.ts` (useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem) | 🔴 | ✅ | TanStack Query + mutations, enabled: !!token |
| C.4 | Tạo `CartPage.tsx` — Layout grid (items + summary) | 🔴 | ✅ | 2-column desktop, stacked mobile |
| C.5 | CartPage — Render danh sách cart items (image, name, brand, price, qty) | 🔴 | ✅ | Populate product info |
| C.6 | CartPage — Quantity selector per item [− N +] | 🔴 | ✅ | Reuse style từ ProductDetail |
| C.7 | CartPage — Nút xóa item | 🔴 | ✅ | Ghost button |
| C.8 | CartPage — Summary sidebar (subtotal, shipping, total) | 🔴 | ✅ | Sticky on desktop |
| C.9 | CartPage — Nút "Thanh Toán" → navigate `/checkout` | 🔴 | ✅ | Primary gold slide button |
| C.10 | CartPage — Xử lý EC-03: SP bị xóa hiện warning | 🔴 | ✅ | BE filter isDeleted+isActive |
| C.11 | CartPage — Empty cart state (editorial + CTA) | 🟡 | ✅ | "Giỏ hàng trống" + link |
| C.12 | CartPage — CSS (Luxury style, responsive) | 🔴 | ✅ | `CartPage.css`, padding-top: 100px |
| C.13 | Tích hợp `addToCart` vào ProductDetailPage | 🔴 | ✅ | Connect nút "Thêm vào giỏ" |
| C.14 | Header — Cart badge (số lượng items) | 🟡 | ✅ | Badge trên icon giỏ hàng |
| C.15 | Cập nhật routing (`App.tsx`) | 🔴 | ✅ | `/cart` → CartPage, protected |
| C.16 | Cập nhật docs | 🔴 | ✅ | ✅ |

---

> Tổng: **16 tasks** — ✅ **16/16 DONE**
