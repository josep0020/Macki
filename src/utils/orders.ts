import { TrackedOrder, OrderStatus } from '../types';

const STORAGE_KEY = 'maule-lena-orders';

export function saveOrder(order: TrackedOrder): void {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function getOrders(): TrackedOrder[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TrackedOrder[];
  } catch {
    return [];
  }
}

export function getOrderById(id: string): TrackedOrder | undefined {
  return getOrders().find(o => o.id === id);
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const orders = getOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return;

  order.status = status;
  order.statusHistory.push({ status, date: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function deleteOrder(id: string): void {
  const orders = getOrders().filter(o => o.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function deleteOrders(ids: string[]): void {
  const orders = getOrders().filter(o => !ids.includes(o.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function clearOrders(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Simula el avance de estados para demostración
export function simulateOrderProgress(id: string): void {
  const order = getOrderById(id);
  if (!order || order.status === 'entregado') return;

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    pendiente: 'en_camino',
    en_camino: 'entregado',
    entregado: null,
  };

  const next = nextStatus[order.status];
  if (next) {
    updateOrderStatus(id, next);
  }
}
