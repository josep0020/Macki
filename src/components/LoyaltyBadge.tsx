import { getLoyaltyState, getLevelConfig } from '../utils/loyalty';
import { Sprout, Leaf, TreePine, Flame, Star } from 'lucide-react';
import type { LoyaltyLevel } from '../types';

interface LoyaltyBadgeProps {
  className?: string;
}

export function getLevelIcon(level: LoyaltyLevel, className?: string) {
  switch (level) {
    case 'semilla':
      return <Sprout className={className} />;
    case 'brote':
      return <Leaf className={className} />;
    case 'roble':
      return <TreePine className={className} />;
    case 'fuego':
      return <Flame className={className} />;
    default:
      return <Star className={className} />;
  }
}

export function LoyaltyBadge({ className = '' }: LoyaltyBadgeProps) {
  const state = getLoyaltyState();
  const config = getLevelConfig(state.currentLevel);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${className}`}
      style={{
        backgroundColor: `${config.color}18`,
        color: config.color,
      }}
    >
      {getLevelIcon(state.currentLevel, 'w-3.5 h-3.5 fill-current')}
      <span>{state.totalPoints} pts</span>
    </span>
  );
}
