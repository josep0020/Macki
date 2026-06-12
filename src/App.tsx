import { useState, useEffect, lazy, Suspense } from 'react';
import { BottomNavBar } from './components/BottomNavBar';
import { CartItem, Product, Screen, OrderData, ThemeMode, TrackedOrder, OrderStatus, LoyaltyCoupon } from './types';
import { DEFAULT_COMUNA, getShippingCost, products } from './data';
import { saveOrder, getOrders, simulateOrderProgress } from './utils/orders';
import { getFavorites, toggleFavorite } from './utils/favorites';
import { addPointsForOrder, getActiveCoupons, redeemCoupon, applyCouponDiscount } from './utils/loyalty';
import { AirQualityData, AirQualityLevel, getAirQualityDataFromAqi, fetchComunaAirQuality, simulatedAqiDatabase } from './utils/airQuality';
import { InfoDrawer } from './components/InfoDrawer';

const HomeScreen             = lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const CatalogScreen          = lazy(() => import('./screens/CatalogScreen').then(m => ({ default: m.CatalogScreen })));
const CheckoutScreen         = lazy(() => import('./screens/CheckoutScreen').then(m => ({ default: m.CheckoutScreen })));
const OrderConfirmationScreen = lazy(() => import('./screens/OrderConfirmationScreen').then(m => ({ default: m.OrderConfirmationScreen })));
const OrderSuccessScreen     = lazy(() => import('./screens/OrderSuccessScreen').then(m => ({ default: m.OrderSuccessScreen })));
const AccountScreen          = lazy(() => import('./screens/AccountScreen').then(m => ({ default: m.AccountScreen })));
const ConsumptionCalculator  = lazy(() => import('./components/ConsumptionCalculator').then(m => ({ default: m.ConsumptionCalculator })));

function ScreenFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

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
  const [showCalculator, setShowCalculator] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());
  const [activeCoupon, setActiveCoupon] = useState<LoyaltyCoupon | null>(null);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [hideBottomNav, setHideBottomNav] = useState(false);
  const [lastOrderPoints, setLastOrderPoints] = useState<{
    pointsEarned: number;
    leveledUp: boolean;
    newLevel?: string;
  } | null>(null);

  const [airQuality, setAirQuality] = useState<AirQualityData>(() => {
    const initialAqi = simulatedAqiDatabase[DEFAULT_COMUNA] ?? 45;
    return getAirQualityDataFromAqi(initialAqi);
  });
  const [simulatedLevel, setSimulatedLevel] = useState<AirQualityLevel | null>(null);

  // Reset simulation when comuna changes
  useEffect(() => {
    setSimulatedLevel(null);
  }, [comuna]);

  // Handle air quality updates (hybrid API/local simulation)
  useEffect(() => {
    let active = true;

    if (simulatedLevel) {
      let simulatedAqi = 45;
      if (simulatedLevel === 'bueno') simulatedAqi = 25;
      else if (simulatedLevel === 'regular') simulatedAqi = 75;
      else if (simulatedLevel === 'alerta') simulatedAqi = 125;
      else if (simulatedLevel === 'preemergencia') simulatedAqi = 175;
      else if (simulatedLevel === 'emergencia') simulatedAqi = 250;

      setAirQuality(getAirQualityDataFromAqi(simulatedAqi, true));
    } else {
      fetchComunaAirQuality(comuna).then(aqi => {
        if (active) {
          setAirQuality(getAirQualityDataFromAqi(aqi, false));
        }
      });
    }

    return () => {
      active = false;
    };
  }, [comuna, simulatedLevel]);

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

  const handleToggleFavorite = (productId: string) => {
    toggleFavorite(productId);
    setFavorites(getFavorites());
  };

  const handleApplyCoupon = () => {
    const available = getActiveCoupons();
    if (available.length > 0) {
      setActiveCoupon(available[0]);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
  };

  const handleConfirmOrder = (data: OrderData) => {
    setOrderData(data);
    const id = 'ML-' + Date.now().toString(36).toUpperCase();
    setOrderId(id);

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const { cost: shippingCost } = getShippingCost(comuna, subtotal);

    let couponDiscount = 0;
    if (activeCoupon) {
      const { totalDiscount } = applyCouponDiscount(activeCoupon, subtotal, shippingCost);
      couponDiscount = totalDiscount;
      redeemCoupon(activeCoupon.id);
    }

    const finalTotal = subtotal + shippingCost - couponDiscount;
    const pointsResult = addPointsForOrder(id, finalTotal);
    setLastOrderPoints({
      pointsEarned: pointsResult.pointsEarned,
      leveledUp: pointsResult.leveledUp,
      newLevel: pointsResult.newLevel,
    });

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
      total: finalTotal,
      shippingCost: Math.max(0, shippingCost - couponDiscount),
      customerName: data.name,
      customerPhone: data.phone,
      customerAddress: data.address,
      notes: data.notes,
      deliveryDate: data.deliveryDate,
      deliveryTimeSlot: data.deliveryTimeSlot,
      statusHistory: [{ status: 'pendiente', date: new Date().toISOString() }],
      pointsEarned: pointsResult.pointsEarned,
    };

    saveOrder(trackedOrder);
    setOrders(prev => [trackedOrder, ...prev]);
    setCurrentScreen('orderSuccess');
  };

  const handleResetOrder = () => {
    setCart([]);
    setOrderData(null);
    setOrderId('');
    setActiveCoupon(null);
    setLastOrderPoints(null);
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

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const { cost: shippingCost } = getShippingCost(comuna, subtotal);
  let couponDiscount = 0;
  if (activeCoupon) {
    const { totalDiscount } = applyCouponDiscount(activeCoupon, subtotal, shippingCost);
    couponDiscount = totalDiscount;
  }

  return (
    <div className="bg-surface min-h-screen text-on-surface selection:bg-primary/20">
      <Suspense fallback={<ScreenFallback />}>
      {currentScreen === 'home' && (
        <div key="home" className="animate-screen-in">
        <HomeScreen
          cart={cart}
          onGoToStore={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('catalog'); }}
          onAddToCart={handleAddToCart}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenCalculator={() => setShowCalculator(true)}
          airQuality={airQuality}
          onSimulateLevel={setSimulatedLevel}
          comuna={comuna}
          onOpenDrawer={() => setShowInfoDrawer(true)}
          onGoToAccount={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('account'); }}
        />
        </div>
      )}
      {currentScreen === 'catalog' && (
        <div key="catalog" className="animate-screen-in">
        <CatalogScreen
          cart={cart}
          comuna={comuna}
          onComunaChange={setComuna}
          onAddToCart={handleAddToCart}
          onGoToCheckout={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('checkout'); }}
          theme={theme}
          onToggleTheme={toggleTheme}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          airQuality={airQuality}
          onSimulateLevel={setSimulatedLevel}
          onOpenDrawer={() => setShowInfoDrawer(true)}
        />
        </div>
      )}
      {currentScreen === 'checkout' && (
        <div key="checkout" className="animate-screen-in">
        <CheckoutScreen
          cart={cart}
          comuna={comuna}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onGoBack={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('catalog'); }}
          onGoToConfirmation={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('orderConfirmation'); }}
          theme={theme}
          onToggleTheme={toggleTheme}
          activeCoupon={activeCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          couponDiscount={couponDiscount}
          airQuality={airQuality}
        />
        </div>
      )}
      {currentScreen === 'orderConfirmation' && (
        <div key="orderConfirmation" className="animate-screen-in">
        <OrderConfirmationScreen
          cart={cart}
          comuna={comuna}
          onConfirm={handleConfirmOrder}
          onGoBack={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen('checkout'); }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        </div>
      )}
      {currentScreen === 'orderSuccess' && orderData && (
        <div key="orderSuccess" className="animate-screen-in">
        <OrderSuccessScreen
          orderId={orderId}
          orderData={orderData}
          cart={cart}
          comuna={comuna}
          onGoHome={handleResetOrder}
          theme={theme}
          onToggleTheme={toggleTheme}
          pointsEarned={lastOrderPoints?.pointsEarned}
          leveledUp={lastOrderPoints?.leveledUp}
          newLevel={lastOrderPoints?.newLevel}
        />
        </div>
      )}
      {currentScreen === 'account' && (
        <div key="account" className="animate-screen-in">
        <AccountScreen
          orders={orders}
          onRefresh={handleRefreshOrders}
          onSimulateProgress={handleSimulateProgress}
          onRepeatOrder={handleRepeatOrder}
          theme={theme}
          onToggleTheme={toggleTheme}
          onEditingOrdersChange={setHideBottomNav}
        />
        </div>
      )}

      {/* Bottom Navigation */}
      {showNav && (
        <BottomNavBar
          activeTab={currentScreen}
          onNavigate={handleNavigate}
          cartItemCount={cartItemCount}
          forceHidden={hideBottomNav}
        />
      )}

      {/* Consumption Calculator Modal */}
      {showCalculator && (
        <ConsumptionCalculator
          open={showCalculator}
          onClose={() => setShowCalculator(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Info Sidebar Drawer */}
      <InfoDrawer
        open={showInfoDrawer}
        onClose={() => setShowInfoDrawer(false)}
      />
      </Suspense>
    </div>
  );
}
