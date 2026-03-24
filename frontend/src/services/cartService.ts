import api from './api';
import type { CartData, AddToCartPayload, UpdateCartPayload } from '../types/cart';
import type { ApiResponse } from '../types/api';

export const cartService = {
  // Lấy giỏ hàng
  getCart: async (): Promise<CartData> => {
    const res = await api.get<ApiResponse<CartData>>('/cart');
    return res.data.data;
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (payload: AddToCartPayload): Promise<void> => {
    await api.post('/cart', payload);
  },

  // Cập nhật số lượng
  updateCartItem: async (productId: string, payload: UpdateCartPayload): Promise<void> => {
    await api.put(`/cart/${productId}`, payload);
  },

  // Xóa sản phẩm khỏi giỏ
  removeCartItem: async (productId: string): Promise<void> => {
    await api.delete(`/cart/${productId}`);
  },
};
