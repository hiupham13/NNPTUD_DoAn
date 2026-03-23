# 🏗️ System Architecture

> Kiến trúc hệ thống Luxury Watch Store — 3 tầng.

---

## Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │         React + Vite + TypeScript                 │  │
│  │  TailwindCSS | Zustand | TanStack Query | Axios  │  │
│  │         Design: Luxury / Editorial                │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │ HTTP / REST API               │
├──────────────────────────┼──────────────────────────────┤
│                    API LAYER                             │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │            Express.js (Node.js)                   │  │
│  │   ┌──────────┐ ┌────────────┐ ┌──────────────┐   │  │
│  │   │  Routes  │→│Controllers │→│  Middleware   │   │  │
│  │   └──────────┘ └────────────┘ │ Auth (JWT)    │   │  │
│  │                               │ RBAC          │   │  │
│  │                               │ Validation    │   │  │
│  │                               │ Error Handler │   │  │
│  │                               └──────────────┘   │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │ Mongoose ODM                  │
├──────────────────────────┼──────────────────────────────┤
│                    DATA LAYER                            │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │              MongoDB 8.0.5                        │  │
│  │   11 Collections: users, roles, products,         │  │
│  │   categories, collections, cart, orders,           │  │
│  │   payments, inventories, coupons                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │   Cloudinary    │  │     VNPay Sandbox             │  │
│  │  (Image CDN)    │  │   (Payment Gateway)           │  │
│  └─────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Request Flow

```
Browser → React Router → Axios → Express Router → Middleware → Controller → Mongoose → MongoDB
                                    │
                                    ├── auth.js (JWT verify)
                                    ├── role.js (RBAC check)
                                    ├── validate.js (input validation)
                                    └── errorHandler.js (centralized errors)
```

## Module Dependency

```
Roles → Auth → Users → Categories/Collections → Products → Inventory → Cart → Orders → Payments → Dashboard
```

## Deployment Architecture (Docker)

```
docker-compose.yml
├── mongo (port 27017)
├── backend (port 3000) — depends_on: mongo
└── frontend (port 5173) — depends_on: backend
```
