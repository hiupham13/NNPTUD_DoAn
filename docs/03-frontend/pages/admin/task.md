# 📝 Admin Pages — Tasks (D12)

> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)
> **Quy ước**: Tách 6 batch, implement từng batch → test → docs → batch tiếp

---

## BATCH 1: Foundation + Dashboard ✅ HOÀN THÀNH (24/03/2026)

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| A1.1 | Tạo `AdminTable.tsx` + `.css` (reusable table) | 🔴 | ✅ | Generic typing, columns config |
| A1.2 | Tạo `AdminModal.tsx` + `.css` (reusable modal) | 🔴 | ✅ | ESC close, 3 sizes, animation |
| A1.3 | Tạo `AdminFormField.tsx` (label + input wrapper) | 🟡 | ☐ | Sẽ dùng khi cần ở Batch 2 |
| A1.4 | Enhance `AdminLayout.tsx` — Sidebar icons + active route | 🔴 | ✅ | Lucide icons, dark sidebar, gold accent |
| A1.5 | BE: Tạo `GET /api/v1/admin/stats` (counts) | 🔴 | ✅ | MongoDB aggregation |
| A1.6 | BE: Tạo `GET /api/v1/admin/stats/revenue-chart` | 🟡 | ✅ | 12 tháng, gap-filling |
| A1.7 | BE: Tạo `GET /api/v1/admin/stats/orders-chart` | 🟡 | ✅ | 30 ngày, gap-filling |
| A1.8 | Tạo `services/adminService.ts` | 🔴 | ✅ | 3 API functions |
| A1.9 | Tạo `hooks/useAdmin.ts` | 🔴 | ✅ | TanStack Query |
| A1.10 | Rewrite `DashboardPage.tsx` — Stats cards + Charts | 🔴 | ✅ | 4 cards + AreaChart + BarChart |
| A1.11 | Install `recharts` (chart library) | 🟡 | ✅ | v2, React-compatible |
| A1.12 | Fix GuestRoute → admin redirect `/admin` | 🔴 | ✅ | Role-based redirect after login |

> Subtotal: **12 tasks** — ✅ **11/12 DONE** (A1.3 deferred to Batch 2)

---

## BATCH 2: Products CRUD ✅ HOÀN THÀNH (24/03/2026)

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| A2.1 | Tạo `services/productAdminService.ts` | 🔴 | ✅ | CRUD + uploadImages |
| A2.2 | Tạo `hooks/useProductAdmin.ts` | 🔴 | ✅ | queries + mutations + cache invalidation |
| A2.3 | Tạo `ImageUploader.tsx` (multi-image upload + preview) | 🔴 | ✅ | Cloudinary, preview grid, remove |
| A2.4 | Tạo `ProductListPage.tsx` + `.css` | 🔴 | ✅ | AdminTable, search, pagination, delete |
| A2.5 | Tạo `ProductFormPage.tsx` + `.css` (Create/Edit) | 🔴 | ✅ | 2-column form, all fields |
| A2.6 | ProductForm — Upload nhiều ảnh (ImageUploader) | 🔴 | ✅ | Max 5 images |
| A2.7 | ProductForm — Select category, collection, brand | 🔴 | ✅ | Fetch from API + select |
| A2.8 | ProductForm — Specs fields (movement, caseMaterial, etc.) | 🟡 | ✅ | Fixed fields (6 specs) |
| A2.9 | Cập nhật routing | 🔴 | ✅ | `/admin/products`, `/new`, `/:id/edit` |
| A2.10 | BE: multi-file upload route | 🔴 | ✅ | POST /upload/multiple (đã có sẵn) |

> Subtotal: **10 tasks** — ✅ **10/10 DONE**

---

## BATCH 3: Orders Management ✅ HOÀN THÀNH (24/03/2026)

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| A3.1 | Tạo `services/orderAdminService.ts` | 🔴 | ✅ | getAll + updateStatus |
| A3.2 | Tạo `hooks/useOrderAdmin.ts` | 🔴 | ✅ | queries + mutation + invalidate stats |
| A3.3 | Tạo `OrderListPage.tsx` + `.css` | 🔴 | ✅ | AdminTable + status badges |
| A3.4 | OrderList — Filter: status tabs | 🔴 | ✅ | 7 status + "All" tab |
| A3.5 | OrderList — Search: mã đơn hàng | 🔴 | ✅ | Regex search orderCode |
| A3.6 | OrderList — Status update: inline select | 🔴 | ✅ | Disabled if cancelled/completed |
| A3.7 | BE: Thêm filter/search/pagination cho GET /orders/admin | 🔴 | ✅ | Query params + Promise.all |
| A3.8 | Cập nhật routing: `/admin/orders` | 🔴 | ✅ | |

> Subtotal: **8 tasks** — ✅ **8/8 DONE**

---

## BATCH 4: Users Management ✅ HOÀN THÀNH (24/03/2026)

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| A4.1 | Tạo `services/userAdminService.ts` | 🔴 | ✅ | getAll, toggleStatus, getOrders |
| A4.2 | Tạo `hooks/useUserAdmin.ts` | 🔴 | ✅ | queries + mutation |
| A4.3 | Tạo `UserListPage.tsx` + `.css` | 🔴 | ✅ | AdminTable + search |
| A4.4 | UserList — Lock/Unlock toggle | 🔴 | ✅ | Protected: không khoá chính mình |
| A4.5 | Tạo `UserDetailDrawer.tsx` (slide-in) | 🟡 | ✅ | Inline trong UserListPage, show orders |
| A4.6 | Cập nhật routing: `/admin/users` | 🔴 | ✅ | |

> Subtotal: **6 tasks** — ✅ **6/6 DONE**

---

## BATCH 5: Settings (Categories + Collections + Coupons) ✅ HOÀN THÀNH (24/03/2026)

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| A5.1 | Tạo `services/settingsAdminService.ts` | 🔴 | ✅ | CRUD 3 modules |
| A5.2 | Tạo `hooks/useSettingsAdmin.ts` | 🔴 | ✅ | queries + mutations all 3 |
| A5.3 | Tạo `SettingsPage.tsx` + `.css` (tabs container) | 🔴 | ✅ | Tab UI: gold active |
| A5.4 | Tạo `CategoryTab` — Table + Modal CRUD | 🔴 | ✅ | Inline trong SettingsPage |
| A5.5 | Tạo `CollectionTab` — Table + Modal CRUD | 🟡 | ✅ | Inline trong SettingsPage |
| A5.6 | Tạo `CouponTab` — Table + Modal CRUD | 🟡 | ✅ | Full form: type, value, min, max, expiry |
| A5.7 | Cập nhật routing: `/admin/settings` | 🔴 | ✅ | |

> Subtotal: **7 tasks** — ✅ **7/7 DONE**

---

## BATCH 6: Inventory ✅ HOÀN THÀNH (24/03/2026)

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| A6.1 | Tạo `services/inventoryAdminService.ts` | 🔴 | ✅ | getAll + updateStock |
| A6.2 | Tạo `hooks/useInventoryAdmin.ts` | 🔴 | ✅ | queries + mutation |
| A6.3 | Tạo `InventoryPage.tsx` + `.css` | 🔴 | ✅ | AdminTable + inline edit |
| A6.4 | Inventory — Search product | 🟡 | ✅ | By name or SKU |
| A6.5 | Inventory — Low-stock warning (badge đỏ) | 🟡 | ✅ | ⚠️ pulse animation, threshold = 5 |
| A6.6 | Cập nhật routing: `/admin/inventory` | 🔴 | ✅ | |
| A6.7 | BE: Tạo controller + routes inventory | 🔴 | ✅ | Aggregation pipeline + updateStock |

> Subtotal: **7 tasks** — ✅ **7/7 DONE**

---

## TỔNG KẾT

| Batch | Module | Tasks | P1 🔴 | P2 🟡 |
|:------|:-------|:------|:------|:------|
| 1 | Foundation + Dashboard | 11 | 7 | 4 |
| 2 | Products CRUD | 10 | 9 | 1 |
| 3 | Orders Management | 8 | 8 | 0 |
| 4 | Users Management | 6 | 5 | 1 |
| 5 | Settings (Cat/Col/Coup) | 7 | 5 | 2 |
| 6 | Inventory | 6 | 4 | 2 |
| **TỔNG** | | **48** | **38** | **10** |

---

> ⚠️ Implement từng batch → test → cập nhật docs → batch tiếp
> 📋 Mỗi batch xong → tick ✅ + ghi ngày hoàn thành
