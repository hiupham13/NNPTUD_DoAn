# Implementation Plan — CollectionsPage

> Tham chiếu template BỐ CỤC: Stitch "The Archive — Product Gallery"
> **CHỈ lấy ý tưởng layout** — Fonts, Colors, Animations dùng Design System GỐC của web
> Cập nhật: 24/03/2026

---

## 1. MỤC TIÊU

Tạo trang `/collections` hiển thị danh sách Bộ sưu tập với phong cách editorial.

## 2. PHÂN TÍCH TEMPLATE (CHỈ BỐ CỤC)

Từ Stitch "The Archive", rút ra **ý tưởng layout** cần áp dụng:

| Pattern từ template | Áp dụng vào web |
|:--------------------|:----------------|
| Hero oversized typography | Giữ — dùng `Cormorant Garamond` (font GỐC), không dùng `Playfair Display` từ template |
| Asymmetric 12-col grid (col-start staggered) | Giữ — tạo bố cục lệch cho các collection card |
| Ảnh aspect-ratio 3/4, grayscale hover | Giữ — đã có pattern này sẵn trên HomePage |
| Vertical text label ("Bộ sưu tập / 01") | Giữ — `writing-mode: vertical-rl`, opacity 0.3 |
| Drop cap intro paragraph | Giữ — đã có class `.home__drop-cap` làm mẫu |
| Product card: border-top divider + editorial italic title | Giữ — dùng `Playfair Display` (font heading GỐC) |
| CTA button border style | Giữ — dùng `.home__cta-btn` pattern đã có |

**KHÔNG copy từ template:**
- ❌ Font `Noto Serif` → dùng `Cormorant Garamond` / `Playfair Display` (đã có)
- ❌ Color values trực tiếp → dùng CSS variables từ `index.css`
- ❌ Tailwind config từ template → dùng `@theme` tokens đã có

## 3. DESIGN SYSTEM GỐC (ĐÃ CÓ)

| Token | Giá trị | File |
|:------|:--------|:-----|
| Font heading | `Cormorant Garamond`, `Playfair Display` | `HomePage.css`, `index.css` |
| Font body | `Inter` | `index.css` |
| Gold accent | `#D4AF37` / `#c9a96e` | `index.css`: `--color-primary-container` |
| Background | `#faf9f7` | `--color-surface` |
| Foreground | `#1a1c1b` / `#2c2c2c` | `--color-on-surface` |
| Grayscale hover | `filter: grayscale(100%)` → `0%`, 1.5s | `HomePage.css` |
| Container max-width | `1600px` | HomePage pattern |
| Padding | `0 48px` (desktop), `0 24px` (tablet) | HomePage pattern |

## 4. THÔNG TIN BE

| API | Method | Endpoint | Response |
|:----|:-------|:---------|:---------|
| Collections list | GET | `/api/v1/collections` | `{ success, data: [{ _id, name, slug, description, image }] }` |
| Products by collection | GET | `/api/v1/products?collection=ID` | `{ success, data, pagination }` |

- Hook đã có: `useCollections()` trong `hooks/useCollections.ts`
- Service đã có: `collectionService.getCollections()` trong `services/collectionService.ts`

## 5. PAGE STRUCTURE — CollectionsPage

```
┌──────────────────────────────────────────┐
│  HERO SECTION                            │
│  ┌─ col 2→10 ──────────────────────────┐ │
│  │ "Bộ Sưu Tập" (oversized, italic)   │ │
│  │ "/ Đặc Biệt"                        │ │
│  │ Drop cap intro text                  │ │
│  └──────────────────────────────────────┘ │
│                                          │
│  ASYMMETRIC GRID (12-col)                │
│  ┌─ col 1→4 ─┐                          │
│  │  Card 01   │  (aspect-3/4, vertical  │
│  │  image     │   label "BST / 01")     │
│  │  ─────────  │                         │
│  │  Tên BST   │                          │
│  │  Mô tả     │                          │
│  └────────────┘                          │
│                 ┌─ col 6→11 ────────────┐│
│                 │  Card 02 (shifted)    ││
│                 │  ...                  ││
│                 └───────────────────────┘│
│  ┌─ col 2→6 ──┐                         │
│  │  Card 03   │                          │
│  └────────────┘                          │
│                 ┌─ col 8→11 ──┐          │
│                 │  Card 04    │          │
│                 └─────────────┘          │
│                                          │
│  CTA — "Khám Phá Tất Cả Sản Phẩm"      │
└──────────────────────────────────────────┘
```

## 6. FILES CẦN TẠO / SỬA

| File | Hành động | Mô tả |
|:-----|:----------|:------|
| `pages/customer/CollectionsPage.tsx` | TẠO MỚI | Page component |
| `pages/customer/CollectionsPage.css` | TẠO MỚI | CSS (BEM naming, 12-col grid) |
| `App.tsx` | SỬA | Thêm route `/collections` |

## 7. KHÔNG CẦN TẠO

- ❌ Service mới (đã có `collectionService`)
- ❌ Hook mới (đã có `useCollections`)
- ❌ Types mới (response đơn giản)
- ❌ Component con riêng (inline trong page)
