import { dayColorHex } from '@/lib/completion';

import { buildTheme, PALETTES } from '../themes';

const PALETTE_IDS = PALETTES.map((p) => p.id);

describe('PALETTES', () => {
  it('bietet genau 4 Paletten mit Label und Swatch', () => {
    expect(PALETTES).toHaveLength(4);
    for (const p of PALETTES) {
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.swatch).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('enthält die erwarteten IDs', () => {
    expect(PALETTE_IDS).toEqual(['indigo', 'teal', 'sunset', 'pink']);
  });
});

describe('buildTheme', () => {
  it('jede Palette hat einen eigenen Akzent', () => {
    const accents = PALETTE_IDS.map((id) => buildTheme(id, 'light').colors.accent);
    expect(new Set(accents).size).toBe(PALETTE_IDS.length);
  });

  it('Light und Dark unterscheiden sich bei Hintergrund und Text', () => {
    const light = buildTheme('indigo', 'light');
    const dark = buildTheme('indigo', 'dark');
    expect(light.colors.background).not.toBe(dark.colors.background);
    expect(light.colors.text).not.toBe(dark.colors.text);
    expect(light.mode).toBe('light');
    expect(dark.mode).toBe('dark');
  });

  it('Tagesfarben (grün/gelb/rot) sind in beiden Modi identisch', () => {
    for (const id of PALETTE_IDS) {
      const light = buildTheme(id, 'light').colors;
      const dark = buildTheme(id, 'dark').colors;
      expect(light.green).toBe(dark.green);
      expect(light.yellow).toBe(dark.yellow);
      expect(light.red).toBe(dark.red);
    }
  });

  it('Tagesfarben sind deckungsgleich mit completion.dayColorHex', () => {
    const { colors } = buildTheme('indigo', 'light');
    expect(colors.green).toBe(dayColorHex('green'));
    expect(colors.yellow).toBe(dayColorHex('yellow'));
    expect(colors.red).toBe(dayColorHex('red'));
    expect(colors.neutral).toBe(dayColorHex('none'));
  });

  it('Typografie übernimmt die Textfarbe des Modus', () => {
    const dark = buildTheme('teal', 'dark');
    expect(dark.typography.title.color).toBe(dark.colors.text);
  });

  it('liefert konstante spacing/radius', () => {
    const theme = buildTheme('pink', 'dark');
    expect(theme.spacing.lg).toBe(16);
    expect(theme.radius.pill).toBe(999);
  });
});
