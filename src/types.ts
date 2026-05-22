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

export type CategoryFilter = 'todos' | 'leña' | 'pellet' | 'parafina';

export type Screen = 'home' | 'catalog' | 'checkout' | 'orderConfirmation' | 'orderSuccess' | 'account';

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  notes: string;
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
  statusHistory: { status: OrderStatus; date: string }[];
}
