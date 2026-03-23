# 🎨 Design System — Luxury / Editorial

> **Phong cách chính thức**: Luxury / Editorial
> **Tham chiếu đầy đủ**: `docs/prompt_ui_root.md`
> **Skill**: `.agents/skills/ui_ux_designer/SKILL.md`

---

## 1. DESIGN PHILOSOPHY

> *Luxury isn't about adding decoration—it's about removing everything unnecessary and perfecting what remains.*

| Keyword | Mô tả |
|:--------|:------|
| **Sophisticated** | Tinh tế, không flashy |
| **Timeless** | Không theo trend, vượt thời gian |
| **Editorial** | Như tạp chí cao cấp (Vogue, Harper's Bazaar) |
| **Cinematic** | Motion chậm, deliberate, như phim luxury fashion |
| **Curated** | Mọi element đều cân nhắc kỹ lưỡng |

---

## 2. COLOR PALETTE

```
Background:       #F9F8F6  (Warm Alabaster — NOT pure white)
Foreground:        #1A1A1A  (Rich Charcoal — NOT pure black)
Muted:             #EBE5DE  (Pale Taupe)
Muted Foreground:  #6C6863  (Warm Grey)
Accent:            #D4AF37  (Metallic Gold — sparingly!)
Border:            rgba(26, 26, 26, 0.15)
Border Strong:     #1A1A1A
```

**Quy tắc Gold:**
- ✅ Hover states, focus indicators, underlines, emphasize nhỏ
- ❌ KHÔNG cho large areas, backgrounds

---

## 3. TYPOGRAPHY

| Vai trò | Font | Weight |
|:--------|:-----|:-------|
| Headlines, Display | Playfair Display (serif) | 300-400 |
| Body, UI, Labels | Inter (sans-serif) | 400-500 |

**Type Scale:** text-xs (12px) → text-9xl (128px)

**Letter Spacing:**
- Uppercase labels: `0.25em - 0.3em`
- Buttons: `0.2em`
- Headlines serif: `tracking-tight`

---

## 4. BORDERS & SHADOWS

- **Border Radius**: `0px` mọi nơi (không ngoại lệ)
- **Shadows**: Subtle, layered, deepen on hover
- **Borders**: 1px, dùng border-t for cards, rgba opacity for dividers

---

## 5. ANIMATION TIMING

| Loại | Duration |
|:-----|:---------|
| Buttons | 500ms |
| Colors | 700ms |
| Backgrounds | 700ms |
| Images (grayscale) | 1500-2000ms |

**Easing**: `ease-out` hoặc `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

---

## 6. KEY PATTERNS

1. **Grayscale Images** → Color on hover (1500-2000ms)
2. **Gold Sliding Button** → translate-x animation
3. **Drop Caps** → Playfair 7xl, float-left
4. **Vertical Text Labels** → `writing-mode: vertical-rl`
5. **Visible Grid Lines** → 4 vertical, 20% opacity
6. **Paper Noise Texture** → SVG overlay 2% opacity
7. **Mixed Italic Headlines** → Regular + *italic gold*
8. **Asymmetric Layouts** → Offset columns, not 50/50

---

## 7. RESPONSIVE

| Breakpoint | Headlines | Padding | Grid |
|:-----------|:----------|:--------|:-----|
| Mobile < 768px | text-4xl - 5xl | px-8, py-20 | 1 col |
| Tablet 768-1024px | text-5xl - 6xl | px-16, py-24 | 2-3 col |
| Desktop > 1024px | text-7xl - 9xl | px-16, py-32 | 12 col asymmetric |

---

## 8. LOCALIZATION (NGÔN NGỮ GIAO DIỆN)

> **QUY TẮC TỐI THƯỢNG:** Mọi giao diện hướng tới người dùng (Customer / Admin) trên Frontend đều **BẮT BUỘC PHẢI DÙNG TIẾNG VIỆT 100%**.

1. **Labels & Placeholders**: Phải được dịch chuẩn ngữ cảnh thương mại điện tử đồng hồ (Ví dụ: "Địa chỉ Email", "Mật khẩu", "Họ và tên"). 
2. **Buttons & Actions**: "Thêm vào giỏ", "Thanh toán", "Đăng ký". KHÔNG được để text tiếng Anh mặc định (như "Submit", "Send Link").
3. **Exceptions**: Tên thương hiệu đặc hữu (Rolex, Omega, "Luxury Watch Store" brand) hoặc technical terms (Quartz, Automatic).
4. **Quy trình làm việc**: Nếu copy UI/template từ Figma/Stitch (thường giao diện sẽ để text tiếng Anh), Agent **BẮT BUỘC phải dịch toàn bộ sang Tiếng Việt ngay trong lúc code React Object/Component**. Không bao giờ được đưa thẳng hardcode tiếng Anh lên layout.

---

## 9. PRODUCT IMAGE STANDARDS (ẢNH SẢN PHẨM)

> **Phong cách chính thức**: Studio Shot trên nền trắng/xám nhạt — giống cách Rolex, Omega trưng bày trên chính trang web của họ.

| Yếu tố | Quy chuẩn |
|:--------|:---------|
| **Kiểu chụp** | Studio shot nền trắng/xám nhạt, rõ sản phẩm, không nhiễu bối cảnh |
| **Tỷ lệ khung** | `aspect-[3/4]` hoặc `aspect-[4/5]` (chân dung, cao hơn rộng) |
| **Hiệu ứng mặc định** | `grayscale(100%)` + `contrast-125` |
| **Hiệu ứng hover** | Grayscale → Full Color + `scale(1.05)` trong `1500ms` |
| **Shadow** | `shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]` → deepen on hover |
| **Nguồn ảnh (dev)** | Unsplash (`luxury watch`, `wristwatch studio`). Production dùng Cloudinary |

---

## 10. PRODUCT FILTER — OFF-CANVAS DRAWER

> **Quyết định**: Dùng **Off-canvas Drawer** (trượt từ trái) thay vì sidebar cố định, giữ cho layout tảng thoáng đãng và luôn đẹp như trang tạp chí.

| Yếu tố | Mô tả |
|:--------|:------|
| **Nút mở** | Nút "Bộ lọc" góc trên bên trái khu vực Product Grid |
| **Panel** | Trượt từ bên trái, overlay nền tối 50% opacity |
| **Nội dung** | Thương hiệu, Giới tính, Loại máy, Khoảng giá, Sắp xếp |
| **Animation** | `translateX` + `duration-500ms` cinematic |
| **Mobile** | Full-width overlay drawer |

---

## 11. ADMIN LAYOUT — MINIMALIST DATA-HEAVY

> **Nguyên tắc**: Không cần quá chú trọng vào mỹ thuật. Chỉ cần hiển thị đúng data, gọn gàng, trực quan, dễ thao tác.

| Yếu tố | Customer Layout | Admin Layout |
|:--------|:---------------|:-------------|
| Paper Noise Texture | ✅ Có | ❌ Không |
| Grayscale Images | ✅ Có | ❌ Không |
| Gold Slide Button | ✅ Có | ❌ Không |
| Vertical Grid Lines | ✅ Có | ❌ Không |
| Border-radius | 0px | 0px (giữ đồng bộ) |
| Font | Playfair + Inter | Inter only |
| Sidebar | Không | Charcoal `#1A1A1A`, cố định trái |
| Trọng tâm | Ảnh đẹp + Typography | Data Table + Stats Cards |
