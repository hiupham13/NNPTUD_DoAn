# 📋 Order History Page

> **Trạng thái**: ⬜ TODO (D11)
> **File code**: `frontend/src/pages/customer/OrderHistoryPage.tsx` — **chưa tạo**
> **Route**: `/orders` — Protected (Customer)

---

## Kế hoạch (D11)

- Danh sách đơn hàng: mã đơn, ngày, trạng thái, tổng tiền
- Click vào đơn → `/orders/:id` (OrderDetailPage)
- Trạng thái đơn: pending, confirmed, shipping, delivered, cancelled
- Pagination

### API
- `GET /api/v1/orders` (lịch sử đơn của user)

---

### OrderDetailPage (`/orders/:id`)

- Chi tiết đơn hàng: thông tin giao hàng, danh sách SP (snapshot), payment status
- Nút "Huỷ đơn" (nếu đơn còn pending)

### API
- `GET /api/v1/orders/:id`
- `PUT /api/v1/orders/:id/cancel`

---

> 📋 Docs sẽ được cập nhật chi tiết sau khi code xong.
