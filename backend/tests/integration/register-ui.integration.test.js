const request = require('supertest');
const app = require('../../app');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');

describe('UI Test Cases - Register Endpoint (/api/v1/auth/register)', () => {
  let customerRole;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    // Chuẩn bị precondition
    customerRole = await Role.create({ name: 'customer', description: 'Customer' });
    
    // Create an existing user for Register_3 testing
    await User.create({
      username: 'user_test',
      fullName: 'User Test',
      email: 'user@example.com',
      password: 'Password123',
      role: customerRole._id,
      isActive: true
    });
  });

  // Register_1: Đăng ký thành công
  it('Register_1: Đăng ký tài khoản thành công', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Nguyen Van A',
        email: 'newuser@example.com',
        password: 'Password123'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('newuser@example.com');
  });

  // Register_2: Email không hợp lệ
  it('Register_2: Đăng ký thất bại – Email không hợp lệ (thiếu .com)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Nguyen Van A',
        email: 'newuserexample.com',
        password: 'Password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some(e => e.msg === 'Email không hợp lệ')).toBe(true);
  });

  // Register_3: Email đã tồn tại
  it('Register_3: Đăng ký thất bại – Email đã tồn tại trong hệ thống', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Nguyen Van B',
        email: 'user@example.com',
        password: 'Password123'
      });

    expect(res.status).toBe(409); // Conflict
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email đã tồn tại');
  });

  // Register_4: Mật khẩu quá ngắn
  it('Register_4: Đăng ký thất bại – Mật khẩu quá ngắn', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Nguyen Van A',
        email: 'newuser2@example.com',
        password: '123'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some(e => e.msg.includes('Mật khẩu tối thiểu'))).toBe(true);
  });

  // Register_5: Bỏ trống họ và tên
  it('Register_5: Đăng ký thất bại – Bỏ trống họ và tên', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: '',
        email: 'newuser3@example.com',
        password: 'Password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.msg.includes('Họ và tên là bắt buộc')) || res.body.errors.some(e => e.msg.includes('Họ và tên từ 2-50 ký tự'))).toBe(true);
  });

  // Register_6: Bỏ trống email
  it('Register_6: Đăng ký thất bại – Bỏ trống email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Nguyen Van A',
        email: '',
        password: 'Password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.msg.includes('Email là bắt buộc'))).toBe(true);
  });

  // Register_7: Bỏ trống mật khẩu
  it('Register_7: Đăng ký thất bại – Bỏ trống mật khẩu', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Nguyen Van A',
        email: 'newuser4@example.com',
        password: ''
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.msg.includes('Mật khẩu là bắt buộc'))).toBe(true);
  });

  // Register_8: Bỏ trống tất cả các trường
  it('Register_8: Đăng ký thất bại – Bỏ trống tất cả các trường', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: '',
        email: '',
        password: ''
      });

    expect(res.status).toBe(400);
  });

  // Register_9: Email chứa khoảng trắng
  it('Register_9: Đăng ký thất bại – Email chứa khoảng trắng', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Nguyen Van A',
        email: 'user  @example.com',
        password: 'Password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.msg.includes('Email không hợp lệ'))).toBe(true);
  });

  // Register_10: Họ tên chỉ chứa khoảng trắng
  it('Register_10: Đăng ký thất bại – Họ tên chỉ nhập khoảng trắng', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: '               ', // Chỉ là khoảng trắng
        email: 'newuser5@example.com',
        password: 'Password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.msg.includes('Họ và tên là bắt buộc'))).toBe(true); // Controller đã chạy lệnh .trim() nên nó sẽ thành empty string
  });
});
