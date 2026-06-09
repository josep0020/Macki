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
    <div className="mb-5 min-h-[48px] flex items-center">
      <p
        className="text-white font-medium text-sm leading-relaxed max-w-[260px]"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 350ms ease',
        }}
      >
        {phrases[index]}
      </p>
    </div>
  );
}
