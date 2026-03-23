import { Link } from 'react-router-dom';

export default function CustomerFooter() {
  return (
    <footer className="w-full px-12 py-24 flex flex-col md:flex-row justify-between items-start gap-16 bg-surface-container-low border-t border-outline-variant/10 relative z-20">
      <div className="flex flex-col gap-8">
        <div className="font-display text-3xl text-on-surface">Luxury Watch Store</div>
        <p className="max-w-xs font-body text-[12px] tracking-widest uppercase font-light leading-relaxed opacity-60">
            Tuyển tập những cỗ máy thời gian danh giá nhất thế giới. Sự kết hợp giữa di sản và nghệ thuật chế tác hiện đại.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-24 gap-y-4">
        <Link to="/privacy" className="font-body text-[12px] tracking-widest uppercase font-light text-on-surface/60 hover:text-primary-container transition-colors duration-500">Chính sách Bảo mật</Link>
        <Link to="/terms" className="font-body text-[12px] tracking-widest uppercase font-light text-on-surface/60 hover:text-primary-container transition-colors duration-500">Điều khoản Dịch vụ</Link>
        <Link to="/shipping" className="font-body text-[12px] tracking-widest uppercase font-light text-on-surface/60 hover:text-primary-container transition-colors duration-500">Giao hàng</Link>
        <Link to="/contact" className="font-body text-[12px] tracking-widest uppercase font-light text-on-surface/60 hover:text-primary-container transition-colors duration-500">Liên hệ</Link>
      </div>
      <div className="flex flex-col items-end gap-4 self-end md:self-auto">
        <div className="font-body text-[12px] tracking-widest uppercase font-light text-on-surface/40">
            © 2026 Luxury Watch Store. Mọi bản quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
