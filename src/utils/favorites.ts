const STORAGE_KEY = 'maule-lena-favorites';

export function getFavorites(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function toggleFavorite(productId: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(productId);
  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return false; // removed
  }
  favorites.push(productId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return true; // added
}

export function isFavorite(productId: string): boolean {
  return getFavorites().includes(productId);
}
