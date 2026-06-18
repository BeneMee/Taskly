/**
 * Zentrales Light-Theme — freundlich, hell, abgerundet.
 * Plattformunabhängig (nur Werte), damit es auch im Web-Export funktioniert.
 */

export const colors = {
  // Hintergründe
  background: '#F6F7F9',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F5',

  // Text
  text: '#1B1F24',
  textSecondary: '#6B7280',
  textMuted: '#9AA1AC',

  // Akzent (freundliches Indigo/Blau)
  accent: '#5B6CFF',
  accentSoft: '#E8EAFF',
  onAccent: '#FFFFFF',

  // Status-/Tagesfarben (deckungsgleich mit completion.dayColorHex)
  green: '#34C759',
  greenSoft: '#E3F8E9',
  yellow: '#FFCC00',
  yellowSoft: '#FFF6D6',
  red: '#FF3B30',
  redSoft: '#FFE5E3',
  neutral: '#E2E5EA',

  // Linien & Schatten
  border: '#E6E9EE',
  shadow: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '800' as const, color: colors.text },
  heading: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 16, fontWeight: '500' as const, color: colors.text },
  label: { fontSize: 14, fontWeight: '600' as const, color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textMuted },
} as const;

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
