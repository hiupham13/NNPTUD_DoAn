# 📝 Order History — Tasks

> **Ngày**: D11 — ✅ HOÀN THÀNH (24/03/2026)
> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)

---

## Tasks

| # | Task | Priority | Status | Ghi chú |
|:--|:-----|:---------|:-------|:--------|
| OH.1 | Bổ sung `hooks/useOrders.ts` (useOrders, useOrder, useCancelOrder) | 🔴 | ✅ | TanStack queries + mutation |
| OH.2 | OrderStatusBadge (inline trong page) | 🔴 | ✅ | CSS class per status |
| OH.3 | Tạo `OrderHistoryPage.tsx` — Danh sách đơn hàng | 🔴 | ✅ | List: mã, ngày, trạng thái, tổng |
| OH.4 | OrderHistoryPage — Pagination | 🟡 | ☐ | Chưa cần (ít đơn) |
| OH.5 | OrderHistoryPage — Empty state | 🟡 | ✅ | Editorial + CTA |
| OH.6 | OrderHistoryPage — CSS (Luxury style) | 🔴 | ✅ | `OrderHistoryPage.css` |
| OH.7 | Tạo `OrderDetailPage.tsx` — Chi tiết đơn hàng | 🔴 | ✅ | Shipping, items, totals |
| OH.8 | OrderDetailPage — Hiển thị snapshot items | 🔴 | ✅ | Image, name, SKU, price |
| OH.9 | OrderDetailPage — Thông tin giao hàng + thanh toán | 🔴 | ✅ | 2-column grid |
| OH.10 | OrderDetailPage — Nút "Huỷ đơn" (pending/confirmed) | 🔴 | ✅ | Confirm dialog + reason |
| OH.11 | OrderDetailPage — CSS (Luxury style) | 🔴 | ✅ | `OrderDetailPage.css` |
| OH.12 | Cập nhật routing (`App.tsx`) | 🔴 | ✅ | `/orders`, `/orders/:id` |
| OH.13 | BE: Tạo `getOrderById` controller + route | 🔴 | ✅ | GET /orders/:id + ownership check |
| OH.14 | Cập nhật docs | 🔴 | ✅ | ✅ |

---

> Tổng: **14 tasks** — ✅ **13/14 DONE** (OH.4 Pagination chưa cần)
