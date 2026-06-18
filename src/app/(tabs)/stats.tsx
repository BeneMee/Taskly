import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MonthHeatmap } from '@/components/MonthHeatmap';
import { StreakBadge } from '@/components/StreakBadge';
import { WeekChart } from '@/components/WeekChart';
import { computeStreak, dayColor, dayStats } from '@/lib/completion';
import { daysOfMonth, daysOfWeek, toKey, todayKey } from '@/lib/dates';
import { useTaskStore } from '@/store/useTaskStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const templates = useTaskStore((s) => s.templates);
  const logs = useTaskStore((s) => s.logs);
  const openDates = useTaskStore((s) => s.openDates);

  const today = todayKey();
  const streak = computeStreak(openDates, today);
  const todayColor = dayColor(today, templates, logs, openDates);

  const weekDone = daysOfWeek(today).reduce(
    (sum, d) => sum + dayStats(toKey(d), templates, logs).done,
    0,
  );
  const monthDone = daysOfMonth(today).reduce(
    (sum, d) => sum + dayStats(toKey(d), templates, logs).done,
    0,
  );
  const monthLabel = format(new Date(), 'MMMM yyyy', { locale: de });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.heading}>Statistik</Text>

      <StreakBadge
        current={streak.current}
        longest={streak.longest}
        todayColor={todayColor}
      />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Diese Woche</Text>
          <Text style={styles.cardBadge}>{weekDone} erledigt</Text>
        </View>
        <WeekChart templates={templates} logs={logs} openDates={openDates} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{monthLabel}</Text>
          <Text style={styles.cardBadge}>{monthDone} erledigt</Text>
        </View>
        <MonthHeatmap templates={templates} logs={logs} openDates={openDates} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  heading: { ...typography.title, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: { ...typography.heading, textTransform: 'capitalize' },
  cardBadge: { ...typography.label, color: colors.accent },
});
