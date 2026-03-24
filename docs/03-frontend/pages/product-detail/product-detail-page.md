# 🔍 Product Detail Page

> **Trạng thái**: ⬜ TODO (D10 — 24/03/2026)
> **File code**: `frontend/src/pages/customer/ProductDetailPage.tsx` — **chưa tạo**
> **Route**: `/products/:slug` — Public

---

## Kế hoạch (D10)

### Layout
- Asymmetric 2-column: Image gallery trái + Info phải
- Responsive: stacked trên mobile

### Sections cần tạo
| Section | Mô tả |
|:--------|:------|
| Image Gallery | Main image + thumbnails, click để đổi, zoom hover |
| Product Info | Tên, brand, giá (salePrice/originalPrice), discount badge |
| Specs table | Movement, case material, case size, strap, water resistance |
| Description | Drop cap intro, editorial style |
| Add to Cart | Quantity selector + button "Thêm vào giỏ" |
| Related Products | Grid ProductCard, cùng category |

### API kết nối
- `GET /api/v1/products/:slug`
- Response: `{ success, data: Product }` — populate category + collectionRef

### Design patterns
- Grayscale → color trên ảnh (1500ms)
- Drop cap paragraph cho description
- Typography: Playfair Display (tên SP) + Inter (specs)

---

> 📋 Docs sẽ được cập nhật chi tiết sau khi code xong.
