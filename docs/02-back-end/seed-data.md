# 🌱 Seed Data

> Dữ liệu khởi tạo cho development/testing.

---

## Chạy Seed

```bash
cd backend
node seeders/seed.js
```

## 1. Roles

```javascript
[
  { name: "admin", description: "Quản trị viên" },
  { name: "customer", description: "Khách hàng" }
]
```

## 2. Admin User

```javascript
{
  username: "admin",
  email: "admin@luxurywatch.vn",
  password: "admin123",    // bcrypt hash auto
  fullName: "Administrator",
  status: true,
  role: <admin_role_id>
}
```

## 3. Categories (Brands) — 8 thương hiệu

```javascript
[
  { name: "Rolex", slug: "rolex", description: "Thương hiệu Thuỵ Sĩ xa xỉ" },
  { name: "Omega", slug: "omega", description: "Thương hiệu Thuỵ Sĩ cao cấp" },
  { name: "Casio", slug: "casio", description: "Thương hiệu Nhật Bản đa dạng" },
  { name: "Seiko", slug: "seiko", description: "Thương hiệu Nhật Bản uy tín" },
  { name: "Citizen", slug: "citizen", description: "Thương hiệu Nhật Bản eco-drive" },
  { name: "Tissot", slug: "tissot", description: "Thương hiệu Thuỵ Sĩ tầm trung" },
  { name: "Longines", slug: "longines", description: "Thương hiệu Thuỵ Sĩ thanh lịch" },
  { name: "TAG Heuer", slug: "tag-heuer", description: "Thương hiệu Thuỵ Sĩ thể thao" },
]
```

## 4. Collections — 4 bộ sưu tập

```javascript
[
  { name: "Classic Gold", slug: "classic-gold", description: "Bộ sưu tập vàng cổ điển" },
  { name: "Sport Series", slug: "sport-series", description: "Dòng thể thao năng động" },
  { name: "Dress Collection", slug: "dress-collection", description: "Đồng hồ lịch lãm" },
  { name: "Diver's Edition", slug: "divers-edition", description: "Dòng lặn chuyên nghiệp" },
]
```

## 5. Sample Products — 10-15 watches

Ví dụ:
```javascript
{
  title: "Rolex Submariner Date 41mm",
  sku: "ROL-SUB-001",
  slug: "rolex-submariner-date-41mm",
  price: 250000000,
  originalPrice: 270000000,
  discountPercent: 7,
  category: <rolex_id>,
  collection: <divers_id>,
  gender: "male",
  movement: "automatic",
  strapMaterial: "steel",
  caseSize: 41,
  waterResistance: 30,
  origin: "Thuỵ Sĩ",
  warranty: 60,
  isFeatured: true,
  images: ["cloudinary_url_1", "cloudinary_url_2"],
}
```

## 6. Auto-create Inventories

Khi seed products → auto tạo inventory cho mỗi product:
```javascript
{ product: <product_id>, stock: 10, reserved: 0, soldCount: 0 }
```

## Thứ tự Seed

```
1. Roles         (admin, customer)
2. Admin user    (depends on Roles)
3. Categories    (8 brands)
4. Collections   (4 BST)
5. Products      (10-15 watches, depends on Categories + Collections)
6. Inventories   (auto from Products)
7. Sample coupons (optional)
```
