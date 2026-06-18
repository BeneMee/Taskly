import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReorderableList, {
  reorderItems,
  type ReorderableListReorderEvent,
} from 'react-native-reorderable-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { StreakBadge } from '@/components/StreakBadge';
import { TaskRow } from '@/components/TaskRow';
import { computeStreak, dayColor, dayStats, statusOf } from '@/lib/completion';
import { todayKey } from '@/lib/dates';
import { activeTemplatesFor } from '@/lib/tasks';
import type { Schedule, TaskStatus } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

interface Row {
  id: string;
  title: string;
  schedule: Schedule;
  status: TaskStatus;
}

export default function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const templates = useTaskStore((s) => s.templates);
  const logs = useTaskStore((s) => s.logs);
  const openDates = useTaskStore((s) => s.openDates);
  const setStatus = useTaskStore((s) => s.setStatus);
  const reorder = useTaskStore((s) => s.reorder);

  const today = todayKey();
  const active = activeTemplatesFor(today, templates);
  const rows: Row[] = active.map((t) => ({
    id: t.id,
    title: t.title,
    schedule: t.schedule,
    status: statusOf(today, t.id, logs),
  }));

  const streak = computeStreak(openDates, today);
  const todayColor = dayColor(today, templates, logs, openDates);
  const stats = dayStats(today, templates, logs);

  const handleReorder = useCallback(
    ({ from, to }: ReorderableListReorderEvent) => {
      const ids = reorderItems(rows, from, to).map((r) => r.id);
      reorder(ids);
    },
    [rows, reorder],
  );

  const renderItem = useCallback(
    ({ item }: { item: Row }) => (
      <TaskRow
        title={item.title}
        schedule={item.schedule}
        status={item.status}
        onToggleDone={() =>
          setStatus(today, item.id, item.status === 'done' ? 'open' : 'done')
        }
        onToggleIgnore={() =>
          setStatus(today, item.id, item.status === 'ignored' ? 'open' : 'ignored')
        }
      />
    ),
    [setStatus, today],
  );

  const dateLabel = format(new Date(), 'EEEE, d. MMMM', { locale: de });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ReorderableList
        data={rows}
        keyExtractor={(r) => r.id}
        onReorder={handleReorder}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.date}>{dateLabel}</Text>
            <Text style={styles.title}>Heute</Text>
            <StreakBadge
              current={streak.current}
              longest={streak.longest}
              todayColor={todayColor}
            />
            {stats.total > 0 && (
              <View style={styles.progressCard}>
                <Text style={styles.progressText}>
                  {stats.counted > 0
                    ? `${stats.done} von ${stats.counted} erledigt`
                    : 'Heute alles ignoriert'}
                </Text>
                {stats.ignored > 0 && (
                  <Text style={styles.progressSub}>{stats.ignored} ignoriert</Text>
                )}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="sunny-outline"
            title="Keine Aufgaben für heute"
            subtitle="Tippe auf +, um eine Aufgabe zu erstellen."
          />
        }
      />

      <Pressable
        style={[styles.fab, { bottom: spacing.lg }]}
        onPress={() => router.push('/task/new')}>
        <Ionicons name="add" size={32} color={colors.onAccent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: 120 },
  date: { ...typography.label, color: colors.textSecondary, textTransform: 'capitalize' },
  title: { ...typography.title, marginBottom: spacing.lg },
  progressCard: {
    marginTop: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  progressText: { ...typography.label, color: colors.accent },
  progressSub: { ...typography.caption, marginTop: 2 },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
    shadowOpacity: 0.2,
  },
});
