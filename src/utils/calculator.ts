export type HeatingType = 'leña' | 'pellet' | 'parafina';
export type UsageLevel = 'bajo' | 'medio' | 'alto';
export type HouseType = 'nueva' | 'estandar' | 'antigua';

export interface ConsumptionResult {
  amount: number;
  monthlyAmount: number;
  unit: string;
  label: string;
}

const MONTHLY_FACTORS: Record<HeatingType, Record<UsageLevel, number>> = {
  leña: { bajo: 0.025, medio: 0.045, alto: 0.07 },
  pellet: { bajo: 0.4, medio: 0.75, alto: 1.25 },
  parafina: { bajo: 0.25, medio: 0.5, alto: 0.875 },
};

const HOUSE_FACTORS: Record<HouseType, number> = {
  nueva: 0.85,
  estandar: 1.0,
  antigua: 1.25,
};

const UNITS: Record<HeatingType, string> = {
  leña: 'm³ de leña',
  pellet: 'sacos de pellet',
  parafina: 'litros de parafina',
};

const LABELS: Record<HeatingType, string> = {
  leña: 'Leña',
  pellet: 'Pellet',
  parafina: 'Parafina',
};

export function calculateConsumption(
  squareMeters: number,
  heatingType: HeatingType,
  usageLevel: UsageLevel,
  houseType: HouseType,
  months: number = 4
): ConsumptionResult {
  const safeSquareMeters = Math.max(0, squareMeters);
  const safeMonths = Math.max(1, months);
  const rawMonthly = safeSquareMeters * MONTHLY_FACTORS[heatingType][usageLevel] * HOUSE_FACTORS[houseType];
  const rawTotal = rawMonthly * safeMonths;

  const monthlyAmount = heatingType === 'leña'
    ? Math.ceil(rawMonthly * 10) / 10
    : Math.ceil(rawMonthly);

  const amount = heatingType === 'leña'
    ? Math.ceil(rawTotal * 10) / 10
    : Math.ceil(rawTotal);

  return {
    amount,
    monthlyAmount,
    unit: UNITS[heatingType],
    label: LABELS[heatingType],
  };
}

export function roundForCart(value: number): number {
  return Math.max(1, Math.round(value));
}
