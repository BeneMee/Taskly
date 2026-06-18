import { toKey, weekdayOf } from './dates';
import { WEEKDAY_LABELS } from './types';
import type { DateKey, Schedule, TaskTemplate, Weekday } from './types';

/** Menschlich lesbare Beschreibung eines Zeitplans, z. B. "Täglich" oder "Mo, Mi, Fr". */
export function scheduleLabel(schedule: Schedule): string {
  if (schedule.kind === 'daily') return 'Täglich';
  if (schedule.days.length === 0) return 'Keine Tage';
  if (schedule.days.length === 7) return 'Täglich';
  return [...schedule.days]
    .sort((a, b) => a - b)
    .map((d) => WEEKDAY_LABELS[d])
    .join(', ');
}

/** Prüft, ob ein Zeitplan an einem bestimmten Wochentag aktiv ist. */
export function scheduleMatches(schedule: Schedule, weekday: Weekday): boolean {
  if (schedule.kind === 'daily') return true;
  return schedule.days.includes(weekday);
}

/** Datumsschlüssel des Erstelldatums einer Vorlage (nur der Tag). */
function createdKey(template: TaskTemplate): DateKey {
  // createdAt ist ISO; der Tagesanteil reicht für den lexikografischen Vergleich.
  return toKey(new Date(template.createdAt));
}

/**
 * Liefert alle Vorlagen, die an `dateKey` aktiv sind:
 * nicht archiviert, am/vor dem Tag erstellt und passend zum Wochentag.
 * Sortiert nach `order` (aufsteigend), dann nach Titel.
 */
export function activeTemplatesFor(
  dateKey: DateKey,
  templates: TaskTemplate[],
): TaskTemplate[] {
  const weekday = weekdayOf(dateKey);
  return templates
    .filter((t) => !t.archived)
    .filter((t) => createdKey(t) <= dateKey)
    .filter((t) => scheduleMatches(t.schedule, weekday))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
