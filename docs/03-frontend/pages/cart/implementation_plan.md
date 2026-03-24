# 🛒 Cart Page — Implementation Plan

> **Ngày**: D11 — 25/03/2026
> **File tạo**: `frontend/src/pages/customer/CartPage.tsx` + `.css`
> **Route**: `/cart` — Protected (Customer)
> **Phụ thuộc**: Cart API (BE D7 ✅), authStore, productService

---

## 1. TỔNG QUAN

Trang giỏ hàng hiển thị danh sách sản phẩm customer đã thêm vào giỏ, cho phép cập nhật số lượng, xóa item, và tiến hành thanh toán.

## 2. CẦN TẠO MỚI

### 2.1. Types
```
frontend/src/types/cart.ts
```
- `CartItem`: productId, product (populated), quantity
- `Cart`: _id, user, items[], totalAmount
- `AddToCartPayload`: { productId, quantity }

### 2.2. Service
```
frontend/src/services/cartService.ts
```
- `getCart()` → `GET /api/v1/cart`
- `addToCart(productId, qty)` → `POST /api/v1/cart`
- `updateCartItem(productId, qty)` → `PUT /api/v1/cart/:productId`
- `removeCartItem(productId)` → `DELETE /api/v1/cart/:productId`

### 2.3. Hook
```
frontend/src/hooks/useCart.ts
```
- `useCart()` — TanStack Query: fetch cart
- `useAddToCart()` — mutation: add to cart + invalidate
- `useUpdateCartItem()` — mutation: update qty + invalidate
- `useRemoveCartItem()` — mutation: remove item + invalidate

### 2.4. Page + CSS
```
frontend/src/pages/customer/CartPage.tsx
frontend/src/pages/customer/CartPage.css
```

## 3. LAYOUT

```
┌──────────────────────────────────────────────────┐
│  < QUAY LẠI MUA SẮM         GIỎ HÀNG (3 SP)    │
├──────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐ ┌─────────┐ │
│  │ DANH SÁCH SẢN PHẨM             │ │ TÓM TẮT │ │
│  │ ┌─────┐ Tên SP          [−1+]  │ │         │ │
│  │ │ img │ Brand / Giá     [Xóa]  │ │ Tạm tính│ │
│  │ └─────┘ ──────────────────────  │ │ Phí ship│ │
│  │ ┌─────┐ Tên SP          [−1+]  │ │ ─────── │ │
│  │ │ img │ Brand / Giá     [Xóa]  │ │ TỔNG    │ │
│  │ └─────┘                         │ │         │ │
│  │ ⚠️ SP không còn tồn tại (EC-03)│ │ [THANH  │ │
│  └─────────────────────────────────┘ │  TOÁN]  │ │
│                                      └─────────┘ │
└──────────────────────────────────────────────────┘
```

## 4. API MAPPING

| Action | Method | Endpoint | Body |
|:-------|:-------|:---------|:-----|
| Load giỏ hàng | GET | `/cart` | — |
| Thêm SP | POST | `/cart` | `{ productId, quantity }` |
| Cập nhật qty | PUT | `/cart/:productId` | `{ quantity }` |
| Xóa SP | DELETE | `/cart/:productId` | — |

## 5. EDGE CASES CẦN XỬ LÝ

| EC | Mô tả | Cách xử lý FE |
|:---|:------|:---------------|
| EC-03 | SP bị xóa nhưng còn trong cart | Hiện warning "Sản phẩm không còn tồn tại", disable qty, cho xóa |
| EC-14 | Giá SP thay đổi | Luôn hiện giá real-time từ API (cart KHÔNG snapshot) |
| EC-16 | Thêm SP đã có | Backend tự tăng qty → FE invalidate query |
| EC-17 | Thêm SP đã xóa | Hiện toast error |
| EC-18 | SP hết hàng | Disable nút "+", hiện badge "Hết hàng" |
| EC-21 | Qty = 0 | Backend auto xóa item → FE invalidate |

## 6. DESIGN (Luxury)

- Background: `#F9F8F6` (Warm Alabaster)
- Item separator: `border-bottom 1px rgba(44,44,44,0.08)`
- Image: 80×80px, grayscale filter default
- Price: Inter font, bold
- Quantity selector: Cùng style với ProductDetailPage `[− N +]`
- Nút xóa: Ghost button, hover → red
- Summary: border-left, sticky on scroll
- Nút "Thanh Toán": Primary button (gold slide)
- Empty cart: Editorial style + CTA "Tiếp tục mua sắm"

## 7. RESPONSIVE

| Breakpoint | Layout |
|:-----------|:-------|
| Desktop (>1024px) | 2 columns: items 65% + summary 35% |
| Tablet (768-1024px) | Stacked: items + summary below |
| Mobile (<768px) | Stacked, compact item layout |

---

> 📋 Xem chi tiết tasks: [`task.md`](./task.md)
