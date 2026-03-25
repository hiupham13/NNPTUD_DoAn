# 🔧 Troubleshooting — VPS Deploy

> Các lỗi thường gặp khi deploy Docker Compose trên VPS và cách fix.

---

## 1. Docker Build

### ❌ `npm ci` failed — ENOMEM (out of memory)

**Nguyên nhân**: RAM không đủ khi build (đặc biệt frontend).

**Fix**: Tạo swap
```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### ❌ Docker build chậm / stuck

**Nguyên nhân**: VPS 1 core, build lần đầu cần download images + compile.

**Fix**: Kiên nhẫn chờ (~5-10 phút lần đầu). Các lần sau nhanh hơn nhờ cache.

### ❌ `COPY failed: file not found`

**Nguyên nhân**: `.dockerignore` exclude file cần thiết, hoặc path sai.

**Fix**: Kiểm tra `.dockerignore` không chặn `package.json`, `package-lock.json`.

---

## 2. MongoDB

### ❌ Backend log: `MongooseServerSelectionError`

**Nguyên nhân**: MongoDB container chưa sẵn sàng khi backend start.

**Fix**: Thêm healthcheck và depends_on condition:
```yaml
mongo:
  healthcheck:
    test: echo 'db.runCommand("ping").ok' | mongosh --quiet
    interval: 10s
    timeout: 5s
    retries: 5

backend:
  depends_on:
    mongo:
      condition: service_healthy
```

Hoặc đơn giản restart backend:
```bash
docker compose -f docker-compose.prod.yml restart backend
```

### ❌ MongoDB chiếm quá nhiều RAM

**Fix**: Giới hạn WiredTiger cache:
```yaml
mongo:
  command: --wiredTigerCacheSizeGB 0.25
```

---

## 3. Nginx Reverse Proxy

### ❌ 502 Bad Gateway

**Nguyên nhân**: Backend/Frontend container chưa start hoặc port sai.

**Fix**:
```bash
# Kiểm tra containers chạy chưa
docker compose -f docker-compose.prod.yml ps

# Kiểm tra logs
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend

# Test internal
curl http://localhost:3000/api/v1   # Backend
curl http://localhost:8080          # Frontend
```

### ❌ 413 Request Entity Too Large

**Nguyên nhân**: Nginx giới hạn upload size mặc định 1MB.

**Fix**: Thêm trong Nginx config:
```nginx
location /api/ {
    client_max_body_size 10M;
    proxy_pass http://localhost:3000;
}
```

### ❌ CORS Error

**Nguyên nhân**: `FRONTEND_URL` trong `.env` không match URL thực tế.

**Fix**:
1. Kiểm tra `FRONTEND_URL` = `http://<VPS_IP>` (không có trailing slash)
2. Restart backend: `docker compose -f docker-compose.prod.yml restart backend`

---

## 4. Frontend

### ❌ 404 khi refresh trang (không phải `/`)

**Nguyên nhân**: Nginx chưa cấu hình SPA routing.

**Fix**: Kiểm tra `frontend/nginx.conf` có:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### ❌ API call failed sau khi deploy

**Nguyên nhân**: `VITE_API_URL` sai hoặc chưa rebuild.

**Fix**:
1. Kiểm tra `VITE_API_URL` trong `docker-compose.prod.yml` build args
2. **Phải rebuild**: `docker compose -f docker-compose.prod.yml up -d --build frontend`

> ⚠️ `VITE_API_URL` được inject lúc build, không phải runtime. Mỗi lần đổi phải rebuild.

---

## 5. VNPay

### ❌ IPN callback không nhận

**Nguyên nhân**: VPS IP chưa public hoặc firewall chặn.

**Fix**:
```bash
# Mở port 80, 443
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### ❌ Return URL redirect sai

**Fix**: Kiểm tra `VNP_RETURN_URL` trong `.env` = `http://<VPS_IP>/payment/vnpay-return`

---

## 6. Lệnh hữu ích

```bash
# Xem tất cả containers
docker ps -a

# Xem logs real-time
docker compose -f docker-compose.prod.yml logs -f

# Xem RAM/CPU usage
docker stats --no-stream

# Disk usage
df -h
docker system df

# Dọn rác Docker (images cũ, cache)
docker system prune -a

# Restart toàn bộ
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# SSH vào container debug
docker exec -it luxury-watch-api sh
docker exec -it luxury-watch-db mongosh
```
