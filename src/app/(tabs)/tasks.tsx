import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryTag } from '@/components/CategoryTag';
import { EmptyState } from '@/components/EmptyState';
import { scheduleLabel } from '@/lib/tasks';
import type { TaskTemplate } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { radius, spacing, useTheme, useThemedStyles, type Theme } from '@/theme';

export default function TasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const styles = useThemedStyles(makeStyles);
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
          color={t.colors.accent}
        />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.schedule}>{scheduleLabel(item.schedule)}</Text>
          <CategoryTag category={item.category} />
          {!!item.notes && (
            <Ionicons name="document-text-outline" size={14} color={t.colors.textMuted} />
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={t.colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={sorted}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.heading}>Aufgaben</Text>
            <Pressable
              style={styles.headerButton}
              hitSlop={8}
              onPress={() => router.push('/category/list')}>
              <Ionicons name="pricetags-outline" size={22} color={t.colors.accent} />
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="list-outline"
            title="Noch keine Aufgaben"
            subtitle="Erstelle deine erste wiederkehrende Aufgabe."
          />
        }
      />
      <Pressable style={styles.fab} onPress={() => router.push('/task/new')}>
        <Ionicons name="add" size={32} color={t.colors.onAccent} />
      </Pressable>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: t.colors.background },
    listContent: { padding: spacing.lg, paddingBottom: 120 },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    heading: { ...t.typography.title },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: t.colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...t.shadow.card,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: t.colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    textBlock: { flex: 1 },
    title: { ...t.typography.body },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: spacing.sm },
    schedule: { ...t.typography.caption },
    fab: {
      position: 'absolute',
      right: spacing.lg,
      bottom: spacing.lg,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: t.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      ...t.shadow.card,
      shadowOpacity: 0.2,
    },
  });
