import { useState } from 'react';
import { Snowflake, X } from 'lucide-react';

function isColdSeason(date: Date): boolean {
  const month = date.getMonth();
  return month >= 4 && month <= 8;
}

export function SeasonalAlert() {
  const [visible, setVisible] = useState(true);
  const today = new Date();

  if (!visible || !isColdSeason(today)) return null;

  const month = new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(today);

  return (
    <section className="mt-4 rounded-2xl border border-blue-200/70 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-3 shadow-sm dark:border-blue-900/40 dark:from-blue-950/40 dark:to-slate-900/40">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
          <Snowflake className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-200">
            Temporada fria de {month}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
            Se acerca una semana fria en el Maule. Asegura tu calefaccion con despacho a domicilio.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-blue-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/40"
          aria-label="Cerrar alerta de temporada"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
