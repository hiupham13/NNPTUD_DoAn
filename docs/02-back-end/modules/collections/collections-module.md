# 🏷️ Collections Module

> Module quản lý danh sách Bộ Sưu Tập (BST) - Vd: Classic Gold, Sport Series

---

## Endpoints

| Method | Endpoint | Access |
|:-------|:---------|:-------|
| GET | `/api/v1/collections` | Public |
| GET | `/api/v1/collections/:slug` | Public |
| POST | `/api/v1/collections` | Admin |
| PUT | `/api/v1/collections/:id` | Admin |
| DELETE | `/api/v1/collections/:id` | Admin |

## Delete Policy (EC-02)
- Khi xoá Collection, cho phép xoá mềm (Soft delete `isDeleted = true`).
- Đồng thời update toàn bộ `Products` mang Collection ref về `null` thay vì ngăn cản thao tác xoá.
