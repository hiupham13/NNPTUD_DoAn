const request = require('supertest');
const app = require('../../app');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');
const Category = require('../../schemas/categories');
const Collection = require('../../schemas/collections');
const Product = require('../../schemas/products');
const jwt = require('jsonwebtoken');

// Helper to generate token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
};

describe('D5 Integration Tests', () => {
  let adminUser, customerUser, adminToken, customerToken, adminRole, customerRole;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    // Seed roles
    adminRole = await Role.create({ name: 'admin', description: 'Quản trị viên' });
    customerRole = await Role.create({ name: 'customer', description: 'Khách hàng' });

    // Seed users
    adminUser = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'password123',
      role: adminRole._id,
      isActive: true
    });
    
    customerUser = await User.create({
      username: 'customer',
      email: 'customer@test.com',
      password: 'password123',
      role: customerRole._id,
      isActive: true
    });

    adminToken = generateToken(adminUser._id);
    customerToken = generateToken(customerUser._id);
  });

  describe('Users', () => {
    it('GET /api/v1/users/profile - should get profile', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.username).toBe('customer');
      expect(res.body.data.password).toBeUndefined(); // password should be hidden
    });

    it('PUT /api/v1/users/profile - should update profile', async () => {
      const res = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ fullName: 'Customer Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.fullName).toBe('Customer Name');
    });

    it('GET /api/v1/users - Admin should get users list', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('GET /api/v1/users - Customer should get forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Categories', () => {
    it('POST /api/v1/categories - Admin should create category', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Rolex' });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Rolex');
      expect(res.body.data.slug).toBe('rolex');
    });

    it('GET /api/v1/categories - Public should view categories', async () => {
      await Category.create({ name: 'Omega' });
      const res = await request(app).get('/api/v1/categories');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('DELETE /api/v1/categories/:id - Should block if product exists (EC-01)', async () => {
      const cat = await Category.create({ name: 'Casio' });
      await Product.create({
        name: 'Casio Vintage', sku: 'C123', slug: 'casio-vintage',
        price: 100, category: cat._id, isDeleted: false
      });

      const res = await request(app)
        .delete(`/api/v1/categories/${cat._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Không thể xóa');
    });
  });

  describe('Collections', () => {
    it('POST /api/v1/collections - Admin should create collection', async () => {
      const res = await request(app)
        .post('/api/v1/collections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Classic Gold' });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Classic Gold');
      expect(res.body.data.slug).toBe('classic-gold');
    });

    it('DELETE /api/v1/collections/:id - Should cascade nullify product ref (EC-02)', async () => {
      const cat = await Category.create({ name: 'Omega' });
      const col = await Collection.create({ name: 'Sport Series' });
      const prod = await Product.create({
        name: 'Omega Sport', sku: 'OS1', slug: 'omega-sport',
        price: 200, category: cat._id, collectionRef: col._id, isDeleted: false
      });

      const res = await request(app)
        .delete(`/api/v1/collections/${col._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const deletedCol = await Collection.findById(col._id);
      expect(deletedCol.isDeleted).toBe(true);

      const updatedProd = await Product.findById(prod._id);
      expect(updatedProd.collectionRef).toBeNull();
    });
  });
});
