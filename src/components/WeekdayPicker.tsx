import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WEEKDAY_LABELS } from '@/lib/types';
import type { Schedule, Weekday } from '@/lib/types';
import { radius, spacing, useThemedStyles, type Theme } from '@/theme';

interface Props {
  value: Schedule;
  onChange: (schedule: Schedule) => void;
}

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export function WeekdayPicker({ value, onChange }: Props) {
  const styles = useThemedStyles(makeStyles);
  const isDaily = value.kind === 'daily';
  const selectedDays = value.kind === 'weekdays' ? value.days : [];

  const toggleDay = (day: Weekday) => {
    const set = new Set(selectedDays);
    if (set.has(day)) set.delete(day);
    else set.add(day);
    const days = ALL_DAYS.filter((d) => set.has(d));
    onChange({ kind: 'weekdays', days });
  };

  return (
    <View>
      <View style={styles.segment}>
        <Segment
          label="Täglich"
          active={isDaily}
          onPress={() => onChange({ kind: 'daily' })}
        />
        <Segment
          label="Wochentage"
          active={!isDaily}
          onPress={() =>
            onChange({
              kind: 'weekdays',
              days: selectedDays.length ? selectedDays : [0, 1, 2, 3, 4],
            })
          }
        />
      </View>

      {!isDaily && (
        <View style={styles.daysRow}>
          {ALL_DAYS.map((day) => {
            const active = selectedDays.includes(day);
            return (
              <Pressable
                key={day}
                onPress={() => toggleDay(day)}
                style={[styles.dayChip, active && styles.dayChipActive]}>
                <Text style={[styles.dayText, active && styles.dayTextActive]}>
                  {WEEKDAY_LABELS[day]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function Segment({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segmentItem, active && styles.segmentItemActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    segment: {
      flexDirection: 'row',
      backgroundColor: t.colors.surfaceAlt,
      borderRadius: radius.md,
      padding: spacing.xs,
      gap: spacing.xs,
    },
    segmentItem: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
      alignItems: 'center',
    },
    segmentItemActive: { backgroundColor: t.colors.surface },
    segmentText: { ...t.typography.label, color: t.colors.textSecondary },
    segmentTextActive: { color: t.colors.accent },
    daysRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
      gap: spacing.xs,
    },
    dayChip: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: radius.sm,
      backgroundColor: t.colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayChipActive: { backgroundColor: t.colors.accent },
    dayText: { ...t.typography.label, color: t.colors.textSecondary, fontSize: 12 },
    dayTextActive: { color: t.colors.onAccent },
  });
