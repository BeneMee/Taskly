import { StyleSheet, Text, View } from 'react-native';

import { dayColor, dayColorHex, dayStats } from '@/lib/completion';
import { daysOfWeek, toKey, todayKey } from '@/lib/dates';
import { WEEKDAY_LABELS } from '@/lib/types';
import type { DailyLog, TaskTemplate } from '@/lib/types';
import { colors, radius, spacing, typography } from '@/theme';

interface Props {
  templates: TaskTemplate[];
  logs: DailyLog;
  openDates: string[];
}

const MAX_BAR_HEIGHT = 120;

export function WeekChart({ templates, logs, openDates }: Props) {
  const today = todayKey();
  const days = daysOfWeek(today);
  const data = days.map((date, i) => {
    const key = toKey(date);
    const stats = dayStats(key, templates, logs);
    return {
      key,
      label: WEEKDAY_LABELS[i],
      done: stats.done,
      color: dayColorHex(dayColor(key, templates, logs, openDates)),
      isToday: key === today,
    };
  });
  const maxDone = Math.max(1, ...data.map((d) => d.done));

  return (
    <View style={styles.container}>
      {data.map((d) => {
        const height = d.done > 0 ? Math.max(6, (d.done / maxDone) * MAX_BAR_HEIGHT) : 4;
        return (
          <View key={d.key} style={styles.column}>
            <Text style={styles.value}>{d.done > 0 ? d.done : ''}</Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.bar,
                  { height, backgroundColor: d.done > 0 ? d.color : colors.neutral },
                ]}
              />
            </View>
            <Text style={[styles.label, d.isToday && styles.labelToday]}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_BAR_HEIGHT + 48,
  },
  column: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  track: { justifyContent: 'flex-end', height: MAX_BAR_HEIGHT },
  bar: { width: 22, borderRadius: radius.sm },
  value: { ...typography.caption, marginBottom: spacing.xs, height: 16 },
  label: { ...typography.caption, marginTop: spacing.sm },
  labelToday: { color: colors.accent, fontWeight: '800' },
});
