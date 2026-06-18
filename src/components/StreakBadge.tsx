import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { dayColorHex } from '@/lib/completion';
import type { DayColor } from '@/lib/types';
import { radius, spacing, useTheme, useThemedStyles, type Theme } from '@/theme';

interface Props {
  current: number;
  longest: number;
  /** Farbe des heutigen Tages (Erfüllungsgrad). */
  todayColor: DayColor;
}

export function StreakBadge({ current, longest, todayColor }: Props) {
  const t = useTheme();
  const styles = useThemedStyles(makeStyles);
  const flameColor = todayColor === 'none' ? t.colors.textMuted : dayColorHex(todayColor);
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

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      ...t.shadow.card,
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
    count: { ...t.typography.title, fontSize: 24 },
    label: { ...t.typography.caption },
    longestBlock: { alignItems: 'center', paddingLeft: spacing.md },
    longestCount: { ...t.typography.heading, color: t.colors.accent },
  });
