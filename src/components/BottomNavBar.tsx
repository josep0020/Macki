import { useEffect, useRef, useState } from 'react';
import { Home, Flame, ShoppingCart, User } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavBarProps {
  activeTab: Screen;
  onNavigate: (screen: Screen) => void;
  cartItemCount: number;
}

type NavTab = {
  key: Screen;
  label: string;
  icon: typeof Home;
};

const tabs: NavTab[] = [
  { key: 'home', label: 'Inicio', icon: Home },
  { key: 'catalog', label: 'Tienda', icon: Flame },
  { key: 'checkout', label: 'Carrito', icon: ShoppingCart },
  { key: 'account', label: 'Cuenta', icon: User },
];

const SCROLL_THRESHOLD = 50;

export function BottomNavBar({ activeTab, onNavigate, cartItemCount }: BottomNavBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const accumulatedDelta = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // At the very top, always show
      if (currentY <= 10) {
        setIsVisible(true);
        accumulatedDelta.current = 0;
        lastScrollY.current = currentY;
        return;
      }

      // Accumulate scroll distance in the current direction
      if (delta > 0) {
        // Scrolling down
        accumulatedDelta.current = Math.max(0, accumulatedDelta.current + delta);
        if (accumulatedDelta.current > SCROLL_THRESHOLD) {
          setIsVisible(false);
        }
      } else if (delta < 0) {
        // Scrolling up — show immediately on any upward scroll
        accumulatedDelta.current = 0;
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show navbar automatically when an item is added to the cart
  const prevCartCount = useRef(cartItemCount);
  useEffect(() => {
    if (cartItemCount > prevCartCount.current) {
      setIsVisible(true);
    }
    prevCartCount.current = cartItemCount;
  }, [cartItemCount]);

  return (
    <nav
      className={`bottom-nav ${isVisible ? '' : 'bottom-nav-hidden'}`}
      aria-label="Navegación principal"
    >
      <div className="bottom-nav-inner">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key === 'checkout' ? `checkout-${cartItemCount}` : tab.key}
              onClick={() => onNavigate(tab.key)}
              className={`bottom-nav-tab ${isActive ? 'is-active' : ''} ${
                tab.key === 'checkout' && cartItemCount > 0 ? 'animate-nav-pop' : ''
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`} />
                {tab.key === 'checkout' && cartItemCount > 0 && (
                  <span key={cartItemCount} className="bottom-nav-badge animate-badge-bounce">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </div>
              <span className={`bottom-nav-label ${isActive ? 'active' : ''}`}>
                {tab.label}
              </span>
              {/* Small flame indicator below the label */}
              <div className={`bottom-nav-flame ${isActive ? 'visible' : ''}`}>
                <Flame className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
