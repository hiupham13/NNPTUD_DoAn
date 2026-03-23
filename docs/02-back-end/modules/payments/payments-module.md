# 💳 Payments Module

> Module thanh toán VNPay Sandbox + COD.

---

## Endpoints

| Method | Endpoint | Access |
|:-------|:---------|:-------|
| POST | `/api/v1/payments/create-vnpay-url` | Customer |
| GET | `/api/v1/payments/vnpay-return` | Public |
| POST | `/api/v1/payments/vnpay-ipn` | System |

## VNPay Flow

1. Customer chọn VNPay → Backend tạo payment URL (HMAC-SHA512)
2. Redirect customer sang VNPay Sandbox
3. Customer nhập thẻ test → thanh toán
4. VNPay redirect về return URL → Backend verify hash
5. VNPay gọi IPN (server-to-server) → Backend verify + update

## Edge Cases
- EC-42: Timeout → payment failed, order pending
- EC-43: Return nhưng IPN chưa gọi → dùng return để update
- EC-44: IPN duplicate → bỏ qua nếu đã paid
- EC-45: Hash sai → reject
