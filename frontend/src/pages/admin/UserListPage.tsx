import { useState } from 'react';
import { Search, Lock, Unlock, Eye, X } from 'lucide-react';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { useAdminUsers, useToggleUserStatus, useUserOrders } from '../../hooks/useUserAdmin';
import toast from 'react-hot-toast';
import './UserListPage.css';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatVND = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

function UserDetailDrawer({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data: orders = [], isLoading } = useUserOrders(userId);

  return (
    <div className="user-drawer__overlay" onClick={onClose}>
      <div className="user-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="user-drawer__header">
          <h2>Đơn hàng của người dùng</h2>
          <button className="user-drawer__close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="user-drawer__body">
          {isLoading ? (
            <p className="user-drawer__loading">Đang tải...</p>
          ) : orders.length === 0 ? (
            <p className="user-drawer__empty">Chưa có đơn hàng nào</p>
          ) : (
            <table className="user-drawer__table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o._id}>
                    <td className="order-code">{o.orderCode}</td>
                    <td>{formatVND(o.finalAmount)}</td>
                    <td><span className={`user-status-badge user-status-badge--${o.status}`}>{o.status}</span></td>
                    <td>{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data, isLoading } = useAdminUsers({ search, page, limit: 20 });
  const toggleStatus = useToggleUserStatus();

  const users = data?.data || [];
  const pagination = data?.pagination;

  const handleToggle = (id: string, name: string, isActive: boolean) => {
    const action = isActive ? 'khoá' : 'mở khoá';
    if (!confirm(`Bạn có chắc muốn ${action} tài khoản "${name}"?`)) return;
    toggleStatus.mutate(id, {
      onSuccess: (res: any) => toast.success(res.message),
      onError: (err: any) => toast.error(err.response?.data?.message || 'Thất bại'),
    });
  };

  const columns: Column<any>[] = [
    {
      key: 'fullName',
      title: 'Họ tên',
      render: (u) => u.fullName || u.username || '—',
    },
    { key: 'email', title: 'Email' },
    {
      key: 'role',
      title: 'Vai trò',
      width: '100px',
      render: (u) => (
        <span className={`user-role ${u.role?.name === 'admin' ? 'user-role--admin' : ''}`}>
          {u.role?.name === 'admin' ? 'Admin' : 'Khách hàng'}
        </span>
      ),
    },
    {
      key: 'isActive',
      title: 'Trạng thái',
      width: '100px',
      render: (u) => (
        <span className={`user-active ${u.isActive ? 'user-active--yes' : 'user-active--no'}`}>
          {u.isActive ? 'Hoạt động' : 'Đã khoá'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      width: '110px',
      render: (u) => formatDate(u.createdAt),
    },
    {
      key: 'actions',
      title: '',
      width: '100px',
      render: (u) => (
        <div className="user-actions">
          <button
            className="user-actions__btn"
            title="Xem đơn hàng"
            onClick={(e) => { e.stopPropagation(); setSelectedUserId(u._id); }}
          >
            <Eye size={14} />
          </button>
          {u.role?.name !== 'admin' && (
            <button
              className={`user-actions__btn ${u.isActive ? 'user-actions__btn--lock' : 'user-actions__btn--unlock'}`}
              title={u.isActive ? 'Khoá' : 'Mở khoá'}
              onClick={(e) => { e.stopPropagation(); handleToggle(u._id, u.fullName || u.username, u.isActive); }}
            >
              {u.isActive ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="user-list">
      <h1 className="user-list__title">Quản lý người dùng</h1>

      <div className="user-list__toolbar">
        <div className="user-list__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={users}
        loading={isLoading}
        rowKey={(u: any) => u._id}
        emptyText="Không có người dùng nào"
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="user-list__pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              className={`user-list__page ${page === i + 1 ? 'user-list__page--active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {selectedUserId && (
        <UserDetailDrawer userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  );
}
