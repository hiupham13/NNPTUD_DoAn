# 🔍 Product Detail Page

> **Trạng thái**: ✅ DONE (D10 + UI Refine — 24/03/2026)
> **File code**: `frontend/src/pages/customer/ProductDetailPage.tsx`
> **CSS**: `frontend/src/pages/customer/ProductDetailPage.css`
> **Route**: `/products/:slug` — Public

---

## Layout
- Asymmetric 2-column grid: Image Gallery (trái) + Product Info (phải)
- Gap: 80px desktop, stacked trên mobile (≤1024px)
- Max-width: 1600px, padding 100px 48px

## Sections

### Image Gallery
| Feature | Chi tiết |
|:--------|:---------|
| Main Image | Aspect ratio 3:4, background #f5f5f0 |
| **Navigation Arrows** | ✅ Mũi tên trái/phải (Chevron) đè trên ảnh chính |
| Image Counter | Hiển thị "1 / N" ở bottom-center ảnh chính |
| Thumbnails | 72x72px, grayscale default → color khi active/hover |
| Arrow Style | 40x40px, bg trắng 85% + blur, hover → bg đen + chữ trắng |

### Product Info
| Section | Mô tả |
|:--------|:------|
| Brand Label | Uppercase, 0.65rem, letter-spacing 0.2em, muted color |
| Product Name | Playfair Display, clamp(1.8rem, 3vw, 2.5rem) |
| Price | Inter 1.5rem bold, có discount badge nếu giảm giá |
| Description | Inter 0.9rem, opacity 0.75, line-height 1.8 |
| Features | Tag chips: border 1px, uppercase 0.65rem |

### Quantity Selector ✅ MỚI
| Feature | Chi tiết |
|:--------|:---------|
| Layout | Inline flex: `[−] [qty] [+] [THÊM VÀO GIỎ HÀNG]` |
| Buttons | 40x44px, hover → bg đen, disabled opacity 0.3 |
| Value | 44px width, center text, border trái/phải |
| Range | Min: 1, Max: 99 |

### Add to Cart Button ✅ CẢI THIỆN
| Before | After |
|:-------|:------|
| Full-width, padding 20px | `flex: 1`, padding 14px 24px |
| Quá lớn, lấn át layout | Cân đối với qty selector |
| Gold slide animation | Giữ nguyên gold slide |

### Specs Table
- Uppercase title, Inter 0.65rem
- 2 columns: label (40%, muted) + value (Inter 500)
- Border-bottom subtle 5% opacity

### Related Products
- Grid 4 columns desktop → 2 tablet → 1 mobile
- Dùng component `ProductCard`

## API
- `GET /api/v1/products/:slug` — populate category + collectionRef
- `GET /api/v1/products?category={id}&limit=4` — related products

## Components Used
- `ProductCard` — related products grid
- `ChevronLeft`, `ChevronRight` — Lucide icons

---

> ✅ Cập nhật lần cuối: 24/03/2026 — Thêm gallery arrows, quantity selector, resize add-to-cart button.
