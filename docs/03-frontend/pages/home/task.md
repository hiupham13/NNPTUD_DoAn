# 📝 Task List: D10 — Home + Products (Frontend)

> **Tham chiếu**: [implementation_plan.md](./implementation_plan.md)
> **Cập nhật**: Khi hoàn thành task → đổi `☐` → `✅`

---

## Phase 1: Foundation (Types + Services + Hooks)
- [x] 1. Tạo `types/api.ts` — ApiResponse<T>, PaginatedResponse<T>, Pagination interfaces
- [x] 2. Tạo `types/product.ts` — Product, Category, Collection, ProductFilter interfaces (khớp BE schema)
- [x] 3. Tạo `utils/format.ts` — formatPrice() dùng Intl.NumberFormat VNĐ
- [x] 4. Tạo `services/productService.ts` — getProducts(params), getProductBySlug(slug)
- [x] 5. Tạo `services/categoryService.ts` — getCategories()
- [x] 6. Tạo `services/collectionService.ts` — getCollections()
- [x] 7. Tạo `hooks/useProducts.ts` — useProducts(params), useProductBySlug(slug)
- [x] 8. Tạo `hooks/useCategories.ts` — useCategories()
- [x] 9. Tạo `hooks/useCollections.ts` — useCollections()

## Phase 2: Shared Components
- [x] 10. Tạo `components/product/ProductCard.tsx` — Grayscale→color hover, aspect-3/4, price VNĐ, link to detail
- [x] 11. Tạo `components/common/Pagination.tsx` — Prev/Next + page numbers, luxury style
- [x] 12. Tạo `components/common/SearchBar.tsx` — Input tìm kiếm, debounce 300ms
- [x] 13. Tạo `components/common/SortDropdown.tsx` — Dropdown: Mới nhất, Giá tăng, Giá giảm

## Phase 3: HomePage (bổ sung 4 sections)
- [x] 14. HomePage: Kết nối API categories thay hardcoded brands
- [x] 15. HomePage: Thêm Stats section (inverted dark background)
- [x] 16. HomePage: Thêm Featured Products grid (dùng ProductCard, filter isFeatured)
- [x] 17. HomePage: Thêm Featured Collections section (API collections)
- [x] 18. HomePage: Thêm CTA section cuối trang

## Phase 4: ProductListPage
- [x] 19. Tạo `components/product/FilterDrawer.tsx` — Off-canvas drawer trái, overlay tối
- [x] 20. Tạo `pages/customer/ProductListPage.tsx` — Grid SP + SearchBar + Sort + Pagination + FilterDrawer

## Phase 5: ProductDetailPage
- [x] 21. Tạo `pages/customer/ProductDetailPage.tsx`:
  - Image gallery (main + thumbnails)
  - Product info: tên, brand, giá, discount
  - Specs table: movement, case, strap, water resistance
  - Description: drop cap editorial
  - Quantity selector + Button "Thêm vào giỏ"
  - Related products (cùng category, dùng ProductCard)

## Phase 6: Routing & Polish
- [x] 22. Cập nhật `App.tsx` — Thêm routes: `/products`, `/products/:slug`
- [x] 23. Fix `<Toaster />` mount trong App/main (react-hot-toast)
- [x] 24. Kiểm tra TypeScript compile, Design System compliance, tiếng Việt 100%
- [x] 25. Cập nhật docs: page docs + components.md + routing.md + PROGRESS.md + task.md root

---

## Thống kê
| Phase | Tasks | Files |
|:------|:------|:------|
| Phase 1: Foundation | 9 | 8 files mới |
| Phase 2: Components | 4 | 4 files mới |
| Phase 3: HomePage | 5 | 1 file sửa |
| Phase 4: ProductList | 2 | 2 files mới |
| Phase 5: ProductDetail | 1 | 1 file mới |
| Phase 6: Polish | 4 | 2 files sửa + docs |
| **TỔNG** | **25** | **~16 files** |
