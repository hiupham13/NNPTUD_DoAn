# 🚀 Deployment Guide — Luxury Watch Store

> **Chiến lược**: Deploy toàn bộ bằng Docker Compose trên VPS
> **Cập nhật**: 25/03/2026

---

## 📋 TỔNG QUAN

### Cấu hình VPS

| Thông số | Giá trị |
|:---------|:--------|
| CPU | 1 Core |
| RAM | 2 GB |
| SSD | 25 GB |
| Bandwidth | 100/10 Mbps |
| OS | Ubuntu 22.04 LTS |

### Kiến trúc Deploy

```
                     Internet
                        │
                   ┌────▼────┐
                   │  Nginx  │  ← Reverse Proxy + SSL
                   │  :80    │     (Let's Encrypt)
                   │  :443   │
                   └────┬────┘
              ┌─────────┴──────────┐
              │                    │
     ┌────────▼────────┐  ┌───────▼────────┐
     │   Frontend      │  │   Backend      │
     │   Nginx :80     │  │   Express :3000 │
     │   (static dist) │  │   Node.js       │
     └─────────────────┘  └───────┬─────────┘
                                  │
                          ┌───────▼────────┐
                          │   MongoDB 8    │
                          │   :27017       │
                          │   (internal)   │
                          └────────────────┘
```

### Dịch vụ bên ngoài (giữ nguyên)

| Service | Nền tảng | Chi phí |
|:--------|:---------|:--------|
| Ảnh sản phẩm | Cloudinary (Free) | $0 |
| Email | Mailtrap (Free) | $0 |
| Thanh toán | VNPay Sandbox | $0 |

---

## 🗓️ KẾ HOẠCH DEPLOY (6 bước)

```
Bước 1 ──► Bước 2 ──► Bước 3 ──► Bước 4 ──► Bước 5 ──► Bước 6
Setup      Chuẩn bị   Đẩy code   Docker      SSL        Test &
VPS        code local  lên VPS    Compose     (HTTPS)    Verify
~15 phút   ~10 phút   ~5 phút    ~10 phút    ~10 phút   ~10 phút
```

**Tổng thời gian ước tính: ~60 phút**

---

## BƯỚC 1: Setup VPS — ~15 phút

### 1.1. SSH vào VPS

```bash
ssh root@<VPS_IP>
```

### 1.2. Cập nhật hệ thống

```bash
apt update && apt upgrade -y
```

### 1.3. Cài Docker + Docker Compose

```bash
# Cài Docker
curl -fsSL https://get.docker.com | sh

# Verify
docker --version
docker compose version
```

### 1.4. Cài Nginx (Reverse Proxy)

```bash
apt install nginx -y
systemctl enable nginx
```

### 1.5. Tạo user deploy (không dùng root)

```bash
adduser deploy
usermod -aG docker deploy
usermod -aG sudo deploy

# Chuyển sang user deploy
su - deploy
```

### 1.6. Cài Git

```bash
sudo apt install git -y
```

---

## BƯỚC 2: Chuẩn bị code trên local — ~10 phút

### 2.1. Sửa Backend `package.json`

Tách script `start` (production) và `dev` (development):

```json
{
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon --ignore uploads/ --ignore _backup_gv/ ./bin/www",
    "seed": "node seeders/seed.js"
  }
}
```

### 2.2. Cập nhật `docker-compose.yml` cho Production

Tạo file `docker-compose.prod.yml` riêng (xem chi tiết ở `docker-setup.md`).

### 2.3. Tạo Nginx config cho Frontend (production)

Tạo file `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing — tất cả path trả về index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2.4. Cập nhật Frontend Dockerfile cho Production

Tạo file `frontend/Dockerfile.prod`:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.5. Cập nhật Backend Dockerfile cho Production

Tạo file `backend/Dockerfile.prod`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p uploads
EXPOSE 3000
CMD ["node", "./bin/www"]
```

### 2.6. Tạo `.dockerignore` (nếu chưa có)

`backend/.dockerignore`:
```
node_modules
.env
uploads/*
!uploads/.gitkeep
_backup_gv
```

`frontend/.dockerignore`:
```
node_modules
dist
.env
```

### 2.7. Commit & Push

```bash
git add -A
git commit -m "feat: add production Docker configs"
git push origin main
```

---

## BƯỚC 3: Đẩy code lên VPS — ~5 phút

### 3.1. Clone repo trên VPS

```bash
# Đăng nhập user deploy
su - deploy
mkdir -p ~/apps
cd ~/apps

git clone https://github.com/<your-username>/NNPTUD_DoAn.git
cd NNPTUD_DoAn
```

### 3.2. Tạo file `.env` cho Backend trên VPS

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Sửa nội dung (xem chi tiết ở `environment-variables.md`):

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/luxury-watch-store
JWT_SECRET=<random_64_chars>
JWT_EXPIRE=24h
CLOUDINARY_CLOUD_NAME=<your_value>
CLOUDINARY_API_KEY=<your_value>
CLOUDINARY_API_SECRET=<your_value>
VNP_TMN_CODE=<your_value>
VNP_HASH_SECRET=<your_value>
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://<VPS_IP>/payment/vnpay-return
VNP_IPN_URL=http://<VPS_IP>/api/v1/payments/vnpay-ipn
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<your_value>
SMTP_PASS=<your_value>
FRONTEND_URL=http://<VPS_IP>
```

---

## BƯỚC 4: Docker Compose Up — ~10 phút

### 4.1. Build & Start

```bash
cd ~/apps/NNPTUD_DoAn

docker compose -f docker-compose.prod.yml up -d --build
```

### 4.2. Verify containers

```bash
docker compose -f docker-compose.prod.yml ps

# Expected:
# luxury-watch-db    running  27017
# luxury-watch-api   running  3000
# luxury-watch-web   running  8080
```

### 4.3. Seed data

```bash
docker exec luxury-watch-api node seeders/seed.js
```

### 4.4. Test internal

```bash
# Test backend
curl http://localhost:3000/api/v1
# → { "success": true, "message": "Luxury Watch Store API is running 🚀" }

# Test frontend
curl http://localhost:8080
# → HTML content
```

---

## BƯỚC 5: Cấu hình Nginx Reverse Proxy — ~10 phút

### 5.1. Tạo Nginx config

```bash
sudo nano /etc/nginx/sites-available/luxury-watch
```

Nội dung:

```nginx
server {
    listen 80;
    server_name <VPS_IP>;
    # Nếu có domain: server_name yourdomain.com www.yourdomain.com;

    # Frontend (React)
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Upload file limit
        client_max_body_size 10M;
    }
}
```

### 5.2. Enable config

```bash
sudo ln -s /etc/nginx/sites-available/luxury-watch /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5.3. (Tuỳ chọn) SSL với Let's Encrypt — nếu có domain

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## BƯỚC 6: Test & Verify — ~10 phút

### 6.1. Test E2E

| # | Test Case | URL | Kỳ vọng |
|:--|:----------|:----|:--------|
| 1 | Health check API | `http://<VPS_IP>/api/v1` | ✅ JSON response |
| 2 | Trang Home | `http://<VPS_IP>` | ✅ Load đầy đủ |
| 3 | Register | `http://<VPS_IP>/register` | ✅ Tạo tài khoản |
| 4 | Login | `http://<VPS_IP>/login` | ✅ Nhận JWT |
| 5 | Xem Products | `http://<VPS_IP>/products` | ✅ Hiển thị danh sách |
| 6 | Add to Cart → Checkout | — | ✅ Tạo đơn hàng |
| 7 | Admin Dashboard | `http://<VPS_IP>/admin` | ✅ Stats hiển thị |
| 8 | VNPay | — | ✅ Redirect sandbox |

### 6.2. Kiểm tra tài nguyên

```bash
# RAM usage
free -h

# Disk usage
df -h

# Docker stats
docker stats --no-stream
```

---

## 🔄 CẬP NHẬT CODE SAU NÀY

Khi có thay đổi code, chạy trên VPS:

```bash
cd ~/apps/NNPTUD_DoAn
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📂 FILES CẦN TẠO/SỬA

| File | Hành động | Mô tả |
|:-----|:----------|:------|
| `backend/package.json` | ✏️ Sửa | Tách `start` vs `dev` |
| `backend/Dockerfile.prod` | ➕ Tạo mới | Production Dockerfile (no nodemon) |
| `backend/.dockerignore` | ➕ Tạo mới | Exclude node_modules, .env |
| `frontend/Dockerfile.prod` | ➕ Tạo mới | Multi-stage build + Nginx |
| `frontend/nginx.conf` | ➕ Tạo mới | SPA routing + cache |
| `frontend/.dockerignore` | ➕ Tạo mới | Exclude node_modules, dist |
| `docker-compose.prod.yml` | ➕ Tạo mới | Production compose (xem docker-setup.md) |

---

## CHECKLIST TRƯỚC KHI DEPLOY

- [ ] VPS: Docker + Nginx đã cài
- [ ] Backend `package.json`: script `start` dùng `node` (không `nodemon`)
- [ ] `Dockerfile.prod` cho cả BE và FE
- [ ] `frontend/nginx.conf` cho SPA routing
- [ ] `docker-compose.prod.yml` tạo xong
- [ ] `.dockerignore` cho cả BE và FE
- [ ] Backend `.env` trên VPS đã điền đầy đủ
- [ ] Nginx reverse proxy config trên VPS
- [ ] Seed data
- [ ] Test E2E trên production URLs
