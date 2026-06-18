import { StyleSheet, Text, View } from 'react-native';

import { getCategoryFrom } from '@/lib/categories';
import type { CategoryId } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { radius, spacing } from '@/theme';

interface Props {
  category?: CategoryId;
}

/** Kleines farbiges Pill mit Punkt + Textlabel (z. B. grünes „Social"). */
export function CategoryTag({ category }: Props) {
  const categories = useTaskStore((s) => s.categories);
  const meta = getCategoryFrom(categories, category);
  if (!meta) return null;
  return (
    <View style={[styles.pill, { backgroundColor: meta.soft }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  label: { fontSize: 12, fontWeight: '700' },
});
