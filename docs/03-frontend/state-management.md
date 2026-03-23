# 🧠 State Management

> Chiến lược quản lý state frontend.

---

## Tổng quan

| Loại State | Tool | Khi nào |
|:-----------|:-----|:-------|
| **Server state** | TanStack Query | API data (products, orders, users) |
| **Global client** | Zustand | Auth info, cart count |
| **Local** | React useState | Form inputs, UI toggles |
| **Form** | React Hook Form + Zod | Controlled forms |

## Zustand Stores

### authStore
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}
```

### cartStore (optional — có thể dùng TanStack Query)
```typescript
interface CartState {
  itemCount: number;
  setItemCount: (count: number) => void;
}
```

## TanStack Query Keys

```typescript
// Query key conventions
['products']                      // List all
['products', { filters }]         // List with filters
['product', slug]                 // Single by slug
['cart']                          // User's cart
['orders']                        // User's orders
['order', id]                     // Single order
['admin', 'orders']               // Admin orders
['admin', 'users']                // Admin users
['dashboard', 'stats']            // Dashboard
```

## React Hook Form + Zod

```typescript
// schemas/loginSchema.ts
const loginSchema = z.object({
  username: z.string().min(3, 'Username tối thiểu 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});
type LoginForm = z.infer<typeof loginSchema>;

// Usage in component
const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
  resolver: zodResolver(loginSchema),
});
```
