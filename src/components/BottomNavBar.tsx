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

export function BottomNavBar({ activeTab, onNavigate, cartItemCount }: BottomNavBarProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
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
