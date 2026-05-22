import { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderConfirmationScreen } from './screens/OrderConfirmationScreen';
import { OrderSuccessScreen } from './screens/OrderSuccessScreen';
import { AccountScreen } from './screens/AccountScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { CartItem, Product, Screen, OrderData, ThemeMode, TrackedOrder, OrderStatus } from './types';
import { DEFAULT_COMUNA, getShippingCost, products } from './data';
import { saveOrder, getOrders, simulateOrderProgress } from './utils/orders';

// Screens where the bottom navbar should be visible
const NAV_SCREENS: Screen[] = ['home', 'catalog', 'checkout', 'account'];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [comuna, setComuna] = useState<string>(DEFAULT_COMUNA);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [orders, setOrders] = useState<TrackedOrder[]>(() => getOrders());
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleConfirmOrder = (data: OrderData) => {
    setOrderData(data);
    const id = 'ML-' + Date.now().toString(36).toUpperCase();
    setOrderId(id);

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const { cost: shippingCost } = getShippingCost(comuna, subtotal);

    const trackedOrder: TrackedOrder = {
      id,
      status: 'pendiente' as OrderStatus,
      createdAt: new Date().toISOString(),
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        unit: item.product.unit,
      })),
      total: subtotal + shippingCost,
      shippingCost,
      customerName: data.name,
      customerPhone: data.phone,
      customerAddress: data.address,
      notes: data.notes,
      statusHistory: [{ status: 'pendiente', date: new Date().toISOString() }],
    };

    saveOrder(trackedOrder);
    setOrders(prev => [trackedOrder, ...prev]);
    setCurrentScreen('orderSuccess');
  };

  const handleResetOrder = () => {
    setCart([]);
    setOrderData(null);
    setOrderId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen('home');
  };

  const handleRefreshOrders = () => {
    setOrders(getOrders());
  };

  const handleSimulateProgress = (id: string) => {
    simulateOrderProgress(id);
    setOrders(getOrders());
  };

  const handleRepeatOrder = (order: TrackedOrder) => {
    const repeatedCart = order.items
      .map(item => {
        const product = products.find(p => p.id === item.productId)
          ?? products.find(p => p.name === item.name && p.price === item.price)
          ?? products.find(p => p.name === item.name);

        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);

    if (repeatedCart.length === 0) return;

    setCart(repeatedCart);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen('checkout');
  };

  const handleNavigate = (screen: Screen) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen(screen);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const showNav = NAV_SCREENS.includes(currentScreen);

  return (
    <div className="bg-surface min-h-screen text-on-surface selection:bg-primary/20">
      {currentScreen === 'home' && (
        <HomeScreen
          cart={cart}
          onGoToStore={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('catalog'); }}
          onAddToCart={handleAddToCart}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {currentScreen === 'catalog' && (
        <CatalogScreen
          cart={cart}
          comuna={comuna}
          onComunaChange={setComuna}
          onAddToCart={handleAddToCart}
          onGoToCheckout={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('checkout'); }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {currentScreen === 'checkout' && (
        <CheckoutScreen
          cart={cart}
          comuna={comuna}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onGoBack={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('catalog'); }}
          onGoToConfirmation={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('orderConfirmation'); }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {currentScreen === 'orderConfirmation' && (
        <OrderConfirmationScreen
          cart={cart}
          comuna={comuna}
          onConfirm={handleConfirmOrder}
          onGoBack={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('checkout'); }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {currentScreen === 'orderSuccess' && orderData && (
        <OrderSuccessScreen
          orderId={orderId}
          orderData={orderData}
          cart={cart}
          comuna={comuna}
          onGoHome={handleResetOrder}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {currentScreen === 'account' && (
        <AccountScreen
          orders={orders}
          onRefresh={handleRefreshOrders}
          onSimulateProgress={handleSimulateProgress}
          onRepeatOrder={handleRepeatOrder}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Bottom Navigation */}
      {showNav && (
        <BottomNavBar
          activeTab={currentScreen}
          onNavigate={handleNavigate}
          cartItemCount={cartItemCount}
        />
      )}
    </div>
  );
}
