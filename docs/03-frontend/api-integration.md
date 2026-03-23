# 🔗 API Integration

> Kết nối Frontend ↔ Backend API.

---

## Axios Instance

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Service Pattern

```typescript
// services/productService.ts
export const productService = {
  getAll: (params?: ProductFilters) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: FormData) => api.post('/products', data),
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};
```

## TanStack Query Hook

```typescript
// hooks/useProducts.ts
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters).then(res => res.data),
  });
}
```

## Error Handling (Frontend)

```typescript
try {
  await authService.login(data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 'Có lỗi xảy ra';
    toast.error(message);
  }
}
```
