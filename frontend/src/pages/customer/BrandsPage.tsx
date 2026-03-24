import { Link } from 'react-router-dom';
import './BrandsPage.css';

export default function BrandsPage() {
  return (
    <div className="brands">
      {/* ════════ HERO ════════ */}
      <section className="brands__hero">
        <div className="brands__hero-content">
          <span className="brands__hero-label">Thương Hiệu / 01</span>
          <h1 className="brands__hero-title">
            Câu Chuyện<br />
            <em>Thương Hiệu</em>
          </h1>
          <p className="brands__hero-desc">
            Sự giao thoa giữa di sản chế tác truyền thống và tầm nhìn hiện đại.
            Chúng tôi không chỉ bán đồng hồ — chúng tôi gìn giữ những giá trị vượt thời gian.
          </p>
        </div>
        <div className="brands__hero-image">
          <div className="brands__hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800&auto=format&fit=crop"
              alt="Luxury watch craftsmanship"
            />
          </div>
        </div>
        <span className="brands__hero-vlabel">Cuộn để khám phá — EST. 2024</span>
      </section>

      {/* ════════ PHILOSOPHY ════════ */}
      <section className="brands__philosophy">
        <div className="brands__philosophy-inner">
          <div>
            <h2 className="brands__philosophy-heading">
              Sự tinh tế<br />
              trong từng<br />
              chi tiết.
            </h2>
          </div>
          <div>
            <p className="brands__philosophy-body">
              Luxury Watch Store được xây dựng trên một niềm tin duy nhất: rằng sự xa xỉ đích thực
              nằm trong những khoảng lặng giữa các chi tiết. Trong một thời đại của sự ồn ào,
              chúng tôi chọn sự tĩnh lặng. Trong một thế giới của tốc độ, chúng tôi ủng hộ
              sự khám phá chậm rãi. Bộ sưu tập của chúng tôi không chỉ là tập hợp những chiếc đồng hồ,
              mà là minh chứng cho sức mạnh bền bỉ của sự chủ đích.
            </p>
            <p className="brands__philosophy-sub">
              Mỗi chiếc đồng hồ đều trải qua quá trình thẩm định nghiêm ngặt về di sản,
              sự cộng hưởng cảm xúc và giá trị thẩm mỹ. Chúng tôi là người gìn giữ
              một tiêu chuẩn mới — nơi nghệ thuật truyền thống gặp gỡ sự tinh tế đương đại.
            </p>
          </div>
        </div>
      </section>

      {/* ════════ HERITAGE ════════ */}
      <section className="brands__heritage">
        <div className="brands__heritage-grid">
          <div className="brands__heritage-left">
            <span className="brands__heritage-vlabel">CHẾ TÁC / 2024</span>
            <div className="brands__heritage-img">
              <img
                src="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=900&auto=format&fit=crop"
                alt="Watch movement detail"
              />
            </div>
            <div className="brands__heritage-caption">
              <h3>Kiến Trúc Của Thời Gian</h3>
              <p>
                Chúng tôi sử dụng những tiêu chuẩn khắt khe nhất để đảm bảo
                mỗi chiếc đồng hồ đều mang sức nặng của sự chính xác và nghệ thuật.
              </p>
            </div>
          </div>
          <div className="brands__heritage-right">
            <div className="brands__heritage-right-img">
              <img
                src="https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=800&auto=format&fit=crop"
                alt="Luxury watch detail"
              />
            </div>
            <div>
              <div className="brands__heritage-divider" />
              <h3>Câu Chuyện Vượt Thời Gian</h3>
              <p>
                Phương pháp của chúng tôi từ chối những xu hướng nhất thời,
                thay vào đó theo đuổi một giá trị bền vững — nơi di sản
                được nâng tầm thành nghệ thuật đương đại.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PROCESS ════════ */}
      <section className="brands__process">
        <div className="brands__process-header">
          <h2 className="brands__process-title">Quy Trình Phục Vụ</h2>
          <span className="brands__process-label">Phương pháp</span>
        </div>
        <div className="brands__process-grid">
          <div className="brands__process-item">
            <span className="brands__process-num">01.</span>
            <h4>Tuyển Chọn</h4>
            <p>
              Quy trình lựa chọn tỉ mỉ, nơi chỉ những chiếc đồng hồ có xuất xứ
              đặc biệt và tính thẩm mỹ vượt trội mới được chọn vào bộ sưu tập.
            </p>
            <div className="brands__process-bar" />
          </div>
          <div className="brands__process-item">
            <span className="brands__process-num">02.</span>
            <h4>Kiểm Định</h4>
            <p>
              Sử dụng kỹ thuật kiểm định tiên tiến để đảm bảo tính xác thực
              và chất lượng của mỗi sản phẩm trước khi đến tay khách hàng.
            </p>
            <div className="brands__process-bar" />
          </div>
          <div className="brands__process-item">
            <span className="brands__process-num">03.</span>
            <h4>Trưng Bày</h4>
            <p>
              Mỗi chiếc đồng hồ được giới thiệu trong một không gian
              tối giản, tôn vinh vẻ đẹp và câu chuyện riêng biệt của nó.
            </p>
            <div className="brands__process-bar" />
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="brands__cta">
        <div className="brands__cta-bg">
          <span>LUXURY</span>
        </div>
        <div className="brands__cta-content">
          <h2 className="brands__cta-title">
            Khám Phá<br />
            <em>Bộ Sưu Tập</em>
          </h2>
          <Link to="/collections" className="brands__cta-btn">
            Xem Bộ Sưu Tập
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
