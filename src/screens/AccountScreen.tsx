import {
  Flame, MapPin, Phone, Mail, ChevronRight, ExternalLink,
  Package, RefreshCw, X, ShoppingCart, ChevronDown, ChevronUp,
  Edit3, Trash2, Check, User, Share2
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { LoyaltyCard } from '../components/LoyaltyCard';
import { ThemeMode, TrackedOrder, OrderStatus } from '../types';
import { useState, useEffect } from 'react';
import { estimateDepletionDate, formatDepletionDate } from '../utils/reorderEstimator';
import { deleteOrders } from '../utils/orders';
import { comunas } from '../data';

interface AccountScreenProps {
  orders: TrackedOrder[];
  onRefresh: () => void;
  onSimulateProgress: (id: string) => void;
  onRepeatOrder: (order: TrackedOrder) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

interface UserProfile {
  name: string;
  phone: string;
  address: string;
}

export function AccountScreen({
  orders,
  onRefresh,
  onRepeatOrder,
  theme,
  onToggleTheme,
}: AccountScreenProps) {
  const [activeMainTab, setActiveMainTab] = useState<'pedidos' | 'fidelidad' | 'soporte'>('pedidos');
  const [showQR, setShowQR] = useState(false);
  const [orderToRepeat, setOrderToRepeat] = useState<TrackedOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null);

  // Profile states
  const [profile, setProfile] = useState<UserProfile>(() => {
    const raw = localStorage.getItem('maule-lena-profile');
    if (raw) {
      try {
        return JSON.parse(raw) as UserProfile;
      } catch {}
    }
    // Fallback to last order if exists
    if (orders.length > 0) {
      return {
        name: orders[0].customerName || '',
        phone: orders[0].customerPhone || '',
        address: orders[0].customerAddress || '',
      };
    }
    return { name: '', phone: '', address: '' };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editAddress, setEditAddress] = useState(profile.address);

  // Sync edits when profile changes
  useEffect(() => {
    setEditName(profile.name);
    setEditPhone(profile.phone);
    setEditAddress(profile.address);
  }, [profile]);

  // Edit mode (delete orders)
  const [isEditingOrders, setIsEditingOrders] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Coverage Dropdown
  const [showCoverage, setShowCoverage] = useState(false);

  const appUrl = 'https://calordemaule.vercel.app/';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}`;

  const handleSaveProfile = () => {
    const newProfile = { name: editName.trim(), phone: editPhone.trim(), address: editAddress.trim() };
    localStorage.setItem('maule-lena-profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setIsEditingProfile(false);
  };

  const handleToggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const handleSelectAllOrders = () => {
    const allSelected = orders.every(o => selectedOrderIds.has(o.id));
    if (allSelected) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(orders.map(o => o.id)));
    }
  };

  const handleDeleteOrders = () => {
    if (selectedOrderIds.size === 0) return;
    deleteOrders(Array.from(selectedOrderIds));
    setSelectedOrderIds(new Set());
    setIsEditingOrders(false);
    setShowDeleteConfirm(false);
    onRefresh();
  };

  const cancelEditingOrders = () => {
    setIsEditingOrders(false);
    setSelectedOrderIds(new Set());
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const allOrdersSelected = orders.length > 0 && orders.every(o => selectedOrderIds.has(o.id));
  const depletionOrder = orders.find(o => o.status === 'entregado');
  const depletion = depletionOrder ? estimateDepletionDate(depletionOrder) : null;

  return (
    <div className="min-h-screen pb-32">
      <header className="bg-surface sticky top-0 z-50 flex justify-between items-center w-full px-4 py-3 shadow-sm">
        <div className="w-10" />
        <div className="flex items-center gap-2">
          <Flame className="text-primary w-6 h-6 fill-primary" />
          <h1 className="text-xl text-primary font-bold tracking-tight">Mi Cuenta</h1>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main className="max-w-md mx-auto px-6 mt-6 flex flex-col gap-6">
        
        {/* ── User Profile Section (Apple Style) ── */}
        <section className="bg-surface-container-low/40 rounded-3xl p-5 border border-outline-variant/10 shadow-sm relative overflow-hidden transition-all duration-300">
          {!isEditingProfile ? (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0 uppercase">
                {profile.name ? profile.name.charAt(0) : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-on-surface truncate">
                  {profile.name || 'Usuario Invitado'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                  {profile.phone || 'Sin teléfono configurado'}
                </p>
                <p className="text-xs text-on-surface-variant/70 mt-1 leading-snug truncate">
                  {profile.address || 'Sin dirección de entrega por defecto'}
                </p>
              </div>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-xs font-bold text-primary hover:underline px-2.5 py-1.5 rounded-lg hover:bg-primary/5 transition-all"
              >
                Editar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                  Editar Datos de Despacho
                </h3>
              </div>
              <div className="flex flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface outline-none focus:border-primary transition-all"
                />
                <input
                  type="text"
                  placeholder="Teléfono (Ej: +56 9 1234 5678)"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface outline-none focus:border-primary transition-all"
                />
                <input
                  type="text"
                  placeholder="Dirección de entrega"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex gap-2 justify-end mt-1.5">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-outline-variant/50 hover:bg-surface-container text-on-surface transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="text-xs font-bold px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-all cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Main Tab Navigation ── */}
        <div className="flex bg-surface-container rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => { setActiveMainTab('pedidos'); cancelEditingOrders(); }}
            className={`flex-1 text-center py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeMainTab === 'pedidos'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant/80 hover:text-on-surface'
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => { setActiveMainTab('fidelidad'); cancelEditingOrders(); }}
            className={`flex-1 text-center py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeMainTab === 'fidelidad'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant/80 hover:text-on-surface'
            }`}
          >
            Fidelidad
          </button>
          <button
            onClick={() => { setActiveMainTab('soporte'); cancelEditingOrders(); }}
            className={`flex-1 text-center py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeMainTab === 'soporte'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant/80 hover:text-on-surface'
            }`}
          >
            Soporte
          </button>
        </div>

        {/* ── Tab Content Area ── */}
        <div className="flex flex-col gap-4">

          {/* 1. PEDIDOS TAB */}
          {activeMainTab === 'pedidos' && (
            <div className="flex flex-col gap-4 animate-screen-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                  Historial de compras
                </span>
                <div className="flex items-center gap-2">
                  {orders.length > 0 && !isEditingOrders && (
                    <button
                      onClick={() => setIsEditingOrders(true)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  )}
                  {isEditingOrders && (
                    <button
                      onClick={cancelEditingOrders}
                      className="text-xs font-bold text-on-surface-variant hover:underline cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>

              {/* Depletion recommendation card */}
              {depletion && depletionOrder && !isEditingOrders && (
                <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 flex flex-col gap-2.5 shadow-sm">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Tus <strong>{depletionOrder.items[0]?.quantity} {depletionOrder.items[0]?.unit}</strong> de{' '}
                    <strong>{depletionOrder.items[0]?.name}</strong> cubrirán tu calefacción hasta aproximadamente el{' '}
                    <strong>{formatDepletionDate(depletion)}</strong>.
                  </p>
                  <button
                    onClick={() => setOrderToRepeat(depletionOrder)}
                    className="self-start text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Programar siguiente despacho <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {orders.length === 0 ? (
                <div className="bg-surface-container-low/30 border border-outline-variant/10 rounded-3xl p-8 text-center">
                  <Package className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-2" />
                  <p className="text-xs font-bold text-on-surface-variant">Aún no tienes pedidos</p>
                  <p className="text-[10px] text-on-surface-variant/60 mt-1">Tus compras se reflejarán aquí</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {/* Select All Row in Editing Mode */}
                  {isEditingOrders && (
                    <div className="flex items-center justify-between p-3 bg-surface-container rounded-2xl mb-1 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSelectAllOrders}
                          className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors ${
                            allOrdersSelected
                              ? 'bg-primary border-primary'
                              : 'border-outline-variant bg-surface'
                          }`}
                        >
                          {allOrdersSelected && <Check className="h-3 w-3 text-on-primary" />}
                        </button>
                        <span className="font-semibold text-on-surface">Seleccionar todo</span>
                      </div>
                      <span className="font-semibold text-on-surface-variant/70">
                        {selectedOrderIds.size} seleccionados
                      </span>
                    </div>
                  )}

                  {orders.map(order => {
                    const isSelected = selectedOrderIds.has(order.id);
                    return (
                      <div
                        key={order.id}
                        onClick={() => !isEditingOrders && setSelectedOrder(order)}
                        className={`flex items-center justify-between p-4 bg-surface-container-low/30 hover:bg-surface-container-low/60 rounded-2xl transition-all border border-outline-variant/10 shadow-sm relative ${
                          isEditingOrders ? '' : 'cursor-pointer active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isEditingOrders && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSelectOrder(order.id);
                              }}
                              className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
                                isSelected
                                  ? 'bg-primary border-primary'
                                  : 'border-outline-variant bg-surface'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 text-on-primary" />}
                            </button>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-on-surface leading-tight truncate">
                              {order.id}
                            </span>
                            <span className="text-[10px] text-on-surface-variant/70 mt-0.5">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="flex flex-col text-right">
                            <span className="text-sm font-bold text-on-surface leading-tight">
                              ${order.total.toLocaleString('es-CL')}
                            </span>
                            <span className="text-[10px] text-on-surface-variant/70 mt-0.5">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                              order.status === 'pendiente'
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : order.status === 'en_camino'
                                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                  : 'bg-green-500/10 text-green-500 border-green-500/20'
                            }`}
                          >
                            {order.status === 'pendiente'
                              ? 'Pendiente'
                              : order.status === 'en_camino'
                                ? 'En camino'
                                : 'Entregado'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. FIDELIDAD TAB */}
          {activeMainTab === 'fidelidad' && (
            <div className="flex flex-col gap-4 animate-screen-in">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                Puntos y Beneficios
              </span>
              <LoyaltyCard onRefresh={onRefresh} />
            </div>
          )}

          {/* 3. SOPORTE TAB */}
          {activeMainTab === 'soporte' && (
            <div className="flex flex-col gap-5 animate-screen-in">
              
              {/* WhatsApp direct help */}
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-2.5">
                  Contacto directo
                </span>
                <a
                  href="https://wa.me/56912345678"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-surface-container-low/30 hover:bg-surface-container-low/60 border border-outline-variant/10 rounded-2xl p-4 shadow-sm transition-all active:scale-[0.99] group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-on-surface">Asistencia WhatsApp</h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Conversa con nuestro equipo para dudas o despachos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Coverage communes dropdown accordion */}
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-2.5">
                  Cobertura Regional
                </span>
                <div className="bg-surface-container-low/30 border border-outline-variant/10 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setShowCoverage(v => !v)}
                    className="w-full flex items-center justify-between p-4 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-on-surface">Comunas habilitadas</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Entregamos en 16 comunas de la Región del Maule</p>
                      </div>
                    </div>
                    {showCoverage ? (
                      <ChevronUp className="w-4 h-4 text-on-surface-variant/70" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-on-surface-variant/70" />
                    )}
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${showCoverage ? 'max-h-72 border-t border-outline-variant/10 overflow-y-auto' : 'max-h-0'}`}>
                    <div className="p-4 grid grid-cols-2 gap-2 bg-surface/50">
                      {comunas.map((c) => (
                        <div key={c} className="flex items-center gap-1.5 text-xs text-on-surface-variant/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Share QR */}
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-2.5">
                  Compartir Aplicación
                </span>
                <div
                  onClick={() => setShowQR(true)}
                  className="flex items-center gap-3 bg-surface-container-low/30 hover:bg-surface-container-low/60 border border-outline-variant/10 rounded-2xl p-4 shadow-sm transition-all active:scale-[0.99] group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-on-surface">Código QR y Enlace</h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Comparte Maule Leña con tus conocidos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Informative Links */}
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-2.5">
                  Información Legal
                </span>
                <div className="bg-surface-container-low/30 border border-outline-variant/10 rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant/10">
                  {[
                    { label: 'Términos y condiciones', icon: ExternalLink },
                    { label: 'Política de privacidad', icon: ExternalLink },
                    { label: 'Preguntas frecuentes', icon: ExternalLink },
                  ].map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.label}
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface-container/60 transition-colors active:bg-surface-container text-left"
                      >
                        <span className="text-xs font-medium text-on-surface">{link.label}</span>
                        <Icon className="w-3.5 h-3.5 text-on-surface-variant/60" />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="text-center py-6 mt-4">
          <p className="text-[9px] text-on-surface-variant/40 tracking-wider font-semibold uppercase">Maule Leña © 2026</p>
        </footer>

      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRepeatOrder={(order) => { onRepeatOrder(order); setSelectedOrder(null); }}
        />
      )}

      {/* Repeat order confirmation modal */}
      {orderToRepeat && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/55 px-5 py-8 backdrop-blur-sm animate-backdrop-in">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-2xl animate-modal-in">
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
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/55 px-5 py-8 backdrop-blur-sm animate-backdrop-in">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-2xl animate-modal-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-on-surface">Eliminar pedido{selectedOrderIds.size !== 1 ? 's' : ''}</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              ¿Eliminar {selectedOrderIds.size} pedido{selectedOrderIds.size !== 1 ? 's' : ''} del historial? Esta accion no se puede deshacer.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-outline-variant/50 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteOrders}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 active:scale-[0.98]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating delete action bar */}
      {isEditingOrders && selectedOrderIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[180] bg-surface border-t border-outline-variant/30 px-6 py-4 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <button
              onClick={cancelEditingOrders}
              className="flex-1 rounded-xl border border-outline-variant/50 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
            >
              Cancelar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar ({selectedOrderIds.size})
            </button>
          </div>
        </div>
      )}

      {/* QR Full-screen overlay */}
      {showQR && (
        <div className="fixed inset-0 z-[200] bg-surface/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 animate-backdrop-in">
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
