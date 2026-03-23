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
