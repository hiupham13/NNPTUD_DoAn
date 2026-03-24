# 📋 Order History Page — Implementation Plan

> **Ngày**: D11 — 25/03/2026
> **File tạo**: `frontend/src/pages/customer/OrderHistoryPage.tsx` + `.css`, `OrderDetailPage.tsx` + `.css`
> **Route**: `/orders` + `/orders/:id` — Protected (Customer)
> **Phụ thuộc**: Orders API (BE D7 ✅)

---

## 1. TỔNG QUAN

Gồm 2 trang:
- **OrderHistoryPage** (`/orders`): Danh sách đơn hàng của customer, hiển thị mã đơn, ngày mua, trạng thái, tổng tiền.
- **OrderDetailPage** (`/orders/:id`): Chi tiết 1 đơn hàng — thông tin giao hàng, danh sách SP (snapshot), thanh toán, trạng thái + nút huỷ đơn.

## 2. CẦN TẠO MỚI

### 2.1. Hook bổ sung
```
frontend/src/hooks/useOrders.ts (bổ sung)
```
- `useOrders()` — query: danh sách đơn hàng
- `useOrder(id)` — query: chi tiết 1 đơn
- `useCancelOrder()` — mutation: huỷ đơn

### 2.2. Components
```
frontend/src/components/order/OrderStatusBadge.tsx + .css
```
- Badge hiển thị trạng thái đơn: pending → confirmed → shipping → delivered → cancelled
- Monochrome style, không dùng màu sặc sỡ

### 2.3. Pages
```
frontend/src/pages/customer/OrderHistoryPage.tsx + .css
frontend/src/pages/customer/OrderDetailPage.tsx + .css
```

## 3. ORDER HISTORY LAYOUT

```
┌──────────────────────────────────────────────────┐
│  ĐƠN HÀNG CỦA TÔI                               │
├──────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐ │
│  │ #ORD-001  │ 25/03/2026  │ [Đang xử lý]    │ │
│  │ 2 sản phẩm │ 23.500.000 ₫ │ [Xem chi tiết →]│ │
│  ├──────────────────────────────────────────────┤ │
│  │ #ORD-002  │ 24/03/2026  │ [Đã giao]       │ │
│  │ 1 sản phẩm │ 15.000.000 ₫ │ [Xem chi tiết →]│ │
│  └──────────────────────────────────────────────┘ │
│  Pagination                                      │
└──────────────────────────────────────────────────┘
```

## 4. ORDER DETAIL LAYOUT

```
┌──────────────────────────────────────────────────┐
│  < QUAY LẠI    ĐƠN HÀNG #ORD-001   [Đang xử lý]│
├──────────────────────────────────────────────────┤
│  ┌──────────────────────┐ ┌────────────────────┐ │
│  │ THÔNG TIN GIAO HÀNG   │ │ THANH TOÁN         │ │
│  │ Nguyễn Văn A          │ │ COD / VNPay        │ │
│  │ 0909...               │ │ Trạng thái: Đã TT  │ │
│  │ Q1, TP.HCM            │ │                    │ │
│  └──────────────────────┘ └────────────────────┘ │
│                                                  │
│  SẢN PHẨM ĐÃ MUA (SNAPSHOT)                     │
│  ┌─────┐ Tissot Le Locle      x2   15.000.000₫  │
│  │ img │ SKU: TIS-001 | Auto                    │
│  └─────┘ ──────────────────────────────────────  │
│  ┌─────┐ TAG Heuer Carrera    x1   25.000.000₫  │
│  │ img │ SKU: TAG-001 | Auto                    │
│  └─────┘                                        │
│  ────────────────────────────────────────────    │
│  Tạm tính:    40.000.000₫                       │
│  Giảm giá:    -4.000.000₫                       │
│  Phí ship:    0₫                                 │
│  TỔNG:        36.000.000₫                       │
│                                                  │
│  [HUỶ ĐƠN HÀNG] (chỉ hiện khi pending/confirmed)│
└──────────────────────────────────────────────────┘
```

## 5. ORDER STATUS MAPPING

| Status | Badge Text (VI) | Style |
|:-------|:----------------|:------|
| `pending` | Chờ xác nhận | bg: muted |
| `confirmed` | Đã xác nhận | bg: charcoal, text: white |
| `processing` | Đang xử lý | bg: charcoal, text: white |
| `shipping` | Đang giao | bg: charcoal, text: white |
| `delivered` | Đã giao | bg: charcoal, text: white |
| `completed` | Hoàn thành | bg: #d4af37, text: white |
| `cancelled` | Đã huỷ | bg: transparent, border, text: muted |

## 6. EDGE CASES

| EC | Mô tả | Xử lý FE |
|:---|:------|:---------|
| EC-23 | Chỉ cancel khi pending/confirmed | Ẩn nút "Huỷ đơn" các status khác |
| EC-10-15 | Snapshot data | Hiển thị snapshot price/name, KHÔNG link về product hiện tại |
| Empty | Chưa có đơn hàng nào | Empty state editorial + CTA "Khám phá sản phẩm" |

## 7. API MAPPING

| Action | Endpoint | Ghi chú |
|:-------|:---------|:--------|
| Danh sách đơn | `GET /orders` | Pagination |
| Chi tiết đơn | `GET /orders/:id` | Snapshot items |
| Huỷ đơn | `PUT /orders/:id/cancel` | Chỉ pending/confirmed |

---

> 📋 Xem chi tiết tasks: [`task.md`](./task.md)
