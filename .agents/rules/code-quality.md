---
description: Quy tắc code quality — Naming convention, coding standards, best practices.
globs: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.css"]
alwaysApply: false
---

# ✨ QUY TẮC CODE QUALITY

## 1. NAMING CONVENTIONS

### Backend (Node.js / Express)
| Loại | Convention | Ví dụ |
|:-----|:----------|:------|
| File name | kebab-case hoặc camelCase (giữ theo GV) | `products.js`, `auth.js` |
| Controller file | camelCase + `.controller` | `products.controller.js` |
| Middleware file | camelCase + `.middleware` | `auth.middleware.js` |
| Variable | camelCase | `productList`, `isDeleted` |
| Constant | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `JWT_EXPIRES_IN` |
| Function | camelCase | `getProductById`, `validateInput` |
| Schema model name | singular, lowercase | `'product'`, `'user'`, `'order'` |
| Collection (auto) | plural by Mongoose | `products`, `users`, `orders` |

### Frontend (React / TypeScript)
| Loại | Convention | Ví dụ |
|:-----|:----------|:------|
| Component file | PascalCase | `ProductCard.tsx`, `Header.tsx` |
| Page file | PascalCase hoặc index.tsx | `Products/index.tsx` |
| Hook file | camelCase + `use` prefix | `useAuth.ts`, `useProducts.ts` |
| API file | camelCase + `.api` | `products.api.ts` |
| Type file | camelCase + `.types` | `product.types.ts` |
| Store file | camelCase + `Store` | `authStore.ts` |
| CSS Module | PascalCase + `.module.css` | `ProductCard.module.css` |
| Interface | PascalCase | `Product`, `UserResponse` |
| Type | PascalCase | `ProductFilter`, `ApiResponse<T>` |
| Enum | PascalCase | `OrderStatus`, `PaymentMethod` |

## 2. CODE STANDARDS

### 2.1. Luôn có error handling
```javascript
// ✅ ĐÚNG
try {
  const result = await Product.findById(id);
  res.json({ success: true, data: result });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}

// ❌ SAI — không có error handling
const result = await Product.findById(id);
res.json(result);
```

### 2.2. Response format chuẩn
```javascript
// ✅ ĐÚNG — format nhất quán
res.json({ success: true, data: product, message: 'Thành công' });
res.status(404).json({ success: false, message: 'Không tìm thấy' });

// ❌ SAI — format không nhất quán
res.send(product);
res.send({ error: "Not found" });
```

### 2.3. Soft delete
```javascript
// ✅ ĐÚNG — soft delete
await Product.findByIdAndUpdate(id, { isDeleted: true });

// ❌ SAI — hard delete
await Product.findByIdAndDelete(id);
await Product.deleteOne({ _id: id });
```

### 2.4. Filter isDeleted trong query
```javascript
// ✅ ĐÚNG — luôn filter isDeleted
const products = await Product.find({ isDeleted: false });

// ❌ SAI — quên filter
const products = await Product.find({});
```

### 2.5. Pagination cho list API
```javascript
// ✅ ĐÚNG — có pagination
const { page = 1, limit = 10 } = req.query;
const total = await Product.countDocuments(filter);
const data = await Product.find(filter).skip((page-1) * limit).limit(limit);

// ❌ SAI — trả về tất cả
const data = await Product.find({});
```

## 3. GIT CONVENTIONS

### Commit message format
```
<type>: <mô tả ngắn gọn>

Types:
  feat:     Tính năng mới
  fix:      Sửa bug
  refactor: Refactor code (không thêm/sửa tính năng)
  docs:     Thêm/sửa tài liệu
  style:    Format code, không ảnh hưởng logic
  test:     Thêm/sửa test
  chore:    Cập nhật config, dependencies
  
Ví dụ:
  feat: add order creation API
  fix: fix product filter not excluding deleted items
  docs: add API documentation for products
  refactor: extract product validation to middleware
```

## 4. FILE ORGANIZATION

### Khi thêm file mới, đặt đúng thư mục:
```
Mongoose Schema    → schemas/
Route definition   → routes/
Controller logic   → controllers/
Middleware         → middlewares/
Utility function   → utils/
Config             → config/
Tests              → tests/
```

### KHÔNG tạo file ở root directory trừ khi:
- Config files (`.env`, `.gitignore`, `docker-compose.yml`)
- Entry points (`app.js`, `package.json`)
