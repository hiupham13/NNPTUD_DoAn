import { useQuery } from '@tanstack/react-query';
import { collectionService } from '../services/collectionService';

/**
 * Hook lấy danh sách bộ sưu tập
 */
export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionService.getCollections(),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}
