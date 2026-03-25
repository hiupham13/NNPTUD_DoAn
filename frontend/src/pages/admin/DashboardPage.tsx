import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid
} from 'recharts';
import { useStats, useRevenueChart, useOrdersChart } from '../../hooks/useAdmin';
import './DashboardPage.css';

const formatVND = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toString();
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: revenueData } = useRevenueChart();
  const { data: ordersData } = useOrdersChart();

  const statCards = [
    {
      label: 'Doanh thu',
      value: stats ? formatVND(stats.totalRevenue) : '---',
      icon: DollarSign,
      color: '#d4af37',
      bg: 'rgba(212,175,55,0.1)',
    },
    {
      label: 'Đơn hàng',
      value: stats?.totalOrders ?? '---',
      icon: ShoppingCart,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Người dùng',
      value: stats?.totalUsers ?? '---',
      icon: Users,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Sản phẩm',
      value: stats?.totalProducts ?? '---',
      icon: Package,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.1)',
    },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>

      {/* Stats Cards */}
      <div className="dashboard__cards">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-card__icon" style={{ background: card.bg, color: card.color }}>
              <card.icon size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__label">{card.label}</span>
              <span className="stat-card__value">{statsLoading ? '...' : card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard__charts">
        {/* Revenue Chart */}
        <div className="chart-card">
          <h2 className="chart-card__title">Doanh thu theo tháng</h2>
          <div className="chart-card__body">
            {revenueData ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#adb5bd' }} />
                  <YAxis tickFormatter={formatVND} tick={{ fontSize: 11, fill: '#adb5bd' }} />
                  <Tooltip
                    formatter={(value) => [new Intl.NumberFormat('vi-VN').format(Number(value)) + ' ₫', 'Doanh thu']}
                    contentStyle={{ fontSize: '0.8rem', borderRadius: 6 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#d4af37" fill="url(#revenueGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-card__loading">Đang tải...</div>
            )}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="chart-card">
          <h2 className="chart-card__title">Đơn hàng 30 ngày gần nhất</h2>
          <div className="chart-card__body">
            {ordersData ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#adb5bd' }} interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#adb5bd' }} />
                  <Tooltip
                    formatter={(value) => [Number(value), 'Đơn hàng']}
                    contentStyle={{ fontSize: '0.8rem', borderRadius: 6 }}
                  />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-card__loading">Đang tải...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
