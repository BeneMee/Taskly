import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { todayKey } from '@/lib/dates';
import type { DailyLog, Schedule, TaskStatus, TaskTemplate } from '@/lib/types';

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface TaskState {
  templates: TaskTemplate[];
  logs: DailyLog;
  /** Tage (yyyy-MM-dd), an denen die App geöffnet wurde — Basis für den Streak. */
  openDates: string[];
  /** true, sobald die persistierten Daten geladen wurden. */
  hydrated: boolean;

  // Aktionen
  addTask: (title: string, schedule: Schedule) => void;
  updateTask: (id: string, patch: Partial<Pick<TaskTemplate, 'title' | 'schedule'>>) => void;
  removeTask: (id: string) => void;
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
      hydrated: false,

      addTask: (title, schedule) =>
        set((state) => {
          const maxOrder = state.templates.reduce((m, t) => Math.max(m, t.order), -1);
          const task: TaskTemplate = {
            id: makeId(),
            title: title.trim(),
            schedule,
            order: maxOrder + 1,
            createdAt: new Date().toISOString(),
          };
          return { templates: [...state.templates, task] };
        }),

      updateTask: (id, patch) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id
              ? { ...t, ...patch, title: patch.title?.trim() ?? t.title }
              : t,
          ),
        })),

      removeTask: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

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
      name: 'taskly-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        templates: state.templates,
        logs: state.logs,
        openDates: state.openDates,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
