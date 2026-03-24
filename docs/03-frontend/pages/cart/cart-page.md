# 🛒 Cart Page

> **Trạng thái**: ⬜ TODO (D11)
> **File code**: `frontend/src/pages/customer/CartPage.tsx` — **chưa tạo**
> **Route**: `/cart` — Protected (Customer)

---

## Kế hoạch (D11)

- Danh sách items: ảnh, tên, giá, số lượng (update), xóa
- Summary: subtotal, phí ship, tổng cộng
- Xử lý sản phẩm đã xóa trong cart (EC-03): "SP không còn tồn tại"
- Button: "Tiến hành Thanh toán" → `/checkout`

### API
- `GET /api/v1/cart`
- `PUT /api/v1/cart` (update qty)
- `DELETE /api/v1/cart/:productId`

---

> 📋 Docs sẽ được cập nhật chi tiết sau khi code xong.
