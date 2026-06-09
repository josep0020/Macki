import { CartItem, OrderData } from '../types';
import { getShippingCost } from '../data';

// Change this to your actual WhatsApp business number
export const WHATSAPP_NUMBER = '56912345678';

export function buildWhatsAppMessage(
  orderId: string,
  orderData: OrderData,
  cart: CartItem[],
  comuna: string,
): string {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const { cost: shippingCost } = getShippingCost(comuna, subtotal);
  const total = subtotal + shippingCost;

  const lines: string[] = [
    `🔥 *NUEVO PEDIDO - Maule Leña*`,
    `━━━━━━━━━━━━━━━━━━`,
    `📋 *Pedido:* ${orderId}`,
    `👤 *Cliente:* ${orderData.name}`,
    `📞 *Teléfono:* ${orderData.phone}`,
    `📍 *Dirección:* ${orderData.address}`,
    `🏘️ *Comuna:* ${comuna}`,
  ];

  if (orderData.deliveryDate) {
    const dateStr = new Date(orderData.deliveryDate + 'T12:00:00').toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const timeSlot = orderData.deliveryTimeSlot || 'Sin preferencia';
    lines.push(`📅 *Entrega:* ${dateStr}`);
    lines.push(`🕐 *Horario:* ${timeSlot}`);
  }

  if (orderData.notes) {
    lines.push(`📝 *Notas:* ${orderData.notes}`);
  }

  lines.push('');
  lines.push('🛒 *PRODUCTOS:*');
  lines.push('───────────────');

  cart.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    lines.push(
      `• ${item.product.name} — ${item.quantity} ${item.product.unit} × $${item.product.price.toLocaleString('es-CL')} = *$${itemTotal.toLocaleString('es-CL')}*`
    );
  });

  lines.push('');
  lines.push('───────────────');
  lines.push(`💰 Subtotal: $${subtotal.toLocaleString('es-CL')}`);
  lines.push(`🚚 Despacho: ${shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CL')}`}`);
  lines.push(`✅ *TOTAL: $${total.toLocaleString('es-CL')}*`);
  lines.push('');
  lines.push('_Enviado desde calordemaule.vercel.app_');

  return lines.join('\n');
}

export function openWhatsApp(message: string, phoneNumber: string = WHATSAPP_NUMBER): void {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
  window.open(url, '_blank');
}
