import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  FolderTree, Layers, Ticket, Warehouse, Settings, LogOut, Watch
} from 'lucide-react';
import './AdminLayout.css';

const MENU_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Sản phẩm', icon: Package },
  { path: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
  { path: '/admin/users', label: 'Người dùng', icon: Users },
  { path: '/admin/inventory', label: 'Tồn kho', icon: Warehouse },
  { path: '/admin/settings', label: 'Cài đặt', icon: Settings },
];

function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <Watch size={20} strokeWidth={1.5} />
        <span>The Curator</span>
      </div>
      <nav className="admin-sidebar__nav">
        {MENU_ITEMS.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`admin-sidebar__link ${isActive(path) ? 'admin-sidebar__link--active' : ''}`}
          >
            <Icon size={18} strokeWidth={1.5} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function AdminHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="admin-header__title">Trang quản trị</div>
      <div className="admin-header__user">
        <span className="admin-header__name">{user?.name}</span>
        <button className="admin-header__logout" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.5} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__main">
        <AdminHeader />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
