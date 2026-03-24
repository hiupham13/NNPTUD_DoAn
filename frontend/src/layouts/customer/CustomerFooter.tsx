import { Link } from 'react-router-dom';
import './CustomerFooter.css';

export default function CustomerFooter() {
  return (
    <footer className="luxury-footer">
      <div className="luxury-footer__inner">
        {/* Top: Decorative line */}
        <div className="luxury-footer__divider" />

        {/* Main Grid */}
        <div className="luxury-footer__grid">
          {/* Brand */}
          <div className="luxury-footer__brand">
            <h2 className="luxury-footer__logo">Luxury Watch Store</h2>
            <p className="luxury-footer__tagline">
              Tuyển tập những cỗ máy thời gian danh giá nhất thế giới.
            </p>
          </div>

          {/* Navigation */}
          <div className="luxury-footer__col">
            <h3 className="luxury-footer__col-title">Khám Phá</h3>
            <nav className="luxury-footer__nav">
              <Link to="/products">Bộ Sưu Tập</Link>
              <Link to="/products?gender=men">Đồng Hồ Nam</Link>
              <Link to="/products?gender=women">Đồng Hồ Nữ</Link>
              <Link to="/products?sort=newest">Mới Nhất</Link>
            </nav>
          </div>

          {/* Support */}
          <div className="luxury-footer__col">
            <h3 className="luxury-footer__col-title">Hỗ Trợ</h3>
            <nav className="luxury-footer__nav">
              <Link to="/shipping">Giao Hàng & Đổi Trả</Link>
              <Link to="/contact">Liên Hệ</Link>
              <Link to="/privacy">Chính Sách Bảo Mật</Link>
              <Link to="/terms">Điều Khoản Dịch Vụ</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="luxury-footer__col">
            <h3 className="luxury-footer__col-title">Liên Hệ</h3>
            <div className="luxury-footer__contact">
              <p>info@luxurywatch.vn</p>
              <p>+84 28 1234 5678</p>
              <p>Quận 1, TP. Hồ Chí Minh</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="luxury-footer__bottom">
          <span className="luxury-footer__copyright">
            © 2026 Luxury Watch Store
          </span>
          <span className="luxury-footer__credit">
            Mọi quyền được bảo lưu
          </span>
        </div>
      </div>
    </footer>
  );
}
