import type { CategoryId, CustomCategory } from './types';

/**
 * Vordefinierte Kategorien. Farben bewusst als Hex hier gehalten (lib bleibt
 * theme-unabhängig). Hinweis: Die Farben überschneiden sich mit den Tagesfarben
 * (Streak/Statistik) — deshalb tragen die Kategorie-Pills immer auch ihr Textlabel.
 */
export const DEFAULT_CATEGORIES: readonly CustomCategory[] = [
  { id: 'social', label: 'Social', color: '#34C759', soft: '#E3F8E9', builtin: true },
  { id: 'leisure', label: 'Leisure', color: '#E0A800', soft: '#FFF6D6', builtin: true },
  { id: 'work', label: 'Work', color: '#FF3B30', soft: '#FFE5E3', builtin: true },
];

/** Auswahlpalette für neue Kategorien (kräftige Hex-Farben). */
export const CATEGORY_COLORS: readonly string[] = [
  '#34C759', // grün
  '#E0A800', // gelb
  '#FF3B30', // rot
  '#5B6CFF', // indigo
  '#0EA5E9', // himmelblau
  '#AF52DE', // violett
  '#FF9500', // orange
  '#FF2D78', // pink
  '#14B8A6', // teal
  '#8E8E93', // grau
];

/** Liefert die Kategorie-Metadaten zu einer Id aus der übergebenen Liste. */
export function getCategoryFrom(
  list: readonly CustomCategory[],
  id?: CategoryId | null,
): CustomCategory | undefined {
  if (!id) return undefined;
  return list.find((c) => c.id === id);
}

/**
 * Leitet die helle `soft`-Hintergrundfarbe aus einer Hauptfarbe ab:
 * die Farbe wird bei ~15% Deckkraft über Weiß gelegt.
 */
export function softFromColor(hex: string): string {
  const clean = hex.replace(/^#/, '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const alpha = 0.15;
  const mix = (channel: number) => Math.round(channel * alpha + 255 * (1 - alpha));
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}
