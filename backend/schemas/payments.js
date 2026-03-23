const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    method: {
      type: String,
      enum: ['cod', 'vnpay'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    // VNPay specific
    vnpayTransactionId: {
      type: String,
      default: '',
    },
    vnpayResponseCode: {
      type: String,
      default: '',
    },
    vnpayBankCode: {
      type: String,
      default: '',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ order: 1 });

module.exports = mongoose.model('Payment', paymentSchema);