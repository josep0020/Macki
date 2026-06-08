import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string; // e.g. "30+", "100%", "24hrs", "16"
  label: string;
  duration?: number; // ms
}

function parseValue(raw: string): { num: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: raw };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

export function AnimatedCounter({ value, label, duration = 1800 }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState('0');
  const [started, setStarted] = useState(false);
  const { num, suffix } = parseValue(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || num === 0) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(String(Math.floor(eased * num)));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(String(num));
    };
    requestAnimationFrame(step);
  }, [started, num, duration]);

  return (
    <div ref={ref} className="text-center px-2">
      <span className="text-lg font-bold text-on-surface leading-none block tabular-nums">
        {display}{suffix}
      </span>
      <span className="text-[10px] text-on-surface-variant font-medium mt-1 block">{label}</span>
    </div>
  );
}
