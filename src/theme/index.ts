/**
 * Zentrales Theme-API.
 * - Konstanten (`spacing`, `radius`) sind theme-unabhängig und direkt importierbar.
 * - Farben/Typografie/Schatten sind paletten-/modus-abhängig und kommen zur
 *   Laufzeit über `useTheme()` bzw. `useThemedStyles()`.
 */

export { spacing, radius, buildTheme, PALETTES } from './themes';
export type { Theme, ThemeColors, ThemeMode, PaletteId, Typography, Shadow } from './themes';
export { ThemeProvider, useTheme, useThemedStyles } from './ThemeProvider';
