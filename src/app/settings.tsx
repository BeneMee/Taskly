import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { useTaskStore } from '@/store/useTaskStore';
import {
  PALETTES,
  radius,
  spacing,
  useTheme,
  useThemedStyles,
  type Theme,
} from '@/theme';

export default function SettingsScreen() {
  const t = useTheme();
  const styles = useThemedStyles(makeStyles);

  const mode = useTaskStore((s) => s.settings.mode);
  const palette = useTaskStore((s) => s.settings.palette);
  const setMode = useTaskStore((s) => s.setMode);
  const setPalette = useTaskStore((s) => s.setPalette);

  const isDark = mode === 'dark';

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      {/* Darstellung */}
      <Text style={styles.sectionLabel}>Darstellung</Text>
      <View style={styles.card}>
        <View style={styles.modeRow}>
          <View style={styles.modeIcon}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={20}
              color={t.colors.accent}
            />
          </View>
          <View style={styles.modeText}>
            <Text style={styles.modeTitle}>Dunkler Modus</Text>
            <Text style={styles.modeSub}>{isDark ? 'An' : 'Aus'}</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={(v) => setMode(v ? 'dark' : 'light')}
            trackColor={{ false: t.colors.neutral, true: t.colors.accent }}
            thumbColor={t.colors.surface}
          />
        </View>
      </View>

      {/* Farbthema */}
      <Text style={styles.sectionLabel}>Farbthema</Text>
      <View style={styles.card}>
        <View style={styles.swatchRow}>
          {PALETTES.map((p) => {
            const active = p.id === palette;
            return (
              <Pressable
                key={p.id}
                style={styles.swatchItem}
                onPress={() => setPalette(p.id)}>
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: p.swatch },
                    active && styles.swatchActive,
                  ]}>
                  {active && <Ionicons name="checkmark" size={22} color="#FFFFFF" />}
                </View>
                <Text style={[styles.swatchLabel, active && styles.swatchLabelActive]}>
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: t.colors.background },
    content: { padding: spacing.lg },
    sectionLabel: {
      ...t.typography.label,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
    },
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...t.shadow.card,
    },
    modeRow: { flexDirection: 'row', alignItems: 'center' },
    modeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: t.colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    modeText: { flex: 1 },
    modeTitle: { ...t.typography.body },
    modeSub: { ...t.typography.caption, marginTop: 2 },
    swatchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    swatchItem: { alignItems: 'center', flex: 1 },
    swatch: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    swatchActive: { borderColor: t.colors.text },
    swatchLabel: {
      ...t.typography.caption,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    swatchLabelActive: { color: t.colors.accent, fontWeight: '700' },
  });
