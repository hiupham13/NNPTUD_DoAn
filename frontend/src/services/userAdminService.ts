import api from './api';

export interface UserFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export const userAdminService = {
  getAll: async (filters: UserFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const { data } = await api.get(`/users?${params.toString()}`);
    return data;
  },

  toggleStatus: async (id: string) => {
    const { data } = await api.put(`/users/${id}/toggle-status`);
    return data;
  },

  getOrders: async (userId: string) => {
    // Dùng admin orders API + filter theo user
    const { data } = await api.get(`/orders/admin?limit=100`);
    return (data.data || []).filter((o: any) => o.user?._id === userId);
  },
};
