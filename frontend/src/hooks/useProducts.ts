import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { ProductFilter } from '../types/product';

/**
 * Hook lấy danh sách sản phẩm có filter/search/sort/pagination
 */
export function useProducts(params: ProductFilter = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
}

/**
 * Hook lấy chi tiết sản phẩm theo slug
 */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
}
