import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className="relative flex items-center p-[2px] rounded-full select-none border backdrop-blur-md transition-all duration-300"
      style={{
        width: '148px',
        height: '32px',
        backgroundColor: isDark ? 'rgba(120, 120, 128, 0.24)' : 'rgba(120, 120, 128, 0.12)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Sliding Active Indicator (Apple-style pill with spring) */}
      <motion.div
        className="absolute top-[2px] bottom-[2px] left-[2px] rounded-full"
        initial={false}
        animate={{
          x: isDark ? 72 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 28,
          mass: 0.8
        }}
        style={{
          width: '72px',
          backgroundColor: isDark ? '#636366' : '#ffffff',
          boxShadow: isDark 
            ? '0 1px 3px rgba(0,0,0,0.35), 0 1px 1px rgba(0,0,0,0.15)'
            : '0 1px 3px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.04)',
        }}
      />

      {/* Light Option Button */}
      <button
        type="button"
        onClick={() => {
          if (isDark) onToggle();
        }}
        className="relative z-10 flex-1 flex items-center justify-center gap-1.5 h-full rounded-full focus:outline-none transition-transform duration-100 active:scale-95 cursor-pointer"
        aria-label="Modo Claro"
      >
        <Sun
          className={`w-3.5 h-3.5 transition-colors duration-200 ${
            !isDark ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
          }`}
          strokeWidth={!isDark ? 2.5 : 2}
        />
        <span
          className={`text-[11px] font-sans font-medium transition-colors duration-200 ${
            !isDark ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
          }`}
          style={{ letterSpacing: '-0.2px' }}
        >
          Claro
        </span>
      </button>

      {/* Dark Option Button */}
      <button
        type="button"
        onClick={() => {
          if (!isDark) onToggle();
        }}
        className="relative z-10 flex-1 flex items-center justify-center gap-1.5 h-full rounded-full focus:outline-none transition-transform duration-100 active:scale-95 cursor-pointer"
        aria-label="Modo Oscuro"
      >
        <Moon
          className={`w-3.5 h-3.5 transition-colors duration-200 ${
            isDark ? 'text-white font-semibold' : 'text-zinc-500 hover:text-zinc-600 dark:text-zinc-400'
          }`}
          strokeWidth={isDark ? 2.5 : 2}
        />
        <span
          className={`text-[11px] font-sans font-medium transition-colors duration-200 ${
            isDark ? 'text-white font-semibold' : 'text-zinc-500 hover:text-zinc-600 dark:text-zinc-400'
          }`}
          style={{ letterSpacing: '-0.2px' }}
        >
          Oscuro
        </span>
      </button>
    </div>
  );
}

