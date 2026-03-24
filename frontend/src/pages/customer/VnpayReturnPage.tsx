import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../../services/api';
import './VnpayReturnPage.css';

export default function VnpayReturnPage() {
  const [searchParams] = useSearchParams();
  const responseCode = searchParams.get('vnp_ResponseCode');
  const txnRef = searchParams.get('vnp_TxnRef');
  const amount = searchParams.get('vnp_Amount');
  const [verified, setVerified] = useState(false);

  const isSuccess = responseCode === '00';
  const formattedAmount = amount
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) / 100)
    : '';

  // Gọi BE để verify + update DB (vì IPN không gọi được localhost)
  useEffect(() => {
    const queryString = searchParams.toString();
    if (queryString) {
      api.get(`/payments/vnpay-return?${queryString}`)
        .catch(() => {}) // Bỏ qua lỗi, FE vẫn hiển thị dựa trên responseCode
        .finally(() => setVerified(true));
    } else {
      setVerified(true);
    }
  }, []);

  if (!verified) {
    return (
      <div className="vnpay-return">
        <div className="vnpay-return__card">
          <Loader size={40} strokeWidth={1} className="vnpay-return__icon vnpay-return__icon--loading" />
          <h1 className="vnpay-return__title">Đang xác minh...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="vnpay-return">
      <div className="vnpay-return__card">
        {isSuccess ? (
          <>
            <CheckCircle size={56} strokeWidth={1} className="vnpay-return__icon vnpay-return__icon--success" />
            <h1 className="vnpay-return__title">Thanh Toán Thành Công</h1>
            <p className="vnpay-return__desc">
              Đơn hàng <strong>{txnRef}</strong> đã được thanh toán thành công.
            </p>
            {formattedAmount && (
              <p className="vnpay-return__amount">{formattedAmount}</p>
            )}
            <div className="vnpay-return__actions">
              <Link to="/orders" className="vnpay-return__btn vnpay-return__btn--primary">
                Xem Đơn Hàng
              </Link>
              <Link to="/" className="vnpay-return__btn">
                Về Trang Chủ
              </Link>
            </div>
          </>
        ) : (
          <>
            <XCircle size={56} strokeWidth={1} className="vnpay-return__icon vnpay-return__icon--fail" />
            <h1 className="vnpay-return__title">Thanh Toán Thất Bại</h1>
            <p className="vnpay-return__desc">
              Giao dịch cho đơn hàng <strong>{txnRef}</strong> không thành công.
              Mã lỗi: {responseCode}
            </p>
            <div className="vnpay-return__actions">
              <Link to="/orders" className="vnpay-return__btn vnpay-return__btn--primary">
                Kiểm Tra Đơn Hàng
              </Link>
              <Link to="/cart" className="vnpay-return__btn">
                Quay Lại Giỏ Hàng
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
