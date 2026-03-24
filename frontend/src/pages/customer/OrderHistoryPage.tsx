import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { useMyOrders } from '../../hooks/useOrders';
import { formatPrice } from '../../utils/format';
import './OrderHistoryPage.css';

const STATUS_MAP: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
  returned: 'Đã hoàn trả',
};

export default function OrderHistoryPage() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="orders-page">
        <div className="orders-page__loading">Đang tải đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">Đơn Hàng Của Tôi</h1>

      {!orders || orders.length === 0 ? (
        <div className="orders-page__empty">
          <Package size={48} strokeWidth={1} />
          <h2 className="orders-page__empty-title">Chưa có đơn hàng nào</h2>
          <p className="orders-page__empty-desc">Hãy khám phá bộ sưu tập đồng hồ của chúng tôi.</p>
          <Link to="/products" className="orders-page__empty-cta">Khám Phá Ngay</Link>
        </div>
      ) : (
        <div className="orders-page__list">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="order-card">
              <div className="order-card__header">
                <span className="order-card__code">{order.orderCode}</span>
                <span className={`order-card__status order-card__status--${order.status}`}>
                  {STATUS_MAP[order.status] || order.status}
                </span>
              </div>
              <div className="order-card__body">
                <span className="order-card__info">
                  {order.items.length} sản phẩm · {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </span>
                <span className="order-card__total">{formatPrice(order.finalAmount)}</span>
              </div>
              <div className="order-card__arrow">
                <ChevronRight size={16} strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
