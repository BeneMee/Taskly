import { describe, expect, it } from '@jest/globals';

import { computeStreak, dayColor, dayStats, statusOf } from '../completion';
import type { DailyLog, TaskTemplate } from '../types';

const daily = (id: string, order = 0): TaskTemplate => ({
  id,
  title: id,
  schedule: { kind: 'daily' },
  order,
  createdAt: '2020-01-01T00:00:00.000Z',
});

describe('statusOf', () => {
  it('liefert open als Default', () => {
    expect(statusOf('2026-06-18', 'a', {})).toBe('open');
  });
  it('liefert gespeicherten Status', () => {
    const logs: DailyLog = { '2026-06-18': { a: 'done' } };
    expect(statusOf('2026-06-18', 'a', logs)).toBe('done');
  });
});

describe('dayStats', () => {
  const templates = [daily('a'), daily('b'), daily('c'), daily('d')];

  it('zählt erledigte, ignorierte und zählende Aufgaben', () => {
    const logs: DailyLog = { '2026-06-18': { a: 'done', b: 'done', c: 'ignored' } };
    const s = dayStats('2026-06-18', templates, logs);
    expect(s.total).toBe(4);
    expect(s.done).toBe(2);
    expect(s.ignored).toBe(1);
    expect(s.counted).toBe(3); // 4 - 1 ignoriert
    expect(s.rate).toBeCloseTo(2 / 3);
  });

  it('rate ist null, wenn alle ignoriert sind', () => {
    const all = [daily('a'), daily('b')];
    const logs: DailyLog = { '2026-06-18': { a: 'ignored', b: 'ignored' } };
    expect(dayStats('2026-06-18', all, logs).rate).toBeNull();
  });
});

describe('dayColor', () => {
  const templates = [daily('a'), daily('b'), daily('c'), daily('d')];
  const open = ['2026-06-18'];

  it('grün bei 100 %', () => {
    const logs: DailyLog = {
      '2026-06-18': { a: 'done', b: 'done', c: 'done', d: 'done' },
    };
    expect(dayColor('2026-06-18', templates, logs, open)).toBe('green');
  });

  it('grün, wenn Rest ignoriert und der Rest erledigt ist', () => {
    const logs: DailyLog = {
      '2026-06-18': { a: 'done', b: 'done', c: 'ignored', d: 'ignored' },
    };
    expect(dayColor('2026-06-18', templates, logs, open)).toBe('green');
  });

  it('gelb bei genau 50 %', () => {
    const logs: DailyLog = { '2026-06-18': { a: 'done', b: 'done' } };
    expect(dayColor('2026-06-18', templates, logs, open)).toBe('yellow');
  });

  it('rot, wenn eingeloggt aber < 50 %', () => {
    const logs: DailyLog = { '2026-06-18': { a: 'done' } };
    expect(dayColor('2026-06-18', templates, logs, open)).toBe('red');
  });

  it('rot, wenn nur eingeloggt (0 % erledigt)', () => {
    expect(dayColor('2026-06-18', templates, {}, open)).toBe('red');
  });

  it('none, wenn an dem Tag nicht eingeloggt und kein Eintrag', () => {
    expect(dayColor('2026-06-17', templates, {}, open)).toBe('none');
  });

  it('none, wenn keine Aufgaben aktiv sind', () => {
    expect(dayColor('2026-06-18', [], {}, open)).toBe('none');
  });
});

describe('computeStreak', () => {
  it('0 ohne Daten', () => {
    expect(computeStreak([], '2026-06-18')).toEqual({ current: 0, longest: 0 });
  });

  it('zählt aufeinanderfolgende Tage bis heute', () => {
    const open = ['2026-06-16', '2026-06-17', '2026-06-18'];
    expect(computeStreak(open, '2026-06-18')).toEqual({ current: 3, longest: 3 });
  });

  it('current bleibt, wenn heute noch nicht, aber gestern geöffnet wurde', () => {
    const open = ['2026-06-16', '2026-06-17'];
    expect(computeStreak(open, '2026-06-18').current).toBe(2);
  });

  it('current ist 0, wenn die letzte Öffnung älter als gestern ist', () => {
    const open = ['2026-06-10', '2026-06-11'];
    expect(computeStreak(open, '2026-06-18').current).toBe(0);
  });

  it('longest erkennt die längste Serie unabhängig von der aktuellen', () => {
    const open = [
      '2026-06-01',
      '2026-06-02',
      '2026-06-03',
      '2026-06-04', // Serie von 4
      '2026-06-17',
      '2026-06-18', // aktuelle Serie von 2
    ];
    const r = computeStreak(open, '2026-06-18');
    expect(r.current).toBe(2);
    expect(r.longest).toBe(4);
  });

  it('ignoriert Duplikate', () => {
    const open = ['2026-06-18', '2026-06-18', '2026-06-17'];
    expect(computeStreak(open, '2026-06-18')).toEqual({ current: 2, longest: 2 });
  });
});
