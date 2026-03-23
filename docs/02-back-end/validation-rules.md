# ✅ Validation Rules

> Input validation cho các API endpoints.

---

## Công cụ: `express-validator`

## Auth Validations

### Register
```javascript
[
  body('username').notEmpty().withMessage('Username là bắt buộc')
    .isLength({ min: 3, max: 30 }).withMessage('Username 3-30 ký tự'),
  body('email').isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
  body('fullName').optional().trim().isLength({ max: 100 }),
]
```

### Login
```javascript
[
  body('username').notEmpty().withMessage('Username là bắt buộc'),
  body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
]
```

## Product Validations

### Create/Update Product
```javascript
[
  body('title').notEmpty().trim().isLength({ max: 200 }),
  body('sku').notEmpty().trim(),
  body('price').isNumeric().custom(v => v >= 0),
  body('category').isMongoId().withMessage('Category ID không hợp lệ'),
  body('collection').optional().isMongoId(),
  body('gender').optional().isIn(['male', 'female', 'unisex']),
  body('movement').optional().isIn(['automatic', 'quartz', 'mechanical', 'solar', 'eco-drive']),
  body('strapMaterial').optional().isIn(['leather', 'steel', 'titanium', 'silicone', 'ceramic', 'nato', 'rubber']),
  body('caseSize').optional().isNumeric().custom(v => v >= 20 && v <= 60),
  body('waterResistance').optional().isNumeric().custom(v => v >= 0),
  body('discountPercent').optional().isNumeric().custom(v => v >= 0 && v <= 100),
]
```

## Category Validations

```javascript
[
  body('name').notEmpty().trim().isLength({ max: 100 }).withMessage('Tên thương hiệu là bắt buộc'),
]
```

## Cart Validations

```javascript
[
  body('product').isMongoId().withMessage('Product ID không hợp lệ'),
  body('quantity').isInt({ min: 1 }).withMessage('Số lượng tối thiểu 1'),
]
```

## Order Validations (Checkout)

```javascript
[
  body('shippingAddress.fullName').notEmpty().withMessage('Họ tên là bắt buộc'),
  body('shippingAddress.phone').notEmpty().withMessage('SĐT là bắt buộc')
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/).withMessage('SĐT không hợp lệ'),
  body('shippingAddress.address').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('paymentMethod').isIn(['cod', 'vnpay']).withMessage('Phương thức thanh toán không hợp lệ'),
  body('couponCode').optional().trim().isLength({ max: 50 }),
]
```

## Coupon Validations

```javascript
[
  body('code').notEmpty().trim().toUpperCase(),
  body('discountType').isIn(['percent', 'fixed']),
  body('discountValue').isNumeric().custom(v => v > 0),
  body('expiresAt').isISO8601().withMessage('Ngày hết hạn không hợp lệ'),
  body('minOrderAmount').optional().isNumeric().custom(v => v >= 0),
  body('maxDiscount').optional().isNumeric().custom(v => v >= 0),
  body('maxUses').optional().isInt({ min: 1 }),
]
```
