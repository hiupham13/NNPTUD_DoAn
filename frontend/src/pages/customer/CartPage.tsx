import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ChevronLeft, ShoppingBag } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../../hooks/useCart';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';
import './CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const items = cart?.items || [];
  const cartTotal = cart?.cartTotal || 0;

  // Shipping logic: free khi >= 50tr
  const FREESHIP_THRESHOLD = 50000000;
  const shippingFee = cartTotal >= FREESHIP_THRESHOLD ? 0 : 50000;
  const amountToFreeship = FREESHIP_THRESHOLD - cartTotal;

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(productId);
      return;
    }
    updateMutation.mutate({ productId, quantity: newQty });
  };

  const handleRemove = (productId: string) => {
    removeMutation.mutate(productId, {
      onSuccess: () => toast.success('Đã xoá sản phẩm khỏi giỏ'),
    });
  };

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="cart-page__loading">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty">
          <ShoppingBag size={48} strokeWidth={1} />
          <h2 className="cart-page__empty-title">Giỏ hàng trống</h2>
          <p className="cart-page__empty-desc">
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </p>
          <Link to="/products" className="cart-page__empty-cta">
            Khám Phá Bộ Sưu Tập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-page__header">
        <Link to="/products" className="cart-page__back">
          <ChevronLeft size={16} strokeWidth={1.5} />
          <span>Tiếp tục mua sắm</span>
        </Link>
        <h1 className="cart-page__title">
          Giỏ Hàng <span className="cart-page__count">({items.length} sản phẩm)</span>
        </h1>
      </div>

      {/* Main Grid */}
      <div className="cart-page__grid">
        {/* Items List */}
        <div className="cart-page__items">
          {items.map((item) => {
            const product = item.product;
            const hasDiscount = product.discountPercent > 0 && product.originalPrice > product.salePrice;

            return (
              <div key={product._id} className="cart-item">
                <Link to={`/products/${product.slug}`} className="cart-item__image">
                  <img src={product.images?.[0] || '/placeholder-watch.jpg'} alt={product.name} />
                </Link>

                <div className="cart-item__info">
                  <div className="cart-item__meta">
                    <span className="cart-item__brand">
                      {typeof product.category === 'object' ? product.category.name : ''}
                    </span>
                    <Link to={`/products/${product.slug}`} className="cart-item__name">
                      {product.name}
                    </Link>
                  </div>

                  <div className="cart-item__price">
                    <span className="cart-item__price-current">{formatPrice(product.salePrice)}</span>
                    {hasDiscount && (
                      <>
                        <span className="cart-item__price-original">{formatPrice(product.originalPrice)}</span>
                        <span className="cart-item__price-badge">-{product.discountPercent}%</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="cart-item__actions">
                  <div className="cart-item__qty">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => handleUpdateQty(product._id, item.quantity - 1)}
                      disabled={updateMutation.isPending}
                    >
                      −
                    </button>
                    <span className="cart-item__qty-value">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => handleUpdateQty(product._id, item.quantity + 1)}
                      disabled={updateMutation.isPending}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item__subtotal">
                    {formatPrice(product.salePrice * item.quantity)}
                  </div>

                  <button
                    className="cart-item__remove"
                    onClick={() => handleRemove(product._id)}
                    disabled={removeMutation.isPending}
                    aria-label="Xoá sản phẩm"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3 className="cart-summary__title">Tóm Tắt Đơn Hàng</h3>

          <div className="cart-summary__row">
            <span>Tạm tính</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <div className="cart-summary__row">
            <span>Phí vận chuyển</span>
            <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
          </div>

          {amountToFreeship > 0 && (
            <div className="cart-summary__freeship">
              Mua thêm {formatPrice(amountToFreeship)} để được miễn phí vận chuyển
            </div>
          )}

          <div className="cart-summary__divider" />

          <div className="cart-summary__row cart-summary__row--total">
            <span>Tổng cộng</span>
            <span>{formatPrice(cartTotal + shippingFee)}</span>
          </div>

          <p className="cart-summary__note">
            Chưa bao gồm mã giảm giá (áp dụng ở bước thanh toán)
          </p>

          <button
            className="cart-summary__checkout"
            onClick={() => navigate('/checkout')}
          >
            Tiến Hành Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
}
