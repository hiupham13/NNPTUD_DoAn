import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryAdminService } from '../services/inventoryAdminService';

export const useInventory = (search?: string) => {
  return useQuery({
    queryKey: ['admin', 'inventory', search],
    queryFn: () => inventoryAdminService.getAll(search),
  });
};

export const useUpdateStock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      inventoryAdminService.updateStock(id, stock),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'inventory'] }),
  });
};
