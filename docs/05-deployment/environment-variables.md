# 🔑 Environment Variables

> Danh sách biến môi trường cho Development và Production (VPS).

---

## 1. Backend — Development (`backend/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database (Docker local)
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

## 2. Backend — Production (trên VPS: `backend/.env`)

```env
PORT=3000
NODE_ENV=production

# Database — docker-compose.prod.yml override thành mongodb://mongo:27017/...
MONGODB_URI=mongodb://mongo:27017/luxury-watch-store

# JWT — dùng random string mạnh 64 ký tự
JWT_SECRET=<random_64_chars_strong_secret>
JWT_EXPIRE=24h

# Cloudinary — cùng tài khoản với dev
CLOUDINARY_CLOUD_NAME=<same_as_dev>
CLOUDINARY_API_KEY=<same_as_dev>
CLOUDINARY_API_SECRET=<same_as_dev>

# VNPay Sandbox — cập nhật URL production
VNP_TMN_CODE=<same_as_dev>
VNP_HASH_SECRET=<same_as_dev>
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://<VPS_IP>/payment/vnpay-return
VNP_IPN_URL=http://<VPS_IP>/api/v1/payments/vnpay-ipn

# Mailtrap — cùng tài khoản
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<same_as_dev>
SMTP_PASS=<same_as_dev>

# Frontend URL — IP hoặc domain VPS
FRONTEND_URL=http://<VPS_IP>
```

> ⚠️ Tạo file `.env` trực tiếp trên VPS: `nano backend/.env`
> ⚠️ **KHÔNG** commit file `.env` lên Git

## 3. Frontend — Development (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 4. Frontend — Production (VPS)

Frontend production **KHÔNG dùng file `.env`**. Biến `VITE_API_URL` được truyền qua Docker build arg trong `docker-compose.prod.yml`:

```yaml
frontend:
  build:
    args:
      VITE_API_URL: http://<VPS_IP>/api/v1
```

> `VITE_API_URL` được inject vào lúc `npm run build` → bake vào file JS tĩnh.

---

## 📊 So sánh Dev vs Production

| Biến | Development (Local) | Production (VPS) |
|:-----|:--------------------|:-----------------|
| `NODE_ENV` | `development` | `production` |
| `MONGODB_URI` | `mongodb://localhost:27017/...` | `mongodb://mongo:27017/...` |
| `FRONTEND_URL` | `http://localhost:5173` | `http://<VPS_IP>` |
| `VNP_RETURN_URL` | `http://localhost:5173/payment/...` | `http://<VPS_IP>/payment/...` |
| `VNP_IPN_URL` | `http://localhost:3000/api/...` | `http://<VPS_IP>/api/...` |
| `VITE_API_URL` | `http://localhost:3000/api/v1` | `http://<VPS_IP>/api/v1` |
| Cloudinary | Cùng 1 tài khoản | Cùng 1 tài khoản |
| Mailtrap | Cùng 1 tài khoản | Cùng 1 tài khoản |

> 💡 Nếu có domain (VD: `luxurywatch.vn`), thay `<VPS_IP>` bằng domain.
> Nếu có SSL, đổi `http://` → `https://`.

---

## ⚠️ Lưu ý

- **KHÔNG** commit `.env` lên Git (đã có trong `.gitignore`)
- Tạo `.env` từ `.env.example`: `cp backend/.env.example backend/.env`
- Production `JWT_SECRET`: tạo random mạnh: `openssl rand -hex 32`
- VNPay Sandbox dùng test credentials
- Mailtrap: email không gửi thật, xem trên dashboard mailtrap.io
- Cloudinary: cùng 1 tài khoản cho dev + prod (ảnh dùng chung)

## 🐳 Docker Note

| Môi trường | MongoDB URI | Giải thích |
|:-----------|:------------|:-----------|
| Local dev (chỉ Docker DB) | `mongodb://localhost:27017/...` | App chạy ngoài Docker, connect qua port 27017 |
| Docker dev (`--profile full`) | `mongodb://mongo:27017/...` | App chạy trong Docker, dùng service name `mongo` |
| Production VPS | `mongodb://mongo:27017/...` | Tất cả trong Docker, dùng service name `mongo` |
