---
name: react_typescript_expert
description: Frontend Developer — Code giao diện React + Vite + TypeScript, quản lý state, routing, API integration cho dự án E-Commerce.
---

# ⚛️ React TypeScript Expert — E-Commerce NNPTUD

## 1. VAI TRÒ
- Phát triển Frontend E-Commerce bằng React + TypeScript + Vite.
- Xây dựng giao diện người dùng (Customer) và trang quản trị (Admin).
- State management, API integration, routing.
- Responsive design, UI/UX implementation.

## 2. TECH STACK
| Thành phần | Công nghệ | Version | Ghi chú |
|:-----------|:----------|:--------|:--------|
| Framework | React | **^19.1.0** | Latest stable, Context7 confirmed |
| Build Tool | Vite | **^6.3.0** | Stable, Node 20 compatible |
| Language | TypeScript | **^5.8.0** | Latest stable |
| Routing | React Router | **^7.5.0** | Built for React 19 |
| State (Global) | Zustand | **^5.0.0** | Hỗ trợ React 18+ |
| State (Server) | TanStack Query | **^5.75.0** | Hỗ trợ React 18+ |
| Forms | React Hook Form | **^7.55.0** | Hỗ trợ React 16+ |
| Validation | Zod | **^3.24.0** | Standalone, không phụ thuộc React |
| HTTP Client | Axios | **^1.8.0** | Stable |
| CSS Framework | TailwindCSS | **^4.1.0** | CSS-first config, Vite plugin tích hợp |
| Icons | Lucide React | **^0.475.0** | Lightweight icon library |
| Notifications | Sonner | **^2.0.0** | Toast notifications |

## 3. CODE CONVENTIONS

### 3.1. File Naming
```
components/ProductCard.tsx       # PascalCase cho components
components/ProductCard.module.css # CSS module đi kèm
pages/ProductDetail/index.tsx    # Page component
pages/ProductDetail/ProductDetail.module.css
hooks/useAuth.ts                 # camelCase với use prefix
api/products.api.ts              # kebab/camelCase + .api suffix
types/product.types.ts           # kebab/camelCase + .types suffix
store/authStore.ts               # camelCase + Store suffix
utils/formatCurrency.ts          # camelCase
```

### 3.2. Component Pattern
```tsx
// components/ProductCard.tsx
import { FC } from 'react';
import { Product } from '../types/product.types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart?.(product._id);
  };

  return (
    <div className={styles.card}>
      <img src={product.images[0]} alt={product.title} />
      <h3>{product.title}</h3>
      <p className={styles.price}>
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(product.price)}
      </p>
      <button onClick={handleAddToCart}>Thêm vào giỏ</button>
    </div>
  );
};

export default ProductCard;
```

### 3.3. Page Pattern
```tsx
// pages/Products/index.tsx
import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import styles from './Products.module.css';

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useProducts({ page, search });

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Có lỗi xảy ra</div>;

  return (
    <div className={styles.container}>
      <h1>Sản phẩm</h1>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.grid}>
        {data?.data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {/* Pagination */}
    </div>
  );
};

export default ProductsPage;
```

### 3.4. Type Definitions
```tsx
// types/product.types.ts
export interface Product {
  _id: string;
  title: string;
  sku: string;
  slug: string;
  description: string;
  price: number;
  category: string | Category;
  images: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  page?: number;
  limit?: number;
  title?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}
```

### 3.5. API Layer
```tsx
// api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — attach JWT token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;

// api/products.api.ts
import axiosClient from './axiosClient';
import { Product, ProductFilter } from '../types/product.types';
import { ApiResponse } from '../types/api.types';

export const productApi = {
  getAll: (params: ProductFilter) =>
    axiosClient.get<any, ApiResponse<Product[]>>('/products', { params }),

  getById: (id: string) =>
    axiosClient.get<any, ApiResponse<Product>>(`/products/${id}`),

  create: (data: Partial<Product>) =>
    axiosClient.post<any, ApiResponse<Product>>('/products', data),

  update: (id: string, data: Partial<Product>) =>
    axiosClient.put<any, ApiResponse<Product>>(`/products/${id}`, data),

  delete: (id: string) =>
    axiosClient.delete<any, ApiResponse<null>>(`/products/${id}`),
};
```

### 3.6. Custom Hooks (TanStack Query)
```tsx
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/products.api';
import { ProductFilter } from '../types/product.types';

export const useProducts = (params: ProductFilter) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getAll(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
```

### 3.7. Zustand Store
```tsx
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: { name: string };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

## 4. ROUTING STRUCTURE
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute';
import AdminRoute from './components/guards/AdminRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import ProductManage from './pages/Admin/ProductManage';
import OrderManage from './pages/Admin/OrderManage';
import UserManage from './pages/Admin/UserManage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes (Customer) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductManage />} />
            <Route path="/admin/orders" element={<OrderManage />} />
            <Route path="/admin/users" element={<UserManage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## 5. UI TEXT — TIẾNG VIỆT
| Key | Text |
|:----|:-----|
| Login | Đăng nhập |
| Register | Đăng ký |
| Search | Tìm kiếm |
| Add to cart | Thêm vào giỏ |
| Checkout | Thanh toán |
| My orders | Đơn hàng của tôi |
| Profile | Hồ sơ cá nhân |
| Logout | Đăng xuất |
| No results | Không có kết quả |
| Loading | Đang tải... |
| Error | Có lỗi xảy ra |

## 6. BEST PRACTICES

1. **TypeScript strict mode** — Không dùng `any`, define interface cho tất cả.
2. **Component composition** — Chia nhỏ component, mỗi component < 200 dòng.
3. **Separation** — API layer → Hook → Component (không gọi API trực tiếp trong component).
4. **Memoization** — Dùng `useMemo`, `useCallback` khi cần optimize rendering.
5. **Error Boundaries** — Wrap page components bằng Error Boundary.
6. **Loading states** — Luôn handle loading, error, empty states.
7. **Responsive** — Mobile-first design, breakpoints: 640px, 768px, 1024px, 1280px.
8. **Accessibility** — Alt text cho images, aria labels cho interactive elements.
