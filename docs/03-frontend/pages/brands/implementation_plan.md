# Implementation Plan — BrandsPage (/brands)

> Template BỐ CỤC: Stitch "The Brand — Manifesto & Heritage"  
> Design System: Project ROOT (Cormorant Garamond / Playfair Display / Inter, Gold #D4AF37)
> Cập nhật: 24/03/2026

---

## 1. PHÂN TÍCH TEMPLATE (CHỈ BỐ CỤC)

| Section | Layout lấy từ template | Áp dụng vào web |
|:--------|:----------------------|:----------------|
| Hero | Flex: text 5/12 + image 7/12 + vertical label | Dùng Cormorant Garamond, gold em, grayscale hover |
| Philosophy | 12-col: heading italic 4cols + drop cap text 7cols | Dùng pattern drop-cap đã có từ HomePage |
| Heritage | 12-col: 2 ảnh + text, vertical label | Ảnh đồng hồ, grayscale hover |
| Process (dark bg) | 3-col, numbered 01/02/03, gold bar hover | Dark section giống Stats trên HomePage |
| CTA | Center, oversized bg text, gold button | Pattern CTA đã có |

## 2. NỘI DUNG TIẾNG VIỆT

- Hero: "Câu Chuyện / *Thương Hiệu*" — Giới thiệu Luxury Watch Store
- Philosophy: "Sự tinh tế trong từng chi tiết" — Triết lý thương hiệu
- Heritage: "Di Sản & Nghệ Thuật Chế Tác" — 2 ảnh đồng hồ + text
- Process: "Quy Trình Phục Vụ" — 01 Tuyển Chọn / 02 Kiểm Định / 03 Trưng Bày
- CTA: "Khám Phá Bộ Sưu Tập" → /collections

## 3. FILES CẦN TẠO / SỬA

| File | Hành động |
|:-----|:----------|
| `pages/customer/BrandsPage.tsx` | TẠO MỚI |
| `pages/customer/BrandsPage.css` | TẠO MỚI |
| `App.tsx` | SỬA — thêm route `/brands` |

## 4. KHÔNG CẦN

- ❌ API backend (static brand story page)
- ❌ Service / Hook / Types
- ❌ Component riêng
