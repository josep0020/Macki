import { useState, useEffect } from 'react';
import { 
  Flame, MapPin, ChevronRight, ArrowRight, TreePine, 
  Thermometer, Award, Calculator, Check, Menu, 
  Package, Calendar, AlertTriangle, Sparkles, CloudRain,
  Leaf, Info
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { BannerCarousel } from '../components/BannerCarousel';
import { SeasonalAlert } from '../components/SeasonalAlert';
import { AirQualityBanner } from '../components/AirQualityBanner';
import { products } from '../data';
import { ThemeMode, CartItem, Product } from '../types';
import { AirQualityData, AirQualityLevel } from '../utils/airQuality';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { RollingText } from '../components/RollingText';

interface HomeScreenProps {
  cart: CartItem[];
  onGoToStore: () => void;
  onAddToCart: (product: Product) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCalculator: () => void;
  airQuality: AirQualityData;
  onSimulateLevel: (level: AirQualityLevel | null) => void;
  comuna: string;
  onOpenDrawer: () => void;
  onGoToAccount: () => void;
}

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
              : 'bg-white hover:bg-neutral-100 text-neutral-900 border-outline-variant/60 shadow-sm'
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

// Subcomponente para renderizar anillos de progreso estilo Apple Watch
function BatteryRing({ value, color, label }: { value: number; color: string; label: string }) {
  const radius = 13;
  const circ = 2 * Math.PI * radius; // ~81.68
  const strokeOffset = circ - (circ * value) / 100;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg className="w-9 h-9 transform -rotate-90">
          {/* Base / Background Ring */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            className="stroke-zinc-200/50 dark:stroke-zinc-800/80 fill-none"
            strokeWidth="3"
          />
          {/* Progress Ring */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-[8px] font-sans font-bold text-on-surface">{value}%</span>
      </div>
      <span className="text-[8px] font-sans font-semibold text-on-surface-variant/70 tracking-tight">{label}</span>
    </div>
  );
}

function Typewriter({ text, speed = 80, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    setIsDone(false);
    
    let intervalId: number | undefined;
    
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setDisplayedText((prev) => {
          if (i < text.length) {
            const next = prev + text.charAt(i);
            i++;
            if (i === text.length) {
              setIsDone(true);
              window.clearInterval(intervalId);
            }
            return next;
          }
          return prev;
        });
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speed, delay]);

  return (
    <span className="relative inline">
      {displayedText}
      {!isDone && (
        <span className="inline-block w-[2px] h-[1em] bg-primary dark:bg-primary-container ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}

export function HomeScreen({
  cart,
  onGoToStore,
  onAddToCart,
  theme,
  onToggleTheme,
  onOpenCalculator,
  airQuality,
  onSimulateLevel,
  comuna,
  onOpenDrawer,
  onGoToAccount,
}: HomeScreenProps) {
  const featured = products.filter(p => p.badge).slice(0, 3);

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
        <SeasonalAlert />
        
        <AirQualityBanner
          comuna={comuna}
          airQuality={airQuality}
          onSimulateLevel={onSimulateLevel}
        />

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

        {/* Panel de Widgets Estilo Apple (macOS / iOS) */}
        <section 
          className="mt-8 select-none mx-[-24px] px-6 py-10 relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: "url('/images/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg')" }}
        >
          {/* Frosted Glass Overlay */}
          <div className="absolute inset-0 bg-surface/40 dark:bg-black/45 backdrop-blur-xs z-0" />

          {/* Top Fade Gradient */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-surface to-transparent z-10 pointer-events-none" />

          {/* Bottom Fade Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none" />

          <div className="relative z-20">
            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-3 pl-1" style={{ letterSpacing: '1.5px' }}>
              Mi Invierno
            </span>
            
            <div className="relative overflow-visible py-4 flex items-center justify-between gap-6 min-h-[180px]">
              {/* Left Side: Typography */}
              <div className="flex-1 pr-2 z-10 pb-1 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary dark:text-primary-container text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 w-fit animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <TreePine className="w-3.5 h-3.5" />
                  Anticipa el Frío
                </span>
                <h4 className="font-serif text-[25px] min-[375px]:text-[28px] min-[410px]:text-3xl font-black text-on-surface leading-tight min-h-[72px] pl-1.5 pr-1">
                  <Typewriter text="¡No te quedes sin leña!" speed={90} delay={400} />
                </h4>
                <p className="text-sm font-semibold text-on-surface mt-1.5 leading-snug max-w-[200px] animate-fade-in-up opacity-0" style={{ animationDelay: '2800ms', animationFillMode: 'both' }}>
                  Compra hoy, despacho rápido.
                </p>
              </div>
  
              {/* Right Side: Cozy Custom Fireplace SVG Illustration */}
              <div className="w-36 h-36 shrink-0 relative flex items-center justify-end">
                <svg className="w-36 h-36 overflow-visible" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g stroke={theme === 'dark' ? '#111412' : '#130c0e'} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
                    
                    {/* Sparks parpadeantes */}
                    <path d="M 155,100 C 140,115 143,130 155,130 C 165,130 168,115 155,100 Z" fill="#f26d3d" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
                    <path d="M 370,145 C 358,155 360,168 370,168 C 378,168 380,155 370,145 Z" fill="#f26d3d" className="animate-pulse" style={{ animationDuration: '3.5s' }} />

                    {/* Fuego exterior */}
                    <path d="M 175,320 C 120,310 100,240 125,185 C 135,160 155,170 160,190 C 170,140 205,80 235,85 C 275,90 280,180 320,160 C 345,150 345,210 325,230 C 355,230 370,260 350,300 C 335,325 300,340 270,320 Z" fill="#f26d3d" className="animate-pulse" style={{ animationDuration: '4s' }} />

                    {/* Fuego medio */}
                    <path d="M 200,320 C 170,310 160,250 180,220 C 190,200 210,240 220,250 C 220,190 250,145 270,180 C 290,210 280,260 310,260 C 325,260 320,300 300,320 Z" fill="#f6be59" className="animate-pulse" style={{ animationDuration: '3s' }} />

                    {/* Fuego interior */}
                    <path d="M 225,320 C 210,310 205,275 220,260 C 230,250 240,280 250,280 C 255,255 270,255 275,275 C 280,295 275,315 260,320 Z" fill="#fff6df" className="animate-pulse" style={{ animationDuration: '2s' }} />

                    {/* Leño principal izquierdo */}
                    <path d="M 100,315 L 260,315 C 260,315 265,340 255,365 L 100,365 C 70,365 70,315 100,315 Z" fill="#be7a4d" />
                    <path d="M 100,315 L 250,315 C 240,330 210,330 190,325 L 100,325" fill="#e3a476" stroke="none" />
                    <path d="M 95,340 C 130,340 150,352 190,350" fill="none" />
                    <circle cx="230" cy="332" r="2" fill={theme === 'dark' ? '#111412' : '#130c0e'} stroke="none" />
                    <path d="M 220,352 C 230,352 240,348 245,342" fill="none" />

                    {/* Extremos de leños derechos */}
                    <circle cx="280" cy="340" r="30" fill="#e3a476" />
                    <path d="M 280,322 A 18,18 0 1,1 265,350" fill="none" />

                    <circle cx="360" cy="340" r="30" fill="#e3a476" />
                    <path d="M 360,322 A 18,18 0 1,1 345,350" fill="none" />

                  </g>
                </svg>
              </div>

            </div>
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
              className="bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm px-8 py-3 rounded-full shadow-md hover:shadow-lg active:scale-[0.97] transition-all cursor-pointer"
            >
              Ir a la Tienda
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
