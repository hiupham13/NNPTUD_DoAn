# 🐳 Docker Setup

> Docker Compose cho Development và Production.

---

## 1. Development — `docker-compose.yml` (hiện tại)

Chỉ chạy MongoDB, BE + FE chạy local bằng `npm start` / `npm run dev`.

```yaml
services:
  mongo:
    image: mongo:8
    container_name: luxury-watch-db
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network
    restart: unless-stopped

volumes:
  mongo_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

```bash
# Chạy MongoDB:
docker compose up -d

# Chạy BE + FE local:
cd backend && npm start
cd frontend && npm run dev
```

> Nếu muốn chạy cả 3 trong Docker (dev mode), dùng profile:
> `docker compose --profile full up -d`

---

## 2. Production — `docker-compose.prod.yml` (VPS)

Chạy toàn bộ 3 services trên VPS.

```yaml
services:
  # === DATABASE ===
  mongo:
    image: mongo:8
    container_name: luxury-watch-db
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network
    restart: unless-stopped
    # KHÔNG expose port 27017 ra ngoài (bảo mật)

  # === BACKEND API ===
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: luxury-watch-api
    ports:
      - "3000:3000"
    env_file:
      - ./backend/.env
    environment:
      - MONGODB_URI=mongodb://mongo:27017/luxury-watch-store
    depends_on:
      - mongo
    networks:
      - app-network
    restart: unless-stopped

  # === FRONTEND (Nginx serve static) ===
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        VITE_API_URL: http://${VPS_HOST:-localhost}/api/v1
    container_name: luxury-watch-web
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

volumes:
  mongo_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### Khác biệt Dev vs Prod

| | Development | Production |
|:--|:------------|:-----------|
| **File** | `docker-compose.yml` | `docker-compose.prod.yml` |
| **MongoDB** | Port 27017 exposed | Không expose (internal only) |
| **Backend** | `nodemon` + volume mount | `node` thuần, copy code vào image |
| **Frontend** | Vite dev server (:5173) | Nginx serve `dist/` (:8080) |
| **Hot reload** | ✅ Có (volume mount) | ❌ Không (rebuild image) |
| **Dockerfile** | `Dockerfile` | `Dockerfile.prod` |

---

## 3. Lệnh chạy

### Development (Local)

```bash
# Chỉ MongoDB
docker compose up -d

# Tất cả (dev mode)
docker compose --profile full up -d

# Stop
docker compose down

# Seed data
docker exec luxury-watch-api node seeders/seed.js
```

### Production (VPS)

```bash
# Build & Start
docker compose -f docker-compose.prod.yml up -d --build

# Stop
docker compose -f docker-compose.prod.yml down

# Seed data
docker exec luxury-watch-api node seeders/seed.js

# Xem logs
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend

# Rebuild 1 service
docker compose -f docker-compose.prod.yml up -d --build backend

# Cập nhật code
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 4. Ước tính tài nguyên (Production)

| Container | RAM | Disk |
|:----------|:----|:-----|
| MongoDB 8 | ~400-500 MB | ~500 MB + data |
| Node.js Express | ~80-150 MB | ~200 MB |
| Nginx (FE static) | ~20-30 MB | ~50 MB |
| **TỔNG** | **~600-700 MB** | **~750 MB** |

> VPS 2 GB RAM → còn dư ~1.3 GB headroom ✅
> VPS 25 GB SSD → còn dư ~20 GB ✅
