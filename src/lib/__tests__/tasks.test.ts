import { describe, expect, it } from '@jest/globals';

import { activeTemplatesFor, scheduleMatches } from '../tasks';
import { weekdayOf } from '../dates';
import type { TaskTemplate } from '../types';

// 2026-06-18 ist ein Donnerstag → Weekday 3 (Mo=0).
const THURSDAY = '2026-06-18';

const make = (over: Partial<TaskTemplate>): TaskTemplate => ({
  id: 'x',
  title: 'x',
  schedule: { kind: 'daily' },
  order: 0,
  createdAt: '2020-01-01T00:00:00.000Z',
  ...over,
});

describe('weekdayOf', () => {
  it('Montag = 0, Donnerstag = 3, Sonntag = 6', () => {
    expect(weekdayOf('2026-06-15')).toBe(0); // Montag
    expect(weekdayOf('2026-06-18')).toBe(3); // Donnerstag
    expect(weekdayOf('2026-06-21')).toBe(6); // Sonntag
  });
});

describe('scheduleMatches', () => {
  it('daily passt immer', () => {
    expect(scheduleMatches({ kind: 'daily' }, 3)).toBe(true);
  });
  it('weekdays passt nur an gelisteten Tagen', () => {
    expect(scheduleMatches({ kind: 'weekdays', days: [0, 2, 4] }, 3)).toBe(false);
    expect(scheduleMatches({ kind: 'weekdays', days: [0, 2, 3] }, 3)).toBe(true);
  });
});

describe('activeTemplatesFor', () => {
  it('liefert tägliche Aufgaben', () => {
    const t = [make({ id: 'a' })];
    expect(activeTemplatesFor(THURSDAY, t).map((x) => x.id)).toEqual(['a']);
  });

  it('filtert Wochentage korrekt (Donnerstag = 3)', () => {
    const t = [
      make({ id: 'thu', schedule: { kind: 'weekdays', days: [3] } }),
      make({ id: 'mon', schedule: { kind: 'weekdays', days: [0] } }),
    ];
    expect(activeTemplatesFor(THURSDAY, t).map((x) => x.id)).toEqual(['thu']);
  });

  it('blendet archivierte Aufgaben aus', () => {
    const t = [make({ id: 'a', archived: true })];
    expect(activeTemplatesFor(THURSDAY, t)).toHaveLength(0);
  });

  it('blendet Aufgaben aus, die nach dem Tag erstellt wurden', () => {
    const t = [make({ id: 'future', createdAt: '2026-06-19T10:00:00.000Z' })];
    expect(activeTemplatesFor(THURSDAY, t)).toHaveLength(0);
  });

  it('sortiert nach order', () => {
    const t = [
      make({ id: 'b', order: 2 }),
      make({ id: 'a', order: 1 }),
      make({ id: 'c', order: 3 }),
    ];
    expect(activeTemplatesFor(THURSDAY, t).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });
});
