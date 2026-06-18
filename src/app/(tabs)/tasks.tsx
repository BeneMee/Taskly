import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryTag } from '@/components/CategoryTag';
import { EmptyState } from '@/components/EmptyState';
import { scheduleLabel } from '@/lib/tasks';
import type { TaskTemplate } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

export default function TasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const templates = useTaskStore((s) => s.templates);

  const sorted = [...templates].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  );

  const renderItem = ({ item }: { item: TaskTemplate }) => (
    <Pressable style={styles.card} onPress={() => router.push(`/task/${item.id}`)}>
      <View style={styles.iconCircle}>
        <Ionicons
          name={item.schedule.kind === 'daily' ? 'repeat' : 'calendar-outline'}
          size={18}
          color={colors.accent}
        />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.schedule}>{scheduleLabel(item.schedule)}</Text>
          <CategoryTag category={item.category} />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={sorted}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.heading}>Aufgaben</Text>}
        ListEmptyComponent={
          <EmptyState
            icon="list-outline"
            title="Noch keine Aufgaben"
            subtitle="Erstelle deine erste wiederkehrende Aufgabe."
          />
        }
      />
      <Pressable style={styles.fab} onPress={() => router.push('/task/new')}>
        <Ionicons name="add" size={32} color={colors.onAccent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: 120 },
  heading: { ...typography.title, marginBottom: spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textBlock: { flex: 1 },
  title: { ...typography.body },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: spacing.sm },
  schedule: { ...typography.caption },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
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
