import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import type { AddToCartPayload } from '../types/cart';

// Query key
const CART_KEY = ['cart'];

// Lấy giỏ hàng — chỉ gọi khi đã đăng nhập
export const useCart = () => {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartService.getCart,
    enabled: !!token, // ← KHÔNG gọi API khi chưa login
  });
};

// Thêm vào giỏ
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
};

// Cập nhật số lượng
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateCartItem(productId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
};

// Xóa khỏi giỏ
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => cartService.removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
};
