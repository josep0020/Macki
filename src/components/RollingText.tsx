import { useState, useEffect } from 'react';

const phrases = [
  'Leña 100% certificada y seca.',
  'Leña con menos de 25% de humedad.',
  '16 comunas de la Región del Maule.',
  'Directo del productor local.',
];

interface RollingTextProps {
  interval?: number; // ms between transitions
}

export function RollingText({ interval = 3000 }: RollingTextProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % phrases.length);
        setVisible(true);
      }, 350);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <p
      className="text-white font-medium text-sm leading-relaxed mb-5 max-w-[260px] transition-all duration-350"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 350ms ease, transform 350ms ease',
      }}
    >
      {phrases[index]}
    </p>
  );
}
