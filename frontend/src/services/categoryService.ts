import api from './api';
import type { Category } from '../types/product';
import type { ApiResponse } from '../types/api';

export const categoryService = {
  /**
   * GET /categories — Danh sách brands (isActive + sorted A-Z)
   */
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const res = await api.get('/categories');
    return res.data;
  },
};
