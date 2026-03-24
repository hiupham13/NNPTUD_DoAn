import api from './api';

export const userService = {
  // Lấy profile
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data.data;
  },

  // Cập nhật profile
  updateProfile: async (data: { fullName?: string; phone?: string; address?: { street?: string; ward?: string; district?: string; city?: string } }) => {
    const res = await api.put('/users/profile', data);
    return res.data.data;
  },

  // Đổi mật khẩu
  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const res = await api.put('/users/change-password', data);
    return res.data;
  },
};
