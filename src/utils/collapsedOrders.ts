const COLLAPSED_KEY = 'maule-lena-collapsed-orders';

export function getCollapsedOrderIds(): string[] {
  const raw = localStorage.getItem(COLLAPSED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function isOrderCollapsed(orderId: string): boolean {
  return getCollapsedOrderIds().includes(orderId);
}

export function toggleOrderCollapsed(orderId: string): void {
  const ids = getCollapsedOrderIds();
  const index = ids.indexOf(orderId);
  if (index >= 0) {
    ids.splice(index, 1);
  } else {
    ids.push(orderId);
  }
  localStorage.setItem(COLLAPSED_KEY, JSON.stringify(ids));
}

export function setAllOrdersCollapsed(orderIds: string[], collapsed: boolean): void {
  const current = getCollapsedOrderIds();
  if (collapsed) {
    const merged = Array.from(new Set([...current, ...orderIds]));
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify(merged));
  } else {
    const filtered = current.filter(id => !orderIds.includes(id));
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify(filtered));
  }
}
