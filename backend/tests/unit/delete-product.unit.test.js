/**
 * UNIT TEST — Delete Product Controller (Soft Delete + Bulk Delete)
 * Chương 5: Kiểm thử đơn vị (Unit Test)
 * 
 * Kỹ thuật: Jest Mock — giả lập Product Model
 * KHÔNG kết nối Database, KHÔNG khởi động Server.
 */

const { deleteProduct, bulkDeleteProducts } = require('../../controllers/products');
const Product = require('../../schemas/products');
const AppError = require('../../utils/AppError');

jest.mock('../../schemas/products');

describe('Unit Test — Delete Product Controller', () => {
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

  // ═══════════════════════════════════════════
  //  PHẦN A: deleteProduct (Xóa đơn lẻ)
  // ═══════════════════════════════════════════

  // ─── TC01: Xóa mềm thành công ───
  it('TC01: Trả về 200 và set isDeleted = true khi xóa thành công', async () => {
    const mockProduct = {
      _id: 'prod_001',
      name: 'Rolex To Delete',
      isDeleted: false,
      isActive: true,
      save: jest.fn().mockResolvedValue(true),
    };

    Product.findById.mockResolvedValue(mockProduct);

    req.params.id = 'prod_001';

    await deleteProduct(req, res, next);

    expect(mockProduct.isDeleted).toBe(true);
    expect(mockProduct.isActive).toBe(false);
    expect(mockProduct.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Xóa sản phẩm thành công',
      })
    );
  });

  // ─── TC02: Sản phẩm không tồn tại ───
  it('TC02: Gọi next(AppError 404) khi ID không tồn tại', async () => {
    Product.findById.mockResolvedValue(null);

    req.params.id = 'ghost_id';

    await deleteProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Không tìm thấy sản phẩm');
  });

  // ─── TC03: Sản phẩm đã bị xóa trước đó ───
  it('TC03: Gọi next(AppError 404) khi sản phẩm đã bị soft-delete rồi', async () => {
    const alreadyDeleted = {
      _id: 'prod_already_del',
      isDeleted: true,
    };

    Product.findById.mockResolvedValue(alreadyDeleted);

    req.params.id = 'prod_already_del';

    await deleteProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });

  // ─── TC04: Lỗi Database khi save ───
  it('TC04: Gọi next(error) khi save() gặp lỗi', async () => {
    const dbError = new Error('Write concern timeout');
    const mockProduct = {
      _id: 'prod_err',
      isDeleted: false,
      isActive: true,
      save: jest.fn().mockRejectedValue(dbError),
    };

    Product.findById.mockResolvedValue(mockProduct);

    req.params.id = 'prod_err';

    await deleteProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });

  // ═══════════════════════════════════════════
  //  PHẦN B: bulkDeleteProducts (Xóa hàng loạt)
  // ═══════════════════════════════════════════

  // ─── TC05: Xóa hàng loạt thành công ───
  it('TC05: Trả về 200 khi xóa nhiều sản phẩm cùng lúc', async () => {
    Product.updateMany.mockResolvedValue({ modifiedCount: 3 });

    req.body = { productIds: ['p1', 'p2', 'p3'] };

    await bulkDeleteProducts(req, res, next);

    expect(Product.updateMany).toHaveBeenCalledWith(
      { _id: { $in: ['p1', 'p2', 'p3'] } },
      { $set: { isDeleted: true, isActive: false } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Xóa 3 sản phẩm thành công',
      })
    );
  });

  // ─── TC06: Mảng productIds rỗng ───
  it('TC06: Gọi next(AppError 400) khi productIds là mảng rỗng', async () => {
    req.body = { productIds: [] };

    await bulkDeleteProducts(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain('ít nhất một sản phẩm');
    expect(Product.updateMany).not.toHaveBeenCalled();
  });

  // ─── TC07: productIds không được gửi (undefined) ───
  it('TC07: Gọi next(AppError 400) khi productIds = undefined', async () => {
    req.body = {};

    await bulkDeleteProducts(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
  });

  // ─── TC08: productIds không phải mảng ───
  it('TC08: Gọi next(AppError 400) khi productIds là string thay vì array', async () => {
    req.body = { productIds: 'not_an_array' };

    await bulkDeleteProducts(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
  });
});
