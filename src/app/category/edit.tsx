import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CATEGORY_COLORS, softFromColor } from '@/lib/categories';
import { useTaskStore } from '@/store/useTaskStore';
import { colors, radius, spacing, typography } from '@/theme';

export default function EditCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const existing = useTaskStore((s) => s.categories.find((c) => c.id === id));
  const addCategory = useTaskStore((s) => s.addCategory);
  const updateCategory = useTaskStore((s) => s.updateCategory);

  const [label, setLabel] = useState(existing?.label ?? '');
  const [color, setColor] = useState(existing?.color ?? CATEGORY_COLORS[0]);

  const canSave = label.trim().length > 0;

  const onSave = () => {
    if (!canSave) return;
    if (existing) {
      updateCategory(existing.id, { label, color });
    } else {
      addCategory(label, color);
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="z. B. Sport"
          placeholderTextColor={colors.textMuted}
          value={label}
          onChangeText={setLabel}
          autoFocus={!existing}
          returnKeyType="done"
          onSubmitEditing={onSave}
        />

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Farbe</Text>
        <View style={styles.swatchRow}>
          {CATEGORY_COLORS.map((c) => {
            const active = c.toUpperCase() === color.toUpperCase();
            return (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.swatch,
                  { backgroundColor: c },
                  active && styles.swatchActive,
                ]}
              />
            );
          })}
        </View>

        <Text style={styles.previewLabel}>Vorschau</Text>
        <View style={[styles.pill, { backgroundColor: softFromColor(color) }]}>
          <View style={[styles.pillDot, { backgroundColor: color }]} />
          <Text style={[styles.pillText, { color }]}>{label.trim() || 'Kategorie'}</Text>
        </View>

        <Pressable
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={onSave}
          disabled={!canSave}>
          <Text style={styles.saveText}>
            {existing ? 'Speichern' : 'Kategorie erstellen'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  label: { ...typography.label, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  swatch: { width: 40, height: 40, borderRadius: 20 },
  swatchActive: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  previewLabel: { ...typography.label, marginTop: spacing.xl, marginBottom: spacing.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  pillDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.xs },
  pillText: { fontSize: 14, fontWeight: '700' },
  saveButton: {
    marginTop: spacing.xxl,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: { backgroundColor: colors.textMuted },
  saveText: { ...typography.body, color: colors.onAccent, fontWeight: '700' },
});
