import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderAdminService, type OrderFilters } from '../services/orderAdminService';

export const useAdminOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: () => orderAdminService.getAll(filters),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderAdminService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
};
