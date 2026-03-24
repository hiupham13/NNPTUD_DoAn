import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export const useStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminService.getStats,
  });
};

export const useRevenueChart = () => {
  return useQuery({
    queryKey: ['admin', 'revenue-chart'],
    queryFn: adminService.getRevenueChart,
  });
};

export const useOrdersChart = () => {
  return useQuery({
    queryKey: ['admin', 'orders-chart'],
    queryFn: adminService.getOrdersChart,
  });
};
