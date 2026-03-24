import { useState } from 'react';
import { Search } from 'lucide-react';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks/useOrderAdmin';
import toast from 'react-hot-toast';
import './OrderListPage.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã huỷ' },
];

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Chờ xử lý', className: 'order-badge--pending' },
  confirmed: { label: 'Đã xác nhận', className: 'order-badge--confirmed' },
  processing: { label: 'Đang xử lý', className: 'order-badge--processing' },
  shipping: { label: 'Đang giao', className: 'order-badge--shipping' },
  delivered: { label: 'Đã giao', className: 'order-badge--delivered' },
  completed: { label: 'Hoàn thành', className: 'order-badge--completed' },
  cancelled: { label: 'Đã huỷ', className: 'order-badge--cancelled' },
};

const formatVND = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function OrderListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminOrders({ search, status: statusFilter, page, limit: 20 });
  const updateStatus = useUpdateOrderStatus();

  const orders = data?.data || [];
  const pagination = data?.pagination;

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus.mutate(
      { id: orderId, status: newStatus },
      {
        onSuccess: () => toast.success(`Cập nhật trạng thái thành công`),
        onError: (err: any) => toast.error(err.response?.data?.message || 'Cập nhật thất bại'),
      }
    );
  };

  const columns: Column<any>[] = [
    {
      key: 'orderCode',
      title: 'Mã đơn',
      width: '160px',
      render: (o) => <span className="order-code">{o.orderCode}</span>,
    },
    {
      key: 'user',
      title: 'Khách hàng',
      render: (o) => o.user?.fullName || o.user?.username || o.user?.email || '—',
    },
    {
      key: 'items',
      title: 'SP',
      width: '50px',
      render: (o) => o.items?.length || 0,
    },
    {
      key: 'finalAmount',
      title: 'Tổng tiền',
      width: '140px',
      render: (o) => formatVND(o.finalAmount),
    },
    {
      key: 'paymentMethod',
      title: 'Thanh toán',
      width: '90px',
      render: (o) => (
        <span className="order-payment">{o.paymentMethod === 'vnpay' ? 'VNPay' : 'COD'}</span>
      ),
    },
    {
      key: 'isPaid',
      title: 'Đã TT',
      width: '70px',
      render: (o) => (
        <span className={`order-paid ${o.isPaid ? 'order-paid--yes' : 'order-paid--no'}`}>
          {o.isPaid ? '✓' : '✗'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: '160px',
      render: (o) => {
        const info = STATUS_LABELS[o.status] || { label: o.status, className: '' };
        return (
          <select
            className={`order-status-select ${info.className}`}
            value={o.status}
            onChange={(e) => handleStatusChange(o._id, e.target.value)}
            disabled={o.status === 'cancelled' || o.status === 'completed'}
          >
            {STATUS_OPTIONS.filter(s => s.value !== 'all').map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        );
      },
    },
    {
      key: 'createdAt',
      title: 'Ngày đặt',
      width: '140px',
      render: (o) => formatDate(o.createdAt),
    },
  ];

  return (
    <div className="order-list">
      <h1 className="order-list__title">Quản lý đơn hàng</h1>

      <div className="order-list__toolbar">
        <div className="order-list__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo mã đơn..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="order-list__filters">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s.value}
              className={`order-list__filter-btn ${statusFilter === s.value ? 'order-list__filter-btn--active' : ''}`}
              onClick={() => { setStatusFilter(s.value); setPage(1); }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={orders}
        loading={isLoading}
        rowKey={(o: any) => o._id}
        emptyText="Không có đơn hàng nào"
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="order-list__pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              className={`order-list__page ${page === i + 1 ? 'order-list__page--active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
