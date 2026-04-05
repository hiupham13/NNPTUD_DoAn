/**
 * UNIT TEST — Update Product Controller
 * Chương 5: Kiểm thử đơn vị (Unit Test)
 * 
 * Kỹ thuật: Jest Mock — giả lập Product Model
 * KHÔNG kết nối Database, KHÔNG khởi động Server.
 */

const { updateProduct } = require('../../controllers/products');
const Product = require('../../schemas/products');
const AppError = require('../../utils/AppError');

jest.mock('../../schemas/products');

describe('Unit Test — Update Product Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ─── TC01: Cập nhật thành công ───
  it('TC01: Trả về 200 khi cập nhật sản phẩm hợp lệ', async () => {
    const mockProduct = {
      _id: 'prod_001',
      name: 'Rolex Old',
      sku: 'ROL-001',
      price: 10000000,
      isDeleted: false,
      save: jest.fn().mockResolvedValue(true),
    };

    Product.findById.mockResolvedValue(mockProduct);

    req.params.id = 'prod_001';
    req.body = { name: 'Rolex Updated' };

    await updateProduct(req, res, next);

    expect(mockProduct.name).toBe('Rolex Updated');
    expect(mockProduct.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Cập nhật thông tin sản phẩm thành công',
      })
    );
  });

  // ─── TC02: Sản phẩm không tồn tại ───
  it('TC02: Gọi next(AppError 404) khi ID không tồn tại', async () => {
    Product.findById.mockResolvedValue(null);

    req.params.id = 'nonexistent_id';
    req.body = { name: 'Ghost' };

    await updateProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Không tìm thấy sản phẩm');
  });

  // ─── TC03: Sản phẩm đã bị xóa mềm (isDeleted = true) ───
  it('TC03: Gọi next(AppError 404) khi sản phẩm đã bị soft-delete', async () => {
    const deletedProduct = {
      _id: 'prod_deleted',
      isDeleted: true,
    };

    Product.findById.mockResolvedValue(deletedProduct);

    req.params.id = 'prod_deleted';
    req.body = { name: 'Try Update Deleted' };

    await updateProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });

  // ─── TC04: Trùng SKU khi cập nhật (MongoDB error code 11000) ───
  it('TC04: Gọi next(AppError 400) khi SKU bị trùng với sản phẩm khác', async () => {
    const duplicateError = new Error('Duplicate key');
    duplicateError.code = 11000;

    const mockProduct = {
      _id: 'prod_001',
      isDeleted: false,
      save: jest.fn().mockRejectedValue(duplicateError),
    };

    Product.findById.mockResolvedValue(mockProduct);

    req.params.id = 'prod_001';
    req.body = { sku: 'DUPLICATE-SKU' };

    await updateProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain('trùng lặp');
  });

  // ─── TC05: Chỉ cập nhật các field có trong updatableFields ───
  it('TC05: Không ghi đè field isDeleted từ req.body', async () => {
    const mockProduct = {
      _id: 'prod_safe',
      name: 'Safe Product',
      isDeleted: false,
      save: jest.fn().mockResolvedValue(true),
    };

    Product.findById.mockResolvedValue(mockProduct);

    req.params.id = 'prod_safe';
    // Kẻ tấn công cố gắng gửi isDeleted = true qua body
    req.body = { name: 'Hacked Name', isDeleted: true };

    await updateProduct(req, res, next);

    // isDeleted không nằm trong updatableFields => KHÔNG bị thay đổi
    expect(mockProduct.isDeleted).toBe(false);
    expect(mockProduct.name).toBe('Hacked Name');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ─── TC06: Cập nhật nhiều field cùng lúc ───
  it('TC06: Cập nhật đồng thời name, price, gender thành công', async () => {
    const mockProduct = {
      _id: 'prod_multi',
      name: 'Old Name',
      price: 5000000,
      gender: 'male',
      isDeleted: false,
      save: jest.fn().mockResolvedValue(true),
    };

    Product.findById.mockResolvedValue(mockProduct);

    req.params.id = 'prod_multi';
    req.body = { name: 'New Name', price: 9000000, gender: 'female' };

    await updateProduct(req, res, next);

    expect(mockProduct.name).toBe('New Name');
    expect(mockProduct.price).toBe(9000000);
    expect(mockProduct.gender).toBe('female');
    expect(mockProduct.save).toHaveBeenCalled();
  });
});
