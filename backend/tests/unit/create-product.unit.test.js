/**
 * UNIT TEST — Create Product Controller
 * Chương 5: Kiểm thử đơn vị (Unit Test)
 * 
 * Kỹ thuật: Jest Mock — giả lập Product Model, Inventory Model
 * KHÔNG kết nối Database, KHÔNG khởi động Server.
 */

const { createProduct } = require('../../controllers/products');
const Product = require('../../schemas/products');
const Inventory = require('../../schemas/inventories');
const AppError = require('../../utils/AppError');

jest.mock('../../schemas/products');
jest.mock('../../schemas/inventories');

describe('Unit Test — Create Product Controller', () => {
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

  // ─── TC01: Tạo sản phẩm thành công ───
  it('TC01: Trả về 201 khi tạo sản phẩm hợp lệ', async () => {
    const mockProduct = {
      _id: 'prod_001',
      name: 'Rolex Submariner',
      sku: 'ROL-001',
      price: 10000000,
    };

    Product.create.mockResolvedValue(mockProduct);
    Inventory.create.mockResolvedValue({});

    req.body = { name: 'Rolex Submariner', sku: 'ROL-001', price: 10000000, category: 'cat_001' };

    await createProduct(req, res, next);

    expect(Product.create).toHaveBeenCalledWith(req.body);
    expect(Inventory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        product: 'prod_001',
        stock: 0,
        reserved: 0,
        soldCount: 0,
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Tạo sản phẩm thành công',
        data: mockProduct,
      })
    );
  });

  // ─── TC02: SKU hoặc Tên bị trùng (MongoDB error code 11000) ───
  it('TC02: Gọi next(AppError 400) khi SKU / Tên đã tồn tại', async () => {
    const duplicateError = new Error('Duplicate key');
    duplicateError.code = 11000;

    Product.create.mockRejectedValue(duplicateError);

    req.body = { name: 'Rolex Submariner', sku: 'ROL-001', price: 10000000, category: 'cat_001' };

    await createProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain('SKU hoặc Tên sản phẩm đã tồn tại');
  });

  // ─── TC03: Lỗi bất ngờ từ Database ───
  it('TC03: Gọi next(error) khi Database gặp lỗi khác', async () => {
    const dbError = new Error('Connection timeout');
    Product.create.mockRejectedValue(dbError);

    req.body = { name: 'Test', sku: 'T-001', price: 5000000, category: 'cat_001' };

    await createProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });

  // ─── TC04: Tự động tạo Inventory khi tạo sản phẩm ───
  it('TC04: Inventory.create() được gọi với stock = 0 sau khi tạo sản phẩm', async () => {
    Product.create.mockResolvedValue({ _id: 'prod_auto_inv' });
    Inventory.create.mockResolvedValue({});

    req.body = { name: 'Auto Inventory', sku: 'AI-001', price: 1000000, category: 'cat_001' };

    await createProduct(req, res, next);

    expect(Inventory.create).toHaveBeenCalledTimes(1);
    expect(Inventory.create).toHaveBeenCalledWith(
      expect.objectContaining({ stock: 0 })
    );
  });

  // ─── TC05: req.body được truyền nguyên vẹn vào Product.create ───
  it('TC05: Toàn bộ req.body được truyền thẳng vào Product.create', async () => {
    const fullBody = {
      name: 'Full Body Test',
      sku: 'FB-001',
      price: 8000000,
      category: 'cat_002',
      gender: 'female',
      movement: 'quartz',
      description: 'Full body product',
    };

    Product.create.mockResolvedValue({ _id: 'prod_full', ...fullBody });
    Inventory.create.mockResolvedValue({});

    req.body = fullBody;

    await createProduct(req, res, next);

    expect(Product.create).toHaveBeenCalledWith(fullBody);
  });

  // ─── TC06: Không gọi Inventory.create nếu Product.create thất bại ───
  it('TC06: Inventory.create KHÔNG được gọi nếu Product.create lỗi', async () => {
    Product.create.mockRejectedValue(new Error('Validation failed'));

    req.body = { name: 'Fail', sku: 'FAIL-001', price: -1, category: 'cat_001' };

    await createProduct(req, res, next);

    expect(Inventory.create).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
