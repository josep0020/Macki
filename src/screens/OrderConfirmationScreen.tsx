import { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, FileText, Sparkles, CalendarDays } from 'lucide-react';
import { CartItem, OrderData, ThemeMode } from '../types';
import { ThemeToggle } from '../components/ThemeToggle';
import { getShippingCost } from '../data';
import { generateRandomOrderData } from '../utils/randomData';

interface OrderConfirmationScreenProps {
  cart: CartItem[];
  comuna: string;
  onConfirm: (data: OrderData) => void;
  onGoBack: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function OrderConfirmationScreen({ cart, comuna, onConfirm, onGoBack, theme, onToggleTheme }: OrderConfirmationScreenProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Sin preferencia');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 14);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const timeSlots = [
    'Mañana (9:00 - 13:00)',
    'Tarde (14:00 - 18:00)',
    'Sin preferencia',
  ];

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const { cost: shippingCost } = getShippingCost(comuna, subtotal);
  const total = subtotal + shippingCost;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    if (!address.trim()) newErrors.address = 'La dirección es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onConfirm({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        deliveryDate: deliveryDate || undefined,
        deliveryTimeSlot: deliveryTimeSlot,
      });
    }
  };

  const handleRandomFill = () => {
    const data = generateRandomOrderData();
    setName(data.name);
    setPhone(data.phone);
    setAddress(data.address);
    setNotes(data.notes);
    setErrors({});
  };

  const inputClass = (field: string) =>
    `w-full bg-surface-container-lowest border shadow-sm rounded-xl py-4 pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant transition-all outline-none ${
      errors[field] ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'
    } focus:ring-1`;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Liquid Glass Header */}
      <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/80 dark:bg-surface-container-low/75 backdrop-blur-md border-b border-outline-variant/15 rounded-b-2xl shadow-sm transition-all">
        <div className="max-w-md mx-auto flex justify-between items-center px-4 py-3">
          <button onClick={onGoBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 text-primary cursor-pointer" aria-label="Volver">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-serif text-lg md:text-xl text-primary font-bold">Datos de Entrega</h1>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRandomFill}
              className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/25 active:scale-95 transition-all cursor-pointer"
              title="Rellenar con datos aleatorios"
            >
              <Sparkles className="w-3 h-3" />
              Demo
            </button>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto px-6 py-6 flex-1 flex flex-col gap-6 pb-32">
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-semibold text-on-surface mb-2 block">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input type="text" value={name} onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }} className={inputClass('name')} placeholder="Tu nombre completo" />
            </div>
            {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-on-surface mb-2 block">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }} className={inputClass('phone')} placeholder="+56 9 1234 5678" />
            </div>
            {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-on-surface mb-2 block">Dirección de Entrega</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input type="text" value={address} onChange={e => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: '' })); }} className={inputClass('address')} placeholder="Calle, número, depto" />
            </div>
            {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-on-surface mb-2 block">Notas (opcional)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-on-surface-variant w-5 h-5" />
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl py-4 pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" rows={3} placeholder="Instrucciones de entrega, horario preferido, etc." />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-on-surface mb-2 block">Fecha de Entrega</label>
            <div className="relative mb-4">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl py-4 pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <label className="text-sm font-semibold text-on-surface mb-2 block">Horario Preferido</label>
            <div className="flex flex-col sm:flex-row gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setDeliveryTimeSlot(slot)}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    deliveryTimeSlot === slot
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:border-primary/60'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <section className="bg-surface-container-low rounded-2xl p-6 flex flex-col gap-3 shadow-sm border border-outline-variant/30">
            <div className="flex justify-between items-center text-on-surface-variant text-sm">
              <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-medium">${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant text-sm">
              <span>Despacho</span>
              <span className="font-medium">{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CL')}`}</span>
            </div>
            <hr className="border-outline-variant/60" />
            <div className="flex justify-between items-center text-on-surface">
              <span className="text-lg font-bold">Total</span>
              <span className="font-serif text-2xl font-bold text-primary">${total.toLocaleString('es-CL')}</span>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant/30 p-4 pb-safe z-50">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          {/* Términos y Garantía Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none px-1">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer accent-primary"
            />
            <span className="text-[11px] text-on-surface-variant leading-normal">
              Acepto la <strong className="text-on-surface">Garantía de Humedad del 25%</strong> (derecho a rechazo sin costo si marca más al medir en la entrega) y los Términos del Servicio.
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!acceptedTerms}
            className="w-full bg-primary text-on-primary font-semibold text-lg py-4 rounded-xl shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}