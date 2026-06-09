import { useState } from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Check, ChevronLeft, ChevronRight, MapPin, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
  cartQuantity: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ProductCard({ product, onAdd, cartQuantity, isFavorite = false, onToggleFavorite }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const [currentImage, setCurrentImage] = useState(0);
  const hasMultipleImages = images.length > 1;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartBounce(true);
    setTimeout(() => setHeartBounce(false), 300);
    onToggleFavorite?.();
  };

  const handleAdd = () => {
    onAdd();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage(prev => (prev - 1 + images.length) % images.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage(prev => (prev + 1) % images.length);
  };

  return (
    <div className="h-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 w-full p-2">
        <img
          alt={product.name}
          src={images[currentImage]}
          className="w-full h-full object-cover rounded-xl transition-opacity duration-300"
          loading="lazy"
        />
        {product.badge && (
          <div className="absolute top-4 left-4 bg-secondary/90 text-on-secondary px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm shadow-sm">
            {product.badge}
          </div>
        )}
        {onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 w-9 h-9 bg-white/70 dark:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 ${heartBounce ? 'scale-125' : 'scale-100'}`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-transparent text-on-surface-variant'}`} />
          </button>
        )}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface shadow-sm hover:bg-surface transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface shadow-sm hover:bg-surface transition-colors"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? 'bg-surface' : 'bg-surface/40'}`}
                  aria-label={`Ir a imagen ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-base text-on-surface mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-transparent'}`} />
            ))}
          </div>
          <span className="text-xs text-on-surface-variant font-medium ml-1">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="mt-auto pt-2 pb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface">
              ${product.price.toLocaleString('es-CL')}
            </span>
            <span className="text-sm text-on-surface-variant">/ {product.unit}</span>
          </div>
        </div>
        {product.category === 'parafina' ? (
          <button
            onClick={() => window.open('https://www.google.com/maps/search/estaciones+de+servicio+copec+petrobras+shell+region+del+maule/', '_blank')}
            className="w-full font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-primary hover:bg-primary-container text-on-primary"
          >
            <MapPin className="w-5 h-5" />
            Ver ubicaciones en el Maule
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className={`w-full font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              justAdded
                ? 'bg-green-700 text-white'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5" />
                ¡Agregado!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Añadir al Carrito</span>
                {cartQuantity > 0 && (
                  <span className="ml-auto bg-white/25 text-white text-[11px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0">
                    {cartQuantity}
                  </span>
                )}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
