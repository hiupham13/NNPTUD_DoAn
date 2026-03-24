import api from './api';
import type { Order, CreateOrderPayload, CreateOrderResponse, ValidateCouponPayload, CouponValidation } from '../types/order';
import type { ApiResponse } from '../types/api';

export const orderService = {
  // Tạo đơn hàng (Checkout)
  createOrder: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const res = await api.post<CreateOrderResponse>('/orders', payload);
    return res.data;
  },

  // Lấy lịch sử đơn hàng
  getMyOrders: async (): Promise<Order[]> => {
    const res = await api.get<ApiResponse<Order[]>>('/orders');
    return res.data.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id: string): Promise<Order> => {
    const res = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return res.data.data;
  },

  // Huỷ đơn hàng (Customer)
  cancelOrder: async (id: string, reason?: string): Promise<void> => {
    await api.put(`/orders/${id}/cancel`, {
      status: 'cancelled',
      cancelReason: reason || 'Khách hàng huỷ đơn',
    });
  },
};

export const couponService = {
  // Kiểm tra mã giảm giá
  validateCoupon: async (payload: ValidateCouponPayload): Promise<CouponValidation> => {
    const res = await api.post<ApiResponse<CouponValidation>>('/coupons/validate', payload);
    return res.data.data;
  },
};
