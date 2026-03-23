const request = require('supertest');
const app = require('../../app');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');
const Category = require('../../schemas/categories');
const Collection = require('../../schemas/collections');
const Product = require('../../schemas/products');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
};

describe('D6 Integration Tests - Products', () => {
  let adminUser, adminToken, category, collection;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    const adminRole = await Role.create({ name: 'admin', description: 'Admin' });
    adminUser = await User.create({
      username: 'admin', email: 'admin@test.com', password: 'password123',
      role: adminRole._id, isActive: true
    });
    adminToken = generateToken(adminUser._id);

    category = await Category.create({ name: 'Rolex' });
    collection = await Collection.create({ name: 'Classic' });
  });

  describe('Products CRUD + salePrice virtual pre-save hook', () => {
    it('should create Product and calc salePrice correctly', async () => {
      const prodData = {
        name: 'Rolex Submariner',
        sku: 'R-SUB-101',
        price: 0, // Should be overridden
        originalPrice: 10000000,
        discountPercent: 10, // 10%
        category: category._id
      };

      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(prodData);

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe('rolex-submariner');
      expect(res.body.data.price).toBe(9000000); // 100M - 10%
      expect(res.body.data.salePrice).toBe(9000000);
      expect(res.body.data.originalPrice).toBe(10000000);
    });

    it('should calculate price=originalPrice when no discount', async () => {
      const prodData = {
        name: 'Omega Speedmaster',
        sku: 'O-SPD-001',
        price: 20000, // Client side sets it
        originalPrice: 5000000,
        discountPercent: 0,
        category: category._id
      };

      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(prodData);

      expect(res.body.data.price).toBe(5000000);
      expect(res.body.data.salePrice).toBe(5000000);
    });

    it('should filter products correctly by multi criteria', async () => {
      await Product.create({
        name: 'Casio Vintage', sku: 'C-V-1', price: 1000, salePrice: 1000, originalPrice: 1000, category: category._id, gender: 'male', movement: 'quartz'
      });
      await Product.create({
        name: 'Casio ProTrek', sku: 'C-P-2', price: 2000, salePrice: 2000, originalPrice: 2000, category: category._id, gender: 'male', movement: 'automatic'
      });
      await Product.create({
        name: 'Seiko 5', sku: 'S-5-1', price: 3000, salePrice: 3000, originalPrice: 3000, category: category._id, gender: 'female', movement: 'automatic'
      });

      // Filter by Search text
      const resSearch = await request(app).get('/api/v1/products?search=Casio');
      expect(resSearch.body.data.length).toBe(2);

      // Filter by Gender and Movement
      const resFilter = await request(app).get('/api/v1/products?gender=male&movement=automatic');
      expect(resFilter.body.data.length).toBe(1);
      expect(resFilter.body.data[0].name).toBe('Casio ProTrek');

      // Filter by minPrice maxPrice
      const resPriceInfo = await request(app).get('/api/v1/products?minPrice=1500&maxPrice=2500');
      expect(resPriceInfo.body.data.length).toBe(1);
      expect(resPriceInfo.body.data[0].salePrice).toBe(2000);
    });

    it('should paginate correctly', async () => {
      for (let i = 0; i < 15; i++) {
        await Product.create({
          name: `Test Paging ${i}`, sku: `TP-${i}`, price: 100, originalPrice: 100, category: category._id
        });
      }

      const res = await request(app).get('/api/v1/products?page=2&limit=10&sort=price_asc');
      expect(res.body.pagination.total).toBe(15);
      expect(res.body.pagination.totalPages).toBe(2);
      expect(res.body.data.length).toBe(5); // 15 total, limit 10 -> page 2 has 5
    });

    it('should be able to Soft Delete Product', async () => {
      const sp = await Product.create({
        name: 'SP Remove', sku: 'DEL', price: 100, originalPrice: 100, category: category._id
      });

      const res = await request(app)
        .delete(`/api/v1/products/${sp._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);

      // Verify omitted from GET
      const getRes = await request(app).get('/api/v1/products');
      expect(getRes.body.data.some((i) => i.sku === 'DEL')).toBe(false);
    });
  });
});
