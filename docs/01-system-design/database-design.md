# 🗄️ Database Design — Luxury Watch Store

> Thiết kế MongoDB Schema cho hệ thống E-Commerce bán đồng hồ cao cấp.
> Sử dụng Mongoose ODM ^9.1.5 trên MongoDB 8.0.5.

---

## 1. TỔNG QUAN SCHEMAS

### Schema có sẵn (GV cung cấp) — Giữ nguyên & MỞ RỘNG:
| # | Schema | Model Name | File | Ghi chú |
|:--|:-------|:-----------|:-----|:--------|
| 1 | `users` | `user` | ✅ Có sẵn | Thêm fields cho forgot password |
| 2 | `roles` | `role` | ✅ Có sẵn | Giữ nguyên |
| 3 | `products` | `product` | ✅ Có sẵn | **MỞ RỘNG nhiều**: thêm watch fields, refs |
| 4 | `cart` | `cart` | ✅ Có sẵn | Giữ nguyên structure |
| 5 | `inventories` | `inventory` | ✅ Có sẵn | Giữ nguyên |
| 6 | `payments` | `Payment` | ✅ Có sẵn | Sửa ref → order, thêm VNPay fields |
| 7 | `reservations` | `reservation` | ✅ Có sẵn | Không dùng (thay bằng orders) |

### Schema cần TẠO MỚI:
| # | Schema | Model Name | File | Mô tả |
|:--|:-------|:-----------|:-----|:------|
| 8 | `categories` | `category` | 🆕 Tạo mới | Thương hiệu đồng hồ |
| 9 | `collections` | `collection` | 🆕 Tạo mới | Bộ sưu tập |
| 10 | `orders` | `order` | 🆕 Tạo mới | Đơn hàng (thay reservations) |
| 11 | `coupons` | `coupon` | 🆕 Tạo mới | Mã giảm giá |

---

## 2. ER DIAGRAM — QUAN HỆ GIỮA CÁC MODELS

```
                    ┌──────────────┐
                    │    Roles     │
                    │──────────────│
                    │ _id          │
                    │ name         │
                    │ description  │
                    └──────┬───────┘
                           │ 1
                           │
                           │ N
                    ┌──────┴───────┐
                    │    Users     │
                    │──────────────│
                    │ _id          │
                    │ username     │
                    │ email        │
                    │ password     │    ┌──────────────┐
                    │ role ────────│───→│   Roles      │
                    │ status       │    └──────────────┘
                    │ resetToken   │
                    └──┬───┬───┬──┘
                       │   │   │
          ┌────────────┘   │   └────────────┐
          │ 1              │ 1              │ 1
          │                │                │
          │ 1              │ N              │ N
   ┌──────┴──────┐  ┌─────┴──────┐  ┌─────┴──────┐
   │    Cart     │  │   Orders   │  │  Payments  │
   │─────────────│  │────────────│  │────────────│
   │ user ───────│  │ user ──────│  │ order ─────│→ Orders
   │ items[]     │  │ orderCode  │  │ user ──────│→ Users
   │  ├ product─→│  │ items[]    │  │ method     │
   │  └ quantity │  │ shipping   │  │ amount     │
   └─────────────┘  │ coupon ────│  │ vnpayData  │
                    │ shippingFee│  │ status     │
                    │ discount   │  └────────────┘
                    │ totalAmount│
                    │ finalAmount│
                    │ payMethod  │
                    │ isPaid     │
                    │ status     │
                    └─────┬──────┘
                          │
                          │ items[].product
                          ▼
   ┌──────────────┐  ┌────────────────────┐  ┌──────────────┐
   │  Categories  │  │     Products       │  │  Collections │
   │  (Brands)    │  │    (Watches)       │  │──────────────│
   │──────────────│  │────────────────────│  │ name         │
   │ name         │  │ title              │  │ slug         │
   │ slug         │  │ sku, slug          │  │ description  │
   │ image        │  │ price              │  │ image        │
   │ description  │  │ originalPrice      │  │ isActive     │
   └──────┬───────┘  │ discountPercent    │  └──────┬───────┘
          │          │ category ──────────│──→ Categories
          │          │ collection ────────│──→ Collections
          │          │ images[] (Cloudinary)│
          └──────────│ movement, gender   │──────────┘
                     │ strapMaterial      │
                     │ caseSize, origin   │
                     │ waterResistance    │
                     └─────────┬──────────┘
                               │ 1
                               │
                               │ 1
                     ┌─────────┴──────────┐
                     │   Inventories      │
                     │────────────────────│
                     │ product ───────────│→ Products
                     │ stock              │
                     │ reserved           │
                     │ soldCount          │
                     └────────────────────┘

   ┌──────────────┐
   │   Coupons    │
   │──────────────│
   │ code         │
   │ discountType │  (percent / fixed)
   │ discountValue│
   │ minOrderAmount│
   │ maxUses      │
   │ usedCount    │
   │ expiresAt    │
   │ isActive     │
   └──────────────┘
```

---

## 3. CHI TIẾT TỪNG SCHEMA

### 3.1. Users (Có sẵn — MỞ RỘNG)

```javascript
// backend/schemas/users.js — GỐC GV + fields bổ sung
{
  username:              { type: String, required, unique },          // ✅ GV
  password:              { type: String, required },                  // ✅ GV (bcrypt hash)
  email:                 { type: String, required, unique, lowercase }, // ✅ GV
  fullName:              { type: String, default: "" },               // ✅ GV
  avatarUrl:             { type: String, default: "..." },            // ✅ GV
  status:                { type: Boolean, default: false },           // ✅ GV (true=active)
  role:                  { ref: "role", required },                   // ✅ GV
  loginCount:            { type: Number, default: 0 },                // ✅ GV
  isDeleted:             { type: Boolean, default: false },           // ✅ GV
  forgotpasswordToken:   String,                                      // ✅ GV
  forgotpasswordTokenExp: Date,                                       // ✅ GV
  // --- BỔ SUNG (nếu cần) ---
  phone:                 { type: String, default: "" },               // 🆕 SĐT
  address:               { type: String, default: "" },               // 🆕 Địa chỉ mặc định
}
// timestamps: true → createdAt, updatedAt
// Index: { username: 1, email: 1 }
// Pre-save: bcrypt hash password
```

**Quan hệ:**
- `role` → `Roles._id` (N:1)

**Ràng buộc:**
- `username`: unique, required
- `email`: unique, required, lowercase, regex validate
- `password`: required, bcrypt hash trước khi save
- `role`: required, phải tồn tại trong collection Roles

---

### 3.2. Roles (Có sẵn — GIỮ NGUYÊN)

```javascript
// backend/schemas/roles.js — GỐC GV
{
  name:        { type: String, required, unique },     // "admin" | "customer"
  description: { type: String, default: "" },
  isDeleted:   { type: Boolean, default: false },
}
// timestamps: true
```

**Seed Data:**
```javascript
[
  { name: "admin", description: "Quản trị viên" },
  { name: "customer", description: "Khách hàng" }
]
```

---

### 3.3. Categories — Thương hiệu (TẠO MỚI)

```javascript
// backend/schemas/categories.js — 🆕
{
  name:        { type: String, required, unique, trim, maxlength: 100 },
  slug:        { type: String, required, unique, lowercase },
  image:       { type: String, default: "" },          // Cloudinary URL
  description: { type: String, default: "" },
  isDeleted:   { type: Boolean, default: false },
}
// timestamps: true
// Index: { slug: 1 }, { name: 1 }
```

**Ràng buộc:**
- `name`: unique (không 2 brand trùng tên)
- `slug`: unique, auto-gen từ name (slugify)

**Seed Data:**
```javascript
[
  { name: "Rolex", slug: "rolex" },
  { name: "Omega", slug: "omega" },
  { name: "Casio", slug: "casio" },
  { name: "Seiko", slug: "seiko" },
  { name: "Citizen", slug: "citizen" },
  { name: "Tissot", slug: "tissot" },
  { name: "Longines", slug: "longines" },
  { name: "TAG Heuer", slug: "tag-heuer" },
]
```

---

### 3.4. Collections — Bộ sưu tập (TẠO MỚI)

```javascript
// backend/schemas/collections.js — 🆕
{
  name:        { type: String, required, unique, trim, maxlength: 100 },
  slug:        { type: String, required, unique, lowercase },
  description: { type: String, default: "" },
  image:       { type: String, default: "" },          // Cloudinary URL
  isActive:    { type: Boolean, default: true },
  isDeleted:   { type: Boolean, default: false },
}
// timestamps: true
// Index: { slug: 1 }, { isActive: 1 }
```

**Seed Data:**
```javascript
[
  { name: "Classic Gold", slug: "classic-gold" },
  { name: "Sport Series", slug: "sport-series" },
  { name: "Dress Collection", slug: "dress-collection" },
  { name: "Diver's Edition", slug: "divers-edition" },
]
```

---

### 3.5. Products — Đồng hồ (Có sẵn — MỞ RỘNG NHIỀU)

```javascript
// backend/schemas/products.js — GỐC GV + NHIỀU fields watch mới
{
  // --- GỐC GV (giữ nguyên) ---
  title:       { type: String, required, unique },
  sku:         { type: String, required, unique },
  slug:        { type: String, required, unique },
  description: { type: String, default: "" },
  price:       { type: Number, default: 0 },           // Giá bán hiện tại (VNĐ)
  images:      { type: [String], default: [] },         // Cloudinary URLs
  isDeleted:   { type: Boolean, default: false },

  // --- BỔ SUNG: References ---
  category:    { type: ObjectId, ref: "category", required },   // 🔄 Đổi từ String → ObjectId
  collection:  { type: ObjectId, ref: "collection", default: null },  // 🆕

  // --- BỔ SUNG: Pricing ---
  originalPrice:   { type: Number, default: 0 },       // 🆕 Giá gốc
  discountPercent: { type: Number, default: 0, min: 0, max: 100 }, // 🆕 % giảm giá

  // --- BỔ SUNG: Watch-specific fields ---
  movement:         { type: String, enum: ["automatic", "quartz", "mechanical", "solar", "eco-drive"], default: "quartz" },
  gender:           { type: String, enum: ["male", "female", "unisex"], default: "unisex" },
  strapMaterial:    { type: String, enum: ["leather", "steel", "titanium", "silicone", "ceramic", "nato", "rubber"], default: "steel" },
  caseSize:         { type: Number, default: 40 },      // mm
  waterResistance:  { type: Number, default: 3 },       // ATM
  origin:           { type: String, default: "" },      // Xuất xứ
  warranty:         { type: Number, default: 12 },      // Tháng bảo hành

  // --- BỔ SUNG: Status ---
  isFeatured: { type: Boolean, default: false },        // 🆕 Nổi bật
  isNew:      { type: Boolean, default: true },         // 🆕 Hàng mới
}
// timestamps: true
```

**Indexes:**
```javascript
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ collection: 1 });
productSchema.index({ price: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ movement: 1 });
productSchema.index({ isDeleted: 1 });
productSchema.index({ title: 'text', description: 'text' }); // Text search
```

**Quan hệ:**
- `category` → `Categories._id` (N:1) — Mỗi watch thuộc 1 brand
- `collection` → `Collections._id` (N:1) — Mỗi watch có thể thuộc 1 bộ sưu tập

**Ràng buộc:**
- `title`, `sku`, `slug`: unique
- `category`: required, phải tồn tại
- `price`: ≥ 0
- `discountPercent`: 0-100
- `caseSize`: mm, hợp lý (20-60mm)
- `waterResistance`: ATM, ≥ 0

**Virtual (tính toán):**
```javascript
productSchema.virtual('salePrice').get(function() {
  if (this.discountPercent > 0) {
    return Math.round(this.originalPrice * (1 - this.discountPercent / 100));
  }
  return this.price;
});
```

---

### 3.6. Cart (Có sẵn — GIỮ NGUYÊN)

```javascript
// backend/schemas/cart.js — GỐC GV
{
  user:  { type: ObjectId, ref: "user", unique, required },
  items: [{
    product:  { type: ObjectId, ref: "product" },
    quantity: { type: Number, min: 1, default: 1 }
  }]  // _id: false cho sub-document
}
```

**Quan hệ:**
- `user` → `Users._id` (1:1) — Mỗi user có 1 cart
- `items[].product` → `Products._id` (N:N thông qua embedded)

**Ràng buộc:**
- `user`: unique (1 user = 1 cart)
- `items[].quantity`: min 1
- Khi thêm product đã có → tăng quantity, không tạo item mới

---

### 3.7. Orders — Đơn hàng (TẠO MỚI)

> ⚠️ **NGUYÊN TẮC QUAN TRỌNG**: Order items lưu **FULL SNAPSHOT** toàn bộ thông tin sản phẩm
> tại thời điểm đặt hàng. Sau khi tạo order, dù Admin thay đổi giá, xoá product, sửa tên,
> đổi category → đơn hàng cũ **KHÔNG bị ảnh hưởng**.

```javascript
// backend/schemas/orders.js — 🆕 (thay thế reservations)

// ===== SUB-SCHEMA: Snapshot sản phẩm tại thời điểm đặt hàng =====
const orderItemSchema = new mongoose.Schema({
  // Reference (để truy vết, có thể null nếu product bị xoá)
  product:        { type: ObjectId, ref: "product", default: null },

  // ===== SNAPSHOT FIELDS (chụp lại từ Product) =====
  title:          { type: String, required },           // Tên đồng hồ
  sku:            { type: String, required },           // Mã SKU
  slug:           { type: String, default: "" },        // Slug (cho link)
  price:          { type: Number, required },           // Giá bán tại thời điểm mua
  originalPrice:  { type: Number, default: 0 },         // Giá gốc (nếu có giảm giá)
  discountPercent:{ type: Number, default: 0 },         // % giảm giá
  image:          { type: String, default: "" },        // Hình chính (1 hình)
  categoryName:   { type: String, default: "" },        // Tên thương hiệu: "Rolex"
  movement:       { type: String, default: "" },        // Loại máy: "automatic"
  gender:         { type: String, default: "" },        // Giới tính: "male"

  // ===== ORDER-SPECIFIC FIELDS =====
  quantity:       { type: Number, min: 1, required },
  subtotal:       { type: Number, required },           // price * quantity
}, { _id: false });

// ===== MAIN ORDER SCHEMA =====
const orderSchema = new mongoose.Schema({
  orderCode:    { type: String, required, unique },     // "ORD-20260323-XXXX"
  user:         { type: ObjectId, ref: "user", required },

  // Items (FULL SNAPSHOT)
  items:        { type: [orderItemSchema], required },

  // Shipping
  shippingAddress: {
    fullName:   { type: String, required },
    phone:      { type: String, required },
    address:    { type: String, required },
    city:       { type: String, default: "" },
    note:       { type: String, default: "" },
  },
  shippingFee:  { type: Number, default: 50000 },       // 50.000đ cố định

  // Coupon (snapshot)
  coupon:       { type: ObjectId, ref: "coupon", default: null },
  couponCode:   { type: String, default: "" },           // 🆕 Snapshot mã coupon
  discount:     { type: Number, default: 0 },            // Số tiền đã giảm

  // Pricing (tất cả tính SNAPSHOT)
  totalAmount:  { type: Number, required },              // Σ subtotals
  finalAmount:  { type: Number, required },              // totalAmount + shippingFee - discount

  // Payment
  paymentMethod: { type: String, enum: ["cod", "vnpay"], default: "cod" },
  isPaid:        { type: Boolean, default: false },
  paidAt:        { type: Date, default: null },

  // Status
  status: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipping",
           "delivered", "completed", "cancelled", "returned"],
    default: "pending"
  },

  cancelledAt:   { type: Date, default: null },
  cancelReason:  { type: String, default: "" },
  isDeleted:     { type: Boolean, default: false },
}, { timestamps: true });
```

**Indexes:**
```javascript
orderSchema.index({ orderCode: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ isPaid: 1 });
```

**Quan hệ:**
- `user` → `Users._id` (N:1)
- `items[].product` → `Products._id` (N:N) — **có thể null** nếu product bị xoá
- `coupon` → `Coupons._id` (N:1, optional)

**Ràng buộc:**
- `orderCode`: unique, auto-gen format `ORD-YYYYMMDD-XXXX`
- `items`: phải có ≥ 1 item
- `finalAmount` = `totalAmount` + `shippingFee` - `discount`
- `status` chỉ chuyển theo flow hợp lệ:
  - `pending` → `confirmed` | `cancelled`
  - `confirmed` → `processing` | `cancelled`
  - `processing` → `shipping`
  - `shipping` → `delivered`
  - `delivered` → `completed` | `returned`
- Cancel chỉ khi `pending` hoặc `confirmed`

**🔒 SNAPSHOT — Tại sao quan trọng?**
```
Ví dụ thực tế:
1. Khách mua "Rolex Submariner" giá 250.000.000₫ → Order snapshot giá 250tr
2. Sau đó Admin đổi giá lên 280.000.000₫
3. Order cũ vẫn hiển thị 250tr → ĐÚNG ✅
4. Admin soft-delete product "Rolex Submariner"
5. Order cũ vẫn hiển thị đầy đủ tên, giá, hình → ĐÚNG ✅
6. Admin xoá category "Rolex"
7. Order cũ vẫn hiển thị categoryName: "Rolex" → ĐÚNG ✅
```

---

### 3.8. Payments (Có sẵn — SỬA ĐỔI)

```javascript
// backend/schemas/payments.js — SỬA ĐỔI từ GV
{
  order:             { type: ObjectId, ref: "order", required },   // 🔄 Đổi từ reservation → order
  user:              { type: ObjectId, ref: "user", required },
  method:            { type: String, enum: ["cod", "vnpay"], required }, // 🔄 Sửa enum
  status:            { type: String, enum: ["pending", "paid", "failed", "cancelled", "refunded"], default: "pending" },
  amount:            { type: Number, required, min: 0 },
  currency:          { type: String, default: "VND" },

  // VNPay specific
  vnpayTxnRef:       { type: String, default: "" },               // 🆕 Mã giao dịch VNPay
  vnpayTransactionNo: { type: String, default: "" },              // 🆕 Mã giao dịch VNPay trả về
  vnpayBankCode:     { type: String, default: "" },               // 🆕 Ngân hàng
  vnpayCardType:     { type: String, default: "" },               // 🆕 Loại thẻ
  vnpayResponseCode: { type: String, default: "" },               // 🆕 Mã response
  providerResponse:  { type: mongoose.Schema.Types.Mixed, default: null },

  paidAt:            { type: Date, default: null },
  failedAt:          { type: Date, default: null },
  cancelledAt:       { type: Date, default: null },
  refundedAt:        { type: Date, default: null },
  note:              { type: String, default: "" },
}
// timestamps: true
```

**Quan hệ:**
- `order` → `Orders._id` (N:1) — Mỗi order có thể nhiều payment attempts
- `user` → `Users._id` (N:1)

**Indexes:**
```javascript
paymentSchema.index({ order: 1 });
paymentSchema.index({ vnpayTxnRef: 1 });
paymentSchema.index({ status: 1 });
```

---

### 3.9. Inventories (Có sẵn — GIỮ NGUYÊN)

```javascript
// backend/schemas/inventories.js — GỐC GV
{
  product:  { type: ObjectId, ref: "product", required, unique },
  stock:    { type: Number, min: 0, default: 0 },       // Tồn kho
  reserved: { type: Number, min: 0, default: 0 },       // Đang giữ (chờ thanh toán)
  soldCount: { type: Number, min: 0, default: 0 },      // Đã bán
}
// timestamps: true (⚠️ GV ghi sai: timestamp → cần sửa thành timestamps)
```

**Quan hệ:**
- `product` → `Products._id` (1:1) — Mỗi product có 1 inventory record

**Ràng buộc:**
- `product`: unique (1 product = 1 inventory)
- `stock` ≥ 0
- Available = `stock` - `reserved`
- Khi đặt hàng: `reserved += quantity`, `stock -= quantity`
- Khi hoàn thành: `reserved -= quantity`, `soldCount += quantity`
- Khi huỷ: `reserved -= quantity`, `stock += quantity`

---

### 3.10. Coupons — Mã giảm giá (TẠO MỚI)

```javascript
// backend/schemas/coupons.js — 🆕
{
  code:           { type: String, required, unique, uppercase, trim },  // "SUMMER2026"
  discountType:   { type: String, enum: ["percent", "fixed"], required }, // % hoặc VNĐ
  discountValue:  { type: Number, required, min: 0 },                   // 10 (%) hoặc 50000 (VNĐ)
  minOrderAmount: { type: Number, default: 0 },                         // Giá trị đơn tối thiểu
  maxDiscount:    { type: Number, default: null },                       // Giảm tối đa (cho %)
  maxUses:        { type: Number, default: null },                       // Số lần sử dụng tối đa
  usedCount:      { type: Number, default: 0, min: 0 },                 // Đã sử dụng
  expiresAt:      { type: Date, required },                              // Hết hạn
  isActive:       { type: Boolean, default: true },
  isDeleted:      { type: Boolean, default: false },
}
// timestamps: true
```

**Indexes:**
```javascript
couponSchema.index({ code: 1 });
couponSchema.index({ expiresAt: 1 });
couponSchema.index({ isActive: 1 });
```

**Ràng buộc:**
- `code`: unique, uppercase
- Nếu `discountType` = "percent": `discountValue` ≤ 100
- `expiresAt` > hiện tại (khi tạo)
- `usedCount` < `maxUses` (khi áp dụng)
- `minOrderAmount` kiểm tra khi checkout

**Logic áp dụng:**
```javascript
function calculateDiscount(coupon, orderTotal) {
  if (orderTotal < coupon.minOrderAmount) throw Error("Đơn hàng chưa đủ giá trị tối thiểu");
  if (coupon.usedCount >= coupon.maxUses) throw Error("Mã đã hết lượt sử dụng");
  if (coupon.expiresAt < new Date()) throw Error("Mã đã hết hạn");

  let discount = 0;
  if (coupon.discountType === "percent") {
    discount = Math.round(orderTotal * coupon.discountValue / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }
  return Math.min(discount, orderTotal); // Không giảm quá tổng đơn
}
```

---

## 4. BẢNG TỔNG HỢP QUAN HỆ

| Từ | → Đến | Loại | Trường | Mô tả |
|:---|:------|:-----|:-------|:------|
| Users | → Roles | N:1 | `user.role` | Mỗi user 1 role |
| Cart | → Users | 1:1 | `cart.user` (unique) | Mỗi user 1 cart |
| Cart.items | → Products | N:N | `cart.items[].product` | Nhiều SP trong giỏ |
| Orders | → Users | N:1 | `order.user` | Mỗi user nhiều đơn |
| Orders.items | → Products | N:N | `order.items[].product` | Nhiều SP trong đơn |
| Orders | → Coupons | N:1 | `order.coupon` (optional) | Đơn có thể dùng coupon |
| Payments | → Orders | N:1 | `payment.order` | Nhiều payment attempts/1 order |
| Payments | → Users | N:1 | `payment.user` | Tracking user |
| Products | → Categories | N:1 | `product.category` | Mỗi watch 1 brand |
| Products | → Collections | N:1 | `product.collection` (optional) | Mỗi watch có thể thuộc 1 BST |
| Inventories | → Products | 1:1 | `inventory.product` (unique) | Mỗi product 1 inventory |

---

## 5. INDEXING STRATEGY

### Compound Indexes
```javascript
// Products — Filter query phổ biến
{ category: 1, gender: 1, price: 1, isDeleted: 1 }
{ collection: 1, isDeleted: 1 }
{ isFeatured: 1, isDeleted: 1 }

// Orders — Admin dashboard
{ user: 1, status: 1, createdAt: -1 }
{ status: 1, createdAt: -1 }

// Payments — VNPay lookup
{ vnpayTxnRef: 1 }
{ order: 1, status: 1 }
```

### Text Index
```javascript
// Products — Search
{ title: "text", description: "text" }
```

---

## 6. DATA FLOW — LUỒNG DỮ LIỆU

### Đặt hàng (Checkout)
```
1. Validate Cart (cart.items.length > 0)
2. Validate từng product:
   a. Product tồn tại? (isDeleted === false)
   b. Nếu product đã bị xoá → Loại khỏi cart + thông báo
3. Validate Inventory (stock >= quantity cho mỗi item)
   a. Nếu hết hàng → Thông báo "Sản phẩm đã hết hàng"
4. Validate Coupon (nếu có: hạn, lượt, minOrder)
5. ⚡ SNAPSHOT: Chụp toàn bộ thông tin product vào order.items[]
   a. title, sku, slug, price, originalPrice, discountPercent
   b. image (hình đầu tiên), categoryName, movement, gender
6. Tính toán: totalAmount, shippingFee, discount, finalAmount
7. Create Order (lưu snapshot)
8. Update Inventory (stock -= qty, reserved += qty)
9. Apply Coupon (usedCount += 1)
10. Clear Cart (cart.items = [])
11. If VNPay: Create Payment record → Redirect
12. If COD: Payment pending, order status = pending
```

### Cancel Order
```
1. Validate status (chỉ pending/confirmed)
2. Update Order status = cancelled, cancelledAt = now
3. Restore Inventory (stock += qty, reserved -= qty)
4. If coupon used: usedCount -= 1
5. If VNPay paid: Ghi nhận cần refund (manual/admin)
```

### VNPay Return
```
1. Verify hash (HMAC-SHA512)
2. Find Payment by vnpayTxnRef
3. Update Payment status = paid/failed
4. If paid: Update Order (isPaid=true, paidAt=now)
5. If paid: Update Inventory (reserved -= qty, soldCount += qty)
```

---

## 7. ⚠️ EDGE CASES & BUSINESS RULES

### 7.1. DELETE PROTECTION — Chống xoá dữ liệu liên kết

| # | Tình huống | Hệ thống xử lý | Rule |
|:--|:-----------|:---------------|:-----|
| EC-01 | Xoá Category có products active | ❌ **CHẶN** — "Danh mục đang có N sản phẩm, không thể xoá" | Check `Products.find({ category: id, isDeleted: false })` |
| EC-02 | Xoá Collection có products | ✅ Cho xoá (soft) — Products chỉ mất ref collection, không hỏng | Set `Products.collection = null` cho các SP thuộc collection |
| EC-03 | Xoá Product đang trong Cart | ✅ Cho xoá (soft) — Cart tự lọc products bị xoá khi hiển thị | Khi GET cart → populate → filter `isDeleted: false` → nếu có SP xoá, hiện "SP không còn tồn tại" |
| EC-04 | Xoá Product đang trong Order active | ✅ Cho xoá (soft) — Order đã có SNAPSHOT | Order items lưu snapshot → không phụ thuộc product gốc |
| EC-05 | Xoá Product có Inventory | ✅ Cho xoá (soft) — Inventory giữ nguyên record | Inventory vẫn tồn tại nhưng product.isDeleted = true |
| EC-06 | Xoá Role đang có users | ❌ **CHẶN** — Không cho xoá role có users active | Check `Users.find({ role: id, isDeleted: false })` |
| EC-07 | Xoá User có Cart | ✅ Cho soft-delete — Cart trở thành orphan | Không cần xoá cart, user bị khoá thì cart vô nghĩa |
| EC-08 | Xoá User có Orders | ✅ Cho soft-delete — Orders giữ nguyên (có snapshot) | Admin vẫn xem được order history |
| EC-09 | Xoá Coupon đang dùng trong Order | ✅ Cho xoá (soft) — Order đã snapshot `couponCode` và `discount` | Coupon bị xoá → không ảnh hưởng orders cũ |

### 7.2. PRICE & PRODUCT CHANGE PROTECTION

| # | Tình huống | Hệ thống xử lý | Rule |
|:--|:-----------|:---------------|:-----|
| EC-10 | Admin đổi giá product SAU khi đặt hàng | ✅ Order **không bị ảnh hưởng** | Order items lưu SNAPSHOT `price` tại thời điểm checkout |
| EC-11 | Admin đổi tên product SAU khi đặt hàng | ✅ Order **không bị ảnh hưởng** | Snapshot `title` tại thời điểm checkout |
| EC-12 | Admin đổi hình product SAU khi đặt hàng | ✅ Order **không bị ảnh hưởng** | Snapshot `image` (hình đầu tiên) tại thời điểm checkout |
| EC-13 | Admin đổi category (brand) của product | ✅ Order **không bị ảnh hưởng** | Snapshot `categoryName` tại thời điểm checkout |
| EC-14 | Admin đổi giá product KHI ở trong Cart | ⚠️ Cart hiển thị giá **MỚI** (giá hiện tại) | Cart chỉ lưu productId + quantity, giá tính real-time từ product |
| EC-15 | Giá product thay đổi giữa lúc Add Cart → Checkout | ⚠️ **Checkout tính theo giá hiện tại** | Snapshot chụp tại thời điểm CREATE ORDER, không phải lúc add cart |

### 7.3. CART EDGE CASES

| # | Tình huống | Hệ thống xử lý |
|:--|:-----------|:---------------|
| EC-16 | Thêm SP đã có trong cart | Tăng quantity (KHÔNG tạo item mới) |
| EC-17 | Thêm SP đã bị xoá (isDeleted=true) | ❌ Chặn: "Sản phẩm không tồn tại" |
| EC-18 | Thêm SP hết hàng (stock=0) | ❌ Chặn: "Sản phẩm đã hết hàng" |
| EC-19 | Cart có SP, sau đó SP hết hàng | ⚠️ Checkout validate: báo lỗi "SP đã hết hàng, vui lòng xoá" |
| EC-20 | Cart qty > stock available | ⚠️ Checkout validate: "Chỉ còn N sản phẩm" |
| EC-21 | Quantity = 0 | Auto xoá item khỏi cart |
| EC-22 | Cart trống khi checkout | ❌ Chặn: "Giỏ hàng trống" |

### 7.4. ORDER STATUS EDGE CASES

| # | Tình huống | Hệ thống xử lý |
|:--|:-----------|:---------------|
| EC-23 | Customer huỷ đơn đã `processing` | ❌ Chặn: Chỉ huỷ khi `pending` hoặc `confirmed` |
| EC-24 | Admin chuyển status ngược (confirmed → pending) | ❌ Chặn: Status chỉ đi tiến, không đi lùi |
| EC-25 | Đơn VNPay chưa paid nhưng Admin confirm | ⚠️ Cho phép: Admin có quyền override |
| EC-26 | Đơn COD → delivered → completed | isPaid = true khi `completed` (khách đã trả tiền khi nhận) |
| EC-27 | Đơn cancelled → hoàn kho | Auto: stock += qty, reserved -= qty |
| EC-28 | Đơn returned → hoàn kho | Auto: stock += qty, soldCount -= qty |

### 7.5. INVENTORY EDGE CASES

| # | Tình huống | Hệ thống xử lý |
|:--|:-----------|:---------------|
| EC-29 | 2 khách mua cùng SP, chỉ còn 1 | Khách checkout sau → lỗi "Hết hàng" (first-come-first-served) |
| EC-30 | Stock = 0 nhưng reserved > 0 | Có đơn đang xử lý, không cho đặt thêm |
| EC-31 | Admin tăng stock | Chỉ cập nhật `stock` field |
| EC-32 | Tạo product mới quên tạo inventory | Auto tạo inventory với stock=0 khi tạo product |

### 7.6. COUPON EDGE CASES

| # | Tình huống | Hệ thống xử lý |
|:--|:-----------|:---------------|
| EC-33 | Coupon hết hạn giữa lúc checkout | Validate tại thời điểm CREATE ORDER: "Mã đã hết hạn" |
| EC-34 | Coupon hết lượt giữa lúc checkout | Validate tại thời điểm CREATE ORDER: "Mã đã hết lượt" |
| EC-35 | Đơn min 500k, áp coupon, sau xoá SP → < 500k | Validate tại checkout, không cho áp |
| EC-36 | Huỷ đơn → coupon usedCount | Auto: usedCount -= 1 (trả lại lượt dùng) |
| EC-37 | Coupon giảm nhiều hơn tổng đơn | Giảm tối đa = totalAmount (finalAmount ≥ shippingFee) |

### 7.7. AUTHENTICATION & USER EDGE CASES

| # | Tình huống | Hệ thống xử lý |
|:--|:-----------|:---------------|
| EC-38 | User bị khoá (status=false) khi đang đặt hàng | Middleware check status → 403 Forbidden |
| EC-39 | Forgot password token hết hạn | Check `forgotpasswordTokenExp < now` → "Link hết hạn" |
| EC-40 | Gửi forgot password cho email không tồn tại | Không báo lỗi (bảo mật) → Vẫn trả "Đã gửi email" |
| EC-41 | Admin xoá chính mình | ❌ Chặn: Không cho admin tự xoá |

### 7.8. VNPAY EDGE CASES

| # | Tình huống | Hệ thống xử lý |
|:--|:-----------|:---------------|
| EC-42 | VNPay timeout (khách không thanh toán xong) | Payment status = failed, order status = pending |
| EC-43 | VNPay return nhưng IPN chưa gọi | Dùng return URL để update, IPN là backup |
| EC-44 | IPN gọi trùng (duplicate) | Check payment đã paid chưa → bỏ qua nếu đã paid |
| EC-45 | Giả mạo VNPay return (hash sai) | ❌ Chặn: Verify HMAC-SHA512 → reject |

---

## 8. SNAPSHOT STRATEGY — TỔNG HỢP

### Dữ liệu cần SNAPSHOT (chụp tại thời điểm tạo order):

```
Từ Product → Order.items[]:
├── title           (tên đồng hồ)
├── sku             (mã SKU)
├── slug            (cho link sản phẩm)
├── price           (giá bán hiện tại)
├── originalPrice   (giá gốc)
├── discountPercent (% giảm giá)
├── image           (hình đầu tiên từ images[])
├── categoryName    (tên brand, resolve từ category.name)
├── movement        (loại máy)
└── gender          (giới tính)

Từ Coupon → Order:
├── couponCode      (mã coupon)
└── discount        (số tiền đã giảm)
```

### Dữ liệu KHÔNG snapshot (tham chiếu trực tiếp):
```
Order.user       → Users._id    (user không đổi, dùng ref)
Order.items[].product → Products._id (giữ ref để truy vết, có thể null)
Order.coupon     → Coupons._id  (giữ ref để truy vết)
```

### Tại thời điểm nào snapshot?
```
Khi gọi POST /api/v1/orders (Create Order / Checkout)
→ Server đọc product hiện tại
→ Snapshot toàn bộ fields cần thiết
→ Lưu vào order.items[]
→ Sau đó product có thay đổi gì → order KHÔNG ảnh hưởng
```

---

## 9. LƯU Ý QUAN TRỌNG

### ⚠️ File GV cần sửa nhỏ:
| File | Vấn đề | Cần sửa |
|:-----|:-------|:--------|
| `products.js` | `category` là String | Đổi → ObjectId ref "category" |
| `products.js` | Thiếu watch fields | Thêm movement, gender, strapMaterial... |
| `payments.js` | ref `reservation` | Đổi → ref `order` |
| `payments.js` | enum có `momo`, `bank_transfer` | Đổi → `cod`, `vnpay` |
| `inventories.js` | `timestamp: true` (thiếu s) | Sửa → `timestamps: true` |

### ✅ Quy tắc chung:
1. Tất cả schemas đều có `timestamps: true` (createdAt, updatedAt)
2. Soft delete qua `isDeleted: Boolean` (không xoá thật)
3. Giá tiền luôn là Number (VNĐ, không chia 100)
4. Slug auto-generate từ title/name
5. Images lưu Cloudinary URLs (array of strings)
6. **Order items lưu FULL SNAPSHOT** — không phụ thuộc product hiện tại
7. **Cart KHÔNG snapshot** — luôn hiển thị giá real-time
8. **Delete protection** — chặn xoá entity có liên kết active

---

> 📖 **Tham chiếu**: Khi code → đọc `mongodb_expert` skill cho conventions chi tiết.
> ⚠️ **Không sửa file gốc GV** cho đến khi bắt tay vào code (Phase 2).
