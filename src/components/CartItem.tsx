import { Product } from '../types';
import { Minus, Plus } from 'lucide-react';

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export function CartItemView({ product, quantity, onUpdateQuantity }: CartItemProps) {
  return (
    <article className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant shadow-sm">
      <img
        alt={product.name}
        src={product.imageUrl}
        className="w-20 h-20 object-cover rounded-xl"
        loading="lazy"
      />
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="font-semibold text-sm text-on-surface">
          {quantity} {product.unit} {product.name}
        </h3>
        <p className="text-base font-bold text-primary">
          ${(product.price * quantity).toLocaleString('es-CL')}
        </p>
      </div>
      <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-2 py-1 border border-outline-variant">
        <button
          onClick={() => onUpdateQuantity(product.id, -1)}
          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-variant rounded-full transition-colors active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(product.id, 1)}
          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-variant rounded-full transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
