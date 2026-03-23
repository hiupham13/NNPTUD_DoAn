import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 className="font-display italic text-xl text-primary-container">The Curator</h1>
      </div>
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4 font-body text-sm">
        <Link to="/admin" className="p-3 hover:bg-gray-800 rounded transition-colors uppercase tracking-widest text-[#d4af37]">Dashboard</Link>
        <Link to="/admin/products" className="p-3 hover:bg-gray-800 rounded transition-colors uppercase tracking-widest">Products</Link>
        <Link to="/admin/orders" className="p-3 hover:bg-gray-800 rounded transition-colors uppercase tracking-widest">Orders</Link>
        <Link to="/admin/users" className="p-3 hover:bg-gray-800 rounded transition-colors uppercase tracking-widest">Users</Link>
        <Link to="/admin/categories" className="p-3 hover:bg-gray-800 rounded transition-colors uppercase tracking-widest">Categories</Link>
        <Link to="/admin/collections" className="p-3 hover:bg-gray-800 rounded transition-colors uppercase tracking-widest">Collections</Link>
        <Link to="/admin/coupons" className="p-3 hover:bg-gray-800 rounded transition-colors uppercase tracking-widest">Coupons</Link>
      </nav>
    </aside>
  );
}

function AdminHeader() {
  const { user, logout } = useAuthStore();
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="font-body font-medium text-gray-700">Admin Dashboard</div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-body text-gray-600">{user?.name}</span>
        <button onClick={logout} className="text-sm text-red-600 font-body hover:underline">Logout</button>
      </div>
    </header>
  );
}

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 flex-col pl-64">
      <AdminSidebar />
      <AdminHeader />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
