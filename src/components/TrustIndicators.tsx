import { Droplets, Truck, ShieldCheck } from 'lucide-react';

export function TrustIndicators() {
  return (
    <div className="flex justify-between items-center bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 shadow-sm mt-6">
      <div className="flex flex-col items-center text-center gap-1 flex-1">
        <Droplets className="text-primary w-7 h-7" />
        <span className="text-xs text-on-surface font-semibold">Leña 100% Seca</span>
        <span className="text-[10px] text-on-surface-variant leading-tight">Máximo rendimiento</span>
      </div>
      <div className="w-px h-10 bg-outline-variant/50"></div>
      <div className="flex flex-col items-center text-center gap-1 flex-1">
        <Truck className="text-primary w-7 h-7" />
        <span className="text-xs text-on-surface font-semibold">Despacho Rápido</span>
        <span className="text-[10px] text-on-surface-variant leading-tight">En toda la región</span>
      </div>
      <div className="w-px h-10 bg-outline-variant/50"></div>
      <div className="flex flex-col items-center text-center gap-1 flex-1">
        <ShieldCheck className="text-primary w-7 h-7" />
        <span className="text-xs text-on-surface font-semibold">Calidad Garantizada</span>
        <span className="text-[10px] text-on-surface-variant leading-tight">Leña seleccionada</span>
      </div>
    </div>
  );
}
