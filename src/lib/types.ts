/** Wochentag-Index: 0 = Montag … 6 = Sonntag (abweichend von JS' Date.getDay). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAY_LABELS: readonly string[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
export const WEEKDAY_LABELS_LONG: readonly string[] = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
];

/** Zeitplan einer Aufgabe: jeden Tag oder an ausgewählten Wochentagen. */
export type Schedule = { kind: 'daily' } | { kind: 'weekdays'; days: Weekday[] };

/** Kategorie-Id (frei wählbar). Metadaten in src/lib/categories.ts / im Store. */
export type CategoryId = string;

/** Vom Nutzer verwaltbare Kategorie. */
export interface CustomCategory {
  /** uuid/makeId; für Builtins stabil 'social' | 'leisure' | 'work'. */
  id: string;
  label: string;
  /** Kräftige Tag-Farbe (Hex, z. B. '#34C759'). */
  color: string;
  /** Heller Hintergrund (aus color abgeleitet, z. B. '#E3F8E9'). */
  soft: string;
  /** Vordefiniert: bearbeitbar, aber nicht löschbar. */
  builtin?: boolean;
}

/** Status einer Aufgabe an einem bestimmten Tag. 'open' ist der Default und wird nicht gespeichert. */
export type TaskStatus = 'open' | 'done' | 'ignored';

/** Wiederkehrende Aufgaben-Vorlage (Habit-Style). */
export interface TaskTemplate {
  id: string;
  title: string;
  schedule: Schedule;
  /** Sortierreihenfolge für Drag & Drop (aufsteigend). */
  order: number;
  /** ISO-Datum der Erstellung; die Aufgabe gilt erst ab diesem Tag. */
  createdAt: string;
  /** Optionale Kategorie. */
  category?: CategoryId;
  /** Optionale Freitext-Notizen. */
  notes?: string;
  archived?: boolean;
}

/** Datumsschlüssel im Format 'yyyy-MM-dd' (lexikografisch = chronologisch sortierbar). */
export type DateKey = string;

/**
 * Statuslog pro Tag. Nur Abweichungen vom Default 'open' werden gespeichert,
 * also nur 'done' und 'ignored'.
 */
export type DailyLog = Record<DateKey, Record<string /* taskId */, 'done' | 'ignored'>>;

/** Farbcodierung eines Tages basierend auf der Erfüllungsquote. */
export type DayColor = 'green' | 'yellow' | 'red' | 'none';

export interface DayStats {
  /** Anzahl aktiver Aufgaben an dem Tag. */
  total: number;
  done: number;
  ignored: number;
  /** total − ignored (zählt in die Quote). */
  counted: number;
  /** done / counted, oder null wenn nichts zählt. */
  rate: number | null;
}

export interface StreakInfo {
  current: number;
  longest: number;
}
