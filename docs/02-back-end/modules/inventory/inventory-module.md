# 📦 Inventory Module

> Module quản lý tồn kho — auto tracking.

---

## Schema

```javascript
{ product (1:1 unique), stock, reserved, soldCount }
```

## Auto Tracking

| Sự kiện | stock | reserved | soldCount |
|:--------|:------|:---------|:----------|
| Đặt hàng | -= qty | += qty | — |
| Hoàn thành | — | -= qty | += qty |
| Huỷ đơn | += qty | -= qty | — |
| Return | += qty | — | -= qty |

## Available = stock - reserved

## Edge Cases
- EC-29: 2 người mua cùng SP, chỉ còn 1 → first-come-first-served
- EC-30: Stock=0 nhưng reserved>0 → có đơn đang xử lý
- EC-32: Tạo product → auto tạo inventory (stock=0)
