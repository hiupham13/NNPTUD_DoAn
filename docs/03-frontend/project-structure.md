# 📂 Frontend Project Structure

> Cấu trúc thư mục frontend (React + Vite + TypeScript).
> **2 Layout riêng biệt**: Customer (Luxury Editorial) + Admin (Dashboard).
> CSS scoped — mỗi layout tự quản lý style, không ảnh hưởng nhau.

---

## NGUYÊN TẮC CSS ISOLATION

> ⚠️ **BẮT BUỘC**: Customer Layout và Admin Layout dùng **CSS riêng biệt**.
> Chỉ **`index.css`** chứa CSS global (fonts, design tokens, reset).
> Mỗi layout/component tự style bằng Tailwind classes hoặc CSS Module.

```
CSS LAYERS:

┌─────────────────────────────────────────────────┐
│            index.css (GLOBAL ONLY)              │
│  ✅ @tailwind base / components / utilities     │
│  ✅ @font-face (Playfair Display, Inter)        │
│  ✅ CSS Variables (--color-*, --font-*)          │
│  ✅ Basic reset (box-sizing, scroll-behavior)   │
│  ❌ KHÔNG layout-specific styles                │
│  ❌ KHÔNG component styles                      │
└─────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐
│  CustomerLayout  │      │    AdminLayout       │
│  (Luxury style)  │      │  (Dashboard style)   │
│                  │      │                      │
│  Tailwind classes│      │  Tailwind classes    │
│  + CSS Modules   │      │  + CSS Modules       │
│  (nếu cần)       │      │  (nếu cần)           │
│                  │      │                      │
│  Header.tsx      │      │  AdminSidebar.tsx    │
│  Footer.tsx      │      │  AdminHeader.tsx     │
│  noise overlay   │      │  Clean dashboard UI  │
│  grayscale imgs  │      │  Data tables         │
│  gold accents    │      │  Forms               │
└──────────────────┘      └──────────────────────┘
```

---

## Cấu trúc thư mục

```
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
├── .env                                    # VITE_API_URL
│
├── public/
│   └── fonts/                              # Playfair Display, Inter
│
└── src/
    ├── main.tsx                            # Entry point
    ├── App.tsx                             # Router + Providers
    ├── index.css                           # 🌍 GLOBAL ONLY: fonts, tokens, reset
    │
    ├── assets/
    │   ├── images/
    │   └── noise-texture.svg               # Paper noise (customer only)
    │
    │
    │   ══════════════════════════════════
    │   ⬇️  LAYOUT 1: CUSTOMER (Luxury)
    │   ══════════════════════════════════
    │
    ├── layouts/
    │   ├── customer/                       # 🎨 Customer Layout (Luxury Editorial)
    │   │   ├── CustomerLayout.tsx          # Layout wrapper
    │   │   ├── CustomerHeader.tsx          # Header: logo, nav, cart, user
    │   │   ├── CustomerFooter.tsx          # Footer: multi-column
    │   │   └── CustomerLayout.module.css   # 🔒 CSS scoped (nếu cần ngoài Tailwind)
    │   │
    │   │   ══════════════════════════════
    │   │   ⬇️  LAYOUT 2: ADMIN (Dashboard)
    │   │   ══════════════════════════════
    │   │
    │   └── admin/                          # 📊 Admin Layout (Dashboard)
    │       ├── AdminLayout.tsx             # Layout wrapper (sidebar + content)
    │       ├── AdminSidebar.tsx            # Sidebar: nav links
    │       ├── AdminHeader.tsx             # Top bar: user info, logout
    │       └── AdminLayout.module.css      # 🔒 CSS scoped (nếu cần ngoài Tailwind)
    │
    ├── components/                         # Shared components (dùng chung)
    │   ├── ui/                             # Base UI (Button, Input, Modal...)
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   └── Modal.tsx
    │   ├── product/                        # Product-specific (customer)
    │   │   ├── ProductCard.tsx
    │   │   ├── ProductGrid.tsx
    │   │   └── ProductFilter.tsx
    │   └── common/                         # Generic reusable
    │       ├── Pagination.tsx
    │       ├── SearchBar.tsx
    │       ├── DataTable.tsx               # 🆕 Admin tables
    │       └── Loading.tsx
    │
    ├── pages/
    │   ├── auth/                           # Auth pages (dùng CustomerLayout)
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── ForgotPasswordPage.tsx
    │   │   └── ResetPasswordPage.tsx
    │   ├── customer/                       # Customer pages (dùng CustomerLayout)
    │   │   ├── HomePage.tsx
    │   │   ├── ProductListPage.tsx
    │   │   ├── ProductDetailPage.tsx
    │   │   ├── CartPage.tsx
    │   │   ├── CheckoutPage.tsx
    │   │   ├── OrderHistoryPage.tsx
    │   │   ├── OrderDetailPage.tsx
    │   │   └── ProfilePage.tsx
    │   └── admin/                          # Admin pages (dùng AdminLayout)
    │       ├── DashboardPage.tsx
    │       ├── ProductManagePage.tsx
    │       ├── OrderManagePage.tsx
    │       ├── UserManagePage.tsx
    │       ├── CategoryManagePage.tsx
    │       ├── CollectionManagePage.tsx
    │       └── CouponManagePage.tsx
    │
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useProducts.ts
    │   ├── useCart.ts
    │   ├── useOrders.ts
    │   └── useCoupons.ts
    │
    ├── stores/                             # Zustand
    │   ├── authStore.ts
    │   └── cartStore.ts
    │
    ├── services/                           # API (Axios)
    │   ├── api.ts
    │   ├── authService.ts
    │   ├── productService.ts
    │   ├── cartService.ts
    │   ├── orderService.ts
    │   └── uploadService.ts
    │
    ├── types/
    │   ├── product.ts
    │   ├── user.ts
    │   ├── order.ts
    │   ├── cart.ts
    │   └── api.ts
    │
    └── utils/
        ├── formatVND.ts
        ├── cn.ts                           # clsx + tailwind-merge
        └── constants.ts
```
