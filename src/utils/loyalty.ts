import { LoyaltyState, LoyaltyLevel, LoyaltyCoupon, LoyaltyPointEntry } from '../types';

const STORAGE_KEY = 'maule-lena-loyalty';

// ── Level Configuration ──

export interface LevelConfig {
  level: LoyaltyLevel;
  name: string;
  minPoints: number;
  maxPoints: number | null; // null = unlimited
  color: string;
  bgGradient: string;
  benefits: string[];
}

const LEVELS: LevelConfig[] = [
  {
    level: 'semilla',
    name: 'Semilla',
    minPoints: 0,
    maxPoints: 99,
    color: '#8B7355',
    bgGradient: 'from-amber-800/20 to-yellow-900/10',
    benefits: ['Acumulas puntos con cada compra'],
  },
  {
    level: 'brote',
    name: 'Brote',
    minPoints: 100,
    maxPoints: 249,
    color: '#6B8E4E',
    bgGradient: 'from-green-600/20 to-emerald-700/10',
    benefits: ['Cupón de $2.000 de descuento en despacho'],
  },
  {
    level: 'roble',
    name: 'Roble',
    minPoints: 250,
    maxPoints: 499,
    color: '#2D5A27',
    bgGradient: 'from-green-800/20 to-emerald-900/10',
    benefits: ['Despacho gratis en tu siguiente pedido'],
  },
  {
    level: 'fuego',
    name: 'Fuego',
    minPoints: 500,
    maxPoints: null,
    color: '#D97706',
    bgGradient: 'from-amber-500/20 to-orange-600/10',
    benefits: ['5% de descuento en total', 'Despacho gratis siempre'],
  },
];

// ── Core Functions ──

export function getLevel(points: number): LoyaltyLevel {
  if (points >= 500) return 'fuego';
  if (points >= 250) return 'roble';
  if (points >= 100) return 'brote';
  return 'semilla';
}

export function getLevelConfig(level: LoyaltyLevel): LevelConfig {
  return LEVELS.find(l => l.level === level)!;
}

export function getAllLevels(): LevelConfig[] {
  return LEVELS;
}

export function getPointsToNextLevel(points: number): { nextLevel: LoyaltyLevel | null; pointsNeeded: number; progress: number } {
  const currentLevel = getLevel(points);
  const currentConfig = getLevelConfig(currentLevel);
  const currentIndex = LEVELS.findIndex(l => l.level === currentLevel);
  const nextConfig = LEVELS[currentIndex + 1];

  if (!nextConfig) {
    return { nextLevel: null, pointsNeeded: 0, progress: 100 };
  }

  const pointsNeeded = nextConfig.minPoints - points;
  const rangeTotal = nextConfig.minPoints - currentConfig.minPoints;
  const pointsInRange = points - currentConfig.minPoints;
  const progress = Math.min(Math.round((pointsInRange / rangeTotal) * 100), 100);

  return { nextLevel: nextConfig.level, pointsNeeded, progress };
}

export function calculatePointsForOrder(totalAmount: number): number {
  return Math.floor(totalAmount / 1000);
}

// ── localStorage Persistence ──

function getDefaultState(): LoyaltyState {
  return {
    totalPoints: 0,
    currentLevel: 'semilla',
    pointsHistory: [],
    coupons: [],
    redeemedCoupons: [],
  };
}

export function getLoyaltyState(): LoyaltyState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getDefaultState();
  try {
    return JSON.parse(raw) as LoyaltyState;
  } catch {
    return getDefaultState();
  }
}

function saveLoyaltyState(state: LoyaltyState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Coupon Generation ──

function createCouponForLevel(level: LoyaltyLevel): LoyaltyCoupon | null {
  const config = getLevelConfig(level);

  switch (level) {
    case 'brote':
      return {
        id: `coupon-brote-${Date.now()}`,
        level: 'brote',
        description: `Descuento $2.000 en despacho`,
        discount: { type: 'fixed', value: 2000 },
        redeemed: false,
        earnedAt: new Date().toISOString(),
      };
    case 'roble':
      return {
        id: `coupon-roble-${Date.now()}`,
        level: 'roble',
        description: `Despacho gratis`,
        discount: { type: 'free_shipping', value: 0 },
        redeemed: false,
        earnedAt: new Date().toISOString(),
      };
    case 'fuego':
      return {
        id: `coupon-fuego-${Date.now()}`,
        level: 'fuego',
        description: `5% descuento + despacho gratis`,
        discount: { type: 'percentage', value: 5 },
        redeemed: false,
        earnedAt: new Date().toISOString(),
      };
    default:
      return null;
  }
}

// ── Main Actions ──

export interface AddPointsResult {
  pointsEarned: number;
  newTotal: number;
  leveledUp: boolean;
  previousLevel: LoyaltyLevel;
  newLevel: LoyaltyLevel;
  coupon: LoyaltyCoupon | null;
}

export function addPointsForOrder(orderId: string, totalAmount: number): AddPointsResult {
  const state = getLoyaltyState();
  const pointsEarned = calculatePointsForOrder(totalAmount);
  const previousLevel = state.currentLevel;
  const newTotal = state.totalPoints + pointsEarned;
  const newLevel = getLevel(newTotal);
  const leveledUp = newLevel !== previousLevel;

  const entry: LoyaltyPointEntry = {
    orderId,
    points: pointsEarned,
    date: new Date().toISOString(),
    total: totalAmount,
  };

  state.totalPoints = newTotal;
  state.currentLevel = newLevel;
  state.pointsHistory.unshift(entry);

  let coupon: LoyaltyCoupon | null = null;
  if (leveledUp) {
    coupon = createCouponForLevel(newLevel);
    if (coupon) {
      state.coupons.unshift(coupon);
    }
  }

  saveLoyaltyState(state);

  return { pointsEarned, newTotal, leveledUp, previousLevel, newLevel, coupon };
}

export function getActiveCoupons(): LoyaltyCoupon[] {
  const state = getLoyaltyState();
  return state.coupons.filter(c => !c.redeemed);
}

export function redeemCoupon(couponId: string): LoyaltyCoupon | null {
  const state = getLoyaltyState();
  const coupon = state.coupons.find(c => c.id === couponId);
  if (!coupon || coupon.redeemed) return null;

  coupon.redeemed = true;
  state.redeemedCoupons.push(couponId);
  saveLoyaltyState(state);
  return coupon;
}

// ── Demo Functions ──

export function addDemoPoints(points: number): AddPointsResult {
  return addPointsForOrder(`DEMO-${Date.now().toString(36).toUpperCase()}`, points * 1000);
}

export function resetLoyalty(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function applyCouponDiscount(
  coupon: LoyaltyCoupon,
  subtotal: number,
  shippingCost: number,
): { newSubtotal: number; newShippingCost: number; totalDiscount: number } {
  switch (coupon.discount.type) {
    case 'fixed':
      return {
        newSubtotal: subtotal,
        newShippingCost: Math.max(0, shippingCost - coupon.discount.value),
        totalDiscount: Math.min(coupon.discount.value, shippingCost),
      };
    case 'free_shipping':
      return {
        newSubtotal: subtotal,
        newShippingCost: 0,
        totalDiscount: shippingCost,
      };
    case 'percentage':
      const discount = Math.round(subtotal * (coupon.discount.value / 100));
      return {
        newSubtotal: subtotal - discount,
        newShippingCost: 0,
        totalDiscount: discount + shippingCost,
      };
    default:
      return { newSubtotal: subtotal, newShippingCost: shippingCost, totalDiscount: 0 };
  }
}
