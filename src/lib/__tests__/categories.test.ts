import { describe, expect, it } from '@jest/globals';

import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORIES,
  getCategoryFrom,
  softFromColor,
} from '../categories';

describe('categories', () => {
  it('Defaults sind genau Social, Leisure und Work und builtin', () => {
    expect(DEFAULT_CATEGORIES.map((c) => c.id)).toEqual(['social', 'leisure', 'work']);
    expect(DEFAULT_CATEGORIES.every((c) => c.builtin === true)).toBe(true);
  });

  it('getCategoryFrom liefert Metadaten zu einer Id aus der Liste', () => {
    expect(getCategoryFrom(DEFAULT_CATEGORIES, 'social')?.label).toBe('Social');
    expect(getCategoryFrom(DEFAULT_CATEGORIES, 'work')?.label).toBe('Work');
  });

  it('getCategoryFrom liefert undefined ohne/bei fehlender Id', () => {
    expect(getCategoryFrom(DEFAULT_CATEGORIES, undefined)).toBeUndefined();
    expect(getCategoryFrom(DEFAULT_CATEGORIES, null)).toBeUndefined();
    expect(getCategoryFrom(DEFAULT_CATEGORIES, 'gibtsnicht')).toBeUndefined();
  });

  it('CATEGORY_COLORS bietet mindestens 8 gültige Hex-Farben', () => {
    expect(CATEGORY_COLORS.length).toBeGreaterThanOrEqual(8);
    expect(CATEGORY_COLORS.every((c) => /^#[0-9A-Fa-f]{6}$/.test(c))).toBe(true);
  });

  describe('softFromColor', () => {
    it('liefert eine gültige 6-stellige Hex-Farbe', () => {
      expect(softFromColor('#34C759')).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('mischt mit Weiß auf (Ergebnis heller als Original)', () => {
      // Schwarz bei 15% Deckkraft auf Weiß ≈ #D9D9D9 (217)
      expect(softFromColor('#000000')).toBe('#D9D9D9');
    });

    it('Weiß bleibt Weiß', () => {
      expect(softFromColor('#FFFFFF')).toBe('#FFFFFF');
    });

    it('akzeptiert Hex ohne führendes #', () => {
      expect(softFromColor('000000')).toBe('#D9D9D9');
    });
  });
});
