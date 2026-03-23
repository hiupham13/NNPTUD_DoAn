# 📱 Responsive Guide

> Responsive design theo Luxury / Editorial.

---

## Breakpoints

| Breakpoint | Range | Layout |
|:-----------|:------|:-------|
| Mobile | < 768px | 1 column, stacked |
| Tablet | 768px — 1024px | 2-3 columns |
| Desktop | > 1024px | 12-column asymmetric grid |

## Typography Scale

| Element | Mobile | Tablet | Desktop |
|:--------|:-------|:-------|:--------|
| Hero heading | text-4xl — 5xl | text-5xl — 6xl | text-7xl — 9xl |
| Section heading | text-3xl | text-4xl | text-5xl — 6xl |
| Body text | text-base | text-base | text-lg |
| Spacing | px-6, py-12 | px-12, py-20 | px-16, py-32 |

## Mobile-specific Rules
- Hamburger menu thay header nav
- Product grid: 1 col (hoặc 2 col nhỏ)
- Filter ẩn vào drawer/accordion
- Footer: stacked layout
- Ẩn vertical text labels
- Ẩn visible grid lines
- Ẩn drop caps (optional)

## Tailwind Responsive Classes

```html
<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

<!-- Typography responsive -->
<h1 class="text-4xl md:text-6xl lg:text-8xl font-playfair">

<!-- Spacing responsive -->
<section class="px-6 py-12 md:px-12 md:py-20 lg:px-16 lg:py-32">

<!-- Show/hide responsive -->
<span class="hidden lg:block writing-mode-vertical">LABEL</span>
```
