import api from './api';

export interface ProductFilters {
  search?: string;
  category?: string;
  isActive?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const productAdminService = {
  getAll: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const { data } = await api.get(`/products?${params.toString()}`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/products/id/${id}`);
    return data.data;
  },

  create: async (payload: any) => {
    const { data } = await api.post('/products', payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const { data } = await api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.urls as string[];
  },
};
