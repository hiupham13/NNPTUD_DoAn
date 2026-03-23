# 📦 Orders Module

> Module đơn hàng — Core phức tạp nhất (SNAPSHOT + Inventory + Status Flow).

---

## Endpoints

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| POST | `/api/v1/orders` | Customer | Checkout (SNAPSHOT) |
| GET | `/api/v1/orders` | Customer | Lịch sử đơn |
| GET | `/api/v1/orders/:id` | Customer | Chi tiết đơn |
| PUT | `/api/v1/orders/:id/cancel` | Customer | Huỷ đơn |
| GET | `/api/v1/admin/orders` | Admin | Tất cả đơn |
| PUT | `/api/v1/admin/orders/:id/status` | Admin | Cập nhật trạng thái |

## Checkout Flow (POST /orders)

```
1. Validate cart not empty
2. Validate products exist (isDeleted=false)
3. Validate stock >= quantity
4. Validate coupon (if provided)
5. ⚡ SNAPSHOT product fields → order.items[]
6. Calculate totals
7. Create order record
8. Update inventory (stock-=qty, reserved+=qty)
9. Apply coupon (usedCount+=1)
10. Clear cart
11. If VNPay → create payment URL
12. Return order + payment URL
```

## SNAPSHOT Fields (12 fields)

```
product, title, sku, slug, price, originalPrice,
discountPercent, image, categoryName, movement, gender,
quantity, subtotal
```

## Status Flow

```
pending → confirmed → processing → shipping → delivered → completed
   ↓          ↓                                     ↓
cancelled  cancelled                            returned
```

## Edge Cases xử lý
- EC-03, EC-04: Product deleted → order không ảnh hưởng (snapshot)
- EC-10→15: Price/name changes → order không ảnh hưởng
- EC-23: Customer chỉ cancel khi pending/confirmed
- EC-24: Status chỉ đi tiến, không đi lùi
- EC-27, EC-28: Cancel/return → hoàn kho
- EC-36: Cancel → coupon usedCount -= 1
