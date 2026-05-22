import {
  Flame, Moon, Sun, MapPin, Phone, Mail, ChevronRight, ExternalLink,
  Package, RefreshCw, QrCode, X, ShoppingCart, ChevronDown, ChevronUp,
  Edit3, Trash2, Check, Minus
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { OrderTracker } from '../components/OrderTracker';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { ThemeMode, TrackedOrder, OrderStatus } from '../types';
import { useState, useEffect } from 'react';
import { estimateDepletionDate, formatDepletionDate } from '../utils/reorderEstimator';
import {
  getCollapsedOrderIds,
  toggleOrderCollapsed,
  setAllOrdersCollapsed,
} from '../utils/collapsedOrders';
import { deleteOrders } from '../utils/orders';

interface AccountScreenProps {
  orders: TrackedOrder[];
  onRefresh: () => void;
  onSimulateProgress: (id: string) => void;
  onRepeatOrder: (order: TrackedOrder) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const tabs: { key: 'activos' | 'historicos'; label: string; filter: OrderStatus[] }[] = [
  { key: 'activos', label: 'Activos', filter: ['pendiente', 'en_camino'] },
  { key: 'historicos', label: 'Históricos', filter: ['entregado'] },
];

export function AccountScreen({
  orders,
  onRefresh,
  onSimulateProgress,
  onRepeatOrder,
  theme,
  onToggleTheme,
}: AccountScreenProps) {
  const [showQR, setShowQR] = useState(false);
  const [orderToRepeat, setOrderToRepeat] = useState<TrackedOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'activos' | 'historicos'>('activos');

  // Edit mode (only for historicos)
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Collapsed state (persisted)
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCollapsedIds(new Set(getCollapsedOrderIds()));
  }, []);

  const appUrl = 'https://maulena.netlify.app/';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}`;

  const currentTab = tabs.find(t => t.key === activeTab)!;
  const filteredOrders = orders.filter(o => currentTab.filter.includes(o.status));
  const historicOrders = orders.filter(o => o.status === 'entregado');

  const handleToggleCollapse = (orderId: string) => {
    toggleOrderCollapsed(orderId);
    setCollapsedIds(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const handleCollapseAll = (collapse: boolean) => {
    const ids = filteredOrders.map(o => o.id);
    setAllOrdersCollapsed(ids, collapse);
    setCollapsedIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => {
        if (collapse) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const handleToggleSelect = (orderId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const handleSelectAll = () => {
    const allSelected = filteredOrders.every(o => selectedIds.has(o.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    deleteOrders(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsEditing(false);
    setShowDeleteConfirm(false);
    onRefresh();
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedIds(new Set());
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const allSelected = filteredOrders.length > 0 && filteredOrders.every(o => selectedIds.has(o.id));

  return (
    <div className="min-h-screen pb-24">
      <header className="bg-surface sticky top-0 z-50 flex justify-between items-center w-full px-4 py-3 shadow-sm">
        <div className="w-10" />
        <div className="flex items-center gap-2">
          <Flame className="text-primary w-7 h-7 fill-primary" />
          <h1 className="font-serif text-2xl text-primary font-bold tracking-tight">Mi Cuenta</h1>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main className="max-w-md mx-auto px-6 mt-6">
        {/* Avatar / Brand Section */}
        <section className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center mb-4 shadow-lg">
            <Flame className="w-10 h-10 text-on-primary fill-on-primary/20" />
          </div>
          <h2 className="font-serif text-2xl text-on-surface font-bold">Maule Leña</h2>
          <p className="text-sm text-on-surface-variant mt-1">Tu proveedor de calefaccion en la Region del Maule</p>
        </section>

        {/* Order Tracking Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg text-on-surface font-bold flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Mis Pedidos
            </h3>
            <div className="flex items-center gap-2">
              {orders.length > 0 && (
                <button
                  onClick={onRefresh}
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  Actualizar
                </button>
              )}
              {activeTab === 'historicos' && historicOrders.length > 0 && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  Editar
                </button>
              )}
              {isEditing && (
                <button
                  onClick={cancelEditing}
                  className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-lg hover:bg-surface-variant transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 text-center">
              <Package className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3" />
              <p className="text-sm text-on-surface-variant">Aun no tienes pedidos</p>
              <p className="text-xs text-on-surface-variant/60 mt-1">Cuando realices uno, aparecera aqui</p>
            </div>
          ) : (
            <div>
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {tabs.map(tab => {
                  const count = orders.filter(o => tab.filter.includes(o.status)).length;
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => { setActiveTab(tab.key); setIsEditing(false); setSelectedIds(new Set()); }}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                        active
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant'
                      }`}
                    >
                      {tab.label}
                      {count > 0 && (
                        <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                          active ? 'bg-on-primary/20 text-on-primary' : 'bg-primary/10 text-primary'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Collapse/Expand all */}
              {filteredOrders.length > 0 && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => {
                      const allCollapsed = filteredOrders.every(o => collapsedIds.has(o.id));
                      handleCollapseAll(!allCollapsed);
                    }}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {filteredOrders.every(o => collapsedIds.has(o.id)) ? (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Expandir todos
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        Contraer todos
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Select all (editing mode) */}
              {isEditing && filteredOrders.length > 0 && (
                <div className="flex items-center gap-3 mb-3 p-3 bg-surface-container-high rounded-xl">
                  <button
                    onClick={handleSelectAll}
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                      allSelected
                        ? 'bg-primary border-primary'
                        : 'border-outline-variant bg-surface'
                    }`}
                  >
                    {allSelected && <Check className="h-3.5 w-3.5 text-on-primary" />}
                  </button>
                  <span className="text-sm font-medium text-on-surface">
                    {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                  </span>
                  <span className="ml-auto text-xs text-on-surface-variant">
                    {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Orders list */}
              {filteredOrders.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 text-center">
                  <Package className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3" />
                  <p className="text-sm text-on-surface-variant">No tienes pedidos {activeTab === 'activos' ? 'activos' : 'entregados'}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredOrders.map(order => {
                    const isCollapsed = collapsedIds.has(order.id);
                    const isSelected = selectedIds.has(order.id);
                    const depletion = order.status === 'entregado' ? estimateDepletionDate(order) : null;

                    return (
                      <div key={order.id}>
                        {/* Re-order banner for delivered orders */}
                        {depletion && !isCollapsed && (
                          <div className="mb-2 rounded-xl bg-blue-50 p-3 text-blue-800">
                            <p className="text-xs leading-relaxed">
                              Tus <strong>{order.items[0]?.quantity} {order.items[0]?.unit}</strong> de{' '}
                              <strong>{order.items[0]?.name}</strong> cubriran tu calefaccion hasta aproximadamente el{' '}
                              <strong>{formatDepletionDate(depletion)}</strong>.
                            </p>
                            <button
                              onClick={() => setOrderToRepeat(order)}
                              className="mt-2 text-xs font-semibold text-primary hover:underline"
                            >
                              ¿Programar siguiente despacho?
                            </button>
                          </div>
                        )}

                        <div
                          className={`bg-surface-container-lowest border rounded-2xl shadow-sm transition-all ${
                            isCollapsed
                              ? 'border-outline-variant/20 p-3'
                              : 'border-outline-variant/30 p-5'
                          }`}
                        >
                          {/* Collapsed view */}
                          {isCollapsed ? (
                            <div className="flex items-center gap-3">
                              {isEditing && (
                                <button
                                  onClick={() => handleToggleSelect(order.id)}
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                    isSelected
                                      ? 'bg-primary border-primary'
                                      : 'border-outline-variant bg-surface'
                                  }`}
                                >
                                  {isSelected && <Check className="h-3.5 w-3.5 text-on-primary" />}
                                </button>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-serif text-sm font-bold text-primary">{order.id}</span>
                                  <span className="text-xs text-on-surface-variant">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                  <span className="text-xs text-on-surface-variant">
                                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                                  </span>
                                  <span className="text-sm font-bold text-on-surface">
                                    ${order.total.toLocaleString('es-CL')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {order.status === 'entregado' && !isEditing && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedIds(new Set([order.id]));
                                      setShowDeleteConfirm(true);
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                    title="Eliminar pedido"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleToggleCollapse(order.id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
                                >
                                  <ChevronDown className="h-4 w-4 text-on-surface-variant" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start gap-3">
                                {isEditing && (
                                  <button
                                    onClick={() => handleToggleSelect(order.id)}
                                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                      isSelected
                                        ? 'bg-primary border-primary'
                                        : 'border-outline-variant bg-surface'
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3.5 w-3.5 text-on-primary" />}
                                  </button>
                                )}
                                <div className="flex-1 min-w-0">
                                  <button
                                    onClick={() => !isEditing && setSelectedOrder(order)}
                                    className="w-full text-left"
                                  >
                                    <OrderTracker
                                      status={order.status}
                                      orderId={order.id}
                                      createdAt={order.createdAt}
                                    />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 mt-1">
                                  {order.status === 'entregado' && !isEditing && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIds(new Set([order.id]));
                                        setShowDeleteConfirm(true);
                                      }}
                                      className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                      title="Eliminar pedido"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleToggleCollapse(order.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
                                  >
                                    <ChevronUp className="h-4 w-4 text-on-surface-variant" />
                                  </button>
                                </div>
                              </div>

                              {/* Order items summary */}
                              <div className="mt-4 pt-4 border-t border-outline-variant/30">
                                <div className="flex flex-col gap-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                      <span className="text-on-surface-variant">
                                        {item.quantity} {item.unit} x {item.name}
                                      </span>
                                      <span className="text-on-surface font-medium">
                                        ${(item.price * item.quantity).toLocaleString('es-CL')}
                                      </span>
                                    </div>
                                  ))}
                                  <div className="flex justify-between text-xs pt-2 mt-1 border-t border-outline-variant/30">
                                    <span className="text-on-surface-variant">Despacho</span>
                                    <span className="text-on-surface font-medium">
                                      {order.shippingCost === 0 ? 'Gratis' : `$${order.shippingCost.toLocaleString('es-CL')}`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold pt-1">
                                    <span className="text-on-surface">Total</span>
                                    <span className="text-primary">${order.total.toLocaleString('es-CL')}</span>
                                  </div>
                                </div>
                              </div>

                              {!isEditing && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-primary font-medium">
                                  <ChevronRight className="w-3.5 h-3.5" />
                                  Ver detalle
                                </div>
                              )}

                              {/* Simulate progress (demo only) */}
                              {order.status !== 'entregado' && !isEditing && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onSimulateProgress(order.id); }}
                                  className="mt-3 w-full text-xs text-primary border border-primary/30 rounded-xl py-2 hover:bg-primary/5 transition-colors"
                                >
                                  Simular avance de estado (demo)
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Theme Section */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Apariencia</h3>
                <p className="text-xs text-on-surface-variant">
                  {theme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado'}
                </p>
              </div>
            </div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </section>

        {/* Presentation Mode */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Modo Presentacion</h3>
                <p className="text-xs text-on-surface-variant">QR para acceder desde el celular</p>
              </div>
            </div>
            <button
              onClick={() => setShowQR(true)}
              className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 active:scale-95 transition-all"
            >
              Mostrar QR
            </button>
          </div>
        </section>

        {/* Contact Info */}
        <section className="mb-4">
          <h3 className="font-serif text-lg text-on-surface font-bold mb-3">Contacto</h3>
          <div className="flex flex-col gap-2">
            <a
              href="tel:+56912345678"
              className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-on-surface">Telefono</h4>
                <p className="text-xs text-on-surface-variant">+56 9 1234 5678</p>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant shrink-0" />
            </a>
            <a
              href="mailto:contacto@maulelena.cl"
              className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-on-surface">Email</h4>
                <p className="text-xs text-on-surface-variant">contacto@maulelena.cl</p>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant shrink-0" />
            </a>
            <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-on-surface">Cobertura</h4>
                <p className="text-xs text-on-surface-variant">16 comunas en la Region del Maule</p>
              </div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mb-4">
          <h3 className="font-serif text-lg text-on-surface font-bold mb-3">Informacion</h3>
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant/30">
            {[
              { label: 'Terminos y condiciones', icon: ExternalLink },
              { label: 'Politica de privacidad', icon: ExternalLink },
              { label: 'Preguntas frecuentes', icon: ExternalLink },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface-variant/50 transition-colors active:bg-surface-variant"
                >
                  <span className="text-sm text-on-surface">{link.label}</span>
                  <Icon className="w-4 h-4 text-on-surface-variant" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-[10px] text-on-surface-variant/60 mt-1">Maule Leña © 2025</p>
        </footer>
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onRepeatOrder={(order) => { onRepeatOrder(order); setSelectedOrder(null); }}
      />

      {/* Repeat order confirmation modal */}
      {orderToRepeat && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/55 px-5 py-8 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <button
                onClick={() => setOrderToRepeat(null)}
                className="-mr-2 -mt-2 flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                aria-label="Cerrar confirmacion"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-4 font-serif text-2xl font-bold text-on-surface">Repetir pedido</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Esto reemplazara los productos actuales de tu carrito por los productos del pedido {orderToRepeat.id}.
            </p>

            <div className="mt-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">Productos</p>
              <div className="flex flex-col gap-1.5">
                {orderToRepeat.items.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex justify-between gap-3 text-xs">
                    <span className="text-on-surface-variant">{item.quantity} {item.unit} x {item.name}</span>
                    <span className="shrink-0 font-semibold text-on-surface">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setOrderToRepeat(null)}
                className="flex-1 rounded-xl border border-outline-variant/50 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onRepeatOrder(orderToRepeat);
                  setOrderToRepeat(null);
                }}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98]"
              >
                Reemplazar carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/55 px-5 py-8 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-on-surface">Eliminar pedido{selectedIds.size !== 1 ? 's' : ''}</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              ¿Eliminar {selectedIds.size} pedido{selectedIds.size !== 1 ? 's' : ''} del historial? Esta accion no se puede deshacer.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-outline-variant/50 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 active:scale-[0.98]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating delete action bar */}
      {isEditing && selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[180] bg-surface border-t border-outline-variant/30 px-6 py-4 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <button
              onClick={cancelEditing}
              className="flex-1 rounded-xl border border-outline-variant/50 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
            >
              Cancelar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar ({selectedIds.size})
            </button>
          </div>
        </div>
      )}

      {/* QR Full-screen overlay */}
      {showQR && (
        <div className="fixed inset-0 z-[200] bg-surface/95 backdrop-blur-sm flex flex-col items-center justify-center p-8">
          <button
            onClick={() => setShowQR(false)}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors"
          >
            <X className="w-6 h-6 text-on-surface" />
          </button>

          <div className="max-w-sm w-full text-center">
            <div className="mb-8">
              <h2 className="font-serif text-2xl text-on-surface font-bold mb-2">Escanea para acceder</h2>
              <p className="text-sm text-on-surface-variant">Abre la app en tu celular escaneando este codigo</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xl inline-block mx-auto mb-6">
              <img
                src={qrUrl}
                alt="QR de acceso"
                className="w-64 h-64 mx-auto"
              />
            </div>

            <p className="text-sm text-on-surface-variant break-all bg-surface-container-high rounded-xl px-4 py-3 font-mono">
              {appUrl}
            </p>

          </div>
        </div>
      )}
    </div>
  );
}
