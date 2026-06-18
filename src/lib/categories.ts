import type { CategoryId } from './types';

export interface Category {
  id: CategoryId;
  label: string;
  /** Kräftige Tag-Farbe. */
  color: string;
  /** Heller Hintergrund für das Pill. */
  soft: string;
}

/**
 * Feste Kategorien. Farben bewusst als Hex hier gehalten (lib bleibt theme-unabhängig).
 * Hinweis: Die Farben überschneiden sich mit den Tagesfarben (Streak/Statistik) —
 * deshalb tragen die Kategorie-Pills immer auch ihr Textlabel.
 */
export const CATEGORIES: readonly Category[] = [
  { id: 'social', label: 'Social', color: '#34C759', soft: '#E3F8E9' },
  { id: 'leisure', label: 'Leisure', color: '#E0A800', soft: '#FFF6D6' },
  { id: 'work', label: 'Work', color: '#FF3B30', soft: '#FFE5E3' },
];

const BY_ID: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CategoryId, Category>,
);

/** Liefert die Kategorie-Metadaten zu einer Id (oder undefined, wenn keine/ungültig). */
export function getCategory(id?: CategoryId | null): Category | undefined {
  return id ? BY_ID[id] : undefined;
}
