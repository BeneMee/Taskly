import { useRouter } from 'expo-router';
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

import { CategoryPicker } from '@/components/CategoryPicker';
import { WeekdayPicker } from '@/components/WeekdayPicker';
import type { CategoryId, Schedule } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { colors, radius, spacing, typography } from '@/theme';

export default function NewTaskScreen() {
  const router = useRouter();
  const addTask = useTaskStore((s) => s.addTask);

  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState<Schedule>({ kind: 'daily' });
  const [category, setCategory] = useState<CategoryId | undefined>(undefined);

  const canSave =
    title.trim().length > 0 &&
    (schedule.kind === 'daily' || schedule.days.length > 0);

  const onSave = () => {
    if (!canSave) return;
    addTask(title, schedule, category);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Titel</Text>
        <TextInput
          style={styles.input}
          placeholder="z. B. 30 Minuten lesen"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={onSave}
        />

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Wiederholung</Text>
        <WeekdayPicker value={schedule} onChange={setSchedule} />

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Kategorie</Text>
        <CategoryPicker value={category} onChange={setCategory} />

        <Pressable
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={onSave}
          disabled={!canSave}>
          <Text style={styles.saveText}>Aufgabe erstellen</Text>
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
