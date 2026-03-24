# 📋 Kế Hoạch Triển Khai D10 — Home + Products (Frontend)

## Mục tiêu
Hoàn thiện HomePage (bổ sung sections còn thiếu) + xây dựng ProductCard component + trang ProductListPage (filter, search, sort, pagination) + trang ProductDetailPage (gallery, specs, add to cart).

---

## API Endpoints sẽ kết nối

| API | Method | Path | Response |
|:----|:-------|:-----|:---------|
| Danh sách SP | GET | `/api/v1/products?search&category&gender&movement&minPrice&maxPrice&sort&page&limit` | `{ success, data: Product[], pagination: { page, limit, total, totalPages } }` |
| Chi tiết SP | GET | `/api/v1/products/:slug` | `{ success, data: Product }` (populate category, collectionRef) |
| Danh sách brands | GET | `/api/v1/categories` | `{ success, data: Category[] }` |
| Danh sách BST | GET | `/api/v1/collections` | `{ success, data: Collection[] }` |

---

## Files cần tạo / sửa (thứ tự thực hiện)

### Phase 1: Foundation (Types + Services + Hooks)
1. `frontend/src/types/product.ts` — Product, Category, Collection, ProductFilter interfaces
2. `frontend/src/types/api.ts` — ApiResponse<T>, PaginatedResponse<T>, Pagination
3. `frontend/src/services/productService.ts` — getProducts(), getProductBySlug()
4. `frontend/src/services/categoryService.ts` — getCategories()
5. `frontend/src/services/collectionService.ts` — getCollections()
6. `frontend/src/hooks/useProducts.ts` — TanStack Query hooks
7. `frontend/src/hooks/useCategories.ts` — useCategories()
8. `frontend/src/hooks/useCollections.ts` — useCollections()
9. `frontend/src/utils/format.ts` — formatPrice() (VNĐ currency formatter)

### Phase 2: Shared Components
10. `frontend/src/components/product/ProductCard.tsx` — Card grayscale→color hover 1500ms
11. `frontend/src/components/common/Pagination.tsx` — Phân trang
12. `frontend/src/components/common/SearchBar.tsx` — Tìm kiếm
13. `frontend/src/components/common/SortDropdown.tsx` — Sắp xếp

### Phase 3: HomePage (bổ sung sections)
14. Sửa `frontend/src/pages/customer/HomePage.tsx`:
    - Thêm Stats section (inverted dark)
    - Thêm Featured Products grid (dùng ProductCard + API isFeatured)
    - Thêm Featured Collections section
    - Thêm CTA section
    - Kết nối API thật thay hardcoded data cho Brands section

### Phase 4: ProductListPage
15. `frontend/src/pages/customer/ProductListPage.tsx` — Danh sách SP + filter drawer
16. `frontend/src/components/product/FilterDrawer.tsx` — Off-canvas filter bên trái

### Phase 5: ProductDetailPage
17. `frontend/src/pages/customer/ProductDetailPage.tsx` — Gallery, Specs, Add to Cart, Related

### Phase 6: Routing & Polish
18. Sửa `frontend/src/App.tsx` — Thêm routes cho ProductListPage + ProductDetailPage
19. Fix `<Toaster />` mount (react-hot-toast) để toast hiển thị
20. Cập nhật docs

---

## Design Patterns áp dụng (từ design-system.md)

| Pattern | Nơi dùng |
|:--------|:---------|
| Grayscale → Color hover (1500ms) | ProductCard, HomePage images |
| Off-canvas Drawer (translateX 500ms) | FilterDrawer trên ProductListPage |
| Drop cap paragraph | ProductDetailPage description |
| Oversized typography (text-7xl→9xl) | HomePage Hero |
| Asymmetric grid (12-col offset) | HomePage, ProductDetailPage |
| Gold accent sparingly | Hover states, focus, price highlights |
| Border-radius: 0px everywhere | Tất cả components |
| Vertical text labels | HomePage, ProductDetailPage |
| Studio shot images (aspect-3/4) | ProductCard |

---

## Edge Cases & Ràng buộc

1. **Ảnh SP từ DB**: Seed data dùng picsum placeholder → HomePage dùng Unsplash thật cho hero/brands
2. **Giá VNĐ**: Format bằng `Intl.NumberFormat('vi-VN')`, hiển thị originalPrice gạch ngang nếu có discount
3. **Empty state**: Khi không có SP nào → hiển thị "Không tìm thấy sản phẩm nào"
4. **Loading state**: Skeleton hoặc "Đang tải..." khi fetch API
5. **Filter URL sync**: Query params sync với filter state (optional, nếu kịp)
6. **Responsive**: Mobile 1 col → Tablet 2 col → Desktop 3-4 col

---

## Dependencies

| Package | Đã cài | Vai trò |
|:--------|:-------|:--------|
| `@tanstack/react-query` | ✅ | Server state |
| `axios` | ✅ | HTTP client |
| `react-router-dom` | ✅ | Routing, Link, useParams |
| `react-hot-toast` | ✅ | Toast notifications |
| `lucide-react` | ✅ | Icons (Search, Filter, ChevronLeft/Right...) |
| `zustand` | ✅ | Cart store (chưa cần D10) |
