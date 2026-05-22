import { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, FileText, Sparkles } from 'lucide-react';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      onConfirm({ name: name.trim(), phone: phone.trim(), address: address.trim(), notes: notes.trim() });
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
      <header className="bg-surface sticky top-0 z-50 flex justify-between items-center w-full px-4 py-3 shadow-sm">
        <button onClick={onGoBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-serif text-xl md:text-2xl text-primary font-bold">Datos de Entrega</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRandomFill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-primary/40 text-xs font-semibold text-primary hover:bg-primary/5 active:scale-95 transition-all"
            title="Rellenar con datos aleatorios"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Demo
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
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

      <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant/30 p-6 pb-safe z-50">
        <div className="max-w-md mx-auto">
          <button onClick={handleSubmit} className="w-full bg-primary text-on-primary font-semibold text-lg py-4 rounded-xl shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all">
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}