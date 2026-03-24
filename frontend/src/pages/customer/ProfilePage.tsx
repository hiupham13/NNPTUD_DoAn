import { useState } from 'react';
import { useProfile, useUpdateProfile, useChangePassword } from '../../hooks/useUser';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const updateUserInStore = useAuthStore((s) => s.setUser);

  // Profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({ street: '', ward: '', district: '', city: '' });
  const [profileInit, setProfileInit] = useState(false);

  if (profile && !profileInit) {
    setFullName(profile.fullName || '');
    setPhone(profile.phone || '');
    setAddress({
      street: profile.address?.street || '',
      ward: profile.address?.ward || '',
      district: profile.address?.district || '',
      city: profile.address?.city || '',
    });
    setProfileInit(true);
  }

  // Password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = () => {
    if (!fullName.trim()) return toast.error('Vui lòng nhập họ tên');
    updateProfileMutation.mutate(
      { fullName, phone, address },
      {
        onSuccess: (data) => {
          toast.success('Cập nhật thông tin thành công');
          if (updateUserInStore) {
            updateUserInStore({ fullName: data.fullName });
          }
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        },
      }
    );
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) return toast.error('Vui lòng nhập đầy đủ');
    if (newPassword.length < 6) return toast.error('Mật khẩu mới tối thiểu 6 ký tự');
    if (newPassword !== confirmPassword) return toast.error('Mật khẩu xác nhận không khớp');

    changePasswordMutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          toast.success('Đổi mật khẩu thành công');
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-page__loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">Hồ Sơ Cá Nhân</h1>

      {/* Section 1: Profile Info */}
      <section className="profile-section">
        <h2 className="profile-section__title">Thông Tin Của Bạn</h2>

        <div className="profile-field">
          <label className="profile-field__label">Họ và tên</label>
          <input
            type="text"
            className="profile-field__input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label className="profile-field__label">Email</label>
          <div className="profile-field__readonly">{profile?.email}</div>
        </div>

        <div className="profile-field">
          <label className="profile-field__label">Username</label>
          <div className="profile-field__readonly">{profile?.username}</div>
        </div>

        <div className="profile-field">
          <label className="profile-field__label">Số điện thoại</label>
          <input
            type="tel"
            className="profile-field__input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0909 123 456"
          />
        </div>

        <div className="profile-field">
          <label className="profile-field__label">Địa chỉ</label>
          <input
            type="text"
            className="profile-field__input"
            value={address.street}
            onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
            placeholder="Số nhà, đường"
          />
        </div>

        <div className="profile-field__row">
          <div className="profile-field">
            <label className="profile-field__label">Phường / Xã</label>
            <input
              type="text"
              className="profile-field__input"
              value={address.ward}
              onChange={(e) => setAddress((prev) => ({ ...prev, ward: e.target.value }))}
            />
          </div>
          <div className="profile-field">
            <label className="profile-field__label">Quận / Huyện</label>
            <input
              type="text"
              className="profile-field__input"
              value={address.district}
              onChange={(e) => setAddress((prev) => ({ ...prev, district: e.target.value }))}
            />
          </div>
          <div className="profile-field">
            <label className="profile-field__label">Tỉnh / TP</label>
            <input
              type="text"
              className="profile-field__input"
              value={address.city}
              onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
            />
          </div>
        </div>

        <div className="profile-field">
          <label className="profile-field__label">Vai trò</label>
          <div className="profile-field__readonly">{profile?.role?.name || 'Customer'}</div>
        </div>

        <div className="profile-field">
          <label className="profile-field__label">Ngày tham gia</label>
          <div className="profile-field__readonly">
            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : ''}
          </div>
        </div>

        <button
          className="profile-section__btn"
          onClick={handleUpdateProfile}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? 'Đang cập nhật...' : 'Cập Nhật Thông Tin'}
        </button>
      </section>

      {/* Section 2: Change Password */}
      <section className="profile-section">
        <h2 className="profile-section__title">Đổi Mật Khẩu</h2>

        <div className="profile-field">
          <label className="profile-field__label">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="profile-field__input"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label className="profile-field__label">Mật khẩu mới</label>
          <input
            type="password"
            className="profile-field__input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label className="profile-field__label">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="profile-field__input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="profile-section__btn profile-section__btn--primary"
          onClick={handleChangePassword}
          disabled={changePasswordMutation.isPending}
        >
          {changePasswordMutation.isPending ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
        </button>
      </section>
    </div>
  );
}
