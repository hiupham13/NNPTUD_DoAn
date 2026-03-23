# 📮 API Testing (Jest + Supertest & Postman)

Hệ thống E-Commerce được apply song song 2 phương pháp test API để đảm bảo chất lượng:
1. **Automated Integration Testing (Jest + Supertest)**: Sử dụng MongoDB chạy ảo trên RAM (in-memory db) độc lập và không để lại rác sau mỗi test suit. Script nằm trong `backend/tests/integration/`.
2. **Manual Testing (Postman)**: Sử dụng Postman collections cho việc test End-to-End các flow phức tạp.

## Trạng thái các Modules

| Module | Đã viết Automation Test | Đã Pass Edge Cases | Ghi chú |
| :--- | :---: | :---: | :--- |
| **Auth** | 🟡 (Postman) | ✅ | Register, Login, Mật khẩu quên |
| **Users** | ✅ (Jest) | ✅ | Lấy thông tin user an toàn |
| **Categories** | ✅ (Jest) | ✅ | Verify EC-01 (Delete Protection) |
| **Collections** | ✅ (Jest) | ✅ | Verify EC-02 (Soft delete & Set Null Product ref) |

> *Các Module về sau (Products, Cart, Order) sẽ tiếp tục được add coverage test tương tự.*
