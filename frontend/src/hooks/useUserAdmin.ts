import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAdminService, type UserFilters } from '../services/userAdminService';

export const useAdminUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => userAdminService.getAll(filters),
  });
};

export const useToggleUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userAdminService.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: ['admin', 'user-orders', userId],
    queryFn: () => userAdminService.getOrders(userId),
    enabled: !!userId,
  });
};
