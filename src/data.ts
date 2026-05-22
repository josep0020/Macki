import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Eucalipto Certificado',
    price: 52000,
    unit: 'm³',
    rating: 4.5,
    reviews: 128,
    imageUrl: '/images/eucalipto.png',
    badge: 'Seco',
    category: 'leña'
  },
  {
    id: '2',
    name: 'Pino Seco Premium',
    price: 42000,
    unit: 'm³',
    rating: 4.2,
    reviews: 96,
    imageUrl: '/images/pino.jpg',
    badge: 'Encendido',
    category: 'leña'
  },
  {
    id: '3',
    name: 'Nativo Seco',
    price: 65000,
    unit: 'm³',
    rating: 4.8,
    reviews: 74,
    imageUrl: '/images/nativa.jpg',
    badge: 'Alta duracion',
    category: 'leña'
  },
  {
    id: '4',
    name: 'Mezcla Seca',
    price: 48000,
    unit: 'm³',
    rating: 4.4,
    reviews: 53,
    imageUrl: '/images/mezcla.jpg',
    badge: 'Economica',
    category: 'leña'
  },
  {
    id: '5',
    name: 'Pellet Premium',
    price: 4990,
    unit: 'saco 15kg',
    rating: 4.9,
    reviews: 45,
    imageUrl: '/images/pellets.jpg',
    badge: 'Popular',
    category: 'pellet'
  },
  {
    id: '6',
    name: 'Parafina a Domicilio',
    price: 1050,
    unit: 'litro',
    rating: 4.0,
    reviews: 22,
    imageUrl: '/images/parafina.jpg',
    category: 'parafina'
  }
];

export const comunas = [
  'Talca',
  'Cauquenes',
  'Curicó',
  'Licantén',
  'Molina',
  'Romeral',
  'Sagrada Familia',
  'Linares',
  'Longaví',
  'Parral',
  'San Javier',
  'Yerbas Buenas',
  'Constitución',
  'Maule',
  'Pelarco',
  'San Rafael',
] as const;

export const BASE_SHIPPING_COST: Record<string, number> = {
  Talca: 12000,
  Cauquenes: 18000,
  Curicó: 10000,
  Licantén: 15000,
  Molina: 13000,
  Romeral: 15000,
  'Sagrada Familia': 18000,
  Linares: 18000,
  Longaví: 22000,
  Parral: 22000,
  'San Javier': 18000,
  'Yerbas Buenas': 22000,
  Constitución: 15000,
  Maule: 13000,
  Pelarco: 12000,
  'San Rafael': 14000,
};

export const FREE_SHIPPING_THRESHOLD = 100000;
export const REDUCED_SHIPPING_THRESHOLD = 50000;

export function getShippingCost(comuna: string, subtotal: number): { cost: number; label: string; savings: number } {
  const baseCost = BASE_SHIPPING_COST[comuna] ?? 15000;

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { cost: 0, label: 'Gratis', savings: baseCost };
  }

  if (subtotal >= REDUCED_SHIPPING_THRESHOLD) {
    const reducedCost = Math.round(baseCost * 0.5);
    return { cost: reducedCost, label: 'Despacho reducido', savings: baseCost - reducedCost };
  }

  return { cost: baseCost, label: 'Despacho a confirmar', savings: 0 };
}

export const DEFAULT_COMUNA = 'Curicó';
