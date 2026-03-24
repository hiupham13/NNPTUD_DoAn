import api from './api';

export const settingsAdminService = {
  // Categories
  getCategories: async () => { const { data } = await api.get('/categories'); return data.data; },
  createCategory: async (payload: any) => { const { data } = await api.post('/categories', payload); return data; },
  updateCategory: async (id: string, payload: any) => { const { data } = await api.put(`/categories/${id}`, payload); return data; },
  deleteCategory: async (id: string) => { const { data } = await api.delete(`/categories/${id}`); return data; },

  // Collections
  getCollections: async () => { const { data } = await api.get('/collections'); return data.data; },
  createCollection: async (payload: any) => { const { data } = await api.post('/collections', payload); return data; },
  updateCollection: async (id: string, payload: any) => { const { data } = await api.put(`/collections/${id}`, payload); return data; },
  deleteCollection: async (id: string) => { const { data } = await api.delete(`/collections/${id}`); return data; },

  // Coupons
  getCoupons: async () => { const { data } = await api.get('/coupons'); return data.data; },
  createCoupon: async (payload: any) => { const { data } = await api.post('/coupons', payload); return data; },
  updateCoupon: async (id: string, payload: any) => { const { data } = await api.put(`/coupons/${id}`, payload); return data; },
  deleteCoupon: async (id: string) => { const { data } = await api.delete(`/coupons/${id}`); return data; },
};
