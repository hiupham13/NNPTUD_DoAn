# 🧩 Components Library

> Danh sách components chính — Luxury / Editorial style.
> Tham chiếu design: [`design-system.md`](./design-system.md)

---

## Base UI Components

> Vị trí: `src/components/ui/`

### `Button.tsx`
- Border-radius: 0px
- Hỗ trợ các variant: `primary`, `outline`, `ghost`.
- Animation: Hiệu ứng Cinematic Gold Slide Effect (lấp đầy màu Gold trượt từ trái sang trong 700ms khi hover).
- Trạng thái loading: Hỗ trợ thuộc tính `isLoading` tự động vô hiệu hoá nút và hiển thị text "ĐANG XỬ LÝ...".
- Typography: Uppercase, letter-spacing 0.2em, Inter font.

### `Input.tsx`
- Border-radius: 0px
- Tích hợp chuẩn label (tiêu đề nhỏ), input (nhập văn bản), error (tin nhắn lỗi đỏ) cho React Hook Form.
- Border-bottom only (`border-outline-variant/30`).
- Focus: gold border-bottom (`#D4AF37`), transition 500ms.
- Placeholder styles: Font Playfair Display, in nghiêng, tracking normal.
- User input style: Khi gõ chữ, văn bản tự động chia letter-spacing cực rộng (`0.2em` hoặc `widest`).

### Card (Product)
- **Grayscale image** → **color on hover** (1500-2000ms transition)
- Border-top only (1px rgba(26,26,26,0.15))
- No border-radius
- Title: Playfair Display
- Price: Inter semibold

### Modal
- Full-width on mobile, max-w on desktop
- No border-radius
- Overlay: rgba(0,0,0,0.5)

## ⚠️ CSS ISOLATION RULES

> **BẮT BUỘC**: 2 layouts hoàn toàn độc lập về CSS.

| Layer | Chứa gì | Ví dụ |
|:------|:--------|:------|
| **Global** (`index.css`) | Fonts, CSS variables, reset, Tailwind directives | `--color-foreground`, `font-family` |
| **Customer Layout** | Luxury styles: noise, grayscale, gold accent | `CustomerLayout.tsx` + Tailwind |
| **Admin Layout** | Dashboard styles: sidebar, tables, clean forms | `AdminLayout.tsx` + Tailwind |

**Không được**: viết CSS global cho `.header`, `.sidebar`, `.card` — mỗi layout tự quản lý.
**Nếu cần CSS đặc biệt** (ngoài Tailwind): dùng CSS Modules (`*.module.css`).

---

## Layout 1: Customer (Luxury Editorial)

> Thư mục: `layouts/customer/`

### CustomerLayout
- Wrapper: `bg-[#F9F8F6] text-[#1A1A1A] font-inter min-h-screen`
- Paper noise texture overlay (fixed, pointer-events-none, opacity 2%)
- Visible grid lines desktop (4 vertical lines, opacity 20%)
- Bao gồm: `<CustomerHeader />` + `<Outlet />` + `<CustomerFooter />`

### CustomerHeader
- Logo: Playfair Display, text-2xl
- Navigation: Inter uppercase, tracking-widest, hover gold underline
- Cart icon + count badge (gold ring)
- User dropdown (Login / Profile)
- Sticky on scroll, backdrop-blur

### CustomerFooter
- Multi-column layout (desktop), stacked (mobile)
- Brand info, quick links, contact
- Warm alabaster bg, border-top 1px charcoal/15

---

## Layout 2: Admin (Dashboard)

> Thư mục: `layouts/admin/`

### AdminLayout
- Wrapper: `flex min-h-screen`
- No noise texture, no grayscale effects
- Clean, functional, data-focused
- Bao gồm: `<AdminSidebar />` + `<div>` `<AdminHeader />` + `<Outlet />` `</div>`

### AdminSidebar
- Fixed left, width 250px
- Dark charcoal bg (`#1A1A1A`)
- Logo trên cùng
- Navigation links: icon + text
- Active link: gold left-border (`#D4AF37`)
- Collapsible on mobile (hamburger)

### AdminHeader
- Top bar, full width (trừ sidebar)
- Right: user info, logout button
- Light bg, border-bottom

## Product Components

### ProductCard
- Image: **Studio shot nền trắng**, grayscale default, color on hover (1500ms)
- Tỷ lệ khung: `aspect-[3/4]` hoặc `aspect-[4/5]`
- Overlay text on hover: title + price
- No rounded corners

### ProductGrid
- Responsive: 1 col mobile → 2 tablet → 3-4 desktop
- Gap: generous spacing

### ProductFilter
- **Off-canvas Drawer** từ bên trái (không phải Sidebar cố định)
- Nút "Bộ lọc" góc trái trên Product Grid
- Accordion sections: Thương hiệu, Giới tính, Loại máy, Khoảng giá
- Overlay nền tối 50% opacity + animation `translateX` 500ms
- Mobile: Full-width overlay drawer

## Animation Tokens

```css
/* Base transitions */
--transition-button: 500ms ease-out;
--transition-color: 700ms ease-out;
--transition-image: 1500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Cinematic Sliding Animations (used via Tailwind) */
--animate-slide-in-left: slide-in-left 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
--animate-slide-in-right: slide-in-right 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
```
