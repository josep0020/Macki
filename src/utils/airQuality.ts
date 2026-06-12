export type AirQualityLevel = 'bueno' | 'regular' | 'alerta' | 'preemergencia' | 'emergencia';

export interface AirQualityData {
  aqi: number;
  level: AirQualityLevel;
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  isRestricted: boolean;
  isSimulated?: boolean;
}

export const simulatedAqiDatabase: Record<string, number> = {
  Talca: 155, // Preemergencia
  Curicó: 162, // Preemergencia
  Linares: 115, // Alerta
  Maule: 142, // Alerta
  'San Javier': 88, // Regular
  Molina: 92, // Regular
  Cauquenes: 42, // Bueno
  Constitución: 35, // Bueno
  Licantén: 32, // Bueno
  Romeral: 85, // Regular
  'Sagrada Familia': 70, // Regular
  Longaví: 65, // Regular
  Parral: 78, // Regular
  'Yerbas Buenas': 60, // Regular
  Pelarco: 55, // Regular
  'San Rafael': 58, // Regular
};

export function getAirQualityDataFromAqi(aqi: number, isSimulated = false): AirQualityData {
  if (aqi <= 50) {
    return {
      aqi,
      level: 'bueno',
      label: 'Bueno',
      color: '#10b981', // Emerald 500
      bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300',
      textClass: 'text-emerald-700 dark:text-emerald-400',
      isRestricted: false,
      isSimulated
    };
  }
  if (aqi <= 100) {
    return {
      aqi,
      level: 'regular',
      label: 'Regular',
      color: '#eab308', // Yellow 500
      bgClass: 'bg-yellow-500/10 dark:bg-yellow-500/5 border border-yellow-500/20 text-yellow-800 dark:text-yellow-300',
      textClass: 'text-yellow-700 dark:text-yellow-400',
      isRestricted: false,
      isSimulated
    };
  }
  if (aqi <= 150) {
    return {
      aqi,
      level: 'alerta',
      label: 'Alerta',
      color: '#f97316', // Orange 500
      bgClass: 'bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20 text-orange-800 dark:text-orange-300',
      textClass: 'text-orange-700 dark:text-orange-400',
      isRestricted: false,
      isSimulated
    };
  }
  if (aqi <= 200) {
    return {
      aqi,
      level: 'preemergencia',
      label: 'Preemergencia',
      color: '#ef4444', // Red 500
      bgClass: 'bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 text-red-800 dark:text-red-300',
      textClass: 'text-red-700 dark:text-red-400',
      isRestricted: true,
      isSimulated
    };
  }
  return {
    aqi,
    level: 'emergencia',
    label: 'Emergencia',
    color: '#a855f7', // Purple 500
    bgClass: 'bg-purple-500/10 dark:bg-purple-500/5 border border-purple-500/20 text-purple-800 dark:text-purple-300',
    textClass: 'text-purple-700 dark:text-purple-400',
    isRestricted: true,
    isSimulated
  };
}

const WAQI_TOKEN = 'demo'; // Token de prueba gratuito de aqicn.org

export async function fetchComunaAirQuality(comuna: string): Promise<number> {
  const waqiCityMap: Record<string, string> = {
    Talca: 'chile/talca',
    Curicó: 'chile/curico',
    Linares: 'chile/linares',
    Constitución: 'chile/constitucion',
  };

  const mappedCity = waqiCityMap[comuna];
  if (!mappedCity) {
    // Si no hay estación física asignada, retornar valor de la base local simulada
    return simulatedAqiDatabase[comuna] ?? 45;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Timeout de 2 segundos para no demorar la interfaz

    const res = await fetch(`https://api.waqi.info/feed/${mappedCity}/?token=${WAQI_TOKEN}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const json = await res.json();
    if (json.status === 'ok' && typeof json.data?.aqi === 'number') {
      return json.data.aqi;
    }
  } catch (e) {
    // Silenciar error y caer al fallback local
  }

  return simulatedAqiDatabase[comuna] ?? 45;
}

export function getAirQualityLevelInfo(level: AirQualityLevel): {
  title: string;
  description: string;
  recommendations: string[];
} {
  switch (level) {
    case 'bueno':
      return {
        title: 'Calidad de Aire Optima',
        description: 'La calidad del aire se encuentra en niveles excelentes. Sin restricciones de calefacción.',
        recommendations: [
          'Ventilar ambientes con libertad.',
          'Uso libre de sistemas de calefacción aprobados.',
          'Realizar actividades físicas al aire libre.'
        ]
      };
    case 'regular':
      return {
        title: 'Calidad de Aire Favorable',
        description: 'La calidad del aire es aceptable. Sin restricciones activas para calefactores certificados.',
        recommendations: [
          'Privilegiar el uso de leña seca (humedad inferior al 25%).',
          'Uso libre de calefacción limpia.'
        ]
      };
    case 'alerta':
      return {
        title: 'Alerta Ambiental',
        description: 'Empeoramiento de calidad del aire. Se recomienda moderación en el uso de leña húmeda.',
        recommendations: [
          'Evitar emitir humos visibles.',
          'Monitorear la combustión de su calefactor.',
          'Idealmente preferir alternativas como pellet o parafina.'
        ]
      };
    case 'preemergencia':
      return {
        title: 'Preemergencia Ambiental',
        description: 'Leña prohibida hoy en zona urbana. Fiscalización de la SEREMI activa.',
        recommendations: [
          'Multas de hasta $325.000 (1 a 5 UTM).',
          'Prohibido encender calefactores a leña hoy.',
          'Prefiera pellet, parafina o calefacción eléctrica.'
        ]
      };
    case 'emergencia':
      return {
        title: 'Emergencia Ambiental',
        description: 'Prohibición absoluta de leña hoy. Fiscalización masiva en curso.',
        recommendations: [
          'Multas directas de hasta $325.000 y sumario sanitario.',
          'Prohibido encender cualquier tipo de leña.',
          'Use únicamente combustibles limpios.'
        ]
      };
  }
}
