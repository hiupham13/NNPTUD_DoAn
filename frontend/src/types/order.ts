// ============ ORDER TYPES ============
// Khớp với backend/schemas/orders.js + controllers/orders.js

// --- Order Status ---
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returned';

// --- Snapshot Item (lưu tại thời điểm đặt hàng) ---
export interface OrderItem {
  product: string | null;
  title: string;
  sku: string;
  slug: string;
  price: number;         // salePrice tại lúc mua
  originalPrice: number;
  discountPercent: number;
  image: string;
  categoryName: string;
  movement: string;
  gender: string;
  quantity: number;
  subtotal: number;      // price × quantity
}

// --- Shipping Address ---
export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}

// --- Order ---
export interface Order {
  _id: string;
  orderCode: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingFee: number;
  coupon: string | null;
  couponCode: string;
  discount: number;
  totalAmount: number;
  finalAmount: number;
  paymentMethod: 'cod' | 'vnpay';
  isPaid: boolean;
  paidAt: string | null;
  status: OrderStatus;
  cancelledAt: string | null;
  cancelReason: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Create Order Payload ---
export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'vnpay';
  couponCode?: string;
}

// --- Create Order Response ---
export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
  paymentUrl?: string;
}

// --- Validate Coupon Payload ---
export interface ValidateCouponPayload {
  code: string;
  orderAmount: number;
}

// --- Validate Coupon Response ---
export interface CouponValidation {
  couponId: string;
  code: string;
  discountAmount: number;
}
