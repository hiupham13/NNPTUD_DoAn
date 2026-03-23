import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function CustomerHeader() {
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
        <Link to="/login" className="font-headline uppercase tracking-[0.2em] text-[11px] font-light text-on-surface opacity-80 hover:text-primary-container transition-all">
          Đăng nhập
        </Link>
        <div className="w-[1px] h-3 bg-outline-variant opacity-50"></div>
        <Link to="/register" className="font-headline uppercase tracking-[0.2em] text-[11px] font-bold text-primary-container opacity-90 hover:opacity-100 transition-all">
          Đăng ký
        </Link>
        <Link to="/cart" className="relative ml-4">
          <ShoppingBag className="w-5 h-5 opacity-80 cursor-pointer hover:text-primary-container transition-colors" />
        </Link>
      </div>
    </nav>
  );
}
