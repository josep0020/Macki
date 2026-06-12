import { ArrowLeft, MoreVertical, MapPin, CreditCard, Lock, Trash2, Truck, ChevronRight, Info, Ticket, X, ShieldAlert } from 'lucide-react';
import { CartItem, ThemeMode, LoyaltyCoupon } from '../types';
import { CartItemView } from '../components/CartItem';
import { TrustIndicators } from '../components/TrustIndicators';
import { ThemeToggle } from '../components/ThemeToggle';
import { getShippingCost, FREE_SHIPPING_THRESHOLD } from '../data';
import { getActiveCoupons } from '../utils/loyalty';
import { AirQualityData } from '../utils/airQuality';

interface CheckoutScreenProps {
  cart: CartItem[];
  comuna: string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onGoBack: () => void;
  onGoToConfirmation: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeCoupon?: LoyaltyCoupon | null;
  onApplyCoupon?: () => void;
  onRemoveCoupon?: () => void;
  couponDiscount?: number;
  airQuality: AirQualityData;
}

export function CheckoutScreen({ cart, comuna, onUpdateQuantity, onRemoveItem, onGoBack, onGoToConfirmation, theme, onToggleTheme, activeCoupon, onApplyCoupon, onRemoveCoupon, couponDiscount, airQuality }: CheckoutScreenProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const { cost: shippingCost, label: shippingLabel, savings } = getShippingCost(comuna, subtotal);
  const effectiveDiscount = couponDiscount && couponDiscount > 0 ? couponDiscount : 0;
  const total = subtotal + shippingCost - effectiveDiscount;
  const isCartEmpty = cart.length === 0;
  const remainingForFree = FREE_SHIPPING_THRESHOLD - subtotal;
  const showFreeShippingHint = remainingForFree > 0 && subtotal < FREE_SHIPPING_THRESHOLD && !isCartEmpty;
  const freeShippingPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Check if there are available coupons when none is applied
  const availableCoupons = !activeCoupon ? getActiveCoupons() : [];
  const hasAvailableCoupon = availableCoupons.length > 0;

  const hasRestrictedFirewoodInCart = cart.some(item => item.product.category === 'leña');

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Liquid Glass Header */}
      <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/80 dark:bg-surface-container-low/75 backdrop-blur-md border-b border-outline-variant/15 rounded-b-2xl shadow-sm transition-all">
        <div className="max-w-md mx-auto flex justify-between items-center px-4 py-3">
          <button onClick={onGoBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 text-primary cursor-pointer" aria-label="Volver">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-serif text-lg md:text-xl text-primary font-bold">Resumen de Compra</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 text-primary cursor-pointer" aria-label="Más opciones">
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto px-6 py-6 flex-1 flex flex-col gap-6 pb-48">
        {showFreeShippingHint && (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#334529]/10 flex items-center justify-center text-[#334529] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">¡Te faltan ${remainingForFree.toLocaleString('es-CL')} para despacho gratis!</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Agrega más productos y ahorra en el envío.</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-outline-variant/30 h-2 rounded-full overflow-hidden">
              <div className="bg-[#334529] h-full rounded-full transition-all duration-500" style={{ width: `${freeShippingPct}%` }} />
            </div>
          </div>
        )}

        {/* Coupon Banner */}
        {!isCartEmpty && activeCoupon && (
          <div className="bg-primary/10 border border-primary/30 rounded-3xl px-5 py-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">{activeCoupon.description}</p>
              <p className="text-xs text-primary font-medium mt-0.5">Cupón aplicado</p>
            </div>
            {onRemoveCoupon && (
              <button
                onClick={onRemoveCoupon}
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center transition-colors shrink-0"
                aria-label="Quitar cupón"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            )}
          </div>
        )}

        {!isCartEmpty && !activeCoupon && hasAvailableCoupon && onApplyCoupon && (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl px-5 py-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <p className="text-sm text-on-surface flex-1">Tienes un cupón disponible</p>
            <button
              onClick={onApplyCoupon}
              className="text-sm font-bold text-primary hover:text-primary-container transition-colors px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20"
            >
              Aplicar
            </button>
          </div>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-serif text-2xl text-on-surface font-bold">Tus Productos</h2>
            {!isCartEmpty && (
              <span className="text-sm text-on-surface-variant">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
            )}
          </div>

          {hasRestrictedFirewoodInCart && airQuality.isRestricted && (
            <div className="bg-red-500/5 border border-red-500/25 rounded-2xl p-4 shadow-sm animate-pulse-slow">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-black text-red-800 dark:text-red-200 uppercase tracking-wide">
                    LEÑA RESTRINGIDA HOY
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-0.5 leading-relaxed">
                    Su comuna está bajo restricción. Prohibido encender leña hoy (multas de hasta $325.000). El despacho se entregará seco para almacenamiento y uso posterior.
                  </p>
                </div>
              </div>
            </div>
          )}
          {isCartEmpty ? (
            <div className="text-center py-12">
              <img src="/images/carro-de-la-compra.png" alt="Carrito vacío" className="w-44 h-44 mx-auto mb-2" />
              <p className="text-on-surface-variant text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-on-surface-variant text-sm">Agrega productos desde el catálogo</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map(item => (
                <div key={item.product.id} className="relative group">
                  <CartItemView product={item.product} quantity={item.quantity} onUpdateQuantity={onUpdateQuantity} />
                  <button onClick={() => onRemoveItem(item.product.id)} className="absolute -top-2 -right-2 w-7 h-7 bg-error/90 text-on-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-error" aria-label="Eliminar">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {!isCartEmpty && (
          <>
            <section className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl text-on-surface font-bold">Despacho</h2>
              <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 shadow-sm rounded-3xl px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#334529]/10 flex items-center justify-center text-[#334529] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Ubicación a confirmar</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Se te pedirá al finalizar la compra</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-on-surface-variant" />
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-3xl p-6 flex flex-col gap-4 shadow-sm border border-outline-variant/30">
              <div className="flex justify-between items-center text-on-surface-variant text-sm">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Despacho</span>
                <span className="line-through text-on-surface-variant/60">${(shippingCost + savings).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Despacho reducido</span>
                <span className="font-bold text-[#334529]">${shippingCost.toLocaleString('es-CL')}</span>
              </div>
              {savings > 0 && (
                <div className="bg-[#334529]/10 rounded-full px-4 py-1.5 flex items-center gap-2 self-start">
                  <span className="text-xs font-semibold text-[#334529]">Ahorras ${savings.toLocaleString('es-CL')} en despacho</span>
                </div>
              )}
              {effectiveDiscount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-primary" />
                    Cupón de descuento
                  </span>
                  <span className="font-bold text-primary">-${effectiveDiscount.toLocaleString('es-CL')}</span>
                </div>
              )}
              <hr className="border-outline-variant/30 my-1" />
              <div className="flex justify-between items-center text-on-surface">
                <span className="text-base font-bold">Total Final</span>
                <span className="font-serif text-3xl font-extrabold text-on-surface">${total.toLocaleString('es-CL')}</span>
              </div>
            </section>

            <section className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-on-surface-variant shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                <span className="font-semibold text-on-surface">Nota:</span> Los precios de despacho son referenciales y pueden variar según tu ubicación exacta. El costo final se confirmará al ingresar tu dirección de entrega.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl text-on-surface font-bold">Método de Pago Seguro</h2>
              <div className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-surface-variant/30 rounded-2xl flex items-center justify-center text-[#334529] relative">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-on-surface">Webpay Plus</h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Tarjetas de Crédito y Débito</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-[#334529] flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#334529] rounded-full"></div>
                </div>
              </div>
            </section>

            <TrustIndicators />
          </>
        )}
      </main>

      {!isCartEmpty && (
        <div className="fixed bottom-[88px] left-0 w-full p-4 z-[90]">
          <div className="max-w-md mx-auto">
            <button onClick={onGoToConfirmation} className="w-full bg-primary hover:bg-primary/90 text-on-primary font-semibold text-base py-4 rounded-full shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
              Confirmar Pedido y Pagar
              <Lock className="w-4 h-4 text-on-primary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}