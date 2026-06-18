import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CategoryId } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { radius, spacing, useThemedStyles, type Theme } from '@/theme';

interface Props {
  value?: CategoryId;
  onChange: (value: CategoryId | undefined) => void;
}

/** Auswahl der Kategorie inkl. Option „Keine". */
export function CategoryPicker({ value, onChange }: Props) {
  const categories = useTaskStore((s) => s.categories);
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(undefined)}
        style={[styles.chip, !value && styles.chipActiveNeutral]}>
        <Text style={[styles.chipText, !value && styles.chipTextActiveNeutral]}>
          Keine
        </Text>
      </Pressable>

      {categories.map((cat) => {
        const active = value === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onChange(cat.id)}
            style={[
              styles.chip,
              active && { backgroundColor: cat.soft, borderColor: cat.color },
            ]}>
            <View style={[styles.dot, { backgroundColor: cat.color }]} />
            <Text style={[styles.chipText, active && { color: cat.color }]}>
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderWidth: 1,
      borderColor: t.colors.border,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    chipActiveNeutral: { backgroundColor: t.colors.accentSoft, borderColor: t.colors.accent },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.xs },
    chipText: { ...t.typography.label, color: t.colors.textSecondary },
    chipTextActiveNeutral: { color: t.colors.accent },
  });
