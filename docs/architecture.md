# Architektur

## Tech-Stack

| Zweck | Bibliothek | Hinweis |
|---|---|---|
| Framework | Expo SDK 54, React Native 0.81, TypeScript | New Architecture (für Reanimated 4 nötig) |
| Navigation | expo-router (file-based, `src/app`) | Tabs + Modal-Routen |
| State + Persistenz | zustand + `persist`-Middleware | über AsyncStorage |
| Lokaler Speicher | @react-native-async-storage/async-storage | Expo-Go-kompatibel |
| Drag & Drop | react-native-reorderable-list | auf Reanimated 4 + Gesture Handler |
| Animation/Gesten | react-native-reanimated 4, react-native-gesture-handler | aus Template enthalten |
| Datum | date-fns | Wochenstart Montag |
| Diagramme | **plain React Native Views** | bewusst keine Chart-Lib → maximale Expo-Go-Robustheit |

> **Diagramm-Entscheidung:** Wochen-Balken und Monats-Heatmap sind einfache farbige Views. Das vermeidet jede native Chart-Abhängigkeit (svg/skia/linear-gradient) und damit Expo-Go-Risiken — die farbcodierte Heatmap ist ohnehin nur ein Raster eingefärbter Zellen.

## Datenmodell (`src/lib/types.ts`)

```ts
type Weekday = 0..6;                 // 0 = Montag … 6 = Sonntag
type Schedule = {kind:'daily'} | {kind:'weekdays'; days: Weekday[]};
type TaskStatus = 'open' | 'done' | 'ignored';

interface TaskTemplate { id; title; schedule; order; createdAt; archived? }
type DailyLog = Record<dateKey, Record<taskId, 'done' | 'ignored'>>; // 'open' = Default, nicht gespeichert
```

**Kein Mitternachts-Reset:** Der Status eines Tages wird aus `logs[dateKey]` *abgeleitet*. Fehlt ein Eintrag, gilt `open`. Jeder neue Tag startet damit automatisch leer.

## Schichten

```
src/
  lib/
    types.ts        Typen
    dates.ts        Datums-Helfer (todayKey, weekdayOf, daysOfWeek, daysOfMonth)
    tasks.ts        activeTemplatesFor(date, templates)
    completion.ts   statusOf · dayStats · dayColor · computeStreak   ← pure, unit-getestet
  store/
    useTaskStore.ts zustand-Store (+persist): addTask/updateTask/removeTask/reorder/setStatus/registerOpen
  theme/
    index.ts        Farben, Spacing, Typografie (Light, freundlich)
  components/
    TaskRow · StreakBadge · WeekdayPicker · WeekChart · MonthHeatmap · EmptyState
  app/
    _layout.tsx          Root: GestureHandlerRootView + Stack; registerOpen() beim Mount
    (tabs)/_layout.tsx   Tabs: Heute · Aufgaben · Statistik
    (tabs)/index.tsx     Heute (ReorderableList, abhaken/ignorieren, Streak-Badge)
    (tabs)/tasks.tsx     Aufgaben verwalten (CRUD, Zeitplan)
    (tabs)/stats.tsx     Statistik (WeekChart + MonthHeatmap + Streak)
    task/new.tsx         Modal: Aufgabe anlegen
    task/[id].tsx        Modal: Aufgabe bearbeiten/löschen
```

## Datenfluss

1. Komponenten lesen `templates` / `logs` / `openDates` aus dem zustand-Store (selektiv).
2. Reine Funktionen in `lib/` leiten daraus „aktive Aufgaben heute", Tagesstatus, Tagesfarbe und Streak ab.
3. Aktionen (`setStatus`, `reorder`, `addTask` …) mutieren den Store; `persist` schreibt sofort nach AsyncStorage.
4. Beim App-Start registriert das Root-Layout den heutigen Tag (`registerOpen`) → Streak bleibt aktuell.

## Test-Strategie

- `jest-expo` Unit-Tests für die reinen Funktionen in `lib/` (`computeStreak`, `dayColor`, `dayStats`, `activeTemplatesFor`).
- Manuelle E2E-Verifikation in Expo Go (siehe SPEC / Plan).
