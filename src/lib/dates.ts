import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type { DateKey, Weekday } from './types';

/** Wandelt ein Date in einen lokalen Datumsschlüssel 'yyyy-MM-dd'. */
export function toKey(date: Date): DateKey {
  return format(date, 'yyyy-MM-dd');
}

/** Parst einen Datumsschlüssel zurück in ein Date (lokale Mitternacht). */
export function fromKey(key: DateKey): Date {
  return parseISO(key);
}

/** Datumsschlüssel für heute. */
export function todayKey(): DateKey {
  return toKey(new Date());
}

/**
 * Wochentag-Index mit Montag = 0 … Sonntag = 6.
 * (JS' getDay liefert Sonntag = 0; hier konvertiert.)
 */
export function weekdayOf(input: Date | DateKey): Weekday {
  const date = typeof input === 'string' ? fromKey(input) : input;
  return ((getDay(date) + 6) % 7) as Weekday;
}

/** Die sieben Tage (Mo–So) der Woche, in der `input` liegt. */
export function daysOfWeek(input: Date | DateKey): Date[] {
  const date = typeof input === 'string' ? fromKey(input) : input;
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/** Alle Tage des Monats, in dem `input` liegt. */
export function daysOfMonth(input: Date | DateKey): Date[] {
  const date = typeof input === 'string' ? fromKey(input) : input;
  return eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });
}
