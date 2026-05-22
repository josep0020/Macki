import { Moon, Sun } from 'lucide-react';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1c2b1c 0%, #0d1a0d 100%)'
          : 'linear-gradient(135deg, #87ceeb 0%, #f0d68a 100%)',
      }}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <div
        className="absolute top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ease-in-out"
        style={{
          left: theme === 'dark' ? '30px' : '4px',
          background: theme === 'dark' ? '#111f11' : '#fcf9f8',
          border: theme === 'dark' ? '2px solid #8fa67e' : '2px solid #334529',
        }}
      >
        {theme === 'dark' ? (
          <Sun className="w-3.5 h-3.5 text-amber-400 theme-icon-animate" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-primary theme-icon-animate" />
        )}
      </div>
      <div className="absolute inset-0 flex items-center px-1.5 pointer-events-none">
        <Sun className={`w-3 h-3 absolute left-1.5 transition-opacity duration-300 ${theme === 'light' ? 'opacity-60 text-amber-500' : 'opacity-0'}`} />
        <Moon className={`w-3 h-3 absolute right-1.5 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-60 text-blue-300' : 'opacity-0'}`} />
      </div>
    </button>
  );
}
