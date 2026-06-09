import { CheckCircle, Home, MapPin, Phone, Copy, MessageCircle, CalendarDays, Sparkles } from 'lucide-react';
import { CartItem, OrderData, ThemeMode } from '../types';
import { getShippingCost } from '../data';
import { ThemeToggle } from '../components/ThemeToggle';
import { OrderTracker } from '../components/OrderTracker';
import { useState } from 'react';
import { buildWhatsAppMessage, openWhatsApp } from '../utils/whatsapp';
import { getLevelConfig } from '../utils/loyalty';
import { getLevelIcon } from '../components/LoyaltyBadge';

interface OrderSuccessScreenProps {
  orderId: string;
  orderData: OrderData;
  cart: CartItem[];
  comuna: string;
  onGoHome: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  pointsEarned?: number;
  leveledUp?: boolean;
  newLevel?: string;
}

export function OrderSuccessScreen({ orderId, orderData, cart, comuna, onGoHome, theme, onToggleTheme, pointsEarned, leveledUp, newLevel }: OrderSuccessScreenProps) {
  const [copied, setCopied] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const { cost: shippingCost } = getShippingCost(comuna, subtotal);
  const total = subtotal + shippingCost;

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback: select text manually
      const el = document.createElement('textarea');
      el.value = orderId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsApp = () => {
    const message = buildWhatsAppMessage(orderId, orderData, cart, comuna);
    openWhatsApp(message);
  };

  const formatDeliveryDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  // Resolve level config for display
  const levelConfig = newLevel ? getLevelConfig(newLevel as any) : null;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-surface flex justify-end items-center w-full px-4 py-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main className="max-w-md w-full mx-auto px-6 pb-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mt-4">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>

        <h1 className="font-serif text-3xl text-on-surface font-bold text-center mb-2">¡Pedido Confirmado!</h1>
        <p className="text-on-surface-variant text-center mb-6">Tu pedido ha sido registrado exitosamente</p>

        {/* Order Tracker */}
        <div className="w-full bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30 shadow-sm mb-4">
          <OrderTracker
            status="pendiente"
            orderId={orderId}
            createdAt={new Date().toISOString()}
          />
        </div>

        <div className="w-full bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Número de pedido</p>
              <p className="font-serif text-xl font-bold text-primary">{orderId}</p>
            </div>
            <button onClick={handleCopyId} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors" aria-label="Copiar número de pedido">
              <Copy className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
          {copied && <p className="text-xs text-primary mb-2">¡Copiado al portapapeles!</p>}
          <div className="flex items-start gap-3 mb-3">
            <MapPin className="w-4 h-4 text-on-surface-variant mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-on-surface">{orderData.name}</p>
              <p className="text-sm text-on-surface-variant">{orderData.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-4 h-4 text-on-surface-variant shrink-0" />
            <p className="text-sm text-on-surface-variant">{orderData.phone}</p>
          </div>
          {orderData.deliveryDate && (
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="w-4 h-4 text-on-surface-variant shrink-0" />
              <div>
                <p className="text-sm font-medium text-on-surface capitalize">{formatDeliveryDate(orderData.deliveryDate)}</p>
                {orderData.deliveryTimeSlot && (
                  <p className="text-xs text-on-surface-variant mt-0.5">{orderData.deliveryTimeSlot}</p>
                )}
              </div>
            </div>
          )}
          {orderData.notes && (
            <p className="text-sm text-on-surface-variant italic bg-surface-container px-3 py-2 rounded-lg">Nota: {orderData.notes}</p>
          )}
        </div>

        <div className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-outline-variant/30">
            <h3 className="font-semibold text-sm text-on-surface-variant">Resumen del pedido</h3>
          </div>
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between items-center px-6 py-3 border-b border-outline-variant/20 last:border-b-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">{item.product.name}</p>
                <p className="text-xs text-on-surface-variant">{item.quantity} {item.product.unit} × ${item.product.price.toLocaleString('es-CL')}</p>
              </div>
              <p className="text-sm font-semibold text-on-surface">${(item.product.price * item.quantity).toLocaleString('es-CL')}</p>
            </div>
          ))}
          <div className="px-6 py-4 bg-surface-container-low space-y-2">
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Despacho</span>
              <span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CL')}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-on-surface pt-2 border-t border-outline-variant/60">
              <span>Total</span>
              <span className="text-primary">${total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <div className="w-full mb-6">
          <button
            onClick={handleWhatsApp}
            className="w-full relative overflow-hidden font-semibold text-base py-4 rounded-2xl shadow-[0_8px_30px_rgba(37,211,102,0.15)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 text-white cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #128C7E 0%, #25D366 100%)',
            }}
          >
            {/* Ambient Shimmer Light Effect */}
            <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-25" />
            <MessageCircle className="w-5 h-5 fill-current relative z-10" />
            <span className="relative z-10">Enviar Pedido por WhatsApp</span>
          </button>
          <p className="text-xs text-on-surface-variant text-center mt-2.5">
            Tu pedido será confirmado y agendado por WhatsApp
          </p>
        </div>

        {/* Points Earned Section (Glassmorphism & Glow) */}
        {pointsEarned != null && pointsEarned > 0 && (
          <div className="w-full relative overflow-hidden rounded-3xl border border-white/10 dark:border-white/5 bg-white/[0.04] dark:bg-white/[0.02] backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] mb-6 flex flex-col gap-4">
            {/* Subtle premium gradient lights inside */}
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Club de Fidelidad
                </span>
                <h3 className="font-serif text-2xl font-extrabold text-on-surface flex items-baseline gap-1.5">
                  +{pointsEarned}
                  <span className="text-xs font-normal text-on-surface-variant font-sans">puntos acumulados</span>
                </h3>
              </div>

              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border"
                style={{
                  backgroundColor: `${levelConfig?.color ?? '#D97706'}15`,
                  borderColor: `${levelConfig?.color ?? '#D97706'}30`,
                  color: levelConfig?.color ?? '#D97706',
                }}
              >
                {getLevelIcon(newLevel as any, 'w-6 h-6 fill-current')}
              </div>
            </div>

            {leveledUp && newLevel && levelConfig && (
              <div className="relative z-10 mt-2 pt-4 border-t border-outline-variant/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">
                    ¡Subiste de Nivel!
                  </p>
                  <p className="text-sm font-bold text-on-surface truncate">
                    Nivel {levelConfig.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={onGoHome} className="w-full bg-primary text-on-primary font-semibold text-lg py-4 rounded-xl shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <Home className="w-5 h-5" />
          Volver al Inicio
        </button>
      </main>
    </div>
  );
}