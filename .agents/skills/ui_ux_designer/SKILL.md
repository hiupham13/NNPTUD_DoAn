---
name: ui_ux_designer
description: UI/UX Designer — Thiết kế giao diện e-commerce Luxury Watch, design system Editorial/Luxury, responsive design, component library.
---

# 🎨 UI/UX Designer — Luxury Watch Store

## 1. VAI TRÒ
- Thiết kế giao diện E-Commerce theo phong cách **Luxury / Editorial**.
- Xây dựng Design System và Component Library.
- Đảm bảo responsive design (Mobile → Desktop).
- Tuân thủ design tokens từ `docs/prompt_ui_root.md`.

## 2. DESIGN STYLE — LUXURY / EDITORIAL

### 2.1. Triết Lý
> *Luxury isn't about adding decoration—it's about removing everything unnecessary and perfecting what remains.*

- Lấy cảm hứng từ: Vogue, Harper's Bazaar, Chanel, Hermès, Aesop
- **Vibe**: Sophisticated, Timeless, Expensive, Serene, Curated, Editorial
- **Nguyên tắc**: Typography hierarchy + Negative space + Cinematic motion + Asymmetry + Layered depth

### 2.2. Color System — Sophisticated Monochrome + Gold Accent
```css
:root {
  /* Primary Palette */
  --background: #F9F8F6;        /* Warm Alabaster (NOT pure white) */
  --foreground: #1A1A1A;        /* Rich Charcoal (NOT pure black) */
  --muted: #EBE5DE;             /* Pale Taupe */
  --muted-foreground: #6C6863;  /* Warm Grey */
  --accent: #D4AF37;            /* Metallic Gold (dùng sparingly) */
  --accent-foreground: #FFFFFF; /* Pure White (chỉ trên dark bg) */

  /* Semantic */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;

  /* Borders & Dividers */
  --border: rgba(26, 26, 26, 0.15);  /* 15% opacity */
  --border-strong: #1A1A1A;          /* Full opacity */
}
```

**Quy tắc Gold Accent:**
- ✅ Hover states, underlines, focus indicators, decorative elements nhỏ
- ❌ KHÔNG dùng gold cho large areas, backgrounds, primary buttons

### 2.3. Typography — Playfair Display + Inter
```css
:root {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', 'Segoe UI', sans-serif;

  /* Type Scale */
  --text-micro: 10px;
  --text-xs: 0.75rem;    /* 12px — labels uppercase */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
  --text-7xl: 4.5rem;    /* 72px */
  --text-8xl: 6rem;      /* 96px */
  --text-9xl: 8rem;      /* 128px — hero only */
}
```

**Letter Spacing:**
- Uppercase labels: `tracking-[0.25em]` đến `tracking-[0.3em]`
- Buttons: `tracking-[0.2em]`
- Headlines: `tracking-tight`
- Body: default (không chỉnh)

**Line Height:**
- Headlines: `leading-[0.9]` — Tight, dramatic
- Body: `leading-relaxed` (1.625) — Dễ đọc

### 2.4. Border Radius & Shadows
```
Border Radius: 0px — EVERYTHING (không ngoại lệ)
```

**Shadows (Subtle & Layered):**
```css
/* Hero Image */
shadow-[0_8px_32px_rgba(0,0,0,0.12)]

/* Feature Images */
shadow-[0_4px_24px_rgba(0,0,0,0.08)]

/* Cards (default → hover) */
shadow-[0_2px_8px_rgba(0,0,0,0.02)] → shadow-[0_8px_24px_rgba(0,0,0,0.06)]

/* Primary Buttons (default → hover) */
shadow-[0_4px_16px_rgba(0,0,0,0.15)] → shadow-[0_8px_24px_rgba(0,0,0,0.25)]

/* Inner Borders for images */
shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04-0.08)]
```

### 2.5. Breakpoints & Spacing
```css
/* Breakpoints */
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;

/* Section Spacing */
Mobile:  py-20, px-8
Desktop: py-32, px-16
Max Container: max-w-[1600px]
```

## 3. ANIMATION — CINEMATIC TIMING

> Tất cả motion phải slow, deliberate, expensive. Không snap, không jump.

| Loại | Duration | Easing |
|:-----|:---------|:-------|
| Button interactions | 500ms | ease-out |
| Color transitions | 700ms | ease-out |
| Background transitions | 700ms | ease-out |
| Image effects (grayscale → color) | 1500-2000ms | ease-out |
| Gold slide animation | 500ms | cubic-bezier(0.25,0.46,0.45,0.94) |

**Image Treatment:**
- Default: `grayscale` filter
- Hover: `grayscale-0` + `scale-105` + shadow deepen
- Transition: `duration-[1500ms]` — ultra-slow cinematic reveal

## 4. COMPONENT LIBRARY

### 4.1. Buttons
| Variant | Default | Hover |
|:--------|:--------|:------|
| **Primary** | bg-[#1A1A1A], text white, uppercase, tracking-[0.2em] | Gold (#D4AF37) slides từ trái sang |
| **Secondary** | transparent, border 1px #1A1A1A | Fill dark, text white |
| **Ghost** | transparent, no border | Underline, gold text |

### 4.2. Cards
| Type | Style |
|:-----|:------|
| **Standard** | border-t 1px, padding p-8/p-12, bg transparent |
| **Featured** | border-t-4 gold (#D4AF37) |
| **Image** | grayscale, slow color reveal, aspect-[3/4] or [4/5] |

### 4.3. Inputs
- Bottom border only, bg transparent
- Focus: border → gold (#D4AF37)
- Placeholder: Playfair Display, italic, warm grey

### 4.4. Base Components
| Component | Variants | Mô tả |
|:----------|:---------|:------|
| Button | primary, secondary, ghost, link | CTA buttons |
| Input | text, email, password, search, number | Form inputs (underline) |
| Select | single, multi | Dropdown select |
| Modal | small, medium, large | Dialog popup |
| Card | standard, featured, image | Container card |
| Badge | success, warning, error, info | Status badge |
| Pagination | numbered, simple | Page navigation |
| Toast | success, error, warning, info | Notification |
| Skeleton | text, card, table | Loading placeholder |

### 4.5. E-Commerce Components
| Component | Mô tả |
|:----------|:------|
| ProductCard | Image (grayscale → color), title serif, price gold accent |
| ProductGrid | Grid 1-4 cols responsive |
| CartItem | Item giỏ hàng, thin border-bottom |
| CartSummary | Tóm tắt, gold total amount |
| OrderStatusBadge | Badge trạng thái monochrome |
| PriceDisplay | Format VNĐ, serif font cho giá |
| QuantitySelector | Input [- N +] rectangular |
| SearchBar | Input underline + icon thin |
| CategoryFilter | Filter sidebar, uppercase labels |
| BreadcrumbNav | Breadcrumb, monochrome |
| ImageGallery | Gallery ảnh, grayscale hover effect |

## 5. BOLD CHOICES — BẮT BUỘC

1. **Vertical Text Labels**: `writing-mode: vertical-rl`, uppercase, wide tracking
2. **Drop Caps**: Playfair Display, 7xl, float-left cho paragraph đầu
3. **Mixed Italic Headlines**: Regular + *italic gold* cho từ nhấn mạnh
4. **Grayscale Images**: Default grayscale, slow 1500-2000ms color reveal
5. **Visible Grid Lines**: 4 vertical lines full viewport, 20% opacity
6. **Gold Sliding Button**: Gold overlay slides từ trái, translate-x transform
7. **Decorative Lines**: h-px w-8 trước labels, giữa metadata
8. **Extreme Type Scale**: text-5xl mobile → text-9xl desktop
9. **Layered Shadows**: Subtle, deepen on hover
10. **Paper Noise Texture**: SVG noise overlay 2% opacity

## 6. ANTI-PATTERNS — TRÁNH

1. ❌ Rounded corners (all 0px)
2. ❌ Harsh/strong shadows
3. ❌ Pure black (#000) hoặc pure white (#FFF)
4. ❌ Fast animations (< 500ms)
5. ❌ Vibrant colors
6. ❌ Center everything (dùng asymmetry)
7. ❌ Tight spacing
8. ❌ Decorative fonts (chỉ Playfair + Inter)
9. ❌ Icons decorative prominent
10. ❌ Gold dominant
11. ❌ Small images
12. ❌ Skip grayscale filter
13. ❌ Generic mobile layouts

## 7. PAGE LAYOUTS

### 7.1. Customer Pages

#### HomePage
```
┌──────────────────────────────────────────────┐
│  Header: Logo (Playfair) | Nav | Cart | User │
├──────────────────────────────────────────────┤
│  Hero: Oversized Typography (9xl)            │
│  "Luxury                                     │
│   *Timepieces*"   [CTA → EXPLORE]            │
│  Decorative line + vertical label             │
├──────────────────────────────────────────────┤
│  Stats: Dark section (inverted)              │
│  Products | Brands | Heritage | Guarantee    │
├──────────────────────────────────────────────┤
│  Featured Collections (grayscale images)     │
│  Asymmetric grid, aspect-[3/4]              │
├──────────────────────────────────────────────┤
│  Featured Products Grid (2-4 cols)           │
│  Image + Brand + Name + Price                │
├──────────────────────────────────────────────┤
│  Dark CTA Section "Ready to find..."         │
│  Gold accent + email input                   │
├──────────────────────────────────────────────┤
│  Footer: Minimal, border-t, gold links       │
└──────────────────────────────────────────────┘
```

#### Product List Page
```
┌──────────────────────────────────────────────┐
│  Breadcrumb: Home > Đồng hồ                 │
├──────────────────────────────────────────────┤
│  ┌────────┐  ┌───────────────────────────┐   │
│  │ Filter │  │  Product Grid              │   │
│  │ Brand  │  │  ┌────┐ ┌────┐ ┌────┐     │   │
│  │ Price  │  │  │Gray│ │Gray│ │Gray│     │   │
│  │ Gender │  │  │→Clr│ │→Clr│ │→Clr│     │   │
│  │ Movement│ │  │name│ │name│ │name│     │   │
│  │ Sort   │  │  │₫   │ │₫   │ │₫   │     │   │
│  └────────┘  │  └────┘ └────┘ └────┘     │   │
│              │  Pagination (numbered)      │   │
│              └───────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

#### Product Detail Page
```
┌──────────────────────────────────────────────┐
│  Breadcrumb: Home > Brand > Product          │
├──────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────────────┐   │
│  │              │ │  OVERLINE LABEL       │   │
│  │  Image       │ │  Product Title (serif)│   │
│  │  Gallery     │ │  Price ₫ (gold accent)│   │
│  │  (grayscale  │ │  ─────────────        │   │
│  │  → color     │ │  Drop cap description │   │
│  │  on hover)   │ │  Specs grid           │   │
│  │              │ │  Qty [- 1 +]          │   │
│  │  [thumbnails]│ │  [THÊM VÀO GIỎ →]    │   │
│  └──────────────┘ └──────────────────────┘   │
├──────────────────────────────────────────────┤
│  Related Products (grayscale grid)            │
└──────────────────────────────────────────────┘
```

### 7.2. Admin Pages

#### Admin Dashboard
```
┌──────┬───────────────────────────────────────┐
│      │  Dashboard                            │
│  S   ├───────────────────────────────────────┤
│  I   │ Stats cards (border-t, subtle shadow) │
│  D   │ [Revenue] [Orders] [Users] [Products] │
│  E   ├───────────────────────────────────────┤
│  B   │  Revenue Chart + Recent Orders Table  │
│  A   │  Clean monochrome style               │
│  R   │  Status badges (subtle, no vibrant)   │
└──────┴───────────────────────────────────────┘
```

## 8. FORMAT GIÁ TIỀN — TIẾNG VIỆT
```typescript
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
// Output: "250.000 ₫"
```

## 9. RESPONSIVE GUIDELINES

### Mobile (< 768px)
- Stack columns vertically
- Padding: px-8, py-20
- Headlines: text-4xl → text-5xl (thay vì text-9xl)
- Maintain: grayscale images, gold accents, slow animations
- Hide: vertical grid lines, vertical text labels

### Tablet (768px - 1024px)
- 2-3 columns grid
- Padding: px-8 → px-16, py-20 → py-32
- Typography scales up: text-5xl → text-6xl

### Desktop (> 1024px)
- Full 12-column asymmetric grid
- Maximum spacing
- Visible vertical gridlines (4 lines)
- Vertical text labels visible
- Full typographic scale (text-9xl hero)

## 10. BEST PRACTICES

1. **Slow Motion** — Tất cả animation ≥ 500ms, images 1500-2000ms
2. **Generous Space** — Nếu cảm thấy quá nhiều space → đúng rồi
3. **Loading states** — Skeleton screens, monochrome
4. **Empty states** — Editorial style, có CTA
5. **Error states** — Rõ ràng, still luxury feel
6. **Image optimization** — Lazy loading, Cloudinary transformations
7. **Labels tiếng Việt** — Tất cả text hiển thị bằng tiếng Việt
8. **Paper texture** — Always add noise SVG overlay 2% opacity
