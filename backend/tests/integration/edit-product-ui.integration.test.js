const request = require('supertest');
const app = require('../../app');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');
const Category = require('../../schemas/categories');
const Product = require('../../schemas/products');

describe('UI Test Cases - Edit Product Endpoint (/api/v1/products/:id)', () => {
  let adminToken;
  let categoryId;
  let productId;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    // 1. Setup Admin Data
    const adminRole = await Role.create({ name: 'admin', description: 'Admin' });
    
    await User.create({
      username: 'admin_test_edit',
      fullName: 'Admin Test Edit',
      email: 'admin_edit@example.com',
      password: 'Password123',
      role: adminRole._id,
      isActive: true
    });

    const category = await Category.create({ name: 'Rolex Edit' });
    categoryId = category._id.toString();

    // 2. Login to get token
    const resAuth = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin_edit@example.com',
        password: 'Password123'
      });
      
    adminToken = resAuth.body.data.token;

    // 3. Create a Base Product for testing Edit
    const product = await Product.create({
      name: 'Rolex Daytona',
      sku: 'ROL-001',
      price: 12000000,
      originalPrice: 12000000,
      discountPercent: 10,
      category: categoryId
    });
    productId = product._id.toString();
  });

  // Edit_1: Chỉnh sửa thành công
  it('Edit_1: Test chỉnh sửa sản phẩm thành công với dữ liệu hợp lệ', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rolex Daytona Updated',
        price: 15000000 // Tăng giá
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Because API replaces missing params with existing ones, it only updates given fields:
    expect(res.body.data.name).toBe('Rolex Daytona Updated');
    // Pre('save') hook in Product schema recalculates: salePrice = 12M * 0.9 = 10.8M!
    expect(res.body.data.price).toBe(10800000);
  });

  // Edit_2: Bỏ trống tên sản phẩm
  it('Edit_2: Test chỉnh sửa thất bại – bỏ trống tên sản phẩm', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: ''
      });

    expect(res.status).toBe(400); 
    expect(res.body.errors.some(e => e.message.includes('Tên không được rỗng'))).toBe(true);
  });

  // Edit_3: Trùng mã SKU (Tạo product khác rồi lấy SKU gán đè)
  it('Edit_3: Test chỉnh sửa thất bại – SKU trùng', async () => {
    // Tạo 1 product khác để chiếm dụng SKU "ROL-002"
    await Product.create({
      name: 'Rolex Submariner Extra',
      sku: 'ROL-002',
      price: 10000000,
      category: categoryId
    });

    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: 'ROL-002' // Cố ý sửa productId hiện tại sang SKU đang bị chiếm
      });

    // Sẽ quăng lỗi trùng lặp từ MongoDB Duplicate key error (11000)
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Mã SKU hoặc Tên sản phẩm bị trùng lặp');
  });

  // Edit_4: Giá = 0
  it('Edit_4: Test chỉnh sửa thất bại – giá = 0', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: 0
      });

    expect(res.status).toBe(400);
    expect(res.body.errors ? res.body.errors.some(e => e.message.toLowerCase().includes('giá')) : res.body.message.toLowerCase().includes('giá')).toBe(true);
  });

  // Edit_5: Giá âm
  it('Edit_5: Test chỉnh sửa thất bại – giá âm', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: -100
      });

    expect(res.status).toBe(400);
    expect(res.body.errors ? res.body.errors.some(e => e.message.toLowerCase().includes('giá')) : res.body.message.toLowerCase().includes('giá')).toBe(true);
  });

  // Edit_6: Giảm giá > 100%
  it('Edit_6: Test chỉnh sửa thất bại – giảm giá > 100%', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        discountPercent: 150
      });

    // ValidationError Mongoose
    expect(res.status).toBeGreaterThanOrEqual(400); 
  });

  // Edit_7: Tên chỉ chứa khoảng trắng
  it('Edit_7: Test chỉnh sửa thất bại – tên chỉ chứa khoảng trắng', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '              '
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes('Tên không được rỗng'))).toBe(true); // .trim() reduces it to empty
  });

  // Edit_8: Không sửa gì (giữ nguyên)
  it('Edit_8: Test chỉnh sửa – không thay đổi gì', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({}); // payload trống, code API sẽ chắp vá 

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Rolex Daytona'); // Dữ liệu cũ còn nguyên
  });

  // Edit_9: Ký tự đặc biệt vào tên
  it('Edit_9: Test chỉnh sửa thất bại – nhập ký tự đặc biệt vào tên', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '   ????@@@   '
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes('ký tự đặc biệt'))).toBe(true);
  });

  // Edit_10: Giá bị nhập dạng text (abc)
  it('Edit_10: Test chỉnh sửa thất bại – nhập giá dạng chữ abc', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: 'abc'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes('Giá phải là số hợp lệ'))).toBe(true);
  });
});
