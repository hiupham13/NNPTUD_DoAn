import api from './api';

export interface OrderFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const orderAdminService = {
  getAll: async (filters: OrderFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const { data } = await api.get(`/orders/admin?${params.toString()}`);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  },
};
