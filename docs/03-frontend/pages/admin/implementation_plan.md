# 🛠 Admin Pages — Implementation Plan

> **Phase**: D12 (Phase 3)
> **Ngày bắt đầu**: 24/03/2026
> **Quyết định thiết kế**: Admin style đơn giản/functional (giữ nguyên, không Luxury)

---

## 1. TỔNG QUAN QUYẾT ĐỊNH

| # | Câu hỏi | Quyết định |
|:--|:--------|:-----------|
| 1 | Design style | **A — Functional** (Tailwind generic, không luxury) |
| 2 | Phạm vi | **Hết 10 modules**, tách từng module implement |
| 3 | Product Upload | **Direct upload Cloudinary**, hỗ trợ **nhiều ảnh** |
| 4 | Orders Admin | **Xem + đổi status + filter/search**, không cần snapshot |
| 5 | Users Admin | **List + lock/unlock + xem detail/orders** |
| 6 | Dashboard | **Stats cards + Charts** (revenue/tháng, đơn/ngày) |
| 7 | Categories/Collections/Coupons | **Gộp 1 trang Settings tab-based** |

---

## 2. SHARED COMPONENTS (Tạo trước, dùng chung)

### 2.1. AdminTable
- Reusable table: columns config, sort, pagination
- Props: `columns`, `data`, `loading`, `pagination`, `onSort`
- File: `components/admin/AdminTable.tsx` + `.css`

### 2.2. AdminModal
- Reusable modal: title, body, footer actions
- Props: `isOpen`, `onClose`, `title`, `children`, `size`
- File: `components/admin/AdminModal.tsx` + `.css`

### 2.3. AdminFormField
- Reusable form field: label + input/select/textarea
- File: `components/admin/AdminFormField.tsx`

### 2.4. AdminSidebar Enhancement
- Thêm Lucide icons cho từng menu
- Highlight active route (useLocation)
- File: Sửa `layouts/admin/AdminLayout.tsx`

---

## 3. PHÂN CHIA MODULES (6 batch)

### BATCH 1: Foundation + Dashboard
```
Mục tiêu: Tạo shared components + Dashboard với stats API + charts
Files:
  - components/admin/AdminTable.tsx + .css
  - components/admin/AdminModal.tsx + .css
  - components/admin/AdminFormField.tsx
  - layouts/admin/AdminLayout.tsx (enhance sidebar)
  - pages/admin/DashboardPage.tsx (rewrite)
  - services/adminService.ts (dashboard stats API)
  - hooks/useAdmin.ts (dashboard queries)
Dependencies: Cần BE API thống kê (revenue, count orders/users/products)
Charts: Sử dụng recharts hoặc chart.js nhẹ
```

### BATCH 2: Products CRUD
```
Mục tiêu: CRUD sản phẩm + upload nhiều ảnh Cloudinary
Files:
  - pages/admin/ProductListPage.tsx + .css
  - pages/admin/ProductFormPage.tsx + .css (Create/Edit chung)
  - components/admin/ImageUploader.tsx (multi-image upload + preview)
  - services/productAdminService.ts
  - hooks/useProductAdmin.ts
BE APIs: GET /products (admin), POST /products, PUT /products/:id, DELETE /products/:id
         POST /upload/cloudinary (multi-file)
```

### BATCH 3: Orders Management
```
Mục tiêu: Danh sách đơn + filter/search + đổi status
Files:
  - pages/admin/OrderListPage.tsx + .css
  - services/orderAdminService.ts
  - hooks/useOrderAdmin.ts
Features: Filter (status, date range), search (mã đơn), status update dropdown
BE APIs: GET /orders/admin, PUT /orders/:id/status
```

### BATCH 4: Users Management
```
Mục tiêu: List users + lock/unlock + xem detail profile + đơn hàng
Files:
  - pages/admin/UserListPage.tsx + .css
  - components/admin/UserDetailDrawer.tsx (slide-in drawer)
  - services/userAdminService.ts
  - hooks/useUserAdmin.ts
BE APIs: GET /users/admin, PUT /users/:id/lock, GET /users/:id (detail + orders)
```

### BATCH 5: Settings (Categories + Collections + Coupons)
```
Mục tiêu: 1 trang tab-based cho 3 CRUD modules
Files:
  - pages/admin/SettingsPage.tsx + .css
  - components/admin/CategoryTab.tsx
  - components/admin/CollectionTab.tsx
  - components/admin/CouponTab.tsx
  - services/settingsAdminService.ts
  - hooks/useSettingsAdmin.ts
BE APIs: CRUD /categories, CRUD /collections, CRUD /coupons
Tab: Tabs UI — click tab → render CRUD table + modal
```

### BATCH 6: Inventory
```
Mục tiêu: Xem tồn kho + cập nhật stock
Files:
  - pages/admin/InventoryPage.tsx + .css
  - services/inventoryAdminService.ts
  - hooks/useInventoryAdmin.ts
BE APIs: GET /inventory, PUT /inventory/:productId
Features: Search product, inline edit stock, low-stock warning
```

---

## 4. THỨ TỰ TRIỂN KHAI

```
BATCH 1 (Foundation + Dashboard)
    ↓
BATCH 2 (Products CRUD) ← phức tạp nhất, cần làm sớm
    ↓
BATCH 3 (Orders Management)
    ↓
BATCH 4 (Users Management)
    ↓
BATCH 5 (Settings — Categories/Collections/Coupons)
    ↓
BATCH 6 (Inventory)
```

---

## 5. BE APIs CẦN KIỂM TRA / BỔ SUNG

| API | Hiện trạng | Cần bổ sung |
|:----|:-----------|:------------|
| `GET /api/v1/admin/stats` | ❌ Chưa có | Tạo mới: count orders, revenue, users, products |
| `GET /api/v1/admin/stats/revenue-chart` | ❌ Chưa có | Revenue theo tháng (aggregation) |
| `GET /api/v1/admin/stats/orders-chart` | ❌ Chưa có | Đơn hàng theo ngày (aggregation) |
| `GET /api/v1/products` (admin) | ✅ Có | Cần thêm filter inactive, deleted |
| `POST /api/v1/upload/cloudinary` | ✅ Có | Cần kiểm tra multi-file |
| `GET /api/v1/orders/admin` | ✅ Có | Cần thêm filter, search, pagination |
| `GET /api/v1/users/admin` | ✅ Có | Cần kiểm tra response format |
| `PUT /api/v1/users/:id/toggle-active` | ✅ Có | Lock/unlock |
| CRUD `/api/v1/categories` | ✅ Có | OK |
| CRUD `/api/v1/collections` | ✅ Có | OK |
| CRUD `/api/v1/coupons` | ✅ Có | OK |
| `GET /api/v1/inventory` | ✅ Có | OK |

---

> ⚠️ **Quy trình**: Mỗi batch sẽ được implement riêng theo workflow:
> 1. Kiểm tra BE APIs liên quan
> 2. Fix/bổ sung BE nếu thiếu
> 3. Code FE (types → services → hooks → components → pages)
> 4. Test + cập nhật docs
