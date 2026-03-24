import api from './api';

export const inventoryAdminService = {
  getAll: async (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const { data } = await api.get(`/inventory${params}`);
    return data.data;
  },

  updateStock: async (id: string, stock: number) => {
    const { data } = await api.put(`/inventory/${id}`, { stock });
    return data;
  },
};
