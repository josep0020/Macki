import { useState } from 'react';
import { Flame, MapPin, ChevronRight, Droplets, Truck, ShieldCheck, TreePine, Thermometer, Award, Calculator } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { BannerCarousel } from '../components/BannerCarousel';
import { SeasonalAlert } from '../components/SeasonalAlert';
import { ConsumptionCalculator } from '../components/ConsumptionCalculator';
import { products } from '../data';
import { ThemeMode, CartItem, Product } from '../types';

interface HomeScreenProps {
  cart: CartItem[];
  onGoToStore: () => void;
  onAddToCart: (product: Product) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const features = [
  {
    icon: Droplets,
    title: 'Leña 100% Seca',
    desc: 'Certificada y lista para usar con máximo rendimiento calórico.',
  },
  {
    icon: Truck,
    title: 'Despacho Regional',
    desc: 'Entrega a domicilio en toda la Región del Maule.',
  },
  {
    icon: ShieldCheck,
    title: 'Calidad Garantizada',
    desc: 'Seleccionamos cada lote para asegurar la mejor calidad.',
  },
];

const stats = [
  { value: '16', label: 'Comunas', icon: MapPin },
  { value: '30+', label: 'Comerciantes', icon: Award },
  { value: '100%', label: 'Certificada', icon: TreePine },
  { value: '24hrs', label: 'Despacho', icon: Thermometer },
];

export function HomeScreen({ onGoToStore, onAddToCart, theme, onToggleTheme }: HomeScreenProps) {
  const [showCalculator, setShowCalculator] = useState(false);
  const featured = products.filter(p => p.badge).slice(0, 3);

  return (
    <div className="min-h-screen pb-24">
      {/* Simple header */}
      <header className="bg-surface sticky top-0 z-50 flex justify-between items-center w-full px-4 py-3 shadow-sm">
        <div className="w-10" />
        <div className="flex items-center gap-2">
          <Flame className="text-primary w-7 h-7 fill-primary" />
          <h1 className="font-serif text-2xl text-primary font-bold tracking-tight">Maule Leña</h1>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main className="max-w-md mx-auto px-6">
        <SeasonalAlert />

        {/* Hero */}
        <section className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-6 pb-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-on-primary/20" />
            <div className="absolute -bottom-12 -left-6 w-48 h-48 rounded-full bg-on-primary/10" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-on-primary/15 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <TreePine className="w-3.5 h-3.5 text-on-primary" />
              <span className="text-[11px] font-semibold text-on-primary tracking-wide uppercase">Región del Maule</span>
            </div>
            <h2 className="font-serif text-3xl text-on-primary font-bold leading-tight mb-2">
              Calor que nace<br />de la tierra
            </h2>
            <p className="text-on-primary/80 text-sm leading-relaxed mb-5 max-w-[260px]">
              Leña certificada, seca y seleccionada. Directo del comerciante local a tu hogar.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={onGoToStore}
                className="inline-flex items-center justify-center gap-2 bg-on-primary text-primary font-semibold text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.97] transition-all"
              >
                Explorar Tienda
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCalculator(true)}
                className="inline-flex items-center justify-center gap-2 bg-on-primary/15 text-on-primary font-semibold text-sm px-5 py-3 rounded-xl border border-on-primary/20 backdrop-blur-sm hover:bg-on-primary/25 active:scale-[0.97] transition-all"
              >
                <Calculator className="w-4 h-4" />
                ¿Cuánto necesito?
              </button>
            </div>
          </div>
        </section>

        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Stats bar */}
        <section className="mt-6 grid grid-cols-4 gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-1"
              >
                <Icon className="w-4.5 h-4.5 text-primary" />
                <span className="text-lg font-bold text-on-surface leading-none">{stat.value}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">{stat.label}</span>
              </div>
            );
          })}
        </section>

        {/* Features */}
        <section className="mt-8">
          <h3 className="font-serif text-xl text-on-surface font-bold mb-4">¿Por qué elegirnos?</h3>
          <div className="flex flex-col gap-3">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="flex items-start gap-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">{feat.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured products */}
        {featured.length > 0 && (
          <section className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl text-on-surface font-bold">Destacados</h3>
              <button
                onClick={onGoToStore}
                className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
              {featured.map(product => (
                <div
                  key={product.id}
                  className="min-w-[160px] max-w-[160px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm shrink-0"
                >
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-secondary/90 text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-on-surface leading-tight line-clamp-2">{product.name}</h4>
                    <p className="text-sm font-bold text-primary mt-1.5">
                      ${product.price.toLocaleString('es-CL')}
                      <span className="text-[10px] text-on-surface-variant font-normal">/{product.unit}</span>
                    </p>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full mt-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold py-1.5 rounded-lg transition-colors active:scale-[0.97]"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-8 mb-4">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 text-center">
            <Flame className="w-8 h-8 text-primary mx-auto mb-3 fill-primary/20" />
            <h3 className="font-serif text-lg text-on-surface font-bold mb-1">¿Listo para abrigarte?</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Revisa nuestro catálogo completo de leña, pellet y parafina.
            </p>
            <button
              onClick={onGoToStore}
              className="bg-primary text-on-primary font-semibold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-container active:scale-[0.97] transition-all"
            >
              Ir a la Tienda
            </button>
          </div>
        </section>
      </main>

      <ConsumptionCalculator open={showCalculator} onClose={() => setShowCalculator(false)} onAddToCart={onAddToCart} />
    </div>
  );
}
