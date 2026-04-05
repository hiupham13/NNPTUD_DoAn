/**
 * UNIT TEST — Register Controller
 * Chương 5: Kiểm thử đơn vị (Unit Test)
 * 
 * Kỹ thuật: Jest Mock — giả lập User, Role, generateToken
 * KHÔNG kết nối Database, KHÔNG khởi động Server.
 */

const { register } = require('../../controllers/auth.controller');
const User = require('../../schemas/users');
const Role = require('../../schemas/roles');
const generateToken = require('../../utils/generateToken');
const AppError = require('../../utils/AppError');

jest.mock('../../schemas/users');
jest.mock('../../schemas/roles');
jest.mock('../../utils/generateToken');

describe('Unit Test — Register Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ─── TC01: Đăng ký thành công ───
  it('TC01: Trả về 201 và token khi đăng ký hợp lệ', async () => {
    const mockCreatedUser = {
      _id: 'new_user_id',
      fullName: 'Nguyen Van B',
      email: 'newuser@example.com',
      isActive: true,
    };

    User.findOne
      .mockResolvedValueOnce(null)   // Email chưa tồn tại
      .mockResolvedValueOnce(null);  // Username chưa tồn tại
    Role.findOne.mockResolvedValue({ _id: 'role_customer', name: 'customer' });
    User.create.mockResolvedValue(mockCreatedUser);
    generateToken.mockReturnValue('new_jwt_token');

    req.body = { name: 'Nguyen Van B', email: 'newuser@example.com', password: 'Password123' };

    await register(req, res, next);

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'newuser@example.com',
        password: 'Password123',
        fullName: 'Nguyen Van B',
        role: 'role_customer',
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Đăng ký thành công',
        data: expect.objectContaining({ token: 'new_jwt_token' }),
      })
    );
  });

  // ─── TC02: Email đã tồn tại ───
  it('TC02: Gọi next(AppError 409) khi email đã tồn tại', async () => {
    User.findOne.mockResolvedValueOnce({ email: 'existing@example.com' }); // Trùng email

    req.body = { name: 'Trùng', email: 'existing@example.com', password: 'Password123' };

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Email đã tồn tại');
    expect(User.create).not.toHaveBeenCalled();
  });

  // ─── TC03: Username tự động thêm suffix khi trùng ───
  it('TC03: Tự thêm suffix vào username nếu username đã tồn tại', async () => {
    User.findOne
      .mockResolvedValueOnce(null)                     // Email chưa tồn tại
      .mockResolvedValueOnce({ username: 'newuser' }); // Username đã tồn tại
    Role.findOne.mockResolvedValue({ _id: 'role_customer', name: 'customer' });

    const mockCreatedUser = {
      _id: 'user_suffix',
      fullName: 'Nguyen Van C',
      email: 'newuser@example.com',
      isActive: true,
    };
    User.create.mockResolvedValue(mockCreatedUser);
    generateToken.mockReturnValue('token_suffix');

    req.body = { name: 'Nguyen Van C', email: 'newuser@example.com', password: 'Password123' };

    await register(req, res, next);

    // Username phải bắt đầu bằng 'newuser_' (có suffix)
    const createCall = User.create.mock.calls[0][0];
    expect(createCall.username).toMatch(/^newuser_/);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  // ─── TC04: Role customer chưa tồn tại (Lỗi hệ thống) ───
  it('TC04: Gọi next(AppError 500) khi role customer chưa được tạo', async () => {
    User.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    Role.findOne.mockResolvedValue(null); // Không tìm thấy role

    req.body = { name: 'Test', email: 'test@example.com', password: 'Password123' };

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(500);
    expect(error.message).toContain('role customer');
    expect(User.create).not.toHaveBeenCalled();
  });

  // ─── TC05: Database lỗi khi tạo User ───
  it('TC05: Gọi next(error) khi User.create() bị lỗi', async () => {
    const dbError = new Error('Duplicate key error');

    User.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    Role.findOne.mockResolvedValue({ _id: 'role_customer' });
    User.create.mockRejectedValue(dbError);

    req.body = { name: 'Test', email: 'test@example.com', password: 'Password123' };

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });

  // ─── TC06: Response chứa đúng cấu trúc user data ───
  it('TC06: Response data chứa id, name, email, role, isActive', async () => {
    const mockCreatedUser = {
      _id: 'user_struct',
      fullName: 'Structure Test',
      email: 'struct@example.com',
      isActive: true,
    };

    User.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    Role.findOne.mockResolvedValue({ _id: 'role_customer', name: 'customer' });
    User.create.mockResolvedValue(mockCreatedUser);
    generateToken.mockReturnValue('struct_token');

    req.body = { name: 'Structure Test', email: 'struct@example.com', password: 'Password123' };

    await register(req, res, next);

    const responseData = res.json.mock.calls[0][0].data.user;
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('name', 'Structure Test');
    expect(responseData).toHaveProperty('email', 'struct@example.com');
    expect(responseData).toHaveProperty('role', 'customer');
    expect(responseData).toHaveProperty('isActive', true);
  });
});
