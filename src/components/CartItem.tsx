import { Product } from '../types';
import { Minus, Plus } from 'lucide-react';

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export function CartItemView({ product, quantity, onUpdateQuantity }: CartItemProps) {
  return (
    <article className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-3xl border border-outline-variant/30 shadow-sm">
      <img
        alt={product.name}
        src={product.imageUrl}
        className="w-20 h-20 object-cover rounded-[20px]"
        loading="lazy"
      />
      <div className="flex-1 flex flex-col gap-0.5">
        <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
          {quantity} {product.unit}
        </span>
        <h3 className="font-serif text-base font-bold text-on-surface leading-tight">
          {product.name}
        </h3>
        <p className="font-serif text-[15px] font-bold text-on-surface mt-1">
          ${product.price.toLocaleString('es-CL')}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-surface-container-low rounded-full p-1 border border-outline-variant/40">
        <button
          onClick={() => onUpdateQuantity(product.id, -1)}
          className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-variant rounded-full transition-colors active:scale-90"
          aria-label="Disminuir cantidad"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(product.id, 1)}
          className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-variant rounded-full transition-colors active:scale-90"
          aria-label="Aumentar cantidad"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
