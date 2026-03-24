import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/format';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPercent > 0 && product.originalPrice > product.price;

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      {/* Image */}
      <div className="product-card__image-wrapper">
        <img
          src={product.images?.[0] || '/placeholder-watch.jpg'}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        {/* Badges */}
        {hasDiscount && (
          <span className="product-card__badge product-card__badge--sale">
            -{product.discountPercent}%
          </span>
        )}
        {product.isNewProduct && (
          <span className="product-card__badge product-card__badge--new">
            Mới
          </span>
        )}
      </div>

      {/* Info */}
      <div className="product-card__info">
        {/* Brand */}
        {product.category && (
          <span className="product-card__brand">
            {typeof product.category === 'object' ? product.category.name : ''}
          </span>
        )}

        {/* Name */}
        <h3 className="product-card__name">{product.name}</h3>

        {/* Price */}
        <div className="product-card__price">
          {hasDiscount ? (
            <>
              <span className="product-card__price--current">
                {formatPrice(product.price)}
              </span>
              <span className="product-card__price--original">
                {formatPrice(product.originalPrice)}
              </span>
            </>
          ) : (
            <span className="product-card__price--current">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
