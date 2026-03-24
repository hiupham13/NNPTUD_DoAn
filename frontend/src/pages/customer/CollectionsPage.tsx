import { Link } from 'react-router-dom';
import { useCollections } from '../../hooks/useCollections';
import './CollectionsPage.css';

// Placeholder images for collections without images
const COLLECTION_IMAGES = [
  'https://images.unsplash.com/photo-1509941943102-10c232535736?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526045431048-f857369baa09?q=80&w=800&auto=format&fit=crop',
];

export default function CollectionsPage() {
  const { data: collectionsData } = useCollections();
  const collections = collectionsData?.data || [];

  return (
    <div className="collections">
      {/* ════════ HERO ════════ */}
      <section className="collections__hero">
        <div className="collections__hero-content">
          <h1 className="collections__title">
            Bộ Sưu Tập<br />
            / <em>Đặc Biệt</em>
          </h1>
          <div className="collections__intro">
            <span className="collections__intro-cap">M</span>
            <p className="collections__intro-text">
              Mỗi bộ sưu tập là một hành trình khám phá, nơi nghệ thuật chế tác
              gặp gỡ phong cách sống đương đại. Những tuyển tập được giám tuyển
              cẩn thận, mang đến cho bạn tinh hoa của ngành đồng hồ thế giới.
            </p>
          </div>
        </div>
        <div className="collections__hero-image">
          <img
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop"
            alt="Luxury watch collection"
          />
        </div>
      </section>

      {/* ════════ ASYMMETRIC GRID ════════ */}
      {collections.length > 0 ? (
        <section className="collections__grid">
          {collections.map((col: any, index: number) => (
            <Link
              key={col._id}
              to={`/products?collection=${col._id}`}
              className="collections__card"
            >
              <div className="collections__card-image collections__card-shadow">
                <img
                  src={col.image || COLLECTION_IMAGES[index % COLLECTION_IMAGES.length]}
                  alt={col.name}
                />
                <span className="collections__card-vlabel">
                  Bộ sưu tập / {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="collections__card-info">
                <div className="collections__card-header">
                  <h3 className="collections__card-name">{col.name}</h3>
                  <span className="collections__card-tag">Collection</span>
                </div>
                {col.description && (
                  <p className="collections__card-desc">{col.description}</p>
                )}
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="collections__empty">
          <p className="collections__empty-text">Chưa có bộ sưu tập nào</p>
        </section>
      )}

      {/* ════════ CTA ════════ */}
      <div className="collections__cta">
        <Link to="/products" className="collections__cta-btn">
          Khám Phá Tất Cả Sản Phẩm
        </Link>
      </div>
    </div>
  );
}
