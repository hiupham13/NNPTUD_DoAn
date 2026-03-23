const Order = require('../schemas/orders');
const Payment = require('../schemas/payments');
const Inventory = require('../schemas/inventories');
const { verifyVNPaySignature } = require('../utils/vnpay');
const AppError = require('../utils/AppError');

// @desc    IPN (Server-to-Server) -> Cập nhật DB thực tế
// @route   GET /api/v1/payments/vnpay-ipn
// @access  Public (VNPay call)
exports.vnpayIPN = async (req, res, next) => {
  try {
    const vnp_Params = { ...req.query };
    
    // So sánh MAC SHA512
    const isChecksumValid = verifyVNPaySignature(req.query);

    if (isChecksumValid) {
      const orderCode = vnp_Params['vnp_TxnRef'];
      const rspCode = vnp_Params['vnp_ResponseCode'];
      const amountStr = vnp_Params['vnp_Amount'];

      // Móc Order lên (Cẩn thận EC-44 IPN Duplicate Cập Nhật Khống)
      const order = await Order.findOne({ orderCode });
      
      if (!order) {
        return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }

      // Check amount
      if (order.finalAmount * 100 !== Number(amountStr)) {
        return res.status(200).json({ RspCode: '04', Message: 'invalid amount' });
      }

      // Đơn hàng rác EC-44 Duplicate: chỉ success/cancel mới bỏ qua update
      if (order.isPaid || order.status !== 'pending') {
        return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
      }

      if (rspCode === '00') {
        // Khách thanh toán Thành Công
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'processing'; // Upped level pending -> processing
        
        await order.save();

        // Ghi lại hoá đơn thanh toán (Kế toán)
        await Payment.create({
          order: order._id,
          method: 'vnpay',
          amount: order.finalAmount,
          status: 'success',
          vnpayTransactionId: vnp_Params['vnp_TransactionNo'],
          vnpayResponseCode: rspCode,
          vnpayBankCode: vnp_Params['vnp_BankCode'],
          paidAt: new Date()
        });

      } else {
        // Thanh toán Xịt !! Huỷ Đơn & Nhả Inventory (EC-42)
        order.status = 'cancelled';
        order.cancelReason = `VNPay Error Code: ${rspCode}`;
        order.cancelledAt = new Date();

        await order.save();

        for (const item of order.items) {
          if (item.product) {
              await Inventory.updateOne(
                { product: item.product },
                { $inc: { reserved: -item.quantity } } 
              );
          }
        }

        await Payment.create({
          order: order._id,
          method: 'vnpay',
          amount: order.finalAmount,
          status: 'failed',
          vnpayResponseCode: rspCode,
          vnpayBankCode: vnp_Params['vnp_BankCode'] || ''
        });
      }

      // ACK VNPay Success System Run
      return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
      
    } else {
      return res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
    }

  } catch (error) {
    console.error('IPN ERROR:', error);
    return res.status(200).json({ RspCode: '99', Message: 'Unknow error' });
  }
};

// @desc    Trả kết quả về Trang Web cho Khách hàng thấy (UI Redirect)
// @route   GET /api/v1/payments/vnpay-return
// @access  Public
exports.vnpayReturn = (req, res, next) => {
  // Thực tế Frontend gọi hoặc VNPay gọi trình duyệt nhảy url sang GET
  // Ko update DB ở đây (chỉ làm giao diện UI) 
  try {
    const isChecksumValid = verifyVNPaySignature(req.query);
    
    if (isChecksumValid) {
       // Thường Redirect thẳng về web `returnUrl?status=success...` thay vì res.json
       if (req.query.vnp_ResponseCode === '00') {
         res.status(200).json({ success: true, message: 'Giao dịch thành công', data: req.query });
       } else {
         res.status(400).json({ success: false, message: 'Giao dịch thất bại', code: req.query.vnp_ResponseCode });
       }
    } else {
       res.status(400).json({ success: false, message: 'Sai Checksum, nghi ngờ giả mạo!' });
    }
  } catch (error) {
    next(error);
  }
};
