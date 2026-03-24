import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsAdminService } from '../services/settingsAdminService';

// Categories
export const useCategories = () => useQuery({ queryKey: ['categories'], queryFn: settingsAdminService.getCategories });
export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: settingsAdminService.createCategory, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
};
export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => settingsAdminService.updateCategory(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
};
export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: settingsAdminService.deleteCategory, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
};

// Collections
export const useCollections = () => useQuery({ queryKey: ['collections'], queryFn: settingsAdminService.getCollections });
export const useCreateCollection = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: settingsAdminService.createCollection, onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }) });
};
export const useUpdateCollection = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => settingsAdminService.updateCollection(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }) });
};
export const useDeleteCollection = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: settingsAdminService.deleteCollection, onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }) });
};

// Coupons
export const useCoupons = () => useQuery({ queryKey: ['coupons'], queryFn: settingsAdminService.getCoupons });
export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: settingsAdminService.createCoupon, onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }) });
};
export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => settingsAdminService.updateCoupon(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }) });
};
export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: settingsAdminService.deleteCoupon, onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }) });
};
