# 🛒 Products Module

> Module sản phẩm (đồng hồ) — CRUD + Filter/Search/Sort.

---

## Endpoints

| Method | Endpoint | Access | Mô tả |
|:-------|:---------|:-------|:------|
| GET | `/api/v1/products` | Public | List + filter/sort/search |
| GET | `/api/v1/products/:slug` | Public | Chi tiết theo slug |
| POST | `/api/v1/products` | Admin | Thêm mới |
| PUT | `/api/v1/products/:id` | Admin | Cập nhật |
| DELETE | `/api/v1/products/:id` | Admin | Soft delete |

## Filter / Sort / Search

| Param | Type | Query MongoDB |
|:------|:-----|:-------------|
| search | string | `$regex` on title |
| category | ObjectId | exact match |
| collection | ObjectId | exact match |
| gender | enum | exact match |
| movement | enum | exact match |
| minPrice | number | `price: { $gte }` |
| maxPrice | number | `price: { $lte }` |
| sort | string | `.sort()` |
| page | number | `.skip()` |
| limit | number | `.limit()` |

## Business Logic

- Tạo product → auto-gen slug từ title
- Tạo product → auto tạo Inventory (stock=0) — EC-32
- Delete → soft delete (isDeleted=true) — EC-03, EC-04
- Delete product có trong cart → cho xoá, cart filter khi GET — EC-03
- Delete product có trong order → cho xoá, order có snapshot — EC-04
