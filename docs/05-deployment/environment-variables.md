# 🔑 Environment Variables

> Danh sách biến môi trường cần cấu hình.

---

## Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/luxury-watch-store

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=24h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# VNPay Sandbox
VNP_TMN_CODE=your_tmn_code
VNP_HASH_SECRET=your_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5173/payment/vnpay-return
VNP_IPN_URL=http://localhost:3000/api/v1/payments/vnpay-ipn

# Mailtrap (Email dev/test)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## ⚠️ Lưu ý
- **KHÔNG** commit `.env` lên Git (đã có trong `.gitignore`)
- Tạo `.env` từ `.env.example`: `cp backend/.env.example backend/.env`
- VNPay Sandbox dùng test credentials
- Mailtrap: email không gửi thật, xem trên dashboard mailtrap.io
- Cloudinary: đăng ký free tại cloudinary.com

## 🐳 Docker Note
- Khi chạy **full Docker** (`--profile full`), `MONGODB_URI` tự override thành `mongodb://mongo:27017/luxury-watch-store`
- Khi dev **local** (chỉ MongoDB Docker), dùng `mongodb://localhost:27017/luxury-watch-store`
