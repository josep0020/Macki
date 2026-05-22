import { TrackedOrder } from '../types';

const MONTHLY_CONSUMPTION_60M2_MEDIO_ESTANDAR = {
  leña: 60 * 0.045 * 1.0, // 2.7 m³/mes
  pellet: 60 * 0.75 * 1.0, // 45 sacos/mes
  parafina: 60 * 0.5 * 1.0, // 30 litros/mes
};

type HeatingType = 'leña' | 'pellet' | 'parafina';

function detectType(item: { name: string; unit: string }): HeatingType | null {
  const name = item.name.toLowerCase();
  const unit = item.unit.toLowerCase();
  if (name.includes('leña') || unit.includes('m³') || unit.includes('m3')) return 'leña';
  if (name.includes('pellet') || unit.includes('saco')) return 'pellet';
  if (name.includes('parafina') || unit.includes('litro')) return 'parafina';
  return null;
}

export function estimateDepletionDate(order: TrackedOrder): Date | null {
  // Find the item that depletes first
  let minMonths = Infinity;

  for (const item of order.items) {
    const type = detectType(item);
    if (!type) continue;
    const monthlyConsumption = MONTHLY_CONSUMPTION_60M2_MEDIO_ESTANDAR[type];
    if (!monthlyConsumption) continue;
    const months = item.quantity / monthlyConsumption;
    if (months < minMonths) {
      minMonths = months;
    }
  }

  if (minMonths === Infinity || minMonths <= 0) return null;

  // Use delivery date if available, otherwise createdAt
  const deliveredEvent = order.statusHistory.find(h => h.status === 'entregado');
  const baseDate = deliveredEvent ? new Date(deliveredEvent.date) : new Date(order.createdAt);
  const depletionDate = new Date(baseDate);
  depletionDate.setDate(depletionDate.getDate() + Math.round(minMonths * 30));

  return depletionDate;
}

export function formatDepletionDate(date: Date): string {
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
  });
}
