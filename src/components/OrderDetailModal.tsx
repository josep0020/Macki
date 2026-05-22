import { useMemo } from 'react';
import {
  X, Clock, Truck, Package, CheckCircle2, MapPin, User, Phone, FileText,
  ShoppingCart, Share2, Printer, Receipt, AlertTriangle
} from 'lucide-react';
import { TrackedOrder, OrderStatus } from '../types';

interface OrderDetailModalProps {
  order: TrackedOrder | null;
  onClose: () => void;
  onRepeatOrder: (order: TrackedOrder) => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pendiente: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  en_camino: { label: 'En camino', color: 'text-blue-600', bg: 'bg-blue-50', icon: Truck },
  entregado: { label: 'Entregado', color: 'text-green-600', bg: 'bg-green-50', icon: Package },
};

export function OrderDetailModal({ order, onClose, onRepeatOrder }: OrderDetailModalProps) {
  if (!order) return null;

  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  const createdDate = new Date(order.createdAt).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const statusDates = useMemo(() => {
    const map: Record<string, string> = {};
    order.statusHistory.forEach(h => {
      const d = new Date(h.date);
      map[h.status] = d.toLocaleDateString('es-CL', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      });
    });
    return map;
  }, [order.statusHistory]);

  const handlePrintVoucher = () => {
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const voucherHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Comprobante ${order.id}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; color: #1a1a1a; }
    .header { text-align: center; border-bottom: 2px solid #334529; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 22px; color: #334529; }
    .header p { margin: 4px 0 0; color: #666; font-size: 13px; }
    .section { margin-bottom: 20px; }
    .section h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #334529; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .row.total { font-weight: bold; font-size: 16px; border-top: 2px solid #334529; padding-top: 10px; margin-top: 8px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .notice { background: #fff8e1; border-left: 4px solid #ffc107; padding: 12px; margin: 16px 0; font-size: 13px; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { text-align: left; padding: 8px 0; border-bottom: 1px solid #eee; }
    th { color: #666; font-weight: 600; }
    .text-right { text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Maule Leña</h1>
    <p>Comprobante de Compra / Despacho</p>
  </div>

  <div class="section">
    <div class="row"><span><strong>Pedido:</strong> ${order.id}</span><span class="badge" style="background:${config.bg};color:${config.color.replace('text-', '')}">${config.label}</span></div>
    <div class="row"><span><strong>Fecha:</strong> ${createdDate}</span></div>
  </div>

  <div class="section">
    <h3>Cliente</h3>
    <div class="row"><span>Nombre:</span><span>${order.customerName}</span></div>
    <div class="row"><span>Teléfono:</span><span>${order.customerPhone}</span></div>
    <div class="row"><span>Dirección:</span><span>${order.customerAddress}</span></div>
  </div>

  <div class="section">
    <h3>Productos</h3>
    <table>
      <thead><tr><th>Producto</th><th class="text-right">Cant.</th><th class="text-right">Precio</th><th class="text-right">Subtotal</th></tr></thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="text-right">${item.quantity} ${item.unit}</td>
            <td class="text-right">$${item.price.toLocaleString('es-CL')}</td>
            <td class="text-right">$${(item.price * item.quantity).toLocaleString('es-CL')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="row"><span>Subtotal</span><span>$${subtotal.toLocaleString('es-CL')}</span></div>
    <div class="row"><span>Despacho</span><span>${order.shippingCost === 0 ? 'Gratis' : '$' + order.shippingCost.toLocaleString('es-CL')}</span></div>
    <div class="row total"><span>TOTAL</span><span>$${order.total.toLocaleString('es-CL')}</span></div>
  </div>

  <div class="notice">
    <strong>Nota importante:</strong> El transportista descargará a pie de camión. El cliente debe disponer del espacio y acceso necesario para la descarga.
  </div>

  ${order.notes ? `<div class="section"><h3>Notas</h3><p style="font-size:13px;color:#555">${order.notes}</p></div>` : ''}

  <div class="footer">
    <p>Maule Leña - Región del Maule</p>
    <p>Este documento es un comprobante de referencia. Para factura legal, contacte a su vendedor.</p>
  </div>

  <script>window.print();</script>
</body>
</html>`;

    const blob = new Blob([voucherHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const handleShare = async () => {
    const text = `Pedido ${order.id} - Maule Leña\nEstado: ${config.label}\nTotal: $${order.total.toLocaleString('es-CL')}\nProductos:\n${order.items.map(i => `- ${i.quantity} ${i.unit} ${i.name}: $${(i.price * i.quantity).toLocaleString('es-CL')}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Comprobante copiado al portapapeles');
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Comprobante copiado al portapapeles');
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-hidden rounded-3xl bg-surface shadow-2xl flex flex-col">
        {/* Header */}
        <div className="relative shrink-0 bg-gradient-to-br from-primary to-primary-container px-6 py-5 text-on-primary">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-on-primary/15 transition-colors hover:bg-on-primary/25"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-on-primary/15">
            <Receipt className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold">Pedido {order.id}</h2>
          <p className="mt-1 text-sm text-on-primary/80">{createdDate}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Status badge */}
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${config.bg}`}>
            <StatusIcon className={`h-4 w-4 ${config.color}`} />
            <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant mb-3">Historial</h3>
            <div className="space-y-3">
              {['pendiente', 'en_camino', 'entregado'].map((status) => {
                const date = statusDates[status];
                const isDone = date !== undefined;
                const icons = { pendiente: Clock, en_camino: Truck, entregado: CheckCircle2 };
                const labels = { pendiente: 'Recibido', en_camino: 'En camino', entregado: 'Entregado' };
                const Icon = icons[status as OrderStatus];
                return (
                  <div key={status} className={`flex items-start gap-3 ${!isDone ? 'opacity-40' : ''}`}>
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isDone ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{labels[status as OrderStatus]}</p>
                      <p className="text-xs text-on-surface-variant">{date || 'Pendiente'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant mb-3">Productos</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-on-surface">
                    {item.quantity} {item.unit} × {item.name}
                  </span>
                  <span className="font-semibold text-on-surface">
                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-outline-variant/30 pt-3">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Despacho</span>
                <span>{order.shippingCost === 0 ? 'Gratis' : `$${order.shippingCost.toLocaleString('es-CL')}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-on-surface">
                <span>Total</span>
                <span className="text-primary">${order.total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant mb-3">Despacho</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">{order.customerName}</p>
                  <p className="text-xs text-on-surface-variant">{order.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-on-surface">{order.customerAddress}</p>
              </div>
              {order.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-on-surface">{order.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                El transportista descargará a pie de camión. El cliente debe disponer del espacio y acceso necesario para la descarga.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 border-t border-outline-variant/30 bg-surface px-6 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrintVoucher}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98]"
            >
              <Printer className="h-4 w-4" />
              Comprobante
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant/50 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </button>
          </div>
          <button
            onClick={() => { onRepeatOrder(order); onClose(); }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4" />
            Repetir pedido
          </button>
        </div>
      </div>
    </div>
  );
}
