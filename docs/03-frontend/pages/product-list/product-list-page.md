# 📦 Product List Page

> **Trạng thái**: ⬜ TODO (D10 — 24/03/2026)
> **File code**: `frontend/src/pages/customer/ProductListPage.tsx` — **chưa tạo**
> **Route**: `/products` — Public

---

## Kế hoạch (D10)

### Layout
- Product grid + Off-canvas Filter Drawer (trượt từ trái)
- Responsive: 1 col mobile → 2 tablet → 3-4 desktop

### Components cần tạo
| Component | File | Mô tả |
|:----------|:-----|:------|
| `ProductCard` | `components/product/ProductCard.tsx` | Grayscale → color hover, 1500ms |
| Search bar | Trong page hoặc `components/common/` | Tìm kiếm sản phẩm |
| Sort dropdown | Trong page | Sắp xếp: mới nhất, giá tăng/giảm |
| Pagination | `components/common/Pagination.tsx` | Phân trang |
| Filter Drawer | Trong page | Off-canvas: Brand, Gender, Movement, Price |

### API kết nối
- `GET /api/v1/products?search=&category=&gender=&movement=&minPrice=&maxPrice=&sort=&page=&limit=`
- Response: `{ success, data: Product[], pagination: { page, limit, total, totalPages } }`

### Filter (Off-canvas Drawer)
- Nút "Bộ lọc" góc trái trên grid
- Panel trượt từ trái, overlay nền tối 50%
- Sections: Thương hiệu, Giới tính, Loại máy, Khoảng giá
- Animation: `translateX` + `duration-500ms`

---

> 📋 Docs sẽ được cập nhật chi tiết sau khi code xong.
