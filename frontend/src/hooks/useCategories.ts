import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

/**
 * Hook lấy danh sách thương hiệu (categories)
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 phút — brands ít thay đổi
  });
}
