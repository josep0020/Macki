export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  images?: string[];
  badge?: string;
  category: 'leña' | 'pellet' | 'parafina';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CategoryFilter = 'todos' | 'leña' | 'pellet' | 'parafina' | 'favoritos';

export type Screen = 'home' | 'catalog' | 'checkout' | 'orderConfirmation' | 'orderSuccess' | 'account';

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  notes: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
}

export type ThemeMode = 'light' | 'dark';

export type OrderStatus = 'pendiente' | 'en_camino' | 'entregado';

export interface TrackedOrder {
  id: string;
  status: OrderStatus;
  createdAt: string;
  items: { productId?: string; name: string; quantity: number; price: number; unit: string }[];
  total: number;
  shippingCost: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  statusHistory: { status: OrderStatus; date: string }[];
  pointsEarned?: number;
}

// ── Loyalty System Types ──

export type LoyaltyLevel = 'semilla' | 'brote' | 'roble' | 'fuego';

export interface LoyaltyCoupon {
  id: string;
  level: LoyaltyLevel;
  description: string;
  discount: { type: 'fixed' | 'percentage' | 'free_shipping'; value: number };
  redeemed: boolean;
  earnedAt: string;
}

export interface LoyaltyPointEntry {
  orderId: string;
  points: number;
  date: string;
  total: number;
}

export interface LoyaltyState {
  totalPoints: number;
  currentLevel: LoyaltyLevel;
  pointsHistory: LoyaltyPointEntry[];
  coupons: LoyaltyCoupon[];
  redeemedCoupons: string[];
}
