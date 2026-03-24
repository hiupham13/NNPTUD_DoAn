import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCollections } from '../../hooks/useCollections';
import ProductCard from '../../components/product/ProductCard';
import './HomePage.css';

export default function HomePage() {
  // API data
  const { data: productsData } = useProducts({ limit: 8, sort: 'newest' });
  const { data: categoriesData } = useCategories();
  const { data: collectionsData } = useCollections();

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];
  const collections = collectionsData?.data || [];

  return (
    <div className="home">
      {/* ════════ HERO SECTION ════════ */}
      <section className="home__hero">
        <div className="home__hero-content">
          <span className="home__label">Tuyệt tác Thời gian</span>
          <h1 className="home__hero-title">
            Đồng Hồ <em>Cao Cấp</em><br />
            Định Danh <span className="home__hero-accent">Chính Xác</span>
          </h1>
          <p className="home__hero-desc">
            Sự tuyển chọn khắt khe những thương hiệu đồng hồ danh giá bậc nhất
            trên thế giới. Giao thoa giữa vẻ đẹp cổ điển và công nghệ tinh xảo.
          </p>
          <Link to="/products" className="home__cta-btn">
            Khám Phá Tổ Hợp
          </Link>
        </div>
        <div className="home__hero-image">
          <img
            alt="Luxury watch detail"
            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop"
          />
        </div>
      </section>

      {/* ════════ EDITORIAL TEXT ════════ */}
      <section className="home__editorial">
        <span className="home__vertical-label">Di sản / 2026</span>
        <div className="home__editorial-left">
          <p className="home__drop-cap">
            Bản chất của kỹ thuật chế tác không chỉ dừng ở việc đong đếm thời gian,
            mà là làm chủ nó. Từng bánh răng, từng tinh thể đều toát lên một luồng
            sinh khí riêng. Hãy tản mạn cùng những kiệt tác cơ học này bằng một
            tâm hồn thưởng lãm nghệ thuật.
          </p>
        </div>
        <div className="home__editorial-right">
          <div className="home__editorial-box">
            <h3>Chế Tác Thụy Sĩ</h3>
            <p>
              Sự cân bằng hoàn hảo giữa tính toàn vẹn trong cấu trúc hình học
              và một bề mặt láng bóng thẩm mỹ, được kiến tạo ra để trường tồn
              vĩnh viễn.
            </p>
          </div>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className="home__stats">
        <div className="home__stats-grid">
          <div className="home__stat">
            <span className="home__stat-number">{products.length > 0 ? '15+' : '—'}</span>
            <span className="home__stat-label">Mẫu Đồng Hồ</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-number">{categories.length || '—'}</span>
            <span className="home__stat-label">Thương Hiệu</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-number">{collections.length || '—'}</span>
            <span className="home__stat-label">Bộ Sưu Tập</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-number">100%</span>
            <span className="home__stat-label">Chính Hãng</span>
          </div>
        </div>
      </section>

      {/* ════════ FEATURED PRODUCTS ════════ */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            Sản Phẩm <em>Nổi Bật</em>
          </h2>
          <Link to="/products" className="home__section-link">
            Xem tất cả
          </Link>
        </div>
        <div className="home__products-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ════════ BRANDS (from API) ════════ */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            Thương Hiệu <em>Đối Tác</em>
          </h2>
        </div>
        <div className="home__brands-grid">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="home__brand-item"
            >
              <div className="home__brand-image">
                <img src={cat.image} alt={cat.name} />
              </div>
              <h3 className="home__brand-name">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════ COLLECTIONS ════════ */}
      {collections.length > 0 && (
        <section className="home__section">
          <div className="home__section-header">
            <h2 className="home__section-title">
              Bộ Sưu Tập <em>Đặc Biệt</em>
            </h2>
          </div>
          <div className="home__collections-grid">
            {collections.map((col) => (
              <Link
                key={col._id}
                to={`/products?collection=${col._id}`}
                className="home__collection-card"
              >
                <div className="home__collection-image">
                  <img src={col.image} alt={col.name} />
                </div>
                <div className="home__collection-info">
                  <h3>{col.name}</h3>
                  <p>{col.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ════════ CTA ════════ */}
      <section className="home__cta">
        <span className="home__label">Luxury Watch Store</span>
        <h2 className="home__cta-title">
          Khám Phá Bộ Sưu Tập<br />
          <em>Đẳng Cấp Vượt Thời Gian</em>
        </h2>
        <p className="home__cta-desc">
          Mỗi chiếc đồng hồ là một câu chuyện. Hãy tìm câu chuyện của bạn.
        </p>
        <Link to="/products" className="home__cta-btn">
          Mua Sắm Ngay
        </Link>
      </section>
    </div>
  );
}
