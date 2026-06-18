/**
 * Liefert das aktive Theme (Palette + Modus aus dem Store) über React-Context.
 * `useThemedStyles` baut StyleSheets memoisiert je Theme — so läuft
 * StyleSheet.create nur bei Theme-Wechsel, nicht bei jedem Render.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useTaskStore } from '@/store/useTaskStore';

import { buildTheme, type Theme } from './themes';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const palette = useTaskStore((s) => s.settings.palette);
  const mode = useTaskStore((s) => s.settings.mode);
  const theme = useMemo(() => buildTheme(palette, mode), [palette, mode]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme muss innerhalb von <ThemeProvider> verwendet werden.');
  }
  return theme;
}

/** Memoisiert ein StyleSheet anhand des aktiven Themes. */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}
