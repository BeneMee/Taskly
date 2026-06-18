/**
 * Theme-Modell: 4 Akzent-Paletten × Light/Dark.
 * Reine Werte/Funktionen (kein React, keine Plattform-APIs) → unit-testbar
 * und Web-Export-tauglich. `buildTheme` setzt aus Palette + Modus ein
 * vollständiges Theme zusammen.
 */

import type { TextStyle, ViewStyle } from 'react-native';

export type PaletteId = 'indigo' | 'teal' | 'sunset' | 'pink';
export type ThemeMode = 'light' | 'dark';

/** Konstante, theme-unabhängige Abstände. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Konstante, theme-unabhängige Eckradien. */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export interface ThemeColors {
  // Hintergründe
  background: string;
  surface: string;
  surfaceAlt: string;
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  // Akzent (paletten-abhängig)
  accent: string;
  accentSoft: string;
  onAccent: string;
  // Status-/Tagesfarben (in beiden Modi fix, deckungsgleich mit completion.dayColorHex)
  green: string;
  greenSoft: string;
  yellow: string;
  yellowSoft: string;
  red: string;
  redSoft: string;
  neutral: string;
  // Linien & Schatten
  border: string;
  shadow: string;
}

type TextToken = Pick<TextStyle, 'fontSize' | 'fontWeight' | 'color'>;

export interface Typography {
  title: TextToken;
  heading: TextToken;
  body: TextToken;
  label: TextToken;
  caption: TextToken;
}

export interface Shadow {
  card: ViewStyle;
}

export interface Theme {
  mode: ThemeMode;
  palette: PaletteId;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: Typography;
  shadow: Shadow;
}

// --- Neutrale Farbsätze (Light/Dark) ----------------------------------------

const lightNeutrals = {
  background: '#F6F7F9',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F5',
  text: '#1B1F24',
  textSecondary: '#6B7280',
  textMuted: '#9AA1AC',
  border: '#E6E9EE',
  shadow: '#000000',
} as const;

const darkNeutrals = {
  background: '#0F1115',
  surface: '#1A1D23',
  surfaceAlt: '#23272F',
  text: '#F2F4F7',
  textSecondary: '#A6ADBA',
  textMuted: '#6B7280',
  border: '#2A2F38',
  shadow: '#000000',
} as const;

// --- Tagesfarben (in beiden Modi identisch) ---------------------------------

const dayColors = {
  green: '#34C759',
  greenSoft: '#E3F8E9',
  yellow: '#FFCC00',
  yellowSoft: '#FFF6D6',
  red: '#FF3B30',
  redSoft: '#FFE5E3',
  // Hält Wert von dayColorHex('none') → Heatmap-Dots und Legende bleiben konsistent.
  neutral: '#E2E5EA',
} as const;

// --- Akzent-Paletten (accent + soft für Light/Dark) -------------------------

interface AccentSet {
  accent: string;
  softLight: string;
  softDark: string;
  onAccent: string;
}

const accents: Record<PaletteId, AccentSet> = {
  indigo: { accent: '#5B6CFF', softLight: '#E8EAFF', softDark: '#232A4D', onAccent: '#FFFFFF' },
  teal: { accent: '#14B8A6', softLight: '#D9F5F1', softDark: '#0E3B36', onAccent: '#FFFFFF' },
  sunset: { accent: '#F97316', softLight: '#FFE9D6', softDark: '#3A2410', onAccent: '#FFFFFF' },
  pink: { accent: '#EC4899', softLight: '#FCE2F0', softDark: '#3D1730', onAccent: '#FFFFFF' },
};

/** Auswahl-Metadaten für den Theme-Picker (UI). */
export const PALETTES: { id: PaletteId; label: string; swatch: string }[] = [
  { id: 'indigo', label: 'Indigo', swatch: accents.indigo.accent },
  { id: 'teal', label: 'Türkis', swatch: accents.teal.accent },
  { id: 'sunset', label: 'Sonnenuntergang', swatch: accents.sunset.accent },
  { id: 'pink', label: 'Pink', swatch: accents.pink.accent },
];

function makeTypography(c: ThemeColors): Typography {
  return {
    title: { fontSize: 28, fontWeight: '800', color: c.text },
    heading: { fontSize: 20, fontWeight: '700', color: c.text },
    body: { fontSize: 16, fontWeight: '500', color: c.text },
    label: { fontSize: 14, fontWeight: '600', color: c.textSecondary },
    caption: { fontSize: 12, fontWeight: '500', color: c.textMuted },
  };
}

/** Setzt aus Palette + Modus ein vollständiges Theme zusammen. */
export function buildTheme(palette: PaletteId, mode: ThemeMode): Theme {
  const neutrals = mode === 'dark' ? darkNeutrals : lightNeutrals;
  const a = accents[palette];
  const colors: ThemeColors = {
    ...neutrals,
    ...dayColors,
    accent: a.accent,
    accentSoft: mode === 'dark' ? a.softDark : a.softLight,
    onAccent: a.onAccent,
  };
  return {
    mode,
    palette,
    colors,
    spacing,
    radius,
    typography: makeTypography(colors),
    shadow: {
      card: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      },
    },
  };
}
