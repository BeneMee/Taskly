import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CustomCategory } from '@/lib/types';
import { useTaskStore } from '@/store/useTaskStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

export default function CategoriesScreen() {
  const router = useRouter();
  const categories = useTaskStore((s) => s.categories);
  const templates = useTaskStore((s) => s.templates);
  const removeCategory = useTaskStore((s) => s.removeCategory);

  const onDelete = (cat: CustomCategory) => {
    const inUse = templates.some((t) => t.category === cat.id);
    if (inUse) {
      Alert.alert(
        'Kategorie wird verwendet',
        `„${cat.label}" ist mindestens einer Aufgabe zugeordnet und kann nicht gelöscht werden.`,
      );
      return;
    }
    Alert.alert('Kategorie löschen?', `„${cat.label}" wird entfernt.`, [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () => removeCategory(cat.id) },
    ]);
  };

  const renderItem = ({ item }: { item: CustomCategory }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: '/category/edit', params: { id: item.id } })}>
      <View style={[styles.pill, { backgroundColor: item.soft }]}>
        <View style={[styles.dot, { backgroundColor: item.color }]} />
        <Text style={[styles.pillLabel, { color: item.color }]}>{item.label}</Text>
      </View>
      <View style={styles.spacer} />
      {item.builtin ? (
        <Text style={styles.builtinHint}>Vordefiniert</Text>
      ) : (
        <Pressable hitSlop={8} onPress={() => onDelete(item)}>
          <Ionicons name="trash-outline" size={20} color={colors.red} />
        </Pressable>
      )}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textMuted}
        style={{ marginLeft: spacing.sm }}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/category/edit')}>
            <Ionicons name="add" size={20} color={colors.accent} />
            <Text style={styles.addText}>Kategorie</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  addText: { ...typography.label, color: colors.accent },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  pillLabel: { fontSize: 13, fontWeight: '700' },
  spacer: { flex: 1 },
  builtinHint: { ...typography.caption },
});
