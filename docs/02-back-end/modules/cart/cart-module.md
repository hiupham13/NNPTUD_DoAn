# 🛒 Cart Module

> Module giỏ hàng.

---

## Endpoints

| Method | Endpoint | Access |
|:-------|:---------|:-------|
| GET | `/api/v1/cart` | Customer |
| POST | `/api/v1/cart` | Customer |
| PUT | `/api/v1/cart/:productId` | Customer |
| DELETE | `/api/v1/cart/:productId` | Customer |

## Business Logic

- 1 user = 1 cart (unique)
- Thêm SP đã có → tăng qty (EC-16)
- Thêm SP đã xoá → error (EC-17)
- Thêm SP hết hàng → error (EC-18)
- Qty = 0 → auto xoá item (EC-21)
- **Cart KHÔNG snapshot** giá — luôn hiện giá real-time (EC-14)
- GET cart → populate products → filter isDeleted → hiện warning (EC-03)
