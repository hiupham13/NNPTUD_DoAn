const request = require('supertest');
const app = require('../../app');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');
const Category = require('../../schemas/categories');

describe('UI Test Cases - Add Product Endpoint (/api/v1/products)', () => {
  let adminToken;
  let categoryId;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    // 1. Setup Data
    const adminRole = await Role.create({ name: 'admin', description: 'Admin' });
    
    const adminUser = await User.create({
      username: 'admin_test',
      fullName: 'Admin Test',
      email: 'admin@example.com',
      password: 'Password123',
      role: adminRole._id,
      isActive: true
    });

    const category = await Category.create({ name: 'Rolex' });
    categoryId = category._id.toString();

    // 2. Login to get token
    const resAuth = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Password123'
      });
      
    adminToken = resAuth.body.data.token;
  });

  // Add_1: Tạo thành công
  it('Add_1: Tạo sản phẩm thành công với dữ liệu hợp lệ', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rolex Submariner',
        sku: 'ROL-001',
        price: 10000000,
        originalPrice: 10000000,
        discountPercent: 10,
        category: categoryId
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Rolex Submariner');
  });

  // Add_2: Bỏ trống tên
  it('Add_2: Tạo sản phẩm thất bại – bỏ trống tên sản phẩm', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '',
        sku: 'ROL-001',
        price: 10000000,
        discountPercent: 10,
        category: categoryId
      });

    expect(res.status).toBe(400); // 400 Bad Request since Express Validator blocks it
    expect(res.body.errors.some(e => e.message.includes('Tên sản phẩm'))).toBe(true);
  });

  // Add_3: Bỏ trống SKU
  it('Add_3: Tạo sản phẩm thất bại khi bỏ trống SKU', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rolex Submariner',
        sku: '',
        price: 10000000,
        discountPercent: 10,
        category: categoryId
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes('Mã SKU'))).toBe(true);
  });

  // Add_4: Trùng SKU
  it('Add_4: Tạo sản phẩm thất bại khi SKU bị trùng', async () => {
    // Insert bản đầu tiên
    await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rolex Submariner 1',
        sku: 'ROL-001',
        price: 10000000,
        category: categoryId
      });

    // Cố gắng insert bản thứ hai
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rolex Submariner 2',
        sku: 'ROL-001', // Trùng mã
        price: 10000000,
        category: categoryId
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('SKU hoặc Tên sản phẩm đã tồn tại');
  });

  // Add_5: Giá = 0 (Requires logic update in API)
  it('Add_5: Tạo sản phẩm thất bại khi giá = 0', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rolex Submariner',
        sku: 'ROL-003',
        price: 0,
        category: categoryId
      });

    // Dựa theo UI, kết quả phải lỗi 'Vui lòng nhập giá hợp lệ'
    expect(res.status).toBe(400); 
    expect(res.body.errors ? res.body.errors.some(e => e.message.toLowerCase().includes('giá')) : res.body.message.toLowerCase().includes('giá')).toBe(true);
  });

  // Add_6: Giá âm
  it('Add_6: Tạo sản phẩm thất bại khi giá âm', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rolex Submariner',
        sku: 'ROL-004',
        price: -1000,
        category: categoryId
      });

    expect(res.status).toBe(400);
    expect(res.body.errors ? res.body.errors.some(e => e.message.toLowerCase().includes('giá')) : res.body.message.toLowerCase().includes('giá')).toBe(true);
  });

  // Add_7: Giảm giá > 100%
  it('Add_7: Tạo sản phẩm thất bại khi giảm giá > 100%', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rolex Submariner',
        sku: 'ROL-004',
        price: 10000000,
        discountPercent: 150,
        category: categoryId
      });

    // Nó có thể bị Mongoose văng Exception (AppError 500 hoặc 400 Handler)
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  // Add_8: Bỏ trống toàn bộ 
  it('Add_8: Tạo sản phẩm thất bại khi bỏ trống toàn bộ dữ liệu', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400); // Rất nhiều fields bị thiếu
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  // Add_9: Tên SP chi chua khoang trang
  it('Add_9: Tạo sản phẩm thất bại khi nhập tên sản phẩm chỉ chứa khoảng trắng', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '      ', // Dấu cách
        sku: 'ROL-005',
        price: 10000000,
        category: categoryId
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes('Tên sản phẩm là bắt buộc'))).toBe(true); // Do đã gọi .trim() trong route
  });

  // Add_10: Special Characters => Cố tình viết expect Fail
  it('Add_10: Tạo sản phẩm thất bại khi nhập ký tự đặc biệt vào tên sản phẩm', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '????@@@',
        sku: 'ROL-006',
        price: 10000000,
        category: categoryId
      });

    // Yêu cầu của UI test spreadsheet là Case này bị FAILED do UI/Backend đang cho phép lưu. 
    // Theo TDD đúng, tester viết test expect FAIL (mong muốn nhận 400). Khi hệ thống cho chạy (trả 201), script sẽ FAIL. 
    // Chúng ta sẽ update logic Regex ở backend để nó PASS script này.
    expect(res.status).toBe(400);
  });
});
