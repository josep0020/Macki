import { useState, useMemo, useEffect } from 'react';
import { Calculator, Flame, Package, Droplets, X, Building2, Home, Warehouse, ShoppingCart, Check, MapPin } from 'lucide-react';
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
  const [added, setAdded] = useState<HeatingType | null>(null);

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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
            onClick={() => setShowResult(true)}
            disabled={meters <= 0 || totalMonths <= 0}
            className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calcular consumo
          </button>

          {/* Results */}
          {showResult && results && costs && (
            <div className="mt-6 space-y-4">
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

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant">Total estimado</p>
                    <p className="text-lg font-bold text-on-surface">${formatNumber(costs.leña.total)}</p>
                    <p className="text-[10px] text-on-surface-variant">~${formatNumber(costs.leña.monthly)}/mes</p>
                  </div>
                  <button
                    onClick={() => handleAdd('leña')}
                    disabled={added === 'leña'}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98] disabled:opacity-70"
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
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98] disabled:opacity-70"
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
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98]"
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
