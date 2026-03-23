---
name: mock_data_seeder
description: Data Seeder — Tạo dữ liệu giả lập Việt Nam (tên, địa chỉ, SĐT, sản phẩm, đơn hàng) cho dev/test.
---

# 🌱 Mock Data Seeder — E-Commerce NNPTUD

## 1. VAI TRÒ
- Tạo dữ liệu giả lập (mock/seed data) cho môi trường development và testing.
- Dữ liệu mang tính Việt Nam (tên người Việt, địa chỉ VN, SĐT VN, giá VNĐ).
- Hỗ trợ bulk insert với số lượng tuỳ chỉnh.
- Có thể chạy lại (idempotent — reset + seed).

## 2. TECH STACK
| Thành phần | Mục đích |
|:-----------|:---------|
| Node.js script | Chạy seed trực tiếp |
| Mongoose | Insert data vào MongoDB |
| faker-js/faker | Sinh dữ liệu ngẫu nhiên |
| slugify | Tạo slug từ tên |

## 3. CẤU TRÚC FILE SEEDER

```
backend/
└── seeders/
    ├── index.js            # Main seeder runner
    ├── data/
    │   ├── roles.data.js       # Dữ liệu roles
    │   ├── users.data.js       # Dữ liệu users
    │   ├── categories.data.js  # Dữ liệu categories
    │   ├── products.data.js    # Dữ liệu products
    │   ├── inventories.data.js # Dữ liệu inventories
    │   ├── orders.data.js      # Dữ liệu orders
    │   └── reviews.data.js     # Dữ liệu reviews
    └── helpers/
        ├── vietnamese.js       # Tên, địa chỉ Việt Nam
        └── generators.js       # Hàm sinh dữ liệu chung
```

## 4. DỮ LIỆU TIẾNG VIỆT

### 4.1. Họ Tên Người Việt
```javascript
// seeders/helpers/vietnamese.js

const hoViet = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Huỳnh', 'Hoàng', 'Phan', 'Vũ',
  'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý',
  'Đào', 'Đinh', 'Mai', 'Trương', 'Lưu', 'Tô', 'Châu', 'Tạ'
];

const tenDemNam = [
  'Văn', 'Hữu', 'Đức', 'Công', 'Quốc', 'Minh', 'Thanh',
  'Xuân', 'Đình', 'Ngọc', 'Trọng', 'Thành', 'Bảo', 'Quang'
];

const tenDemNu = [
  'Thị', 'Ngọc', 'Thanh', 'Thu', 'Minh', 'Phương', 'Bích',
  'Kim', 'Hoài', 'Diệu', 'Mỹ', 'Thuỳ', 'Hồng', 'Tuyết'
];

const tenNam = [
  'Hùng', 'Dũng', 'Mạnh', 'Tuấn', 'Kiên', 'Long', 'Phong',
  'Tùng', 'Đạt', 'Khải', 'Minh', 'Hải', 'Nam', 'Bình',
  'Quân', 'Thiện', 'Trí', 'Phúc', 'An', 'Khang'
];

const tenNu = [
  'Lan', 'Hương', 'Trang', 'Ngọc', 'Linh', 'Mai', 'Hà',
  'Anh', 'Thảo', 'Vy', 'Nhi', 'Tú', 'Yến', 'Hạnh',
  'Uyên', 'Dung', 'Trâm', 'Châu', 'Như', 'Trinh'
];

function generateVietnameseName(gender = 'male') {
  const ho = hoViet[Math.floor(Math.random() * hoViet.length)];
  const tenDem = gender === 'male'
    ? tenDemNam[Math.floor(Math.random() * tenDemNam.length)]
    : tenDemNu[Math.floor(Math.random() * tenDemNu.length)];
  const ten = gender === 'male'
    ? tenNam[Math.floor(Math.random() * tenNam.length)]
    : tenNu[Math.floor(Math.random() * tenNu.length)];
  return `${ho} ${tenDem} ${ten}`;
}
```

### 4.2. Địa Chỉ Việt Nam
```javascript
const diaChiVN = {
  cities: [
    { name: 'TP. Hồ Chí Minh', districts: ['Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Thủ Đức'] },
    { name: 'Hà Nội', districts: ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Đống Đa', 'Quận Cầu Giấy', 'Quận Thanh Xuân', 'Quận Hai Bà Trưng'] },
    { name: 'Đà Nẵng', districts: ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn'] },
    { name: 'Cần Thơ', districts: ['Quận Ninh Kiều', 'Quận Bình Thuỷ', 'Quận Cái Răng'] },
    { name: 'Hải Phòng', districts: ['Quận Hồng Bàng', 'Quận Lê Chân', 'Quận Ngô Quyền'] },
  ],
  streets: [
    'Nguyễn Huệ', 'Lê Lợi', 'Trần Hưng Đạo', 'Nguyễn Trãi', 'Lê Duẩn',
    'Võ Văn Tần', 'Pasteur', 'Hai Bà Trưng', 'Điện Biên Phủ', 'Nam Kỳ Khởi Nghĩa',
    'Cách Mạng Tháng 8', 'Lý Tự Trọng', 'Phạm Ngọc Thạch', 'Nguyễn Đình Chiểu',
    'Phan Xích Long', 'Hoàng Văn Thụ', 'Trường Chinh', 'Lạc Long Quân'
  ]
};

function generateAddress() {
  const city = diaChiVN.cities[Math.floor(Math.random() * diaChiVN.cities.length)];
  const district = city.districts[Math.floor(Math.random() * city.districts.length)];
  const street = diaChiVN.streets[Math.floor(Math.random() * diaChiVN.streets.length)];
  const number = Math.floor(Math.random() * 300) + 1;
  return {
    address: `${number} ${street}`,
    district,
    city: city.name,
    ward: `Phường ${Math.floor(Math.random() * 15) + 1}`,
    fullAddress: `${number} ${street}, ${district}, ${city.name}`
  };
}
```

### 4.3. Số Điện Thoại VN
```javascript
const prefixes = ['032', '033', '034', '035', '036', '037', '038', '039',
                  '056', '058', '070', '076', '077', '078', '079',
                  '081', '082', '083', '084', '085', '086', '088', '089',
                  '090', '091', '092', '093', '094', '096', '097', '098', '099'];

function generatePhoneVN() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${suffix}`;
}
```

### 4.4. Email từ Tên Việt
```javascript
const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

function generateEmailFromName(fullName) {
  const normalized = fullName
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove dấu
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().split(' ').reverse().join('');
  const suffix = Math.floor(Math.random() * 999);
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  return `${normalized}${suffix}@${domain}`;
}
```

## 5. SEED DATA TEMPLATES

### 5.1. Roles (Cố định)
```javascript
// seeders/data/roles.data.js
const roles = [
  { name: 'admin', description: 'Quản trị viên hệ thống' },
  { name: 'customer', description: 'Khách hàng' },
];
```

### 5.2. Users
```javascript
// seeders/data/users.data.js
function generateUsers(count = 20) {
  const users = [];
  // Admin account (cố định)
  users.push({
    username: 'admin',
    password: 'Admin@123',
    email: 'admin@nnptud.com',
    fullName: 'Quản Trị Viên',
    role: 'admin', // sẽ map ObjectId sau
    status: true,
  });
  // Customer accounts
  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const name = generateVietnameseName(gender);
    users.push({
      username: `user${i + 1}`,
      password: 'User@123',
      email: generateEmailFromName(name),
      fullName: name,
      role: 'customer',
      status: true,
    });
  }
  return users;
}
```

### 5.3. Categories
```javascript
const categories = [
  { name: 'Điện thoại', slug: 'dien-thoai', description: 'Điện thoại thông minh các hãng' },
  { name: 'Laptop', slug: 'laptop', description: 'Laptop văn phòng, gaming, đồ hoạ' },
  { name: 'Máy tính bảng', slug: 'may-tinh-bang', description: 'Tablet các loại' },
  { name: 'Phụ kiện', slug: 'phu-kien', description: 'Ốp lưng, sạc, tai nghe, chuột, bàn phím' },
  { name: 'Đồng hồ thông minh', slug: 'dong-ho-thong-minh', description: 'Smartwatch các hãng' },
  { name: 'Âm thanh', slug: 'am-thanh', description: 'Tai nghe, loa bluetooth, soundbar' },
  { name: 'Màn hình', slug: 'man-hinh', description: 'Màn hình máy tính, gaming' },
  { name: 'Thiết bị mạng', slug: 'thiet-bi-mang', description: 'Router, switch, modem' },
];
```

### 5.4. Products
```javascript
const productTemplates = {
  'Điện thoại': [
    { title: 'iPhone 15 Pro Max 256GB', price: 29990000 },
    { title: 'iPhone 15 128GB', price: 19990000 },
    { title: 'Samsung Galaxy S24 Ultra', price: 31990000 },
    { title: 'Samsung Galaxy A55 5G', price: 9990000 },
    { title: 'Xiaomi 14 Ultra', price: 23990000 },
    { title: 'OPPO Find X7 Ultra', price: 22990000 },
    { title: 'Google Pixel 8 Pro', price: 17990000 },
    { title: 'OnePlus 12', price: 19990000 },
  ],
  'Laptop': [
    { title: 'MacBook Air M3 13 inch', price: 27990000 },
    { title: 'MacBook Pro M3 Pro 14 inch', price: 44990000 },
    { title: 'Dell XPS 15', price: 35990000 },
    { title: 'ASUS ROG Strix G16', price: 32990000 },
    { title: 'Lenovo ThinkPad X1 Carbon Gen 12', price: 38990000 },
    { title: 'HP Pavilion 15', price: 15990000 },
    { title: 'Acer Nitro V Gaming', price: 22990000 },
  ],
  'Phụ kiện': [
    { title: 'AirPods Pro 2 USB-C', price: 5990000 },
    { title: 'Samsung Galaxy Buds3 Pro', price: 4990000 },
    { title: 'Chuột Logitech MX Master 3S', price: 2490000 },
    { title: 'Bàn phím cơ Keychron K8 Pro', price: 2290000 },
    { title: 'Sạc nhanh Anker 65W GaN', price: 790000 },
    { title: 'Ốp lưng iPhone 15 MagSafe', price: 290000 },
    { title: 'Cáp USB-C to Lightning Anker 1.8m', price: 250000 },
  ],
  'Đồng hồ thông minh': [
    { title: 'Apple Watch Series 9 45mm', price: 10990000 },
    { title: 'Apple Watch Ultra 2', price: 19990000 },
    { title: 'Samsung Galaxy Watch 6 Classic', price: 7990000 },
    { title: 'Garmin Venu 3S', price: 11990000 },
    { title: 'Xiaomi Watch S3', price: 3490000 },
  ],
};

function generateProducts() {
  const products = [];
  for (const [category, items] of Object.entries(productTemplates)) {
    for (const item of items) {
      products.push({
        title: item.title,
        sku: `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        slug: slugify(item.title, { lower: true, locale: 'vi', strict: true }),
        price: item.price,
        category: category,
        description: `${item.title} chính hãng, bảo hành 12 tháng. Giao hàng toàn quốc.`,
        images: [`https://placehold.co/400x400/EEE/31343C?text=${encodeURIComponent(item.title.split(' ')[0])}`],
      });
    }
  }
  return products;
}
```

### 5.5. Orders
```javascript
const orderStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed'];
const paymentMethods = ['cod', 'banking', 'vnpay'];

function generateOrders(users, products, count = 30) {
  const orders = [];
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items
    const items = [];
    let totalAmount = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const subtotal = product.price * quantity;
      totalAmount += subtotal;
      items.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity,
        subtotal,
      });
    }

    const shippingFee = 30000;
    const address = generateAddress();

    orders.push({
      user: user._id,
      orderCode: `ORD-${Date.now()}-${i.toString().padStart(4, '0')}`,
      items,
      shippingAddress: {
        fullName: user.fullName,
        phone: generatePhoneVN(),
        ...address,
      },
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      totalAmount,
      shippingFee,
      discount: 0,
      finalAmount: totalAmount + shippingFee,
      isPaid: Math.random() > 0.3,
    });
  }
  return orders;
}
```

## 6. MAIN SEEDER SCRIPT

```javascript
// seeders/index.js
const mongoose = require('mongoose');
require('dotenv').config();

// Models
const Role = require('../schemas/roles');
const User = require('../schemas/users');
const Product = require('../schemas/products');
const Inventory = require('../schemas/inventories');
// const Category = require('../schemas/categories');
// const Order = require('../schemas/orders');

// Data
const { roles } = require('./data/roles.data');
const { generateUsers } = require('./data/users.data');
const { generateProducts } = require('./data/products.data');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nnptud-ecommerce');
    console.log('📦 Connected to MongoDB');

    // 1. Reset data (optional — hỏi user trước)
    console.log('🗑️ Clearing existing data...');
    await Role.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});

    // 2. Seed Roles
    console.log('👑 Seeding roles...');
    const createdRoles = await Role.insertMany(roles);
    const roleMap = {};
    createdRoles.forEach(r => roleMap[r.name] = r._id);
    console.log(`  ✅ ${createdRoles.length} roles created`);

    // 3. Seed Users
    console.log('👥 Seeding users...');
    const usersData = generateUsers(20);
    usersData.forEach(u => u.role = roleMap[u.role]);
    const createdUsers = await User.create(usersData); // .create() triggers pre-save hooks (password hash)
    console.log(`  ✅ ${createdUsers.length} users created`);

    // 4. Seed Products + Inventories
    console.log('📦 Seeding products...');
    const productsData = generateProducts();
    const createdProducts = await Product.insertMany(productsData);
    console.log(`  ✅ ${createdProducts.length} products created`);

    console.log('📊 Seeding inventories...');
    const inventories = createdProducts.map(p => ({
      product: p._id,
      stock: Math.floor(Math.random() * 200) + 10,
    }));
    await Inventory.insertMany(inventories);
    console.log(`  ✅ ${inventories.length} inventories created`);

    // Summary
    console.log('\n🎉 Seed completed!');
    console.log('───────────────────────');
    console.log(`  Roles:       ${createdRoles.length}`);
    console.log(`  Users:       ${createdUsers.length}`);
    console.log(`  Products:    ${createdProducts.length}`);
    console.log(`  Inventories: ${inventories.length}`);
    console.log('───────────────────────');
    console.log('  Admin login: admin / Admin@123');
    console.log('  User login:  user1 / User@123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();
```

## 7. CHẠY SEEDER

### Thêm script vào package.json:
```json
{
  "scripts": {
    "seed": "node seeders/index.js",
    "seed:reset": "node seeders/index.js --reset"
  }
}
```

### Commands:
```bash
# Chạy seed
npm run seed

# Hoặc với Docker
docker-compose exec backend npm run seed
```

## 8. QUY TẮC SEEDER

1. **Hỏi user trước khi reset** — KHÔNG tự xoá data mà không hỏi.
2. **Dữ liệu Việt Nam** — Tên, địa chỉ, SĐT, giá VNĐ phải realistic.
3. **Mật khẩu cố định** — Dùng `Admin@123` / `User@123` cho dev (dễ nhớ).
4. **Idempotent** — Có thể chạy nhiều lần mà không lỗi (reset trước khi seed).
5. **Tài khoản Admin luôn có** — Luôn tạo 1 admin account cố định.
6. **Inventory đi kèm Product** — Khi seed product phải seed inventory.
7. **Giá thực tế** — Dùng giá phù hợp thị trường VN (không random vô nghĩa).
