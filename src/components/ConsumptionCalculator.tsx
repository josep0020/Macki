import { useState, useMemo, useEffect, useRef } from 'react';
import { Calculator, Flame, Package, Droplets, X, Building2, Home, Warehouse, ShoppingCart, Check, MapPin, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateConsumption, roundForCart, HeatingType, UsageLevel, HouseType } from '../utils/calculator';
import { products } from '../data';
import { Product } from '../types';

interface ConsumptionCalculatorProps {
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const heatingOptions: { value: HeatingType; label: string; icon: typeof Flame }[] = [
  { value: 'leña', label: 'Leña', icon: Flame },
  { value: 'pellet', label: 'Pellet', icon: Package },
  { value: 'parafina', label: 'Parafina', icon: Droplets },
];

const usageOptions: { value: UsageLevel; label: string; description: string }[] = [
  { value: 'bajo', label: 'Bajo', description: 'Uso ocasional' },
  { value: 'medio', label: 'Medio', description: 'Uso diario moderado' },
  { value: 'alto', label: 'Alto', description: 'Uso intensivo' },
];

const houseOptions: { value: HouseType; label: string; description: string; icon: typeof Home }[] = [
  { value: 'nueva', label: 'Nueva', description: 'Termopanel / Aislada', icon: Building2 },
  { value: 'estandar', label: 'Estandar', description: 'Albanileria o madera', icon: Home },
  { value: 'antigua', label: 'Antigua', description: 'Sin aislamiento', icon: Warehouse },
];

const lenaProducts = products.filter(p => p.category === 'leña');
const pelletProduct = products.find(p => p.category === 'pellet')!;
const parafinaProduct = products.find(p => p.category === 'parafina')!;

export function ConsumptionCalculator({ open, onClose, onAddToCart }: ConsumptionCalculatorProps) {
  const [squareMeters, setSquareMeters] = useState('60');
  const [months, setMonths] = useState('4');
  const [heatingType, setHeatingType] = useState<HeatingType>('leña');
  const [usageLevel, setUsageLevel] = useState<UsageLevel>('medio');
  const [houseType, setHouseType] = useState<HouseType>('estandar');
  const [selectedLena, setSelectedLena] = useState<Product>(lenaProducts[3]); // Mezcla por defecto
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [added, setAdded] = useState<HeatingType | null>(null);
  const [moisture, setMoisture] = useState(20);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const efficiency = useMemo(() => {
    if (moisture <= 20) return 100;
    const loss = (moisture - 20) * 2;
    return Math.max(40, 100 - loss);
  }, [moisture]);

  const lossPercentage = useMemo(() => {
    return 100 - efficiency;
  }, [efficiency]);

  const meters = Number(squareMeters) || 0;
  const totalMonths = Number(months) || 0;

  const results = useMemo(() => {
    if (meters <= 0 || totalMonths <= 0) return null;
    return {
      leña: calculateConsumption(meters, 'leña', usageLevel, houseType, totalMonths),
      pellet: calculateConsumption(meters, 'pellet', usageLevel, houseType, totalMonths),
      parafina: calculateConsumption(meters, 'parafina', usageLevel, houseType, totalMonths),
    };
  }, [meters, usageLevel, houseType, totalMonths]);

  const costs = useMemo(() => {
    if (!results) return null;
    return {
      leña: {
        total: Math.round(results.leña.amount * selectedLena.price),
        monthly: Math.round((results.leña.amount * selectedLena.price) / totalMonths),
        product: selectedLena,
        cartQty: roundForCart(results.leña.amount),
      },
      pellet: {
        total: Math.round(results.pellet.amount * pelletProduct.price),
        monthly: Math.round((results.pellet.amount * pelletProduct.price) / totalMonths),
        product: pelletProduct,
        cartQty: roundForCart(results.pellet.amount),
      },
      parafina: {
        total: Math.round(results.parafina.amount * parafinaProduct.price),
        monthly: Math.round((results.parafina.amount * parafinaProduct.price) / totalMonths),
        product: parafinaProduct,
        cartQty: roundForCart(results.parafina.amount),
      },
    };
  }, [results, selectedLena, totalMonths]);

  const moneyLost = useMemo(() => {
    if (!costs) return 0;
    return Math.round(costs.leña.total * (lossPercentage / 100));
  }, [costs, lossPercentage]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Smooth scroll to results once they are ready and rendered
  useEffect(() => {
    if (showResult && resultsRef.current) {
      const timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setShowResult(false);
    
    // Instant smooth scroll to the robot loader in the next render frame
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);

    setTimeout(() => {
      setIsCalculating(false);
      setShowResult(true);
    }, 1200);
  };

  if (!open) return null;

  const handleAdd = (type: HeatingType) => {
    if (!costs) return;
    const item = costs[type];
    if (!item) return;

    // Add multiple times if quantity > 1
    for (let i = 0; i < item.cartQty; i++) {
      onAddToCart(item.product);
    }

    setAdded(type);
    setTimeout(() => {
      setAdded(null);
      onClose();
    }, 1200);
  };

  const formatNumber = (n: number) => n.toLocaleString('es-CL');

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm animate-backdrop-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-hidden rounded-3xl bg-surface shadow-2xl flex flex-col animate-modal-in">
        {/* Header */}
        <div className="relative shrink-0 bg-gradient-to-br from-primary to-primary-container px-6 py-5 text-on-primary">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-on-primary/15 transition-colors hover:bg-on-primary/25"
            aria-label="Cerrar calculadora"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-on-primary/15">
            <Calculator className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold">Calcula tu consumo</h2>
          <p className="mt-1 max-w-[280px] text-sm leading-relaxed text-on-primary/80">
            Estima cuanto necesitas para calefaccionar tu hogar durante la temporada fria.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* House type */}
          <div>
            <p className="text-sm font-semibold text-on-surface">Tipo de vivienda</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {houseOptions.map((option) => {
                const Icon = option.icon;
                const active = houseType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => { setHouseType(option.value); setShowResult(false); }}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-semibold transition-all ${active ? 'border-primary bg-primary text-on-primary shadow-md' : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-primary/40'}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{option.label}</span>
                    <span className={`text-[10px] font-normal ${active ? 'text-on-primary/70' : 'text-on-surface-variant/70'}`}>{option.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* m2 + months */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-on-surface" htmlFor="square-meters">
                m² vivienda
              </label>
              <input
                id="square-meters"
                type="number"
                inputMode="numeric"
                min="1"
                value={squareMeters}
                onChange={(e) => { setSquareMeters(e.target.value); setShowResult(false); }}
                className="mt-2 w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-lg font-semibold text-on-surface outline-none transition-colors focus:border-primary"
                placeholder="Ej: 60"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface" htmlFor="consumption-months">
                Meses de uso
              </label>
              <input
                id="consumption-months"
                type="number"
                inputMode="numeric"
                min="1"
                max="12"
                value={months}
                onChange={(e) => { setMonths(e.target.value); setShowResult(false); }}
                className="mt-2 w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-lg font-semibold text-on-surface outline-none transition-colors focus:border-primary"
                placeholder="Ej: 4"
              />
            </div>
          </div>

          {/* Usage level */}
          <div className="mt-5">
            <p className="text-sm font-semibold text-on-surface">Intensidad de uso</p>
            <div className="mt-2 flex flex-col gap-2">
              {usageOptions.map((option) => {
                const active = usageLevel === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => { setUsageLevel(option.value); setShowResult(false); }}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${active ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:border-primary/40'}`}
                  >
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-xs text-on-surface-variant">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculate button */}
          <button
            type="button"
            onClick={handleCalculate}
            disabled={meters <= 0 || totalMonths <= 0 || isCalculating}
            className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCalculating ? 'Calculando...' : 'Calcular consumo'}
          </button>

          {/* Silly Robot Loading animation */}
          {isCalculating && (
            <div ref={loaderRef} className="mt-6 p-5 bg-surface-container-low border border-outline-variant/15 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 animate-fade-in shadow-inner animate-pulse">
              <svg className="w-20 h-20 text-primary animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <g>
                  <polygon strokeLinejoin="round" strokeMiterlimit={10} points="10.5,6.5 9,7.5 7.5,6.5 7.5,5 9,4 10.5,5" />
                  <line strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="12" y1="0.5" x2="12" y2="1.5" />
                  <polygon strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="16,23.5 8,23.5 6.5,16 9,13.5 15,13.5 17.5,16" />
                  <line strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="12" y1="10.5" x2="12" y2="13.5" />
                  <line strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="7.6" y1="21.5" x2="16.4" y2="21.5" />
                  <polyline strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="2.5,16 3,19 6.844,17.719" />
                  <polyline strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="0.5,12 0.5,14 2.5,16 4.5,14 4.5,12" />
                  <polygon strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="16,10.5 20.5,6 16,1.5 8,1.5 3.5,6 8,10.5" />
                  <polygon strokeLinejoin="round" strokeMiterlimit={10} points="13.5,6.5 15,7.5 16.5,6.5 16.5,5 15,4 13.5,5" />
                  <polyline strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="21.5,16 21,19 17.156,17.719" />
                  <polyline strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="23.5,12 23.5,14 21.5,16 19.5,14 19.5,12" />
                </g>
              </svg>
              
              {/* Message */}
              <div className="relative bg-surface-container-lowest border border-outline-variant/30 px-4 py-2.5 rounded-2xl shadow-sm text-[11px] font-bold text-on-surface">
                <span className="inline-block animate-bounce mr-1">🤖</span>
                <span>"¡Beep boop! Estoy calculando tu consumo..."</span>
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-container-lowest border-t border-l border-outline-variant/30 rotate-45" />
              </div>
            </div>
          )}

          {/* Explainer Link */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <Info className="h-3.5 w-3.5" />
              ¿Cómo funciona el cálculo?
              {showExplanation ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Explainer Panel */}
          {showExplanation && (
            <div className="mt-3 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 text-xs text-on-surface-variant leading-relaxed animate-fade-in">
              <h4 className="font-semibold text-on-surface mb-2 flex items-center gap-1">
                Fórmula del consumo estimado
              </h4>
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-center font-mono text-[13px] font-bold text-primary mb-3">
                m² × Coef. Uso × Coef. Aislamiento × Meses
              </div>
              <p className="mb-2">
                Multiplicamos la superficie de tu hogar por factores adaptados al clima local:
              </p>
              <ul className="space-y-3 pl-1">
                <li>
                  <span className="font-semibold text-on-surface">1. Coeficientes de Uso (por m² al mes):</span>
                  <div className="mt-1.5 grid grid-cols-3 gap-2 text-[10px] bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-2.5 font-mono">
                    <div>
                      <p className="font-bold text-primary mb-1 border-b border-outline-variant/20 pb-0.5">Leña (m³)</p>
                      <p>Bajo: 0.025</p>
                      <p>Medio: 0.045</p>
                      <p>Alto: 0.070</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary mb-1 border-b border-outline-variant/20 pb-0.5">Pellet (sacos)</p>
                      <p>Bajo: 0.40</p>
                      <p>Medio: 0.75</p>
                      <p>Alto: 1.25</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary mb-1 border-b border-outline-variant/20 pb-0.5">Parafina (L)</p>
                      <p>Bajo: 0.25</p>
                      <p>Medio: 0.50</p>
                      <p>Alto: 0.875</p>
                    </div>
                  </div>
                </li>
                <li>
                  <span className="font-semibold text-on-surface">2. Coeficientes de Aislamiento (Multiplicador):</span>
                  <div className="mt-1.5 grid grid-cols-3 gap-2 text-[10px] bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-2.5 font-mono text-center">
                    <div>
                      <p className="font-bold text-primary mb-0.5">Nueva</p>
                      <p className="text-on-surface">0.85</p>
                      <p className="text-[9px] text-green-700 font-sans font-semibold">-15% consumo</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary mb-0.5">Estándar</p>
                      <p className="text-on-surface">1.00</p>
                      <p className="text-[9px] text-on-surface-variant font-sans">Base</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary mb-0.5">Antigua</p>
                      <p className="text-on-surface">1.25</p>
                      <p className="text-[9px] text-red-600 font-sans font-semibold">+25% consumo</p>
                    </div>
                  </div>
                </li>
                <li>
                  <span className="font-semibold text-on-surface">3. Lógica de Redondeo:</span>
                  <p className="mt-0.5 text-[11px]">
                    Para la <strong className="text-on-surface">leña</strong> estimamos al primer decimal (ej: 1.8 m³). Para <strong className="text-on-surface">pellet y parafina</strong> se redondea hacia arriba al entero más cercano para asegurar autonomía suficiente.
                  </p>
                </li>
              </ul>
            </div>
          )}

          {/* Results */}
          {showResult && results && costs && (
            <div ref={resultsRef} className="mt-6 space-y-4">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                Comparativa para {meters} m² · {totalMonths} mes{totalMonths !== 1 ? 'es' : ''}
              </p>

              {/* Leña card */}
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-lg font-bold text-on-surface">Leña</h3>
                </div>
                <p className="mt-1 text-3xl font-bold text-primary">{results.leña.amount} <span className="text-base font-medium">m³</span></p>
                <p className="text-xs text-on-surface-variant">~{results.leña.monthlyAmount} m³ por mes</p>

                {/* Lena subtype selector */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {lenaProducts.map((prod) => {
                    const active = selectedLena.id === prod.id;
                    const subtotal = Math.round(results.leña.amount * prod.price);
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setSelectedLena(prod)}
                        className={`rounded-xl border px-3 py-2 text-left transition-all ${active ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/30 bg-surface text-on-surface hover:border-primary/30'}`}
                      >
                        <span className="block text-xs font-semibold">{prod.name}</span>
                        <span className="block text-[10px] text-on-surface-variant">${formatNumber(prod.price)}/m³</span>
                      </button>
                    );
                  })}
                </div>

                {/* Humedad selector */}
                <div className="mt-4 border-t border-outline-variant/20 pt-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                    <span>Humedad de tu Leña</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      moisture <= 25 
                        ? 'bg-emerald-500/10 text-emerald-700' 
                        : moisture <= 35 
                          ? 'bg-amber-500/10 text-amber-700' 
                          : 'bg-red-500/10 text-red-700'
                    }`}>
                      {moisture}% {moisture <= 25 ? '(Seca Certificada)' : '(Húmeda / Informal)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    value={moisture}
                    onChange={(e) => setMoisture(Number(e.target.value))}
                    className="w-full mt-2 accent-primary cursor-pointer"
                  />
                  
                  {/* Dinero Perdido / Diagnostico */}
                  <div className="mt-3 rounded-xl bg-surface-container p-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">Eficiencia Real:</span>
                      <span className="font-bold text-on-surface">{efficiency}%</span>
                    </div>
                    {moisture > 25 ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">Dinero perdido en vapor:</span>
                          <span className="font-bold text-red-600 dark:text-red-400">
                            -${formatNumber(moneyLost)} ({lossPercentage}%)
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-[10px] text-red-700 dark:text-red-300 mt-1">
                          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
                          <span>Tu estufa gastará energía en hervir el agua antes de calentar. Emitirá humo visible denso.</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start gap-2 text-[10px] text-emerald-700 dark:text-emerald-300 mt-1">
                        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                        <span>Calor eficiente y sin humo visible. Cumple plenamente con la normativa de la SEREMI.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant">Total estimado</p>
                    <p className="text-lg font-bold text-on-surface">${formatNumber(costs.leña.total)}</p>
                    <p className="text-[10px] text-on-surface-variant">~${formatNumber(costs.leña.monthly)}/mes</p>
                  </div>
                  <button
                    onClick={() => handleAdd('leña')}
                    disabled={added === 'leña'}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
                  >
                    {added === 'leña' ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                    {added === 'leña' ? 'Agregado' : `Agregar ${costs.leña.cartQty}`}
                  </button>
                </div>
              </div>

              {/* Pellet card */}
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-lg font-bold text-on-surface">Pellet</h3>
                </div>
                <p className="mt-1 text-3xl font-bold text-primary">{formatNumber(results.pellet.amount)} <span className="text-base font-medium">sacos</span></p>
                <p className="text-xs text-on-surface-variant">~{formatNumber(results.pellet.monthlyAmount)} sacos por mes</p>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant">Total estimado</p>
                    <p className="text-lg font-bold text-on-surface">${formatNumber(costs.pellet.total)}</p>
                    <p className="text-[10px] text-on-surface-variant">~${formatNumber(costs.pellet.monthly)}/mes</p>
                  </div>
                  <button
                    onClick={() => handleAdd('pellet')}
                    disabled={added === 'pellet'}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
                  >
                    {added === 'pellet' ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                    {added === 'pellet' ? 'Agregado' : `Agregar ${costs.pellet.cartQty}`}
                  </button>
                </div>
              </div>

              {/* Parafina card */}
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-lg font-bold text-on-surface">Parafina</h3>
                </div>
                <p className="mt-1 text-3xl font-bold text-primary">{formatNumber(results.parafina.amount)} <span className="text-base font-medium">litros</span></p>
                <p className="text-xs text-on-surface-variant">~{formatNumber(results.parafina.monthlyAmount)} litros por mes</p>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant">Total estimado</p>
                    <p className="text-lg font-bold text-on-surface">${formatNumber(costs.parafina.total)}</p>
                    <p className="text-[10px] text-on-surface-variant">~${formatNumber(costs.parafina.monthly)}/mes</p>
                  </div>
                  <button
                    onClick={() => window.open('https://www.google.com/maps/search/estaciones+de+servicio+copec+petrobras+shell+region+del+maule/', '_blank')}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary/90 active:scale-[0.98]"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver ubicaciones
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
