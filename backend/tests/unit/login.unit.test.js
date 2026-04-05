/**
 * UNIT TEST — Login Controller
 * Chương 5: Kiểm thử đơn vị (Unit Test)
 * 
 * Kỹ thuật: Jest Mock — giả lập toàn bộ Model (User), utility (generateToken)
 * KHÔNG kết nối Database, KHÔNG khởi động Server.
 */

const { login } = require('../../controllers/auth.controller');
const User = require('../../schemas/users');
const generateToken = require('../../utils/generateToken');
const AppError = require('../../utils/AppError');

// Mock toàn bộ module bên ngoài
jest.mock('../../schemas/users');
jest.mock('../../utils/generateToken');

describe('Unit Test — Login Controller', () => {
  let req, res, next;

  beforeEach(() => {
    // Tạo các đối tượng giả lập Request, Response, Next
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ─── TC01: Đăng nhập thành công ───
  it('TC01: Trả về 200 và token khi email + password đúng', async () => {
    const mockUser = {
      _id: 'user123',
      fullName: 'Nguyen Van A',
      username: 'nguyenvana',
      email: 'test@example.com',
      isActive: true,
      role: { name: 'customer' },
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    // Giả lập chuỗi: User.findOne().select().populate() → trả về mockUser
    User.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      }),
    });
    generateToken.mockReturnValue('fake_jwt_token');

    req.body = { email: 'test@example.com', password: 'Password123' };

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Đăng nhập thành công',
        data: expect.objectContaining({
          token: 'fake_jwt_token',
        }),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // ─── TC02: Email không tồn tại trong hệ thống ───
  it('TC02: Gọi next(AppError 401) khi email không tồn tại', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    req.body = { email: 'notfound@example.com', password: 'Password123' };

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Email hoặc mật khẩu không đúng');
    expect(res.status).not.toHaveBeenCalled();
  });

  // ─── TC03: Mật khẩu sai ───
  it('TC03: Gọi next(AppError 401) khi mật khẩu không khớp', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      isActive: true,
      role: { name: 'customer' },
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      }),
    });

    req.body = { email: 'test@example.com', password: 'WrongPassword' };

    await login(req, res, next);

    expect(mockUser.comparePassword).toHaveBeenCalledWith('WrongPassword');
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
  });

  // ─── TC04: Tài khoản bị khóa (isActive = false) ───
  it('TC04: Gọi next(AppError 403) khi tài khoản bị khóa', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      isActive: false, // Bị khóa
      role: { name: 'customer' },
      comparePassword: jest.fn(),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      }),
    });

    req.body = { email: 'test@example.com', password: 'Password123' };

    await login(req, res, next);

    // Không gọi comparePassword vì đã bị chặn trước
    expect(mockUser.comparePassword).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(403);
    expect(error.message).toContain('khoá');
  });

  // ─── TC05: Lỗi bất ngờ từ Database ───
  it('TC05: Gọi next(error) khi Database quăng exception', async () => {
    const dbError = new Error('MongoDB connection lost');

    User.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(dbError),
      }),
    });

    req.body = { email: 'test@example.com', password: 'Password123' };

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });

  // ─── TC06: generateToken được gọi đúng payload ───
  it('TC06: generateToken nhận đúng userId và role', async () => {
    const mockUser = {
      _id: { toString: () => 'user_abc' },
      fullName: 'Admin',
      username: 'admin',
      email: 'admin@example.com',
      isActive: true,
      role: { name: 'admin' },
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      }),
    });
    generateToken.mockReturnValue('admin_token');

    req.body = { email: 'admin@example.com', password: 'Admin123' };

    await login(req, res, next);

    expect(generateToken).toHaveBeenCalledWith({
      userId: 'user_abc',
      role: 'admin',
    });
  });
});
