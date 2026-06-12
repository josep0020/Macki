import { useState } from 'react';
import { Flame, MapPin, ChevronDown, Store, ShieldAlert, Check, Menu } from 'lucide-react';
import { products, comunas } from '../data';
import { merchantsByComuna } from '../merchants';
import { ProductCard } from '../components/ProductCard';
import { TrustIndicators } from '../components/TrustIndicators';
import { MerchantCard } from '../components/MerchantCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { AirQualityBanner } from '../components/AirQualityBanner';
import { CartItem, CategoryFilter, ThemeMode } from '../types';
import { AirQualityData, AirQualityLevel } from '../utils/airQuality';

interface CatalogScreenProps {
  cart: CartItem[];
  comuna: string;
  onComunaChange: (comuna: string) => void;
  onAddToCart: (product: any) => void;
  onGoToCheckout: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  airQuality: AirQualityData;
  onSimulateLevel: (level: AirQualityLevel | null) => void;
  onOpenDrawer: () => void;
}

const categories: { key: CategoryFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'leña', label: 'Leña' },
  { key: 'pellet', label: 'Pellet' },
  { key: 'parafina', label: 'Parafina' },
  { key: 'favoritos', label: 'Favoritos' },
];

export function CatalogScreen({ 
  cart, 
  comuna, 
  onComunaChange, 
  onAddToCart, 
  onGoToCheckout, 
  theme, 
  onToggleTheme, 
  favorites, 
  onToggleFavorite,
  airQuality,
  onSimulateLevel,
  onOpenDrawer
}: CatalogScreenProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('todos');
  const [locationOpen, setLocationOpen] = useState(false);
  const [showMerchants, setShowMerchants] = useState(false);

  const baseProducts = activeCategory === 'favoritos'
    ? products.filter(p => favorites.includes(p.id))
    : activeCategory === 'todos'
      ? products
      : products.filter(p => p.category === activeCategory);

  // If restricted, sort pellets and parafina first, leña last
  const filteredProducts = airQuality.isRestricted
    ? [...baseProducts].sort((a, b) => {
        if (a.category === 'leña' && b.category !== 'leña') return 1;
        if (a.category !== 'leña' && b.category === 'leña') return -1;
        return 0;
      })
    : baseProducts;

  const merchants = merchantsByComuna[comuna] ?? [];

  return (
    <div className="min-h-screen pb-24">
      {/* Liquid Glass Header */}
      <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/80 dark:bg-surface-container-low/75 backdrop-blur-md border-b border-outline-variant/15 rounded-b-2xl shadow-sm transition-all">
        <div className="max-w-md mx-auto flex justify-between items-center px-4 py-3">
          <button
            onClick={onOpenDrawer}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 text-on-surface cursor-pointer"
            aria-label="Abrir menú de información"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Flame className="text-primary w-7 h-7 fill-primary" />
            <h1 className="font-serif text-2xl text-primary font-bold tracking-tight">Maule Leña</h1>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 mt-4">
        <AirQualityBanner
          comuna={comuna}
          airQuality={airQuality}
          onSimulateLevel={onSimulateLevel}
        />

        <h2 className="font-serif text-2xl text-on-surface font-bold mt-6 mb-4">Nuestros Productos</h2>

        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 relative">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {airQuality.isRestricted && (
          <div className="mt-2 mb-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/25 text-red-900 dark:text-red-300 flex items-start gap-3 shadow-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-red-800 dark:text-red-200">
                LEÑA PROHIBIDA: FISCALIZACIÓN ACTIVA
              </h4>
              <p className="text-xs mt-0.5 leading-relaxed opacity-90">
                Multas de hasta $325.000 por encendido hoy en {comuna}. Prefiera pellet o parafina.
              </p>
            </div>
          </div>
        )}

        {activeCategory === 'pellet' && (
          <div className="mt-2 mb-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 text-emerald-900 dark:text-emerald-300 flex items-start gap-3 shadow-sm">
            <Check className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-200">
                Garantía de Suministro Protegido
              </h4>
              <p className="text-xs mt-0.5 leading-relaxed opacity-90">
                Reserva de stock prioritario ENplus activa para la provincia. Despacho express asegurado en 24-48 horas ante el riesgo de quiebre invernal regional.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className="stagger-item h-full"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <ProductCard
                product={product}
                onAdd={() => onAddToCart(product)}
                cartQuantity={cart.find(i => i.product.id === product.id)?.quantity ?? 0}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={() => onToggleFavorite(product.id)}
                isRestrictedComuna={airQuality.isRestricted}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">
            <p className="text-lg">No hay productos en esta categoría</p>
          </div>
        )}

        <TrustIndicators />

        {merchants.length > 0 && (
          <section className="mt-10 mb-2">
            <h3 className="font-serif text-xl text-on-surface font-bold mb-3">Contacta directo a nuestros proveedores</h3>

            <div className="mb-3">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="w-full flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 shadow-sm rounded-xl px-4 py-3 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3 text-on-surface">
                  <MapPin className="w-5 h-5 text-on-surface-variant" />
                  <span className="text-sm font-medium">{comuna}, Maule</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
              </button>
              {locationOpen && (
                <div className="mt-2 bg-surface-container-lowest border border-outline-variant/60 shadow-lg rounded-xl max-h-80 overflow-y-auto">
                  {comunas.map(c => (
                    <button
                      key={c}
                      onClick={() => { onComunaChange(c); setLocationOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-surface-variant transition-colors flex items-center gap-2 ${
                        c === comuna ? 'text-primary font-semibold bg-primary/5' : 'text-on-surface'
                      }`}
                    >
                      {c === comuna && <MapPin className="w-4 h-4" />}
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowMerchants(!showMerchants)}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 transition-colors border ${
                showMerchants
                  ? 'bg-primary/5 border-primary/40 text-primary'
                  : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-primary/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {merchants.length} comerciante{merchants.length > 1 ? 's' : ''} en {comuna}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMerchants ? 'rotate-180' : ''}`} />
            </button>

            {showMerchants && (
              <div className="mt-3 flex flex-col gap-2">
                {merchants.map((merchant) => (
                  <MerchantCard key={merchant.phone} merchant={merchant} />
                ))}
              </div>
            )}
          </section>
        )}

        {cart.length > 0 && (
          <section className="mt-8 mb-8 bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/30 text-center">
            <h3 className="font-serif text-xl text-on-surface font-bold mb-2">¿Listo para comprar?</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Tienes {cart.reduce((s, i) => s + i.quantity, 0)} producto{cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''} en tu carrito
            </p>
            <button
              onClick={onGoToCheckout}
              className="w-full bg-primary text-on-primary font-semibold text-base py-3.5 rounded-xl shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Ir al Carrito y Pagar
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
