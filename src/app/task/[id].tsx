import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { EmptyState } from '@/components/EmptyState';
import { WeekdayPicker } from '@/components/WeekdayPicker';
import type { CategoryId, Schedule } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { colors, radius, spacing, typography } from '@/theme';

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const template = useTaskStore((s) => s.templates.find((t) => t.id === id));
  const updateTask = useTaskStore((s) => s.updateTask);
  const removeTask = useTaskStore((s) => s.removeTask);

  const [title, setTitle] = useState(template?.title ?? '');
  const [schedule, setSchedule] = useState<Schedule>(
    template?.schedule ?? { kind: 'daily' },
  );
  const [category, setCategory] = useState<CategoryId | undefined>(template?.category);
  const [notes, setNotes] = useState(template?.notes ?? '');

  if (!template) {
    return (
      <View style={styles.flex}>
        <EmptyState
          icon="alert-circle-outline"
          title="Aufgabe nicht gefunden"
          subtitle="Sie wurde möglicherweise gelöscht."
        />
      </View>
    );
  }

  const canSave =
    title.trim().length > 0 &&
    (schedule.kind === 'daily' || schedule.days.length > 0);

  const onSave = () => {
    if (!canSave) return;
    updateTask(template.id, { title, schedule, category, notes });
    router.back();
  };

  const onDelete = () => {
    Alert.alert('Aufgabe löschen?', `„${template.title}" wird dauerhaft entfernt.`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          removeTask(template.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Titel</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          onSubmitEditing={onSave}
        />

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Notizen</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Optionale Notizen zur Aufgabe…"
          placeholderTextColor={colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Wiederholung</Text>
        <WeekdayPicker value={schedule} onChange={setSchedule} />

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Kategorie</Text>
        <CategoryPicker value={category} onChange={setCategory} />

        <Pressable
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={onSave}
          disabled={!canSave}>
          <Text style={styles.saveText}>Speichern</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>Aufgabe löschen</Text>
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
  notesInput: { minHeight: 96, paddingTop: spacing.md },
  saveButton: {
    marginTop: spacing.xxl,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: { backgroundColor: colors.textMuted },
  saveText: { ...typography.body, color: colors.onAccent, fontWeight: '700' },
  deleteButton: { marginTop: spacing.lg, paddingVertical: spacing.md, alignItems: 'center' },
  deleteText: { ...typography.body, color: colors.red, fontWeight: '600' },
});
