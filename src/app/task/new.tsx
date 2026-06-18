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
} from 'react-native';

import { CategoryPicker } from '@/components/CategoryPicker';
import { WeekdayPicker } from '@/components/WeekdayPicker';
import type { CategoryId, Schedule } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { radius, spacing, useTheme, useThemedStyles, type Theme } from '@/theme';

export default function NewTaskScreen() {
  const router = useRouter();
  const t = useTheme();
  const styles = useThemedStyles(makeStyles);
  const addTask = useTaskStore((s) => s.addTask);

  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState<Schedule>({ kind: 'daily' });
  const [category, setCategory] = useState<CategoryId | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const canSave =
    title.trim().length > 0 &&
    (schedule.kind === 'daily' || schedule.days.length > 0);

  const onSave = () => {
    if (!canSave) return;
    addTask(title, schedule, category, notes);
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
          placeholderTextColor={t.colors.textMuted}
          value={title}
          onChangeText={setTitle}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={onSave}
        />

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Notizen</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Optionale Notizen zur Aufgabe…"
          placeholderTextColor={t.colors.textMuted}
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
          <Text style={styles.saveText}>Aufgabe erstellen</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: t.colors.background },
    content: { padding: spacing.lg },
    label: { ...t.typography.label, marginBottom: spacing.sm },
    input: {
      backgroundColor: t.colors.surface,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      fontSize: 16,
      color: t.colors.text,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    notesInput: { minHeight: 96, paddingTop: spacing.md },
    saveButton: {
      marginTop: spacing.xxl,
      backgroundColor: t.colors.accent,
      borderRadius: radius.md,
      paddingVertical: spacing.lg,
      alignItems: 'center',
    },
    saveButtonDisabled: { backgroundColor: t.colors.textMuted },
    saveText: { ...t.typography.body, color: t.colors.onAccent, fontWeight: '700' },
  });
