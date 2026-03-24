# 📋 Admin Order Manage Page

> **Trạng thái**: ⬜ TODO (D12)
> **File code**: `frontend/src/pages/admin/OrderManagePage.tsx` — **chưa tạo**
> **Route**: `/admin/orders` — Admin only

---

## Kế hoạch (D12)

- Danh sách đơn hàng: mã đơn, khách hàng, ngày, tổng tiền, trạng thái, payment
- Filter theo trạng thái: pending, confirmed, shipping, delivered, cancelled
- Click vào đơn → modal/page chi tiết (snapshot data)
- Cập nhật trạng thái đơn: confirm, ship, deliver, cancel

### API
- `GET /api/v1/orders` (Admin: tất cả đơn)
- `GET /api/v1/orders/:id`
- `PUT /api/v1/orders/:id/status`

---

> 📋 Docs sẽ được cập nhật chi tiết sau khi code xong.
