---
name: docker_devops
description: DevOps Engineer — Docker Compose setup (MongoDB + Backend + Frontend), environment config, deployment cho dự án E-Commerce.
---

# 🐳 Docker DevOps — E-Commerce NNPTUD

## 1. VAI TRÒ
- Setup Docker Compose cho môi trường development.
- Containerize Backend (Express), Frontend (Vite), Database (MongoDB).
- Quản lý environment variables.
- Hướng dẫn deployment.

## 2. DOCKER COMPOSE ARCHITECTURE

### 2.1. Services Overview
```
┌─────────────────────────────────────────────────────┐
│                Docker Compose Network               │
│                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐ │
│  │  frontend    │ │  backend    │ │  mongodb      │ │
│  │  :5173       │→│  :3000      │→│  :27017       │ │
│  │  Vite Dev    │ │  Express    │ │  Mongo 8      │ │
│  └─────────────┘ └─────────────┘ └──────────────┘ │
│                                                     │
│  Volumes: mongodb_data, uploads                    │
└─────────────────────────────────────────────────────┘
```

### 2.2. docker-compose.yml Template
```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:8
    container_name: nnptud-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=nnptud-ecommerce
    networks:
      - app-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: nnptud-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
      - ./backend/uploads:/app/uploads
    environment:
      - NODE_ENV=development
      - PORT=3000
      - MONGODB_URI=mongodb://mongodb:27017/nnptud-ecommerce
      - JWT_SECRET=${JWT_SECRET:-super-secret-key-dev}
      - JWT_EXPIRES_IN=24h
    depends_on:
      - mongodb
    networks:
      - app-network

  # Frontend React
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: nnptud-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000/api/v1
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

### 2.3. Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cache optimization)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start with nodemon for dev
CMD ["npm", "start"]
```

### 2.4. Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite dev server cần host 0.0.0.0 để Docker expose
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### 2.5. Docker Ignore Files
```
# .dockerignore (cho cả backend và frontend)
node_modules
npm-debug.log
.git
.gitignore
.env
*.md
.DS_Store
```

## 3. DEVELOPMENT WORKFLOW

### 3.1. Lần đầu setup
```bash
# Clone project
git clone <repo-url>
cd NNPTUD_DoAn

# Copy env file
cp .env.example .env

# Build & start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Xem status
docker-compose ps
```

### 3.2. Commands thường dùng
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild 1 service
docker-compose up -d --build backend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access MongoDB shell
docker-compose exec mongodb mongosh nnptud-ecommerce

# Access backend shell
docker-compose exec backend sh

# Install new npm package (backend)
docker-compose exec backend npm install <package-name>

# Install new npm package (frontend)
docker-compose exec frontend npm install <package-name>

# Reset database
docker-compose down -v  # ⚠️ Xóa toàn bộ data
docker-compose up -d
```

### 3.3. MongoDB Replica Set (cho Transactions)
```yaml
# Nếu cần hỗ trợ Mongoose transactions
# Thêm vào mongodb service:
mongodb:
  image: mongo:8
  command: ["--replSet", "rs0"]
  # Sau khi start:
  # docker-compose exec mongodb mongosh --eval "rs.initiate()"
```

## 4. ENVIRONMENT MANAGEMENT

### 4.1. .env.example Template
```env
# ============ APP ============
NODE_ENV=development

# ============ BACKEND ============
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nnptud-ecommerce
JWT_SECRET=change-this-to-a-strong-secret
JWT_EXPIRES_IN=24h

# ============ EMAIL ============
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=

# ============ FRONTEND ============
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=NNPTUD E-Commerce

# ============ UPLOAD ============
MAX_FILE_SIZE=5242880
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp
```

## 5. FOLDER STRUCTURE (Full Project)
```
NNPTUD_DoAn/
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
├── README.md
│
├── backend/                    # Express.js Backend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── app.js
│   ├── bin/www
│   ├── schemas/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── utils/
│   ├── uploads/
│   └── tests/
│
├── frontend/                   # React + Vite Frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│
├── docs/                       # Project documentation
│   ├── ke-hoach/
│   ├── phan-tich/
│   ├── thiet-ke/
│   └── bao-cao/
│
└── .agent/                     # Agent configuration
    └── skills/
```

## 6. BEST PRACTICES

1. **Không commit `.env`** — Chỉ commit `.env.example`.
2. **Volume cho node_modules** — Tránh conflict giữa host và container.
3. **Named volumes cho data** — MongoDB data persist qua restarts.
4. **Health checks** — Thêm healthcheck cho services.
5. **Docker layer caching** — Copy package.json trước code.
6. **Log management** — Dùng `docker-compose logs -f` để debug.
