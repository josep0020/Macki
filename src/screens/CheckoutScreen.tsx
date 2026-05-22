import { ArrowLeft, MoreVertical, MapPin, CreditCard, Lock, Trash2, Truck } from 'lucide-react';
import { CartItem, ThemeMode } from '../types';
import { CartItemView } from '../components/CartItem';
import { TrustIndicators } from '../components/TrustIndicators';
import { ThemeToggle } from '../components/ThemeToggle';
import { getShippingCost, FREE_SHIPPING_THRESHOLD } from '../data';

interface CheckoutScreenProps {
  cart: CartItem[];
  comuna: string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onGoBack: () => void;
  onGoToConfirmation: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function CheckoutScreen({ cart, comuna, onUpdateQuantity, onRemoveItem, onGoBack, onGoToConfirmation, theme, onToggleTheme }: CheckoutScreenProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const { cost: shippingCost, label: shippingLabel, savings } = getShippingCost(comuna, subtotal);
  const total = subtotal + shippingCost;
  const isCartEmpty = cart.length === 0;
  const remainingForFree = FREE_SHIPPING_THRESHOLD - subtotal;
  const showFreeShippingHint = remainingForFree > 0 && subtotal < FREE_SHIPPING_THRESHOLD && !isCartEmpty;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-surface sticky top-0 z-50 flex justify-between items-center w-full px-4 py-3 shadow-sm">
        <button onClick={onGoBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-serif text-xl md:text-2xl text-primary font-bold">Resumen de Compra</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 text-primary">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto px-6 py-6 flex-1 flex flex-col gap-6 pb-48">
        {showFreeShippingHint && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-3">
            <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-on-surface">¡Te faltan ${remainingForFree.toLocaleString('es-CL')} para despacho gratis!</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Agrega más productos y ahorra en el envío.</p>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-serif text-2xl text-on-surface font-bold">Tus Productos</h2>
            {!isCartEmpty && (
              <span className="text-sm text-on-surface-variant">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
            )}
          </div>
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
              <div className="flex items-center gap-3 bg-surface-container-lowest border border-primary/60 shadow-sm rounded-xl px-4 py-4">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">Ubicación a confirmar</p>
                  <p className="text-xs text-on-surface-variant">Se te pedirá al finalizar la compra</p>
                </div>
              </div>
            </section>

            <section className="bg-surface-container-low rounded-2xl p-6 flex flex-col gap-3 shadow-sm border border-outline-variant/30">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-base">Subtotal</span>
                <span className="text-base font-medium">${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-base text-on-surface-variant">Despacho</span>
                  <span className={`text-xs ${shippingCost === 0 ? 'text-green-600 font-semibold' : savings > 0 ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                    {shippingCost === 0 ? '¡Gratis!' : shippingLabel}
                  </span>
                </div>
                <div className="text-right">
                  {savings > 0 ? (
                    <div className="flex flex-col items-end">
                      <span className="text-base font-medium line-through text-on-surface-variant/60">${(shippingCost + savings).toLocaleString('es-CL')}</span>
                      <span className="text-base font-bold text-primary">${shippingCost.toLocaleString('es-CL')}</span>
                    </div>
                  ) : (
                    <span className={`text-base font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-on-surface-variant'}`}>
                      {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CL')}`}
                    </span>
                  )}
                </div>
              </div>
              {savings > 0 && (
                <div className="bg-primary/10 rounded-lg px-3 py-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary">Ahorras ${savings.toLocaleString('es-CL')} en despacho</span>
                </div>
              )}
              <hr className="border-outline-variant/60 my-1" />
              <div className="flex justify-between items-center text-on-surface">
                <span className="text-lg font-bold">Total Final</span>
                <span className="font-serif text-2xl font-bold text-primary">${total.toLocaleString('es-CL')}</span>
              </div>
            </section>

            <section className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <p className="text-sm text-on-surface">
                <span className="font-semibold">Nota:</span> Los precios de despacho son referenciales y pueden variar según tu ubicación exacta. El costo final se confirmará al ingresar tu dirección de entrega.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl text-on-surface font-bold">Método de Pago Seguro</h2>
              <div className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-surface-variant rounded-full flex items-center justify-center text-primary relative">
                  <CreditCard className="w-6 h-6 fill-current opacity-20 absolute" />
                  <CreditCard className="w-6 h-6 relative" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-on-surface">Webpay Plus</h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Tarjetas de Crédito y Débito</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
            </section>

            <TrustIndicators />
          </>
        )}
      </main>

      {!isCartEmpty && (
        <div className="fixed bottom-16 left-0 w-full bg-surface border-t border-outline-variant/30 p-6 pb-safe z-50">
          <div className="max-w-md mx-auto">
            <button onClick={onGoToConfirmation} className="w-full bg-primary text-on-primary font-semibold text-lg py-4 rounded-xl shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Confirmar Pedido y Pagar
              <Lock className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}