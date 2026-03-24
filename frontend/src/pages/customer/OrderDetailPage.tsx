import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useOrder, useCancelOrder } from '../../hooks/useOrders';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';
import './OrderDetailPage.css';

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

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id || '');
  const cancelMutation = useCancelOrder();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancel = () => {
    if (!id) return;
    cancelMutation.mutate(
      { id, reason: cancelReason || 'Khách hàng huỷ đơn' },
      {
        onSuccess: () => {
          toast.success('Đã huỷ đơn hàng');
          setShowCancelDialog(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Không thể huỷ đơn');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="order-detail">
        <div className="order-detail__loading">Đang tải...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail">
        <div className="order-detail__loading">Không tìm thấy đơn hàng</div>
      </div>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="order-detail">
      {/* Header */}
      <div className="order-detail__header">
        <Link to="/orders" className="order-detail__back">
          <ChevronLeft size={16} strokeWidth={1.5} />
          <span>Quay lại đơn hàng</span>
        </Link>
        <div className="order-detail__title-row">
          <h1 className="order-detail__title">{order.orderCode}</h1>
          <span className={`order-detail__status order-detail__status--${order.status}`}>
            {STATUS_MAP[order.status] || order.status}
          </span>
        </div>
        <span className="order-detail__date">
          Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
        </span>
      </div>

      {/* Timeline (chỉ hiện khi chưa cancel) */}
      {order.status !== 'cancelled' && order.status !== 'returned' && (
        <div className="order-timeline">
          {STATUS_STEPS.map((step, i) => (
            <div
              key={step}
              className={`order-timeline__step ${i <= currentStepIndex ? 'order-timeline__step--done' : ''} ${i === currentStepIndex ? 'order-timeline__step--current' : ''}`}
            >
              <div className="order-timeline__dot" />
              <span className="order-timeline__label">{STATUS_MAP[step]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Info Grid */}
      <div className="order-detail__info-grid">
        <div className="order-info-card">
          <h3 className="order-info-card__title">Thông Tin Giao Hàng</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.address}</p>
          {order.shippingAddress.city && <p>{order.shippingAddress.city}</p>}
          {order.shippingAddress.note && <p className="order-info-card__note">Ghi chú: {order.shippingAddress.note}</p>}
        </div>

        <div className="order-info-card">
          <h3 className="order-info-card__title">Thanh Toán</h3>
          <p>{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'VNPay'}</p>
          <p>Trạng thái: {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
          {order.paidAt && <p>Ngày TT: {new Date(order.paidAt).toLocaleDateString('vi-VN')}</p>}
        </div>
      </div>

      {/* Items Snapshot */}
      <section className="order-detail__items-section">
        <h2 className="order-detail__section-title">Sản Phẩm Đã Mua</h2>
        <div className="order-detail__items">
          {order.items.map((item, idx) => (
            <div key={idx} className="order-item">
              <div className="order-item__image">
                <img src={item.image || ''} alt={item.title} />
              </div>
              <div className="order-item__info">
                <span className="order-item__name">{item.title}</span>
                <span className="order-item__meta">SKU: {item.sku}</span>
              </div>
              <div className="order-item__qty">×{item.quantity}</div>
              <div className="order-item__price">{formatPrice(item.subtotal)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <div className="order-detail__totals">
        <div className="order-detail__totals-row">
          <span>Tạm tính</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
        {order.couponCode && (
          <div className="order-detail__totals-row order-detail__totals-row--discount">
            <span>Giảm giá ({order.couponCode})</span>
            <span>−{formatPrice(order.discount)}</span>
          </div>
        )}
        <div className="order-detail__totals-row">
          <span>Phí vận chuyển</span>
          <span>{order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}</span>
        </div>
        <div className="order-detail__totals-divider" />
        <div className="order-detail__totals-row order-detail__totals-row--final">
          <span>Tổng cộng</span>
          <span>{formatPrice(order.finalAmount)}</span>
        </div>
      </div>

      {/* Cancel Button */}
      {canCancel && !showCancelDialog && (
        <button className="order-detail__cancel-btn" onClick={() => setShowCancelDialog(true)}>
          Huỷ Đơn Hàng
        </button>
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="order-detail__cancel-dialog">
          <p className="order-detail__cancel-text">Bạn có chắc chắn muốn huỷ đơn hàng này?</p>
          <textarea
            className="order-detail__cancel-reason"
            placeholder="Lý do huỷ đơn (tuỳ chọn)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={2}
          />
          <div className="order-detail__cancel-actions">
            <button className="order-detail__cancel-no" onClick={() => setShowCancelDialog(false)}>
              Không, giữ đơn
            </button>
            <button
              className="order-detail__cancel-yes"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? 'Đang huỷ...' : 'Xác nhận huỷ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
