const mongoose = require('mongoose');

// SNAPSHOT — lưu thông tin sản phẩm tại thời điểm đặt hàng
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Snapshot data (không thay đổi dù product bị sửa/xoá)
    snapshot: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, default: '' },
      slug: { type: String, default: '' },
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      ward: { type: String, default: '' },
      district: { type: String, required: true },
      city: { type: String, required: true },
    },
    shippingFee: {
      type: Number,
      default: 50000, // 50.000₫ cố định
    },
    coupon: {
      code: { type: String, default: '' },
      discountAmount: { type: Number, default: 0 },
    },
    subtotal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'vnpay'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
      default: 'pending',
    },
    note: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderCode: 1 });

module.exports = mongoose.model('Order', orderSchema);
