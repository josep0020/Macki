import { MapPin, Phone, Mail } from 'lucide-react';
import { Merchant } from '../merchants';

interface MerchantCardProps {
  merchant: Merchant;
}

export function MerchantCard({ merchant }: MerchantCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-4 flex flex-col gap-3">
      <h4 className="font-semibold text-sm text-on-surface leading-tight">{merchant.name}</h4>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span className="text-xs text-on-surface-variant leading-snug">{merchant.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <a href={`tel:+56${merchant.phone}`} className="text-xs text-primary font-medium hover:underline">+56 {merchant.phone}</a>
        </div>
        {merchant.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <a href={`mailto:${merchant.email}`} className="text-xs text-primary font-medium hover:underline truncate">{merchant.email}</a>
          </div>
        )}
      </div>
    </div>
  );
}
