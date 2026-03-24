# 📦 Admin Product Manage Page

> **Trạng thái**: ⬜ TODO (D12)
> **File code**: `frontend/src/pages/admin/ProductManagePage.tsx` — **chưa tạo**
> **Route**: `/admin/products` — Admin only

---

## Kế hoạch (D12)

- CRUD table: danh sách sản phẩm (name, SKU, category, price, status)
- Nút "Thêm sản phẩm" → modal/form create
- Edit: form chỉnh sửa inline hoặc modal
- Delete: soft delete với confirmation dialog
- Upload ảnh lên Cloudinary
- Pagination + Search

### API
- `GET /api/v1/products?page=&limit=` (Admin: bao gồm cả inactive)
- `POST /api/v1/products`
- `PUT /api/v1/products/:id`
- `DELETE /api/v1/products/:id` (soft delete)
- `POST /api/v1/upload` + `POST /api/v1/upload/multiple` (Cloudinary)

---

> 📋 Docs sẽ được cập nhật chi tiết sau khi code xong.
