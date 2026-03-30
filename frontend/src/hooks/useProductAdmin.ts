import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAdminService, type ProductFilters } from '../services/productAdminService';

export const useAdminProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: () => productAdminService.getAll(filters),
  });
};

export const useAdminProductById = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: () => productAdminService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => productAdminService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => productAdminService.update(id, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['admin', 'product', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productAdminService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
};

export const useBulkDeleteProducts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => productAdminService.bulkDelete(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
};

export const useImportExcelProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => productAdminService.importExcel(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['admin', 'product'] });
      qc.invalidateQueries({ queryKey: ['admin', 'inventory'] });
    },
  });
};
