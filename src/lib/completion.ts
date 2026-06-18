import { differenceInCalendarDays, subDays } from 'date-fns';

import { fromKey, toKey, todayKey } from './dates';
import { activeTemplatesFor } from './tasks';
import type {
  DateKey,
  DailyLog,
  DayColor,
  DayStats,
  StreakInfo,
  TaskStatus,
  TaskTemplate,
} from './types';

/** Schwellwerte der Tagesfarbe. Leicht anpassbar. */
export const GREEN_THRESHOLD = 1; // 100 %
export const YELLOW_THRESHOLD = 0.5; // 50 %

/** Status einer Aufgabe an einem Tag. Default 'open'. */
export function statusOf(dateKey: DateKey, taskId: string, logs: DailyLog): TaskStatus {
  return logs[dateKey]?.[taskId] ?? 'open';
}

/** Aggregierte Kennzahlen eines Tages über die an dem Tag aktiven Aufgaben. */
export function dayStats(
  dateKey: DateKey,
  templates: TaskTemplate[],
  logs: DailyLog,
): DayStats {
  const active = activeTemplatesFor(dateKey, templates);
  const dayLog = logs[dateKey] ?? {};
  let done = 0;
  let ignored = 0;
  for (const t of active) {
    const s = dayLog[t.id];
    if (s === 'done') done += 1;
    else if (s === 'ignored') ignored += 1;
  }
  const total = active.length;
  const counted = total - ignored;
  const rate = counted > 0 ? done / counted : null;
  return { total, done, ignored, counted, rate };
}

/**
 * Farbcodierung eines Tages:
 * - grün: alle zählenden Aufgaben erledigt (100 %)
 * - gelb: ≥ 50 % erledigt
 * - rot: an dem Tag aktiv (eingeloggt oder mit Eintrag), aber < 50 %
 * - none: nicht aktiv / keine zählenden Aufgaben
 */
export function dayColor(
  dateKey: DateKey,
  templates: TaskTemplate[],
  logs: DailyLog,
  openDates: DateKey[],
): DayColor {
  const hasLog = !!logs[dateKey] && Object.keys(logs[dateKey]).length > 0;
  const engaged = openDates.includes(dateKey) || hasLog;
  if (!engaged) return 'none';

  const stats = dayStats(dateKey, templates, logs);
  if (stats.counted === 0 || stats.rate === null) return 'none';

  if (stats.rate >= GREEN_THRESHOLD) return 'green';
  if (stats.rate >= YELLOW_THRESHOLD) return 'yellow';
  return 'red';
}

/**
 * Berechnet den Login-Streak aus den Tagen, an denen die App geöffnet wurde.
 * - current: aufeinanderfolgende Tage bis heute (oder bis gestern, falls heute noch nicht geöffnet).
 * - longest: längste aufeinanderfolgende Serie überhaupt.
 */
export function computeStreak(
  openDates: DateKey[],
  today: DateKey = todayKey(),
): StreakInfo {
  if (openDates.length === 0) return { current: 0, longest: 0 };

  const set = new Set(openDates);
  const sorted = [...set].sort();

  // Längste Serie
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of sorted) {
    const d = fromKey(key);
    if (prev && differenceInCalendarDays(d, prev) === 1) run += 1;
    else run = 1;
    longest = Math.max(longest, run);
    prev = d;
  }

  // Aktuelle Serie: Anker ist heute, sonst gestern, sonst gebrochen.
  let anchor: Date | null = null;
  if (set.has(today)) anchor = fromKey(today);
  else {
    const yesterday = toKey(subDays(fromKey(today), 1));
    if (set.has(yesterday)) anchor = fromKey(yesterday);
  }
  if (!anchor) return { current: 0, longest };

  let current = 0;
  let cursor = anchor;
  while (set.has(toKey(cursor))) {
    current += 1;
    cursor = subDays(cursor, 1);
  }

  return { current, longest };
}

/** Mappt eine Tagesfarbe auf einen Hex-Wert (für Diagramme). Theme-unabhängig gehalten. */
export function dayColorHex(color: DayColor): string {
  switch (color) {
    case 'green':
      return '#34C759';
    case 'yellow':
      return '#FFCC00';
    case 'red':
      return '#FF3B30';
    default:
      return '#E2E5EA';
  }
}
