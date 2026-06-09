import { useState, useCallback } from 'react';
import { Award, Star, Gift, Sparkles, ChevronDown, ChevronUp, Flame, Ticket, Settings, Zap, ArrowUpRight } from 'lucide-react';
import {
  getLoyaltyState,
  getLevelConfig,
  getPointsToNextLevel,
  getActiveCoupons,
  addDemoPoints,
  resetLoyalty,
  getAllLevels,
} from '../utils/loyalty';
import { getLevelIcon } from './LoyaltyBadge';
import type { LoyaltyState, LoyaltyCoupon, LoyaltyLevel } from '../types';

interface LoyaltyCardProps {
  onRefresh?: () => void;
}

export function LoyaltyCard({ onRefresh }: LoyaltyCardProps) {
  const [state, setState] = useState<LoyaltyState>(() => getLoyaltyState());
  const [showBenefits, setShowBenefits] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const refresh = useCallback(() => {
    setState(getLoyaltyState());
    onRefresh?.();
  }, [onRefresh]);

  const config = getLevelConfig(state.currentLevel);
  const { nextLevel, pointsNeeded, progress } = getPointsToNextLevel(state.totalPoints);
  const nextConfig = nextLevel ? getLevelConfig(nextLevel) : null;
  const activeCoupons = getActiveCoupons();
  const allCoupons = state.coupons;
  const allLevels = getAllLevels();
  const isMaxLevel = nextLevel === null;

  const handleAddPoints = (pts: number) => {
    addDemoPoints(pts);
    refresh();
  };

  const handleReset = () => {
    resetLoyalty();
    refresh();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 dark:border-white/5 bg-white/[0.04] dark:bg-white/[0.01] backdrop-blur-xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col gap-6">
      {/* Ambient glow backgrounds to give glassmorphic depth */}
      <div
        className="absolute -right-12 -top-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-500"
        style={{ backgroundColor: config.color }}
      />
      <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Level Badge with Glow */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-[0_8px_20px_rgba(0,0,0,0.08)] relative"
            style={{
              backgroundColor: `${config.color}15`,
              borderColor: `${config.color}25`,
              color: config.color,
            }}
          >
            {getLevelIcon(state.currentLevel, "w-7 h-7 fill-current")}
            {/* Outer halo */}
            <span className="absolute inset-0 rounded-2xl border border-current opacity-20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          </div>

          <div>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest block mb-0.5">
              Club de Beneficios
            </span>
            <h3 className="font-serif text-2xl font-bold text-on-surface leading-none">
              Nivel {config.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Subtle Demo Toggle */}
          <button
            onClick={() => setShowDemo(v => !v)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              showDemo
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'hover:bg-surface-variant/40 text-on-surface-variant/70'
            }`}
            title="Ajustes de prueba (Demo)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Score ── */}
      <div className="relative z-10 grid grid-cols-2 gap-4 items-end">
        <div>
          <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest block mb-1">
            Puntos Disponibles
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold font-serif text-on-surface leading-none tracking-tight">
              {state.totalPoints}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">pts</span>
          </div>
        </div>

        <div className="text-right">
          {isMaxLevel ? (
            <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold text-amber-500">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Nivel Máximo
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Faltan <span className="font-bold text-on-surface">{pointsNeeded}</span> para{' '}
              <span className="font-bold" style={{ color: nextConfig?.color }}>
                {nextConfig?.name}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ── Horizontal Line Progress & Timeline ── */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Fine Progress Bar */}
        <div className="h-1.5 w-full bg-outline-variant/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: config.color,
            }}
          />
        </div>

        {/* Timeline dots */}
        <div className="flex items-center justify-between mt-1 relative">
          {/* Central thin gray connector line */}
          <div className="absolute left-0 right-0 top-[9px] h-[1px] bg-outline-variant/20 -z-10" />

          {allLevels.map((lvl) => {
            const isCurrent = lvl.level === state.currentLevel;
            const isPassed = lvl.minPoints <= state.totalPoints;
            return (
              <div key={lvl.level} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-500 relative ${
                    isCurrent
                      ? 'bg-surface border-current scale-125'
                      : isPassed
                        ? 'bg-current border-transparent'
                        : 'bg-surface border-outline-variant/40'
                  }`}
                  style={{
                    color: isPassed || isCurrent ? lvl.color : undefined,
                  }}
                >
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  )}
                  {isPassed && !isCurrent && (
                    <span className="w-1 h-1 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={`text-[9px] font-bold tracking-tight mt-0.5 ${
                    isCurrent ? 'text-on-surface font-black' : 'text-on-surface-variant/60'
                  }`}
                >
                  {lvl.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Collapsible Beneficios & Cupones (Single Dropdown) ── */}
      <div className="relative z-10">
        <button
          onClick={() => setShowBenefits((v) => !v)}
          className="w-full flex items-center justify-between py-2.5 px-1 border border-transparent hover:border-white/5 rounded-xl transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">
              Beneficios
            </span>
            {activeCoupons.length > 0 && (
              <span className="bg-primary text-on-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full leading-none scale-95">
                {activeCoupons.length}
              </span>
            )}
          </div>
          {showBenefits ? (
            <ChevronUp className="w-4 h-4 text-on-surface-variant/70 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 text-on-surface-variant/70 transition-transform" />
          )}
        </button>

        {/* Collapsible Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showBenefits ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col gap-4 bg-white/[0.01] dark:bg-black/10 rounded-2xl p-4 border border-white/5">
            {/* Privileges Sub-section */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                Privilegios de Nivel
              </span>
              <ul className="grid grid-cols-1 gap-2">
                {config.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant leading-relaxed">
                    <Award className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/60" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coupons Sub-section */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                Cupones de Descuento
              </span>
              {allCoupons.length === 0 ? (
                <p className="text-xs text-on-surface-variant/60 italic py-1">
                  Aún no tienes cupones disponibles.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {allCoupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Demo Panel (Ocultable) ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5 ${
          showDemo ? 'max-h-36 opacity-100 pt-4 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block mb-2.5">
          Simulador de Fidelidad (Pruebas)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddPoints(50)}
            className="flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface transition-all active:scale-95 cursor-pointer"
          >
            +50 pts
          </button>
          <button
            onClick={() => handleAddPoints(100)}
            className="flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface transition-all active:scale-95 cursor-pointer"
          >
            +100 pts
          </button>
          <button
            onClick={handleReset}
            className="flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all active:scale-95 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Coupon Card Sub-component (Luxury Ticket Design) ── */

function CouponCard({ coupon }: { coupon: LoyaltyCoupon }) {
  const levelConfig = getLevelConfig(coupon.level);

  return (
    <div
      className={`rounded-2xl border p-4 flex items-center justify-between transition-all relative overflow-hidden ${
        coupon.redeemed
          ? 'border-white/5 bg-white/[0.01] opacity-40'
          : 'border-dashed border-white/15 bg-white/[0.02] shadow-sm hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: `${levelConfig.color}12`,
            borderColor: `${levelConfig.color}20`,
            color: levelConfig.color,
          }}
        >
          <Ticket className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface leading-snug">
            {coupon.description}
          </p>
          <p className="text-[9px] text-on-surface-variant/50 mt-0.5 font-mono tracking-wider">
            {coupon.id.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="shrink-0 pl-2">
        {coupon.redeemed ? (
          <span className="text-[9px] font-bold text-on-surface-variant/40 bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Usado
          </span>
        ) : (
          <span
            className="text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border flex items-center gap-1"
            style={{
              color: levelConfig.color,
              backgroundColor: `${levelConfig.color}12`,
              borderColor: `${levelConfig.color}25`,
            }}
          >
            Activo
            <ArrowUpRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
}
