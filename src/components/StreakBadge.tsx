import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { dayColorHex } from '@/lib/completion';
import type { DayColor } from '@/lib/types';
import { colors, radius, shadow, spacing, typography } from '@/theme';

interface Props {
  current: number;
  longest: number;
  /** Farbe des heutigen Tages (Erfüllungsgrad). */
  todayColor: DayColor;
}

export function StreakBadge({ current, longest, todayColor }: Props) {
  const flameColor = todayColor === 'none' ? colors.textMuted : dayColorHex(todayColor);
  return (
    <View style={styles.card}>
      <View style={[styles.flameCircle, { backgroundColor: `${flameColor}22` }]}>
        <Ionicons name="flame" size={28} color={flameColor} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.count}>
          {current} {current === 1 ? 'Tag' : 'Tage'}
        </Text>
        <Text style={styles.label}>Aktuelle Streak</Text>
      </View>
      <View style={styles.longestBlock}>
        <Text style={styles.longestCount}>{longest}</Text>
        <Text style={styles.label}>Rekord</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  flameCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  textBlock: { flex: 1 },
  count: { ...typography.title, fontSize: 24 },
  label: { ...typography.caption },
  longestBlock: { alignItems: 'center', paddingLeft: spacing.md },
  longestCount: { ...typography.heading, color: colors.accent },
});
