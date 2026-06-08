import { useState } from 'react';
import { Flame, MapPin, ChevronRight, ArrowRight, Droplets, Truck, ShieldCheck, TreePine, Thermometer, Award, Calculator, Check } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { BannerCarousel } from '../components/BannerCarousel';
import { SeasonalAlert } from '../components/SeasonalAlert';
import { products } from '../data';
import { ThemeMode, CartItem, Product } from '../types';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { RollingText } from '../components/RollingText';

interface HomeScreenProps {
  cart: CartItem[];
  onGoToStore: () => void;
  onAddToCart: (product: Product) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCalculator: () => void;
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
  { value: '<25%', label: 'Humedad', icon: Thermometer },
];

function FeaturedProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="min-w-[160px] max-w-[160px] bg-surface-container-lowest border border-outline-variant/30 rounded-[24px] overflow-hidden shadow-sm shrink-0 flex flex-col justify-between">
      <div>
        <div className="relative h-24 overflow-hidden rounded-t-[24px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-3 pb-0">
          <h4 className="font-serif text-sm font-bold text-on-surface leading-tight line-clamp-1">{product.name}</h4>
          <p className="font-serif text-[15px] font-bold text-on-surface mt-1">
            ${product.price.toLocaleString('es-CL')}
            <span className="text-[10px] text-on-surface-variant font-normal font-sans ml-1">/{product.unit}</span>
          </p>
        </div>
      </div>
      <div className="p-3 pt-0">
        <button
          onClick={handleAdd}
          className={`w-full mt-2 text-xs font-semibold py-2 px-4 rounded-full border transition-all active:scale-[0.97] flex items-center justify-center gap-1 cursor-pointer ${
            justAdded
              ? 'bg-green-700 text-white border-green-700'
              : 'bg-white hover:bg-surface-container-low text-neutral-900 border-outline-variant/60 shadow-sm'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              ¡Agregado!
            </>
          ) : (
            'Agregar'
          )}
        </button>
      </div>
    </div>
  );
}

export function HomeScreen({ onGoToStore, onAddToCart, theme, onToggleTheme, onOpenCalculator }: HomeScreenProps) {
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
        <section
          className="mt-6 relative overflow-hidden rounded-2xl bg-cover bg-center p-6 pb-8"
          style={{ backgroundImage: "url('/images/renderizacion-3d-piezas-madera_23-2151340210.avif')" }}
        >
          {/* Overlay to ensure contrast */}
          <div className="absolute inset-0 bg-black/35 z-0" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <TreePine className="w-3.5 h-3.5 text-white" />
              <span className="text-[11px] font-bold text-white tracking-wide uppercase">Región del Maule</span>
            </div>
            <h2 className="font-serif text-3xl text-white font-extrabold leading-tight mb-2">
              Calor que nace<br />de la tierra
            </h2>
            <RollingText />
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={onGoToStore}
                className="inline-flex items-center justify-center gap-2 bg-[#2d422a] hover:bg-[#233520] text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.97] transition-all cursor-pointer"
              >
                Explorar Tienda
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={onOpenCalculator}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-xl border border-white/20 backdrop-blur-md hover:bg-white/20 active:scale-[0.97] transition-all cursor-pointer"
              >
                <div className="bg-white/10 border border-white/20 p-1.5 rounded-lg flex items-center justify-center mr-1">
                  <Calculator className="w-4 h-4 text-white" />
                </div>
                ¿Cuánto necesito?
              </button>
            </div>
          </div>
        </section>

        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Stats */}
        <section className="mt-6 flex items-center justify-between bg-surface-container-low rounded-2xl px-4 py-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center flex-1 justify-center">
              <AnimatedCounter value={stat.value} label={stat.label} />
              {i < stats.length - 1 && (
                <div className="w-px h-8 bg-outline-variant/40 ml-2" />
              )}
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="mt-8">
          <h3 className="font-serif text-xl text-on-surface font-bold mb-4">¿Por qué elegirnos?</h3>
          <div className="flex flex-col gap-4">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="flex items-start gap-3 border-l-2 border-primary/40 pl-4 py-1"
                >
                  <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
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
                <FeaturedProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-8 mb-4">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-outline-variant/10 dark:bg-surface-container-high">
              <Flame className="w-5 h-5 text-[#334529] fill-none" />
            </div>
            <h3 className="font-serif text-xl text-on-surface font-extrabold mb-1">¿Listo para abrigarte?</h3>
            <p className="text-xs text-on-surface-variant mb-5 leading-relaxed max-w-[240px] mx-auto">
              Revisa nuestro catálogo completo de leña, pellet y parafina.
            </p>
            <button
              onClick={onGoToStore}
              className="bg-[#334529] hover:bg-[#283720] text-white font-semibold text-sm px-8 py-3 rounded-full shadow-md hover:shadow-lg active:scale-[0.97] transition-all cursor-pointer dark:bg-primary dark:text-on-primary dark:hover:bg-primary-container"
            >
              Ir a la Tienda
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
