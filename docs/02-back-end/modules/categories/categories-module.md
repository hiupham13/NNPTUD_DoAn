# 🏷️ Categories Module

> Module quản lý danh mục (Thương hiệu đồng hồ).

---

## Endpoints

| Method | Endpoint | Access |
|:-------|:---------|:-------|
| GET | `/api/v1/categories` | Public |
| GET | `/api/v1/categories/:slug` | Public |
| POST | `/api/v1/categories` | Admin |
| PUT | `/api/v1/categories/:id` | Admin |
| DELETE | `/api/v1/categories/:id` | Admin |

## Delete Protection (EC-01)

```javascript
// Trước khi xoá, check:
const productCount = await Product.countDocuments({ category: id, isDeleted: false });
if (productCount > 0) {
  throw new AppError(`Danh mục đang có ${productCount} sản phẩm, không thể xoá`, 400);
}
```
