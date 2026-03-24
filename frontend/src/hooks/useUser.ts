import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

// Lấy profile
export const useProfile = () => {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: ['profile'],
    queryFn: userService.getProfile,
    enabled: !!token,
  });
};

// Cập nhật profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Đổi mật khẩu
export const useChangePassword = () => {
  return useMutation({
    mutationFn: userService.changePassword,
  });
};
