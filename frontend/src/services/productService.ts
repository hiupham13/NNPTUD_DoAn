import api from './api';
import type { Product, ProductFilter } from '../types/product';
import type { ApiResponse, PaginatedResponse } from '../types/api';

export const productService = {
  /**
   * GET /products — Danh sách SP có filter/search/sort/pagination
   */
  getProducts: async (params: ProductFilter = {}): Promise<PaginatedResponse<Product>> => {
    const res = await api.get('/products', { params });
    return res.data;
  },

  /**
   * GET /products/:slug — Chi tiết SP (populate category, collectionRef)
   */
  getProductBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  },
};
