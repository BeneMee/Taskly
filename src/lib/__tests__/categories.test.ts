import { describe, expect, it } from '@jest/globals';

import { CATEGORIES, getCategory } from '../categories';

describe('categories', () => {
  it('hat genau Social, Leisure und Work', () => {
    expect(CATEGORIES.map((c) => c.id)).toEqual(['social', 'leisure', 'work']);
  });

  it('getCategory liefert Metadaten zu einer Id', () => {
    expect(getCategory('social')?.label).toBe('Social');
    expect(getCategory('work')?.label).toBe('Work');
  });

  it('getCategory liefert undefined ohne/bei fehlender Id', () => {
    expect(getCategory(undefined)).toBeUndefined();
    expect(getCategory(null)).toBeUndefined();
  });
});
