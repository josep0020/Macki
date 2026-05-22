import { CheckCircle, Clock, Truck, Package } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTrackerProps {
  status: OrderStatus;
  orderId: string;
  createdAt: string;
}

const statusSteps: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
  { key: 'pendiente', label: 'Pendiente', icon: Clock },
  { key: 'en_camino', label: 'En camino', icon: Truck },
  { key: 'entregado', label: 'Entregado', icon: Package },
];

const statusOrder: Record<OrderStatus, number> = {
  pendiente: 0,
  en_camino: 1,
  entregado: 2,
};

export function OrderTracker({ status, orderId, createdAt }: OrderTrackerProps) {
  const currentIndex = statusOrder[status];
  const date = new Date(createdAt);
  const formatted = date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-on-surface-variant">Pedido</p>
          <p className="font-serif text-sm font-bold text-primary">{orderId}</p>
        </div>
        <p className="text-xs text-on-surface-variant">{formatted}</p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-0 mb-4">
        {statusSteps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const isLast = idx === statusSteps.length - 1;

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/30 scale-110'
                        : 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium text-center ${
                    isCompleted ? 'text-on-surface' : 'text-on-surface-variant/50'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-1 mb-6">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx < currentIndex ? 'bg-primary' : 'bg-outline-variant/30'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-3">
        <CheckCircle className={`w-4 h-4 ${status === 'entregado' ? 'text-green-600' : 'text-primary'}`} />
        <span className="text-sm font-medium text-on-surface">
          {status === 'pendiente' && 'Tu pedido está siendo preparado'}
          {status === 'en_camino' && 'Tu pedido está en camino'}
          {status === 'entregado' && 'Tu pedido fue entregado'}
        </span>
      </div>
    </div>
  );
}
