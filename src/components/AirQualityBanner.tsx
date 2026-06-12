import { useState } from 'react';
import { AirQualityData, AirQualityLevel, getAirQualityLevelInfo } from '../utils/airQuality';
import { ShieldAlert, SlidersHorizontal, ChevronDown, Sun, CloudSun, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Expandable,
  ExpandableCard,
  ExpandableContent,
  ExpandableTrigger,
  useExpandable,
} from './Expandable';

interface AirQualityBannerProps {
  comuna: string;
  airQuality: AirQualityData;
  onSimulateLevel: (level: AirQualityLevel | null) => void;
}

function ChevronIndicator() {
  const { isExpanded } = useExpandable();
  return (
    <ChevronDown 
      className={`w-5 h-5 opacity-60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
    />
  );
}

export function AirQualityBanner({ comuna, airQuality, onSimulateLevel }: AirQualityBannerProps) {
  const levelInfo = getAirQualityLevelInfo(airQuality.level);

  const simulationOptions: { 
    level: AirQualityLevel | null; 
    label: string; 
    dotBg: string; 
    activeBorder: string; 
    activeBg: string; 
    activeText: string;
  }[] = [
    { 
      level: null, 
      label: 'Automático', 
      dotBg: 'bg-slate-400 dark:bg-slate-500',
      activeBorder: 'border-slate-500 dark:border-slate-400',
      activeBg: 'bg-slate-500/10 dark:bg-slate-500/20',
      activeText: 'text-slate-800 dark:text-slate-300'
    },
    { 
      level: 'bueno', 
      label: 'Bueno', 
      dotBg: 'bg-emerald-500',
      activeBorder: 'border-emerald-600 dark:border-emerald-500',
      activeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      activeText: 'text-emerald-800 dark:text-emerald-300'
    },
    { 
      level: 'regular', 
      label: 'Regular', 
      dotBg: 'bg-yellow-500',
      activeBorder: 'border-yellow-600 dark:border-yellow-500',
      activeBg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
      activeText: 'text-yellow-800 dark:text-yellow-300'
    },
    { 
      level: 'alerta', 
      label: 'Alerta', 
      dotBg: 'bg-orange-500',
      activeBorder: 'border-orange-500',
      activeBg: 'bg-orange-500/10 dark:bg-orange-500/20',
      activeText: 'text-orange-850 dark:text-orange-300'
    },
    { 
      level: 'preemergencia', 
      label: 'Preemergencia', 
      dotBg: 'bg-red-500',
      activeBorder: 'border-red-500',
      activeBg: 'bg-red-500/10 dark:bg-red-500/20',
      activeText: 'text-red-800 dark:text-red-300'
    },
    { 
      level: 'emergencia', 
      label: 'Emergencia', 
      dotBg: 'bg-purple-600',
      activeBorder: 'border-purple-600',
      activeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      activeText: 'text-purple-800 dark:text-purple-300'
    },
  ];

  const getLevelIconAndColor = (level: AirQualityLevel) => {
    switch (level) {
      case 'bueno':
        return {
          icon: <Sun className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/5',
          border: 'border-emerald-500/20 dark:border-emerald-500/10'
        };
      case 'regular':
        return {
          icon: <CloudSun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
          bg: 'bg-yellow-500/10 dark:bg-yellow-500/5',
          border: 'border-yellow-500/20 dark:border-yellow-500/10'
        };
      case 'alerta':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
          bg: 'bg-orange-500/10 dark:bg-orange-500/5',
          border: 'border-orange-500/20 dark:border-orange-500/10'
        };
      case 'preemergencia':
      case 'emergencia':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />,
          bg: 'bg-red-500/10 dark:bg-red-500/5',
          border: 'border-red-500/20 dark:border-red-500/10'
        };
    }
  };

  const { icon, bg: iconBg, border: iconBorder } = getLevelIconAndColor(airQuality.level);

  return (
    <div className="w-full mt-4">
      {/* TARJETA UNIFICADA: Calidad del Aire y Simulación (Expandible) */}
      <Expandable>
        <ExpandableCard
          className="w-full"
          collapsedSize={{ width: undefined, height: undefined }}
          expandedSize={{ width: undefined, height: undefined }}
        >
          {/* Cabecera Interactiva */}
          <ExpandableTrigger className="w-full text-left">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Dynamic Status Icon Circle */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${iconBorder} ${iconBg} shadow-inner transition-all duration-300`}>
                  {icon}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap text-on-surface">
                    <span className="text-sm font-bold opacity-90">Aire en {comuna}:</span>
                    <span 
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${airQuality.color}18`, color: airQuality.color }}
                    >
                      {airQuality.label}
                    </span>
                    <span className="text-xs opacity-65 font-medium">(AQI {airQuality.aqi})</span>
                  </div>
                  
                  <div className="text-sm font-medium mt-1.5 leading-relaxed text-on-surface">
                    {airQuality.level === 'bueno' || airQuality.level === 'regular' ? (
                      <span className="opacity-80">
                        Uso de leña seca permitido hoy.
                      </span>
                    ) : (
                      <span className={`flex items-start gap-1.5 ${
                        airQuality.level === 'alerta'
                          ? 'text-orange-600 dark:text-orange-400 font-semibold'
                          : airQuality.level === 'preemergencia'
                            ? 'text-red-600 dark:text-red-400 font-bold'
                            : 'text-purple-600 dark:text-purple-400 font-bold'
                      }`}>
                        <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${
                          airQuality.level === 'alerta'
                            ? 'text-orange-500'
                            : airQuality.level === 'preemergencia'
                              ? 'text-red-500'
                              : 'text-purple-500'
                        }`} />
                        <span>
                          {airQuality.level === 'alerta' && 'Restricción de humos visibles de 18:00 a 23:59 hrs. Evita multas.'}
                          {airQuality.level === 'preemergencia' && 'Leña prohibida hoy (18:00 a 06:00 hrs). Fiscalización de la SEREMI activa (Multas de hasta $325.000).'}
                          {airQuality.level === 'emergencia' && 'Prohibición absoluta las 24 horas. Fiscalización masiva de la SEREMI (Evita sumarios sanitarios).'}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Indicador de expansión */}
              <div className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0">
                <ChevronIndicator />
              </div>
            </div>
          </ExpandableTrigger>

          {/* Contenido Desplegable (Recomendaciones + Simulador) */}
          <ExpandableContent preset="fade" className="w-full">
            <div className="pt-5 mt-5 border-t border-outline-variant/30 space-y-5 pb-2">
              {/* Sección 1: Recomendaciones Sanitarias */}
              <div>
                <p className="text-[11px] font-black text-on-surface-variant/80 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-primary opacity-80" />
                  <span>Recomendaciones sanitarias</span>
                </p>
                <ul className="space-y-3.5 pl-1">
                  {levelInfo.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm flex items-start gap-2.5 text-on-surface opacity-85 leading-relaxed">
                      <span 
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors duration-300" 
                        style={{ backgroundColor: airQuality.color }}
                      />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sección 2: Panel de Simulación */}
              <div className="pt-5 border-t border-outline-variant/30">
                <p className="text-[11px] font-black text-on-surface-variant/80 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 opacity-70 text-primary" />
                  <span>Panel de simulación</span>
                </p>
                <div className="grid grid-cols-2 gap-3 pb-1">
                  {simulationOptions.map(opt => {
                    const isActive = (opt.level === null && !airQuality.isSimulated) || (opt.level === airQuality.level && airQuality.isSimulated);
                    return (
                      <button
                        key={opt.level ?? 'real'}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSimulateLevel(opt.level);
                        }}
                        className={`relative overflow-hidden flex items-center justify-between px-4 py-3 rounded-full cursor-pointer select-none transition-all duration-300 border outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ${
                          isActive 
                            ? `${opt.activeBorder} ${opt.activeBg} font-bold shadow-sm`
                            : 'bg-surface-container border-transparent hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className={`relative z-10 text-xs transition-colors duration-250 ${
                          isActive 
                            ? opt.activeText
                            : 'text-on-surface opacity-80 font-medium'
                        }`}>
                          {opt.label}
                        </span>
                        
                        {/* Circle status indicator */}
                        <span className={`relative z-10 flex h-2.5 w-2.5 rounded-full transition-all duration-250 border ${
                          isActive 
                            ? 'bg-white border-transparent scale-110 shadow-sm' 
                            : `${opt.dotBg} border-transparent`
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ExpandableContent>
        </ExpandableCard>
      </Expandable>
    </div>
  );
}
