# 🐳 Docker Setup

> Docker Compose cho development environment.

---

## docker-compose.yml

```yaml
version: '3.8'

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

  backend:
    build: ./backend
    container_name: luxury-watch-api
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/nnptud-ecommerce
    depends_on:
      - mongo
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - app-network

  frontend:
    build: ./frontend
    container_name: luxury-watch-web
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - app-network

volumes:
  mongo_data:

networks:
  app-network:
    driver: bridge
```

## Lệnh chạy

```bash
# Start all
docker-compose up -d

# Stop all
docker-compose down

# Rebuild
docker-compose up --build -d

# View logs
docker-compose logs -f backend

# Seed data
docker exec luxury-watch-api node seeders/seed.js
```
