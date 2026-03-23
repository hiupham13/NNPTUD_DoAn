const mongoose = require('mongoose');
const cron = require('node-cron');
const Order = require('../schemas/orders');
const Inventory = require('../schemas/inventories');

exports.startCleanupCron = () => {
  // Chạy mỗi 5 phút
  cron.schedule('*/5 * * * *', async () => {
    try {
      // Tìm các đơn VNPay Pending tạo > 15 phút trước
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60000);
      
      const expiredOrders = await Order.find({
        paymentMethod: 'vnpay',
        status: 'pending',
        createdAt: { $lt: fifteenMinsAgo },
        isDeleted: false
      });

      if (expiredOrders.length > 0) {
        console.log(`[Nodes Cron] Đang quét ${expiredOrders.length} VNPay Orders bị quá hạn thanh toán...`);

        for (const order of expiredOrders) {
          order.status = 'cancelled';
          order.cancelReason = 'Hết thời gian thanh toán VNPay (15 phút)';
          order.cancelledAt = new Date();

          // EC-42: Trả lại kho (giảm reserved)
          for (const item of order.items) {
            if (item.product) {
               await Inventory.updateOne(
                 { product: item.product },
                 { $inc: { reserved: -item.quantity } } 
               );
            }
          }

          await order.save();
          console.log(`[Nodes Cron] ❌ Đã tự động HUỶ đơn treo ${order.orderCode} & Phục hồi Tồn Kho!`);
        }
      }
    } catch (error) {
      console.error('[Nodes Cron] Lỗi Cleanup Orders:', error);
    }
  });

  console.log('✅ CronJob dọn rác đơn VNPay pending đã khởi động! (*/5 * * * *)');
};
