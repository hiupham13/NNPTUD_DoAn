import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductBySlug, useProducts } from '../../hooks/useProducts';
import { useAddToCart } from '../../hooks/useCart';
import { useAuthStore } from '../../stores/authStore';
import ProductCard from '../../components/product/ProductCard';
import { formatPrice, formatMovement, formatGender } from '../../utils/format';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useProductBySlug(slug || '');
  const product = data?.data;
  const addToCartMutation = useAddToCart();
  const isAuthenticated = useAuthStore((s) => !!s.token);

  // Related products (same category)
  const { data: relatedData } = useProducts({
    category: product?.category?._id,
    limit: 4,
  });
  const relatedProducts = (relatedData?.data || []).filter(
    (p) => p._id !== product?._id
  ).slice(0, 4);

  // Gallery
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handlePrevImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    if (!product) return;
    addToCartMutation.mutate(
      { productId: product._id, quantity },
      {
        onSuccess: () => {
          setQuantity(1);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="product-detail">
        <div className="product-detail__loading">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-detail__loading">Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  const hasDiscount = product.discountPercent > 0 && product.originalPrice > product.price;
  const categoryName = typeof product.category === 'object' ? product.category.name : '';

  // Specs table data
  const specs = [
    { label: 'Thương hiệu', value: categoryName },
    { label: 'Bộ máy', value: formatMovement(product.movement) },
    { label: 'Giới tính', value: formatGender(product.gender) },
    { label: 'Chất liệu vỏ', value: product.caseMaterial },
    { label: 'Kích thước', value: product.caseSize },
    { label: 'Dây đeo', value: product.strapMaterial },
    { label: 'Chống nước', value: product.waterResistance },
    { label: 'Mã SKU', value: product.sku },
  ].filter((s) => s.value);

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <nav className="product-detail__breadcrumb">
        <Link to="/products" className="product-detail__back">
          <ChevronLeft size={16} strokeWidth={1.5} />
          <span>Quay lại</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="product-detail__main">
        {/* Gallery */}
        <div className="product-detail__gallery">
          <div className="product-detail__image-main">
            <img
              src={product.images?.[selectedImage] || product.images?.[0] || '/placeholder-watch.jpg'}
              alt={product.name}
            />
            {/* Navigation Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  className="product-detail__arrow product-detail__arrow--prev"
                  onClick={handlePrevImage}
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button
                  className="product-detail__arrow product-detail__arrow--next"
                  onClick={handleNextImage}
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
                {/* Image Counter */}
                <div className="product-detail__image-counter">
                  {selectedImage + 1} / {product.images.length}
                </div>
              </>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="product-detail__thumbnails">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`product-detail__thumb ${i === selectedImage ? 'product-detail__thumb--active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${product.name} - ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail__info">
          {categoryName && (
            <span className="product-detail__brand">{categoryName}</span>
          )}

          <h1 className="product-detail__name">{product.name}</h1>

          <div className="product-detail__price">
            {hasDiscount ? (
              <>
                <span className="product-detail__price-current">
                  {formatPrice(product.price)}
                </span>
                <span className="product-detail__price-original">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="product-detail__price-badge">
                  -{product.discountPercent}%
                </span>
              </>
            ) : (
              <span className="product-detail__price-current">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="product-detail__desc">
            <p>{product.description}</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="product-detail__features">
              {product.features.map((feat, i) => (
                <span key={i} className="product-detail__feature-tag">
                  {feat}
                </span>
              ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="product-detail__actions">
            <div className="product-detail__qty">
              <button
                className="product-detail__qty-btn"
                onClick={decreaseQty}
                disabled={quantity <= 1}
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <span className="product-detail__qty-value">{quantity}</span>
              <button
                className="product-detail__qty-btn"
                onClick={increaseQty}
                disabled={quantity >= 99}
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>
            <button
              className="product-detail__add-btn"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? 'Đang thêm...' : 'Thêm Vào Giỏ Hàng'}
            </button>
          </div>

          {/* Specs Table */}
          <div className="product-detail__specs">
            <h3 className="product-detail__specs-title">Thông Số Kỹ Thuật</h3>
            <table className="product-detail__specs-table">
              <tbody>
                {specs.map((spec, i) => (
                  <tr key={i}>
                    <td className="product-detail__spec-label">{spec.label}</td>
                    <td className="product-detail__spec-value">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="product-detail__related">
          <h2 className="product-detail__related-title">
            Sản Phẩm <em>Tương Tự</em>
          </h2>
          <div className="product-detail__related-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
