# 🏠 HomePage

> **Trạng thái**: 🔄 PARTIAL (D9 — scaffold sẵn, D10 sẽ hoàn thiện)
> **File code**: `frontend/src/pages/customer/HomePage.tsx` (85 lines)
> **Route**: `/` — Public

---

## Tổng quan

Trang chủ editorial kiểu tạp chí cao cấp. Hiện tại đã có 3 sections cơ bản, sẽ bổ sung thêm ở D10.

---

## Sections hiện có

### 1. Hero Section ✅
- **Grid**: 12-column asymmetric — text trái (col 2-8), ảnh phải (col 9-12)
- **Min-height**: `min-h-[819px]` — viewport-filling
- **Typography**:
  - Label nhỏ: "Tuyệt tác Thời gian" — uppercase, tracking `0.4em`, opacity 60%
  - Heading: `text-7xl md:text-9xl` — Playfair Display
  - Mixed italic: "Đồng Hồ *Cao Cấp*" + "Định Danh *Chính Xác*"
- **Ảnh**: Unsplash luxury watch, `aspect-[3/4]`, grayscale-hover effect
- **CTA**: Button "Khám Phá Tổ Hợp" → link `/products`
  - Class: `cta-button` — border, uppercase, tracking-widest

### 2. Editorial Text Section ✅
- **Drop cap**: Đoạn văn mở đầu kiểu tạp chí (class `drop-cap`)
- **Vertical label**: "Di sản / 2026" — `writing-mode: vertical-rl`, absolute left
- **Sidebar card**: "Chế Tác Thụy Sĩ" — border-top, italic heading, body text nhỏ
- Grid: text trái (col 2-6), card phải (col 8-11), offset nhau

### 3. Thương Hiệu Nổi Bật ✅ (placeholder)
- **Header**: "Thương Hiệu *Nổi Bật*" + link "Xem tất cả" → `/brands`
- **Grid**: 3 columns, mỗi column có:
  - Ảnh `aspect-[4/3]`, grayscale-hover
  - Tên brand (Playfair italic): Rolex, Patek Philippe, Omega
  - Subtitle: Oyster Perpetual, Grand Complications, Seamaster
- **Stagger effect**: Column giữa `md:mt-12` tạo offset bất đối xứng
- Hiện dùng **hardcoded Unsplash images** — D10 sẽ kết nối API categories

---

## Sections cần thêm (D10)

| Section | Priority | Mô tả |
|:--------|:---------|:------|
| Stats (inverted dark) | 🟡 | Số liệu nổi bật: thương hiệu, sản phẩm, khách hàng |
| Featured Products grid | 🔴 | `isFeatured: true` — dùng `ProductCard` component |
| Featured Collections | 🟡 | Bộ sưu tập từ API `/api/v1/collections` |
| CTA section | 🟡 | Call-to-action cuối trang |

---

## Design Patterns được sử dụng

- ✅ Oversized typography (text-9xl)
- ✅ Asymmetric grid layout (12-col, offset columns)
- ✅ Grayscale → color hover trên ảnh (1500ms)
- ✅ Drop cap paragraph
- ✅ Vertical text labels (`writing-mode: vertical-rl`)
- ✅ Mixed italic headlines (regular + *italic gold*)
- ✅ Staggered grid items (md:mt-12)
- ⬜ Paper noise texture (từ CustomerLayout)
- ⬜ Visible grid lines (từ CustomerLayout)

---

## Dependencies

| Package | Vai trò |
|:--------|:--------|
| `react-router-dom` | `Link` component |

> ⚠️ Chưa kết nối API nào. D10 sẽ thêm TanStack Query hooks cho products/categories/collections.
