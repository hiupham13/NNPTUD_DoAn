const mongoose = require('mongoose');

// ===== SUB-SCHEMA: Snapshot sản phẩm tại thời điểm đặt hàng =====
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null, // giữ ref để truy vết, có thể null nếu bị xoá cứng (tuyệt đối ko)
    },
    // Snapshot fields
    title: { type: String, required: true },
    sku: { type: String, required: true },
    slug: { type: String, default: '' },
    price: { type: Number, required: true }, // Giá bán lúc mua (salePrice của product lúc mua)
    originalPrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    image: { type: String, default: '' },
    categoryName: { type: String, default: '' },
    movement: { type: String, default: '' },
    gender: { type: String, default: '' },
    
    // Thuộc tính order
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true }, // price * quantity
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true, // VD: ORD-20260324-A7F2
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, default: '' },
      note: { type: String, default: '' },
    },
    shippingFee: { type: Number, default: 50000 },
    
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
    couponCode: { type: String, default: '' }, // Snapshot
    discount: { type: Number, default: 0 }, // Số tiền đã giảm thật sự

    totalAmount: { type: Number, required: true }, // Tổng subtotals
    finalAmount: { type: Number, required: true }, // total + shipping - discount

    paymentMethod: { type: String, enum: ['cod', 'vnpay'], default: 'cod' },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled', 'returned'],
      default: 'pending',
    },
    
    cancelledAt: { type: Date, default: null },
    cancelReason: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.index({ orderCode: 1 });
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
