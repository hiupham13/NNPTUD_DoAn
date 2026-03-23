---
name: mongodb_expert
description: Database Engineer — Thiết kế schema Mongoose, indexing, aggregation pipeline, data modeling cho MongoDB.
---

# 🗄️ MongoDB Expert — E-Commerce NNPTUD

## 1. VAI TRÒ
- Thiết kế MongoDB Schema (Mongoose ODM).
- Data modeling cho e-commerce (embedding vs referencing).
- Indexing strategy cho performance.
- Aggregation pipeline cho báo cáo, thống kê.
- Data migration & seeding.

## 2. TECH STACK
| Thành phần | Version | Ghi chú |
|:-----------|:--------|:--------|
| MongoDB | **8.0.5** | Local: v8.0.5, Docker: mongo:8 |
| Mongoose | **^9.1.5** | Giữ nguyên GV, tương thích MongoDB 8 |
| MongoDB Node Driver | **6.x** (auto by Mongoose) | Hỗ trợ MongoDB 6.0 — 8.x |
| Database Name | `nnptud-ecommerce` | |

## 3. SCHEMA DESIGN CONVENTIONS

### 3.1. Schema Template
```javascript
const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema(
  {
    // Required fields first
    name: {
      type: String,
      required: [true, 'Tên là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tên không quá 200 ký tự']
    },

    // Reference fields
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true
    },

    // Optional fields
    description: {
      type: String,
      default: ''
    },

    // Number with constraints
    price: {
      type: Number,
      required: true,
      min: [0, 'Giá không được âm']
    },

    // Array field
    tags: {
      type: [String],
      default: []
    },

    // Enum field
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active'
    },

    // Soft delete (BẮT BUỘC)
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true  // auto createdAt, updatedAt
  }
);

// Indexes
exampleSchema.index({ name: 1 });
exampleSchema.index({ category: 1, isDeleted: 1 });

module.exports = mongoose.model('example', exampleSchema);
```

### 3.2. Naming Conventions
| Element | Convention | Ví dụ |
|:--------|:-----------|:------|
| Collection name | singular, lowercase | `product`, `user`, `order` |
| Field name | camelCase | `fullName`, `createdAt`, `isDeleted` |
| Reference field | singular noun | `category`, `user`, `product` |
| Array field | plural noun | `images`, `items`, `tags` |
| Boolean field | `is` prefix | `isDeleted`, `isActive`, `isPaid` |

### 3.3. Mandatory Fields (Mọi schema đều phải có)
```javascript
{
  isDeleted: { type: Boolean, default: false }
}
// + timestamps: true (auto createdAt, updatedAt)
```

## 4. DATA MODEL — E-COMMERCE

### 4.1. Entity Relationship
```
                  ┌──────────┐
                  │   Role   │
                  └────┬─────┘
                       │ 1:N
                  ┌────▼─────┐         ┌──────────┐
                  │   User   │────────►│  Review   │
                  └────┬─────┘   1:N   └──────────┘
                       │                     │
                       │ 1:N                 │ N:1
                  ┌────▼─────┐         ┌─────▼────┐
                  │  Order   │         │ Product   │◄────┐
                  └────┬─────┘         └─────┬────┘     │
                       │                     │           │
                       │ 1:N           1:1   │      N:1  │
                  ┌────▼─────────┐  ┌────────▼──┐  ┌────┴─────┐
                  │  OrderItem   │  │ Inventory  │  │ Category │
                  └──────────────┘  └───────────┘  └──────────┘
                  
   ┌──────────┐
   │   Cart   │ ──── 1:1 with User (embedded items)
   └──────────┘
   
   ┌──────────┐
   │ Payment  │ ──── 1:1 with Order
   └──────────┘
```

### 4.2. Schema Definitions

#### Users (Có sẵn - giữ nguyên)
```javascript
{
  username: String (unique, required),
  password: String (required, hashed),
  email: String (unique, required),
  fullName: String,
  avatarUrl: String,
  status: Boolean,
  role: ObjectId → Role,
  loginCount: Number,
  isDeleted: Boolean,
  forgotpasswordToken: String,
  forgotpasswordTokenExp: Date
}
```

#### Products (Có sẵn - giữ nguyên)
```javascript
{
  title: String (unique, required),
  sku: String (unique, required),
  slug: String (unique, required),
  description: String,
  price: Number,
  category: String,  // ⚠️ Nên chuyển thành ObjectId ref
  images: [String],
  isDeleted: Boolean
}
```

#### Categories (Cần tạo mới)
```javascript
{
  name: String (unique, required),
  slug: String (unique, required),
  description: String,
  image: String,
  parent: ObjectId → Category (self-ref, optional),
  isDeleted: Boolean
}
```

#### Orders (Cần tạo mới)
```javascript
{
  user: ObjectId → User (required),
  orderCode: String (unique, auto-gen),
  items: [{
    product: ObjectId → Product,
    title: String,       // snapshot at order time
    price: Number,       // snapshot at order time
    quantity: Number,
    subtotal: Number
  }],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    district: String,
    ward: String
  },
  paymentMethod: String (enum: ['cod', 'banking', 'vnpay']),
  status: String (enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled', 'returned']),
  totalAmount: Number,
  shippingFee: Number,
  discount: Number,
  finalAmount: Number,
  note: String,
  cancelReason: String,
  isPaid: Boolean,
  paidAt: Date,
  deliveredAt: Date,
  isDeleted: Boolean
}
```

#### Reviews (Cần tạo mới)
```javascript
{
  user: ObjectId → User (required),
  product: ObjectId → Product (required),
  order: ObjectId → Order (required),
  rating: Number (1-5, required),
  comment: String,
  images: [String],
  isDeleted: Boolean
}
```

## 5. INDEXING STRATEGY

### 5.1. Index Types
| Type | Khi nào dùng | Ví dụ |
|:-----|:------------|:------|
| Single field | Filter/sort trên 1 field | `{ email: 1 }` |
| Compound | Filter trên nhiều fields | `{ category: 1, isDeleted: 1 }` |
| Text | Full-text search | `{ title: 'text', description: 'text' }` |
| Unique | Đảm bảo duy nhất | `{ sku: 1 }, { unique: true }` |

### 5.2. Recommended Indexes
```javascript
// Products
productSchema.index({ category: 1, isDeleted: 1 });
productSchema.index({ price: 1 });
productSchema.index({ title: 'text', description: 'text' });

// Orders
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ orderCode: 1 }, { unique: true });
orderSchema.index({ createdAt: -1 });

// Reviews
reviewSchema.index({ product: 1, isDeleted: 1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // 1 review/product/user
```

## 6. AGGREGATION PATTERNS

### 6.1. Dashboard Statistics
```javascript
// Thống kê doanh thu theo tháng
Order.aggregate([
  { $match: { status: 'completed', isDeleted: false } },
  { $group: {
    _id: { $month: '$createdAt' },
    totalRevenue: { $sum: '$finalAmount' },
    orderCount: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
]);
```

### 6.2. Product with Average Rating
```javascript
Product.aggregate([
  { $match: { isDeleted: false } },
  { $lookup: {
    from: 'reviews',
    localField: '_id',
    foreignField: 'product',
    as: 'reviews'
  }},
  { $addFields: {
    avgRating: { $avg: '$reviews.rating' },
    reviewCount: { $size: '$reviews' }
  }}
]);
```

## 7. BEST PRACTICES

1. **Embedding vs Referencing**: Embed khi data nhỏ, ít thay đổi, luôn truy vấn cùng. Reference khi data lớn, thay đổi thường xuyên.
2. **Soft Delete**: KHÔNG dùng `deleteOne()`. Set `isDeleted: true`.
3. **Timestamps**: Luôn enable `{ timestamps: true }`.
4. **Validation**: Validate trong schema (Mongoose validators).
5. **Pre-save hooks**: Dùng cho password hashing, slug generation.
6. **Population**: Dùng `populate()` có chọn lọc fields (`select`).
7. **Lean queries**: Dùng `.lean()` khi chỉ cần đọc data (performance).
