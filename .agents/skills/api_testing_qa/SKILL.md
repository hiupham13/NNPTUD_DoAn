---
name: api_testing_qa
description: QA Engineer — Viết test case, Postman collection, unit test (Jest), integration test cho dự án E-Commerce.
---

# 🧪 API Testing & QA — E-Commerce NNPTUD

## 1. VAI TRÒ
- Viết test case cho mọi API endpoint.
- Tạo Postman collection cho manual testing.
- Viết unit test và integration test (Jest + Supertest).
- Đảm bảo chất lượng code trước khi release.

## 2. TECH STACK TESTING
| Tool | Mục đích |
|:-----|:---------|
| Jest | Unit test framework |
| Supertest | HTTP API testing |
| Postman | Manual API testing |
| MongoDB Memory Server | In-memory DB cho test |

## 3. TEST STRUCTURE

### 3.1. Thư mục test
```
backend/
└── tests/
    ├── setup.js                # Test setup & teardown
    ├── unit/
    │   ├── controllers/
    │   │   ├── auth.test.js
    │   │   ├── products.test.js
    │   │   └── orders.test.js
    │   ├── models/
    │   │   ├── user.test.js
    │   │   └── product.test.js
    │   └── utils/
    │       └── constants.test.js
    ├── integration/
    │   ├── auth.integration.test.js
    │   ├── products.integration.test.js
    │   ├── cart.integration.test.js
    │   └── orders.integration.test.js
    └── fixtures/
        ├── users.fixture.js
        ├── products.fixture.js
        └── orders.fixture.js
```

### 3.2. Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterSetup: ['./tests/setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**'
  ]
};
```

### 3.3. Test Setup
```javascript
// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

## 4. TEST PATTERNS

### 4.1. API Integration Test
```javascript
// tests/integration/products.integration.test.js
const request = require('supertest');
const app = require('../../app');
const Product = require('../../schemas/products');

describe('Products API', () => {
  describe('GET /api/v1/products', () => {
    it('should return empty array when no products', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });

    it('should return products with pagination', async () => {
      // Seed data
      await Product.create([
        { title: 'Product A', sku: 'SKU001', slug: 'product-a', price: 100000, category: 'electronics' },
        { title: 'Product B', sku: 'SKU002', slug: 'product-b', price: 200000, category: 'electronics' },
      ]);

      const res = await request(app).get('/api/v1/products?page=1&limit=10');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should filter by title', async () => {
      await Product.create([
        { title: 'iPhone 15', sku: 'IP15', slug: 'iphone-15', price: 25000000, category: 'phones' },
        { title: 'Samsung S24', sku: 'SS24', slug: 'samsung-s24', price: 22000000, category: 'phones' },
      ]);

      const res = await request(app).get('/api/v1/products?title=iPhone');
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('iPhone 15');
    });

    it('should not return deleted products', async () => {
      await Product.create({
        title: 'Deleted Product', sku: 'DEL01', slug: 'deleted', price: 100, category: 'test', isDeleted: true
      });

      const res = await request(app).get('/api/v1/products');
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'Test Product',
        sku: 'TEST001',
        price: 150000,
        category: 'test',
        description: 'Test description'
      };

      const res = await request(app)
        .post('/api/v1/products')
        .send(newProduct);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Product');
      expect(res.body.data.slug).toBeDefined();
    });

    it('should reject duplicate SKU', async () => {
      await Product.create({ title: 'Existing', sku: 'DUP01', slug: 'existing', price: 100, category: 'test' });

      const res = await request(app)
        .post('/api/v1/products')
        .send({ title: 'New Product', sku: 'DUP01', price: 200, category: 'test' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should soft delete a product', async () => {
      const product = await Product.create({
        title: 'To Delete', sku: 'DEL01', slug: 'to-delete', price: 100, category: 'test'
      });

      const res = await request(app).delete(`/api/v1/products/${product._id}`);
      expect(res.status).toBe(200);

      // Verify soft deleted
      const deleted = await Product.findById(product._id);
      expect(deleted.isDeleted).toBe(true);
    });
  });
});
```

### 4.2. Unit Test
```javascript
// tests/unit/utils/constants.test.js
const { generateRandomPassword } = require('../../../utils/constants');

describe('generateRandomPassword', () => {
  it('should generate password with correct length', () => {
    const password = generateRandomPassword(12);
    expect(password).toHaveLength(12);
  });

  it('should contain uppercase, lowercase, numbers, symbols', () => {
    const password = generateRandomPassword(16);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%&*]/);
  });
});
```

## 5. TEST CASE TEMPLATE

### Format cho mỗi endpoint:
```markdown
### [METHOD] [ENDPOINT]

| # | Test Case | Input | Expected | Status |
|:--|:----------|:------|:---------|:-------|
| 1 | Happy path | Valid data | 200/201 + data | ✅/❌ |
| 2 | Missing required field | Thiếu field X | 400 + error message | ✅/❌ |
| 3 | Invalid data type | Sai type field Y | 400 + validation error | ✅/❌ |
| 4 | Not found | ID không tồn tại | 404 | ✅/❌ |
| 5 | Unauthorized | Không có token | 401 | ✅/❌ |
| 6 | Forbidden | Token user thường | 403 | ✅/❌ |
| 7 | Duplicate | Data trùng unique | 400 + duplicate error | ✅/❌ |
```

## 6. POSTMAN COLLECTION STRUCTURE
```
NNPTUD E-Commerce/
├── Auth/
│   ├── Register
│   ├── Login
│   └── Forgot Password
├── Products/
│   ├── Get All Products
│   ├── Get Product by ID
│   ├── Create Product (Admin)
│   ├── Update Product (Admin)
│   └── Delete Product (Admin)
├── Categories/
├── Cart/
├── Orders/
├── Users/
└── Upload/
```

## 7. BEST PRACTICES

1. **Mỗi test độc lập** — Không phụ thuộc thứ tự chạy.
2. **Clean up sau mỗi test** — Reset DB state.
3. **Happy path + Edge cases** — Test cả success và failure.
4. **Test authentication** — Verify protected routes.
5. **Test pagination** — Verify page, limit, total.
6. **Test soft delete** — Verify isDeleted logic.
