import api from './api';
import type { Collection } from '../types/product';
import type { ApiResponse } from '../types/api';

export const collectionService = {
  /**
   * GET /collections — Danh sách bộ sưu tập (isActive)
   */
  getCollections: async (): Promise<ApiResponse<Collection[]>> => {
    const res = await api.get('/collections');
    return res.data;
  },
};
