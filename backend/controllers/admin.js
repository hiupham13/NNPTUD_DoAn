const Order = require('../schemas/orders');
const Product = require('../schemas/products');
const User = require('../schemas/users');

// @desc    Dashboard — Lấy thống kê tổng hợp
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, totalUsers, totalProducts] = await Promise.all([
      Order.countDocuments({ isDeleted: false }),
      Order.aggregate([
        { $match: { isDeleted: false, status: { $nin: ['cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ]),
      User.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false, isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        totalProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard — Revenue theo tháng (12 tháng gần nhất)
// @route   GET /api/v1/admin/stats/revenue-chart
// @access  Private/Admin
exports.getRevenueChart = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const revenue = await Order.aggregate([
      {
        $match: {
          isDeleted: false,
          status: { $nin: ['cancelled'] },
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Fill missing months with 0
    const result = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = revenue.find(r => r._id.year === year && r._id.month === month);
      result.push({
        month: `${month}/${year}`,
        revenue: found?.revenue || 0,
        orders: found?.count || 0
      });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard — Đơn hàng theo ngày (30 ngày gần nhất)
// @route   GET /api/v1/admin/stats/orders-chart
// @access  Private/Admin
exports.getOrdersChart = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const orders = await Order.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$finalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Fill missing days with 0
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const found = orders.find(o =>
        o._id.year === year && o._id.month === month && o._id.day === day
      );
      result.push({
        date: `${day}/${month}`,
        orders: found?.count || 0,
        revenue: found?.revenue || 0
      });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
