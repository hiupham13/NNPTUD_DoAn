# 🛠️ Tech Stack

> Công nghệ chính thức sử dụng trong dự án Luxury Watch Store.

---

## Runtime & Backend

| Công nghệ | Version | Vai trò |
|:-----------|:--------|:--------|
| Node.js | 20.19.x LTS | Runtime |
| Express.js | ~4.16.1 | Web framework (GV cung cấp) |
| Mongoose | ^9.1.5 | MongoDB ODM |
| bcrypt | ^5.x | Hash password |
| jsonwebtoken | ^9.x | JWT authentication |
| express-validator | ^7.x | Input validation |
| nodemailer | ^6.x | Send email (forgot password) |
| multer | ^1.x | File upload middleware |
| cloudinary | ^2.x | Image storage SDK |
| cors | ^2.x | CORS middleware |
| dotenv | ^16.x | Environment variables |
| slugify | ^1.x | Auto-gen slug từ title |

## Database

| Công nghệ | Version | Vai trò |
|:-----------|:--------|:--------|
| MongoDB | 8.0.5 | NoSQL Database |
| MongoDB Node Driver | 6.x (auto) | Driver (by Mongoose) |

## Frontend

| Công nghệ | Version | Vai trò |
|:-----------|:--------|:--------|
| React | ^19.1.0 | UI Library |
| Vite | ^6.3.0 | Build tool |
| TypeScript | ^5.8.0 | Type safety |
| React Router | ^7.5.0 | Client routing |
| TailwindCSS | ^4.1.0 | CSS framework |
| Zustand | ^5.0.0 | Global state |
| TanStack Query | ^5.75.0 | Server state / caching |
| React Hook Form | ^7.55.0 | Form management |
| Zod | ^3.24.0 | Schema validation |
| Axios | ^1.8.0 | HTTP client |
| Lucide React | latest | Icon library |

## Fonts (Google Fonts)

| Font | Vai trò |
|:-----|:--------|
| Playfair Display | Headlines, serif, editorial |
| Inter | Body text, UI, sans-serif |

## DevOps & Tools

| Công nghệ | Version | Vai trò |
|:-----------|:--------|:--------|
| Docker | 29.2.1 | Containerization |
| Docker Compose | v5.0.2 | Multi-container orchestration |
| Git | latest | Version control |

## Third-party Services

| Service | Vai trò | Môi trường |
|:--------|:--------|:-----------|
| Cloudinary | Image storage & CDN | Production (free tier) |
| VNPay Sandbox | Payment gateway | Sandbox (test) |
| Gmail SMTP / Mailtrap | Email service | Dev (Mailtrap) / Prod (Gmail) |
