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
    image: '/images/banner1.webp',
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
  return (
    <section className="banner-section">
      {/* Marquee scroll container */}
      <div className="banner-scroll">
        <div className="banner-marquee-track">
          {/* Group 1 */}
          <div className="banner-marquee-group">
            {slides.map((slide, idx) => (
              <div key={`g1-${idx}`} className="banner-card">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="banner-card-bg"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Group 2 (Duplicate for infinite seamless loop) */}
          <div className="banner-marquee-group">
            {slides.map((slide, idx) => (
              <div key={`g2-${idx}`} className="banner-card">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="banner-card-bg"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
