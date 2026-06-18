import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useReorderableDrag } from 'react-native-reorderable-list';

import { scheduleLabel } from '@/lib/tasks';
import type { CategoryId, Schedule, TaskStatus } from '@/lib/types';
import { radius, spacing, useTheme, useThemedStyles, type Theme } from '@/theme';

import { CategoryTag } from './CategoryTag';

export interface TaskRowProps {
  title: string;
  schedule: Schedule;
  status: TaskStatus;
  category?: CategoryId;
  onToggleDone: () => void;
  onToggleIgnore: () => void;
}

function TaskRowComponent({
  title,
  schedule,
  status,
  category,
  onToggleDone,
  onToggleIgnore,
}: TaskRowProps) {
  const t = useTheme();
  const styles = useThemedStyles(makeStyles);
  const drag = useReorderableDrag();
  const done = status === 'done';
  const ignored = status === 'ignored';

  return (
    <View style={[styles.card, ignored && styles.cardIgnored]}>
      {/* Checkbox / Status */}
      <Pressable
        onPress={onToggleDone}
        hitSlop={8}
        disabled={ignored}
        style={[styles.checkbox, done && styles.checkboxDone]}>
        {done && <Ionicons name="checkmark" size={18} color={t.colors.onAccent} />}
        {ignored && <Ionicons name="remove" size={18} color={t.colors.textMuted} />}
      </Pressable>

      {/* Titel + Zeitplan */}
      <Pressable
        style={styles.textBlock}
        onPress={onToggleDone}
        disabled={ignored}>
        <Text
          style={[
            styles.title,
            done && styles.titleDone,
            ignored && styles.titleIgnored,
          ]}
          numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.schedule}>
            {ignored ? 'Heute ignoriert' : scheduleLabel(schedule)}
          </Text>
          {!ignored && <CategoryTag category={category} />}
        </View>
      </Pressable>

      {/* Ignorieren / Wiederherstellen */}
      <Pressable onPress={onToggleIgnore} hitSlop={8} style={styles.iconButton}>
        <Ionicons
          name={ignored ? 'arrow-undo-outline' : 'eye-off-outline'}
          size={20}
          color={t.colors.textMuted}
        />
      </Pressable>

      {/* Drag-Handle (lange drücken zum Sortieren) */}
      <Pressable onLongPress={drag} delayLongPress={200} style={styles.iconButton}>
        <Ionicons name="reorder-three-outline" size={24} color={t.colors.textMuted} />
      </Pressable>
    </View>
  );
}

export const TaskRow = memo(TaskRowComponent);

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
      ...t.shadow.card,
    },
    cardIgnored: { opacity: 0.55 },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: t.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    checkboxDone: { backgroundColor: t.colors.accent, borderColor: t.colors.accent },
    textBlock: { flex: 1 },
    title: { ...t.typography.body },
    titleDone: { textDecorationLine: 'line-through', color: t.colors.textMuted },
    titleIgnored: { color: t.colors.textMuted },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: spacing.sm },
    schedule: { ...t.typography.caption },
    iconButton: { padding: spacing.xs, marginLeft: spacing.xs },
  });
