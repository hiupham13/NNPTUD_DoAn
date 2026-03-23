# 📏 Coding Conventions

> Quy tắc code áp dụng cho toàn dự án Luxury Watch Store.

---

## 1. NAMING CONVENTIONS

### Backend (JavaScript / Node.js)
| Loại | Convention | Ví dụ |
|:-----|:----------|:------|
| Variables | camelCase | `userName`, `totalAmount` |
| Functions | camelCase | `getProducts()`, `createOrder()` |
| Files | kebab-case hoặc camelCase | `auth.controller.js`, `products.js` |
| Schema model names | lowercase singular | `"user"`, `"product"`, `"category"` |
| Constants | UPPER_SNAKE | `JWT_SECRET`, `MAX_FILE_SIZE` |
| Routes | kebab-case, plural | `/api/v1/products`, `/api/v1/categories` |

### Frontend (TypeScript / React)
| Loại | Convention | Ví dụ |
|:-----|:----------|:------|
| Components | PascalCase | `ProductCard.tsx`, `CartPage.tsx` |
| Hooks | camelCase, prefix `use` | `useAuth.ts`, `useProducts.ts` |
| Utils/Services | camelCase | `formatVND.ts`, `apiClient.ts` |
| Types/Interfaces | PascalCase, prefix `I` optional | `Product`, `IUser` |
| Store | camelCase | `authStore.ts`, `cartStore.ts` |
| CSS classes | Tailwind utility classes | `className="text-lg font-bold"` |

### Database (MongoDB)
| Loại | Convention | Ví dụ |
|:-----|:----------|:------|
| Collection names | lowercase plural (auto by Mongoose) | `users`, `products` |
| Field names | camelCase | `totalAmount`, `shippingFee` |
| Boolean fields | prefix `is` | `isDeleted`, `isPaid`, `isActive` |

---

## 2. API RESPONSE FORMAT

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Thành công",
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Lỗi cụ thể",
  "errors": [
    { "field": "email", "message": "Email không hợp lệ" }
  ]
}
```

---

## 3. GIT CONVENTIONS

### Commit Message Format
```
<type>(<scope>): <message>

Ví dụ:
feat(auth): implement login API
fix(cart): fix quantity validation
docs(readme): update setup instructions
style(home): add hero section animations
refactor(products): extract filter logic
```

### Types
| Type | Khi nào |
|:-----|:--------|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `docs` | Cập nhật tài liệu |
| `style` | UI/CSS changes |
| `refactor` | Refactor code |
| `test` | Thêm/sửa test |
| `chore` | Config, setup, packages |

---

## 4. CODE STYLE

### General
- Indent: **2 spaces** (không dùng tab)
- Semicolons: **Có** (JS backend), **Không** (TS frontend nếu dùng ESLint)
- Quotes: **Single quotes** `'text'`
- Max line length: **100 characters**
- Trailing comma: **Yes**

### Backend
- `const` > `let` > `var` (không dùng `var`)
- Async/await > callbacks > .then()
- Try-catch cho async controllers
- Destructuring khi lấy req.body, req.params, req.query

### Frontend
- TypeScript strict mode
- Functional components (không dùng class)
- Custom hooks cho shared logic
- Zod schema cho form validation
- Format tiền: `formatVND()` helper

---

## 5. FILE STRUCTURE

### Controller Pattern (Backend)
```javascript
// controllers/products.controller.js
const getProducts = async (req, res, next) => {
  try {
    // Logic
    res.json({ success: true, data: products, message: 'Thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts };
```

### Component Pattern (Frontend)
```tsx
// components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border-t border-[#1A1A1A]/15">
      {/* content */}
    </div>
  );
}
```

---

## 6. LABELS TIẾNG VIỆT

Tất cả text hiển thị trên giao diện bằng **tiếng Việt**:
- Buttons: "Thêm vào giỏ", "Đặt hàng", "Đăng nhập"
- Labels: "Tên sản phẩm", "Giá bán", "Số lượng"
- Messages: "Đăng nhập thành công", "Sản phẩm đã hết hàng"
- Placeholders: "Nhập email của bạn..."

Code (biến, hàm, comment) bằng **tiếng Anh**.
