# 📊 Admin Dashboard Page

> **Trạng thái**: 🔄 SCAFFOLD (D9 — placeholder cơ bản)
> **File code**: `frontend/src/pages/admin/DashboardPage.tsx` (27 lines)
> **Route**: `/admin` — Admin only

---

## Hiện trạng code

Page placeholder với 4 stat cards tĩnh (hardcoded giá trị `0`):

| Card | Label | Value |
|:-----|:------|:------|
| 1 | Total Revenue | 0$ |
| 2 | Orders | 0 |
| 3 | Users | 0 |
| 4 | Products | 0 |

### Layout
- Grid: 1 col mobile → 2 tablet → 4 desktop
- Style: `bg-white rounded-lg shadow-sm border border-gray-100 p-6`
- ⚠️ Label vẫn bằng **tiếng Anh** — cần Việt hoá khi hoàn thiện (D12)

---

## Kế hoạch (D12)

- Kết nối API dashboard stats: revenue, orders, users, products count
- Charts: biểu đồ doanh thu theo tháng (optional)
- Recent orders widget
- Việt hoá toàn bộ UI labels

### API
- `GET /api/v1/dashboard/stats` (cần tạo backend)

---

> 📋 Docs sẽ được cập nhật chi tiết sau khi code xong D12.
