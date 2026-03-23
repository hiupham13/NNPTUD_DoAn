# 🗺️ Implementation Plan: Collections Module

## Mục tiêu module
- Cung cấp API quản lý Bộ sưu tập đồng hồ (Collections).
- Logic xoá linh hoạt hơn so với Categories: chỉ nullify foreign keys.

## Files cần tạo/sửa
1. `backend/controllers/collections.js`.
2. `backend/routes/collections.routes.js`.

## Dependencies
- Model Collections và Model Products.

## Edge cases cần xử lý
- **EC-02**: Cho phép Collection chứa Products xoá (khác với EC-01). Hành động DELETE sẽ trigger một update query: update mọi Product đang attach to collection_id này cập nhật field `collection: null`.

## Tiêu chí hoàn thành
- End-to-end APIs cho BST.
- Endpoint DELETE xử lý an toàn theo EC-02 và phản hồi nhanh chóng.
