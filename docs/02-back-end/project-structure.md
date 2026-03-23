# 📂 Backend Project Structure

> Cấu trúc thư mục backend (Express.js).

---

```
backend/
├── app.js                          # Entry point, middleware, routes
├── package.json
├── .env                            # Environment variables
├── .env.example
│
├── config/
│   ├── database.js                 # MongoDB connection (Mongoose)
│   ├── cloudinary.js               # Cloudinary SDK config
│   └── cors.js                     # CORS whitelist config
│
├── schemas/                        # Mongoose Schemas (GV + mở rộng)
│   ├── users.js                    # ✅ GV
│   ├── roles.js                    # ✅ GV
│   ├── products.js                 # ✅ GV + watch fields
│   ├── cart.js                     # ✅ GV
│   ├── inventories.js              # ✅ GV (fix timestamps)
│   ├── payments.js                 # ✅ GV + VNPay fields
│   ├── reservations.js             # ✅ GV (không dùng)
│   ├── categories.js               # 🆕 Brands
│   ├── collections.js              # 🆕 BST
│   ├── orders.js                   # 🆕 (thay reservations)
│   └── coupons.js                  # 🆕 Mã giảm giá
│
├── routes/
│   ├── index.js                    # Route aggregator
│   ├── auth.routes.js
│   ├── users.routes.js
│   ├── categories.routes.js
│   ├── collections.routes.js
│   ├── products.routes.js
│   ├── cart.routes.js
│   ├── orders.routes.js
│   ├── payments.routes.js
│   ├── coupons.routes.js
│   ├── upload.routes.js
│   └── dashboard.routes.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── users.controller.js
│   ├── categories.controller.js
│   ├── collections.controller.js
│   ├── products.controller.js
│   ├── cart.controller.js
│   ├── orders.controller.js
│   ├── payments.controller.js
│   ├── coupons.controller.js
│   ├── upload.controller.js
│   └── dashboard.controller.js
│
├── middlewares/
│   ├── auth.js                     # JWT verify → req.user
│   ├── role.js                     # authorize('admin')
│   ├── validate.js                 # express-validator runner
│   ├── errorHandler.js             # Centralized error handler
│   └── upload.js                   # Multer config (memory storage)
│
├── utils/
│   ├── AppError.js                 # Custom error class
│   ├── generateOrderCode.js        # ORD-YYYYMMDD-XXXX
│   ├── sendEmail.js                # Nodemailer helper
│   └── vnpay.js                    # VNPay helpers (createURL, verify)
│
└── seeders/
    └── seed.js                     # Seed: roles, categories, collections, products, admin
```
