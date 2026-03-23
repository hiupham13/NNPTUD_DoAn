# 🔑 Environment Variables

> Danh sách biến môi trường cần cấu hình.

---

## Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nnptud-ecommerce

# JWT
JWT_SECRET=your_jwt_secret_key_here
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

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL (for reset password link)
FRONTEND_URL=http://localhost:5173
```

## Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## ⚠️ Lưu ý
- **KHÔNG** commit `.env` lên Git
- Tạo `.env.example` (không có giá trị thật) để team reference
- VNPay Sandbox dùng test credentials
- Gmail cần "App Password" (bật 2FA trước)
