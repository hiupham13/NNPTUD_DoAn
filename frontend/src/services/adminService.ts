import api from './api';

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data.data;
  },

  getRevenueChart: async () => {
    const { data } = await api.get('/admin/stats/revenue-chart');
    return data.data;
  },

  getOrdersChart: async () => {
    const { data } = await api.get('/admin/stats/orders-chart');
    return data.data;
  },
};
