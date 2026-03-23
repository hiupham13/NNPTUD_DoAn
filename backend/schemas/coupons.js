const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Mã coupon là bắt buộc'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, 'Giá trị giảm là bắt buộc'],
      min: [0, 'Giá trị giảm không được âm'],
    },
    maxDiscount: {
      type: Number,
      default: null, // null = unlimited (for percentage)
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxUses: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Ngày hết hạn là bắt buộc'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Check if coupon is valid
couponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.expiresAt < new Date()) return false;
  if (this.maxUses !== null && this.usedCount >= this.maxUses) return false;
  return true;
};

module.exports = mongoose.model('Coupon', couponSchema);
