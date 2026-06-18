import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import { DEFAULT_CATEGORIES, softFromColor } from '@/lib/categories';
import { todayKey } from '@/lib/dates';
import type {
  CategoryId,
  CustomCategory,
  DailyLog,
  Schedule,
  TaskStatus,
  TaskTemplate,
} from '@/lib/types';

const STORE_KEY = 'taskly-store-v2';
const LEGACY_KEY = 'taskly-store-v1';

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Storage-Wrapper für die Migration auf v2: Existiert noch kein v2-Eintrag,
 * wird einmalig der alte v1-Eintrag gelesen, dessen Nutzdaten (templates/logs/
 * openDates) übernommen und `categories` mit den Defaults befüllt.
 */
const migratingStorage: StateStorage = {
  getItem: async (name) => {
    const current = await AsyncStorage.getItem(name);
    if (current != null) return current;

    const legacy = await AsyncStorage.getItem(LEGACY_KEY);
    if (legacy == null) return null;

    try {
      const parsed = JSON.parse(legacy) as {
        state?: Partial<PersistedState>;
        version?: number;
      };
      const migrated = {
        state: {
          templates: parsed.state?.templates ?? [],
          logs: parsed.state?.logs ?? {},
          openDates: parsed.state?.openDates ?? [],
          categories: DEFAULT_CATEGORIES,
        },
        version: 0,
      };
      const serialized = JSON.stringify(migrated);
      await AsyncStorage.setItem(name, serialized);
      return serialized;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name),
};

interface PersistedState {
  templates: TaskTemplate[];
  logs: DailyLog;
  openDates: string[];
  categories: CustomCategory[];
}

interface TaskState {
  templates: TaskTemplate[];
  logs: DailyLog;
  /** Tage (yyyy-MM-dd), an denen die App geöffnet wurde — Basis für den Streak. */
  openDates: string[];
  /** Verwaltbare Kategorien (inkl. der 3 Builtins). */
  categories: CustomCategory[];
  /** true, sobald die persistierten Daten geladen wurden. */
  hydrated: boolean;

  // Aktionen
  addTask: (
    title: string,
    schedule: Schedule,
    category?: CategoryId,
    notes?: string,
  ) => void;
  updateTask: (
    id: string,
    patch: Partial<Pick<TaskTemplate, 'title' | 'schedule' | 'category' | 'notes'>>,
  ) => void;
  removeTask: (id: string) => void;
  /** Legt eine neue Kategorie an (soft wird aus color abgeleitet). */
  addCategory: (label: string, color: string) => void;
  updateCategory: (
    id: string,
    patch: Partial<Pick<CustomCategory, 'label' | 'color'>>,
  ) => void;
  /** Entfernt eine (nicht-builtin) Kategorie und löst sie von Aufgaben. */
  removeCategory: (id: string) => void;
  /** Setzt die Reihenfolge der sichtbaren Aufgaben (Liste ihrer IDs in neuer Reihenfolge). */
  reorder: (orderedIds: string[]) => void;
  setStatus: (dateKey: string, taskId: string, status: TaskStatus) => void;
  registerOpen: () => void;
  setHydrated: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      templates: [],
      logs: {},
      openDates: [],
      categories: [...DEFAULT_CATEGORIES],
      hydrated: false,

      addTask: (title, schedule, category, notes) =>
        set((state) => {
          const maxOrder = state.templates.reduce((m, t) => Math.max(m, t.order), -1);
          const trimmedNotes = notes?.trim();
          const task: TaskTemplate = {
            id: makeId(),
            title: title.trim(),
            schedule,
            order: maxOrder + 1,
            createdAt: new Date().toISOString(),
            category,
            notes: trimmedNotes ? trimmedNotes : undefined,
          };
          return { templates: [...state.templates, task] };
        }),

      updateTask: (id, patch) =>
        set((state) => ({
          templates: state.templates.map((t) => {
            if (t.id !== id) return t;
            const next = { ...t, ...patch, title: patch.title?.trim() ?? t.title };
            if ('notes' in patch) {
              const trimmed = patch.notes?.trim();
              next.notes = trimmed ? trimmed : undefined;
            }
            return next;
          }),
        })),

      removeTask: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      addCategory: (label, color) =>
        set((state) => {
          const category: CustomCategory = {
            id: makeId(),
            label: label.trim(),
            color,
            soft: softFromColor(color),
          };
          return { categories: [...state.categories, category] };
        }),

      updateCategory: (id, patch) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...patch,
                  label: patch.label?.trim() ?? c.label,
                  soft: patch.color ? softFromColor(patch.color) : c.soft,
                }
              : c,
          ),
        })),

      removeCategory: (id) =>
        set((state) => {
          const target = state.categories.find((c) => c.id === id);
          if (!target || target.builtin) return state;
          return {
            categories: state.categories.filter((c) => c.id !== id),
            templates: state.templates.map((t) =>
              t.category === id ? { ...t, category: undefined } : t,
            ),
          };
        }),

      reorder: (orderedIds) =>
        set((state) => {
          // Die order-Werte der betroffenen Aufgaben werden in neuer Reihenfolge
          // neu verteilt — nicht sichtbare Aufgaben behalten ihre Position.
          const slots = orderedIds
            .map((id) => state.templates.find((t) => t.id === id)?.order)
            .filter((n): n is number => typeof n === 'number')
            .sort((a, b) => a - b);
          const orderById = new Map<string, number>();
          orderedIds.forEach((id, i) => orderById.set(id, slots[i]));
          return {
            templates: state.templates.map((t) =>
              orderById.has(t.id) ? { ...t, order: orderById.get(t.id)! } : t,
            ),
          };
        }),

      setStatus: (dateKey, taskId, status) =>
        set((state) => {
          const dayLog = { ...(state.logs[dateKey] ?? {}) };
          if (status === 'open') {
            delete dayLog[taskId];
          } else {
            dayLog[taskId] = status;
          }
          const logs = { ...state.logs };
          if (Object.keys(dayLog).length === 0) {
            delete logs[dateKey];
          } else {
            logs[dateKey] = dayLog;
          }
          // Aktivität an dem Tag impliziert "eingeloggt".
          const openDates = state.openDates.includes(dateKey)
            ? state.openDates
            : [...state.openDates, dateKey];
          return { logs, openDates };
        }),

      registerOpen: () =>
        set((state) => {
          const key = todayKey();
          if (state.openDates.includes(key)) return state;
          return { openDates: [...state.openDates, key] };
        }),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => migratingStorage),
      partialize: (state): PersistedState => ({
        templates: state.templates,
        logs: state.logs,
        openDates: state.openDates,
        categories: state.categories,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
