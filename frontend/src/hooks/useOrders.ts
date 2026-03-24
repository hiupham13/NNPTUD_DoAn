import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, couponService } from '../services/orderService';
import type { CreateOrderPayload, ValidateCouponPayload } from '../types/order';

// Lịch sử đơn hàng
export const useMyOrders = () => {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getMyOrders,
    enabled: !!token,
  });
};

// Chi tiết 1 đơn hàng
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
};

// Tạo đơn hàng (Checkout)
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Huỷ đơn hàng
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      orderService.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Validate coupon
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (payload: ValidateCouponPayload) => couponService.validateCoupon(payload),
  });
};
