const request = require('supertest');
const app = require('../../app');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');

describe('UI Test Cases - Login Endpoint (/api/v1/auth/login)', () => {
  let customerRole;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    // Chuẩn bị precondition: Đã có tài khoản
    customerRole = await Role.create({ name: 'customer', description: 'Customer' });
    
    await User.create({
      username: 'user_test',
      fullName: 'User Test',
      email: 'user@example.com',
      password: 'Password123',
      role: customerRole._id,
      isActive: true
    });
  });

  // Login_1: Valid login
  it('Login_1: Đăng nhập thành công với email và mật khẩu hợp lệ', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: 'Password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Đăng nhập thành công');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('user@example.com');
  });

  // Login_2: Invalid email format
  it('Login_2: Đăng nhập thất bại do email không hợp lệ (thiếu .com)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example',
        password: 'Password123'
      });

    expect(res.status).toBe(400); // Bad Request (Validation failed)
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some(e => e.msg === 'Email không hợp lệ')).toBe(true);
  });

  // Login_3: Wrong password
  it('Login_3: Đăng nhập thất bại do sai mật khẩu', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: 'WrongPassword123'
      });

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email hoặc mật khẩu không đúng');
  });

  // Login_4: Unregistered email
  it('Login_4: Đăng nhập thất bại do email không tồn tại trong hệ thống', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'Password123'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email hoặc mật khẩu không đúng');
  });

  // Login_5: Wrong password (short/numeric)
  it('Login_5: Đăng nhập thất bại do sai mật khẩu (trường hợp password ngắn "123")', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: '123'
      });

    expect(res.status).toBe(401); 
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email hoặc mật khẩu không đúng');
  });

  // Login_6: Empty email
  it('Login_6: Đăng nhập thất bại khi email để trống', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: '',
        password: 'Password123'
      });

    expect(res.status).toBe(400); // Validation error
    expect(res.body.success).toBe(false);
    // API validation returns both "Email là bắt buộc" and "Email không hợp lệ"
    expect(res.body.errors.some(e => e.msg.includes('Email'))).toBe(true);
  });

  // Login_7: Empty password
  it('Login_7: Đăng nhập thất bại khi mật khẩu để trống', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: ''
      });

    expect(res.status).toBe(400); // Validation error
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some(e => e.msg === 'Mật khẩu là bắt buộc')).toBe(true);
  });

  // Login_8: Empty email and password
  it('Login_8: Đăng nhập thất bại khi bỏ trống cả email và mật khẩu', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: '',
        password: ''
      });

    expect(res.status).toBe(400); // Validation error
    expect(res.body.success).toBe(false);
    
    expect(res.body.errors.some(e => e.msg.includes('Email'))).toBe(true);
    expect(res.body.errors.some(e => e.msg === 'Mật khẩu là bắt buộc')).toBe(true);
  });

  // Login_9: Email with spaces
  it('Login_9: Đăng nhập thất bại do email chứa khoảng trắng', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user   @example.com',
        password: 'Password123'
      });

    expect(res.status).toBe(400); 
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some(e => e.msg === 'Email không hợp lệ')).toBe(true);
  });

  // Login_10: No internet (Skip for backend API test)
  it.skip('Login_10: Đăng nhập khi không có kết nối internet (Client-side behaviour)', () => {
    // This is purely a UI/Network layer error. The backend API is not reachable.
  });
});
