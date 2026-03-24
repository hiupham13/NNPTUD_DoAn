import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function CustomerHeader() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 bg-surface/80 backdrop-blur">
      <Link to="/" className="text-2xl font-display italic text-on-surface hover:text-primary-container transition-colors">
        Luxury Watch Store
      </Link>
      <div className="hidden md:flex gap-12 items-center">
        <Link to="/brands" className="font-headline uppercase tracking-[0.2em] text-[11px] font-light text-on-surface opacity-80 hover:text-primary-container hover:opacity-100 transition-all duration-500 ease-in-out">
          Thương hiệu
        </Link>
        <Link to="/products" className="font-headline uppercase tracking-[0.2em] text-[11px] font-light text-on-surface opacity-80 hover:text-primary-container hover:opacity-100 transition-all duration-500 ease-in-out">
          Đồng hồ
        </Link>
        <Link to="/collections" className="font-headline uppercase tracking-[0.2em] text-[11px] font-light text-on-surface opacity-80 hover:text-primary-container hover:opacity-100 transition-all duration-500 ease-in-out">
          Bộ sưu tập
        </Link>
        <Link to="/about" className="font-headline uppercase tracking-[0.2em] text-[11px] font-light text-on-surface opacity-80 hover:text-primary-container hover:opacity-100 transition-all duration-500 ease-in-out">
          Di sản
        </Link>
      </div>
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-all duration-300">
              <UserCircle className="w-5 h-5 text-on-surface" strokeWidth={1.5} />
              <span className="font-label uppercase tracking-[0.15em] text-[11px] font-light text-on-surface hidden lg:inline">
                {user?.name}
              </span>
            </button>

            {/* Dropdown — Luxury Style */}
            <div
              className={`absolute right-0 top-full pt-3 transition-all duration-300 ${
                dropdownOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="min-w-[240px] bg-surface border-t-2 border-t-primary-container border border-outline-variant/10 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
                {/* User info */}
                <div className="px-5 py-4 border-b border-outline-variant/10">
                  <p className="font-display text-base italic text-on-surface truncate">{user?.name}</p>
                  <p className="font-label text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-1 truncate" title={user?.email}>{user?.email}</p>
                </div>

                {/* Menu items */}
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 font-label text-[11px] tracking-[0.15em] uppercase text-on-surface/70 hover:text-primary-container hover:bg-surface-container-low transition-all duration-300"
                >
                  <User className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Hồ sơ
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-5 py-3 w-full text-left font-label text-[11px] tracking-[0.15em] uppercase text-on-surface/70 hover:text-primary-container hover:bg-surface-container-low transition-all duration-300"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="font-headline uppercase tracking-[0.2em] text-[11px] font-light text-on-surface opacity-80 hover:text-primary-container transition-all">
              Đăng nhập
            </Link>
            <div className="w-[1px] h-3 bg-outline-variant opacity-50"></div>
            <Link to="/register" className="font-headline uppercase tracking-[0.2em] text-[11px] font-bold text-primary-container opacity-90 hover:opacity-100 transition-all">
              Đăng ký
            </Link>
          </>
        )}
        <Link to="/cart" className="relative ml-4">
          <ShoppingBag className="w-5 h-5 opacity-80 cursor-pointer hover:text-primary-container transition-colors" />
        </Link>
      </div>
    </nav>
  );
}


