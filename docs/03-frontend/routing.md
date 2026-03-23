# 🗺️ Routing

> React Router v7 — 2 Layouts riêng biệt.

---

## NGUYÊN TẮC 2 LAYOUTS

```
App.tsx
├── <CustomerLayout>              ← Luxury Editorial (Header + Footer + noise)
│   ├── Public routes (Guest)
│   └── Protected routes (Customer)
│
└── <AdminLayout>                 ← Dashboard (Sidebar + AdminHeader)
    └── Admin routes (Admin only)
```

> ⚠️ Customer và Admin **KHÔNG share layout components**.
> Mỗi layout tự có Header, Sidebar/Footer riêng.

---

## Router Configuration (App.tsx)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerLayout from './layouts/customer/CustomerLayout';
import AdminLayout from './layouts/admin/AdminLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ═══ CUSTOMER LAYOUT (Luxury Editorial) ═══ */}
        <Route element={<CustomerLayout />}>

          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />

          {/* Auth (Guest only) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>

          {/* Protected (Customer) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/payment/vnpay-return" element={<VNPayReturnPage />} />
          </Route>

        </Route>

        {/* ═══ ADMIN LAYOUT (Dashboard) ═══ */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/products" element={<ProductManagePage />} />
            <Route path="/admin/orders" element={<OrderManagePage />} />
            <Route path="/admin/users" element={<UserManagePage />} />
            <Route path="/admin/categories" element={<CategoryManagePage />} />
            <Route path="/admin/collections" element={<CollectionManagePage />} />
            <Route path="/admin/coupons" element={<CouponManagePage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
```

---

## Route Summary

### Customer Layout — Luxury Editorial

| Path | Page | Guard | Mô tả |
|:-----|:-----|:------|:------|
| `/` | HomePage | Public | Trang chủ |
| `/products` | ProductListPage | Public | Danh sách SP |
| `/products/:slug` | ProductDetailPage | Public | Chi tiết SP |
| `/login` | LoginPage | Guest | Đăng nhập |
| `/register` | RegisterPage | Guest | Đăng ký |
| `/forgot-password` | ForgotPasswordPage | Guest | Quên MK |
| `/reset-password/:token` | ResetPasswordPage | Guest | Reset MK |
| `/cart` | CartPage | Customer | Giỏ hàng |
| `/checkout` | CheckoutPage | Customer | Thanh toán |
| `/orders` | OrderHistoryPage | Customer | Lịch sử đơn |
| `/orders/:id` | OrderDetailPage | Customer | Chi tiết đơn |
| `/profile` | ProfilePage | Customer | Profile |
| `/payment/vnpay-return` | VNPayReturnPage | Customer | VNPay callback |

### Admin Layout — Dashboard

| Path | Page | Guard | Mô tả |
|:-----|:-----|:------|:------|
| `/admin` | DashboardPage | Admin | Tổng quan |
| `/admin/products` | ProductManagePage | Admin | Quản lý SP |
| `/admin/orders` | OrderManagePage | Admin | Quản lý đơn |
| `/admin/users` | UserManagePage | Admin | Quản lý users |
| `/admin/categories` | CategoryManagePage | Admin | Quản lý brands |
| `/admin/collections` | CollectionManagePage | Admin | Quản lý BST |
| `/admin/coupons` | CouponManagePage | Admin | Quản lý mã GG |

---

## Route Guards

```tsx
// GuestRoute — chỉ cho user chưa login
function GuestRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
}

// ProtectedRoute — phải login (customer hoặc admin)
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

// AdminRoute — phải login + role = admin
function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return <Outlet />;
}
```

---

## Layout Components

### CustomerLayout (Luxury Editorial)
```tsx
function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-inter">
      {/* Paper noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50">
        <img src={noiseTexture} className="w-full h-full object-cover" />
      </div>

      <CustomerHeader />
      <main>
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}
```

### AdminLayout (Dashboard)
```tsx
function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```
