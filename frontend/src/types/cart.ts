// ============ CART TYPES ============
// Khớp với backend/schemas/cart.js + controllers/cart.js

import type { Product } from './product';

// --- Cart Item (populated product) ---
export interface CartItem {
  product: Product;
  quantity: number;
}

// --- Cart Response từ GET /cart ---
export interface CartData {
  _id: string;
  items: CartItem[];
  cartTotal: number;
}

// --- Payload gửi lên POST /cart ---
export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

// --- Payload gửi lên PUT /cart/:productId ---
export interface UpdateCartPayload {
  quantity: number;
}
