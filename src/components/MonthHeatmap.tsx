import { StyleSheet, Text, View } from 'react-native';

import { dayColor, dayColorHex } from '@/lib/completion';
import { daysOfMonth, toKey, todayKey, weekdayOf } from '@/lib/dates';
import { WEEKDAY_LABELS } from '@/lib/types';
import type { DailyLog, TaskTemplate } from '@/lib/types';
import { radius, spacing, useTheme, useThemedStyles, type Theme } from '@/theme';

interface Props {
  templates: TaskTemplate[];
  logs: DailyLog;
  openDates: string[];
}

export function MonthHeatmap({ templates, logs, openDates }: Props) {
  const styles = useThemedStyles(makeStyles);
  const today = todayKey();
  const days = daysOfMonth(today);
  const leadingBlanks = days.length > 0 ? weekdayOf(days[0]) : 0;

  const cells: ({ key: string; color: string; day: number; isToday: boolean } | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...days.map((date) => {
      const key = toKey(date);
      return {
        key,
        color: dayColorHex(dayColor(key, templates, logs, openDates)),
        day: date.getDate(),
        isToday: key === today,
      };
    }),
  ];

  return (
    <View>
      <View style={styles.weekHeader}>
        {WEEKDAY_LABELS.map((l) => (
          <Text key={l} style={styles.weekHeaderText}>
            {l}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((cell, i) =>
          cell === null ? (
            <View key={`blank-${i}`} style={styles.cell} />
          ) : (
            <View key={cell.key} style={styles.cell}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: cell.color },
                  cell.isToday && styles.dotToday,
                ]}>
                <Text style={styles.dayNum}>{cell.day}</Text>
              </View>
            </View>
          ),
        )}
      </View>
      <Legend />
    </View>
  );
}

function Legend() {
  const t = useTheme();
  const styles = useThemedStyles(makeStyles);
  const items: { color: string; label: string }[] = [
    { color: t.colors.green, label: 'Alles' },
    { color: t.colors.yellow, label: '≥ 50 %' },
    { color: t.colors.red, label: '< 50 %' },
    { color: t.colors.neutral, label: 'Frei' },
  ];
  return (
    <View style={styles.legend}>
      {items.map((it) => (
        <View key={it.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: it.color }]} />
          <Text style={styles.legendText}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

const COLUMN = `${100 / 7}%`;

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    weekHeader: { flexDirection: 'row', marginBottom: spacing.xs },
    weekHeaderText: {
      width: COLUMN,
      textAlign: 'center',
      ...t.typography.caption,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: {
      width: COLUMN,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
    },
    dot: {
      width: '100%',
      height: '100%',
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dotToday: { borderWidth: 2, borderColor: t.colors.text },
    dayNum: { fontSize: 11, fontWeight: '600', color: '#00000066' },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendDot: { width: 12, height: 12, borderRadius: 4, marginRight: spacing.xs },
    legendText: { ...t.typography.caption },
  });
