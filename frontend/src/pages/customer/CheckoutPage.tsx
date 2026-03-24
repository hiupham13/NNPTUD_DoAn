import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useCreateOrder, useValidateCoupon } from '../../hooks/useOrders';
import { useProfile } from '../../hooks/useUser';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';
import type { ShippingAddress } from '../../types/order';
import type { CouponValidation } from '../../types/order';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: profile } = useProfile();
  const createOrderMutation = useCreateOrder();
  const validateCouponMutation = useValidateCoupon();

  // Form state — auto-fill from profile
  const [form, setForm] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    note: '',
  });
  const [formInitialized, setFormInitialized] = useState(false);

  // Auto-fill khi profile load xong
  if (profile && !formInitialized) {
    setForm({
      fullName: profile.fullName || '',
      phone: profile.phone || '',
      address: [profile.address?.street, profile.address?.ward, profile.address?.district].filter(Boolean).join(', '),
      city: profile.address?.city || '',
      note: '',
    });
    setFormInitialized(true);
  }

  // Payment & Coupon state
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = cart?.items || [];
  const cartTotal = cart?.cartTotal || 0;

  // Shipping fee
  const FREESHIP_THRESHOLD = 50000000;
  const shippingFee = cartTotal >= FREESHIP_THRESHOLD ? 0 : 50000;
  const discount = appliedCoupon?.discountAmount || 0;
  const finalAmount = cartTotal + shippingFee - discount;

  // Redirect if empty cart
  if (!cartLoading && items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleValidateCoupon = () => {
    if (!couponCode.trim()) return;
    validateCouponMutation.mutate(
      { code: couponCode.trim(), orderAmount: cartTotal },
      {
        onSuccess: (data) => {
          setAppliedCoupon(data);
          toast.success(`Áp dụng mã thành công! Giảm ${formatPrice(data.discountAmount)}`);
        },
        onError: (error: any) => {
          setAppliedCoupon(null);
          toast.error(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.fullName.trim()) return toast.error('Vui lòng nhập họ tên');
    if (!form.phone.trim()) return toast.error('Vui lòng nhập số điện thoại');
    if (!form.address.trim()) return toast.error('Vui lòng nhập địa chỉ');

    setIsSubmitting(true);
    createOrderMutation.mutate(
      {
        shippingAddress: form,
        paymentMethod,
        couponCode: appliedCoupon?.code || undefined,
      },
      {
        onSuccess: (res) => {
          if (paymentMethod === 'vnpay' && res.paymentUrl) {
            // Redirect sang VNPay Sandbox
            window.location.href = res.paymentUrl;
          } else {
            // COD → success
            toast.success('Đặt hàng thành công!');
            navigate(`/orders/${res.data._id}`);
          }
        },
        onError: (error: any) => {
          setIsSubmitting(false);
          toast.error(error.response?.data?.message || 'Đặt hàng thất bại');
        },
      }
    );
  };

  if (cartLoading) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <div className="checkout-page__header">
        <Link to="/cart" className="checkout-page__back">
          <ChevronLeft size={16} strokeWidth={1.5} />
          <span>Quay lại giỏ hàng</span>
        </Link>
        <h1 className="checkout-page__title">Thanh Toán</h1>
      </div>

      <div className="checkout-page__grid">
        {/* Form */}
        <div className="checkout-page__form">
          {/* Shipping Info */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">Thông Tin Giao Hàng</h2>

            <div className="checkout-field">
              <label className="checkout-field__label">Họ và tên *</label>
              <input
                type="text"
                className="checkout-field__input"
                value={form.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="checkout-field">
              <label className="checkout-field__label">Số điện thoại *</label>
              <input
                type="tel"
                className="checkout-field__input"
                value={form.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="0909 123 456"
              />
            </div>

            <div className="checkout-field">
              <label className="checkout-field__label">Địa chỉ *</label>
              <input
                type="text"
                className="checkout-field__input"
                value={form.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện"
              />
            </div>

            <div className="checkout-field">
              <label className="checkout-field__label">Tỉnh / Thành phố</label>
              <input
                type="text"
                className="checkout-field__input"
                value={form.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="TP. Hồ Chí Minh"
              />
            </div>

            <div className="checkout-field">
              <label className="checkout-field__label">Ghi chú</label>
              <textarea
                className="checkout-field__textarea"
                value={form.note || ''}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
                rows={3}
              />
            </div>
          </section>

          {/* Coupon */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">Mã Giảm Giá</h2>
            {appliedCoupon ? (
              <div className="checkout-coupon__applied">
                <span className="checkout-coupon__code">{appliedCoupon.code}</span>
                <span className="checkout-coupon__amount">−{formatPrice(appliedCoupon.discountAmount)}</span>
                <button className="checkout-coupon__remove" onClick={handleRemoveCoupon}>Xoá</button>
              </div>
            ) : (
              <div className="checkout-coupon">
                <input
                  type="text"
                  className="checkout-coupon__input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã giảm giá"
                />
                <button
                  className="checkout-coupon__btn"
                  onClick={handleValidateCoupon}
                  disabled={validateCouponMutation.isPending || !couponCode.trim()}
                >
                  {validateCouponMutation.isPending ? 'Đang kiểm tra...' : 'Áp Dụng'}
                </button>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">Phương Thức Thanh Toán</h2>

            <label className={`checkout-radio ${paymentMethod === 'cod' ? 'checkout-radio--active' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <div className="checkout-radio__content">
                <span className="checkout-radio__title">Thanh toán khi nhận hàng (COD)</span>
                <span className="checkout-radio__desc">Thanh toán bằng tiền mặt khi nhận hàng</span>
              </div>
            </label>

            <label className={`checkout-radio ${paymentMethod === 'vnpay' ? 'checkout-radio--active' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="vnpay"
                checked={paymentMethod === 'vnpay'}
                onChange={() => setPaymentMethod('vnpay')}
              />
              <div className="checkout-radio__content">
                <span className="checkout-radio__title">VNPay (Test Sandbox)</span>
                <span className="checkout-radio__desc">Thanh toán qua thẻ ATM / Visa / QR Code</span>
              </div>
            </label>
          </section>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3 className="checkout-summary__title">Đơn Hàng Của Bạn</h3>

          <div className="checkout-summary__items">
            {items.map((item) => (
              <div key={item.product._id} className="checkout-summary__item">
                <div className="checkout-summary__item-img">
                  <img src={item.product.images?.[0] || ''} alt={item.product.name} />
                  <span className="checkout-summary__item-qty">{item.quantity}</span>
                </div>
                <div className="checkout-summary__item-info">
                  <span className="checkout-summary__item-name">{item.product.name}</span>
                  <span className="checkout-summary__item-price">
                    {formatPrice(item.product.salePrice * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary__divider" />

          <div className="checkout-summary__row">
            <span>Tạm tính</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <div className="checkout-summary__row">
            <span>Phí vận chuyển</span>
            <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
          </div>

          {discount > 0 && (
            <div className="checkout-summary__row checkout-summary__row--discount">
              <span>Giảm giá ({appliedCoupon?.code})</span>
              <span>−{formatPrice(discount)}</span>
            </div>
          )}

          <div className="checkout-summary__divider" />

          <div className="checkout-summary__row checkout-summary__row--total">
            <span>Tổng cộng</span>
            <span>{formatPrice(finalAmount)}</span>
          </div>

          <button
            className="checkout-summary__submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : paymentMethod === 'vnpay' ? 'Thanh Toán Qua VNPay' : 'Xác Nhận Đặt Hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}
