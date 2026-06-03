import { useState, useRef, useEffect } from 'react';
import { Flame, TreePine, Truck, ShieldCheck } from 'lucide-react';

interface BannerSlide {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  watermark: string;
  bottomIcons: typeof Flame[];
  bottomText: string;
}

const slides: BannerSlide[] = [
  {
    image: '/images/banner1.jpg',
    eyebrow: 'DESTACADO',
    title: 'Leña 100% Certificada',
    subtitle: 'Seca, seleccionada y lista para usar',
    watermark: 'Maule Leña',
    bottomIcons: [Flame, TreePine, ShieldCheck],
    bottomText: '30+ comerciantes en la región',
  },
  {
    image: '/images/banner2.jpg',
    eyebrow: 'SUSTENTABLE',
    title: 'Más calor, menos árboles',
    subtitle: 'Manejo forestal responsable',
    watermark: 'Maule Leña',
    bottomIcons: [TreePine, ShieldCheck, Truck],
    bottomText: 'Despacho en toda la región',
  },
];

export function BannerCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll position to update active dot
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.firstElementChild
        ? (container.firstElementChild as HTMLElement).offsetWidth
        : 1;
      const gap = 12;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, slides.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement;
    if (card) {
      container.scrollTo({
        left: card.offsetLeft - 16,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="banner-section">
      {/* Scrollable cards container */}
      <div ref={scrollRef} className="banner-scroll">
        {slides.map((slide, idx) => (
          <div key={idx} className="banner-card">
            {/* Background image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="banner-card-bg"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="banner-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`banner-dot ${idx === activeIndex ? 'active' : ''}`}
            aria-label={`Ir a slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
