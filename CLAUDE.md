@AGENTS.md

# Taskly — Projekt-Guide

Daily-Habit-/To-Do-App mit **Expo (SDK 54)**, lauffähig in **Expo Go**. Siehe [SPEC.md](SPEC.md) und [docs/architecture.md](docs/architecture.md).

## Starten
- `npm start` → Expo Dev Server, QR-Code in Expo Go scannen
- `npm test` → Jest-Unit-Tests (reine Logik in `src/lib`)
- `npx tsc --noEmit` → Typecheck

## Architektur-Leitplanken
- **Expo-Go-kompatibel bleiben:** keine Bibliotheken mit Custom-Native-Code. Aktuell genutzt: reanimated 4, gesture-handler, reorderable-list, async-storage. Diagramme sind bewusst plain RN Views (keine Chart-Lib).
- **Reine Logik** liegt in `src/lib/` (dates, tasks, completion) und ist unit-getestet — neue Regeln dort ergänzen und testen.
- **State** in `src/store/useTaskStore.ts` (zustand + persist über AsyncStorage). Tagesstatus wird aus `logs[dateKey]` *abgeleitet* (kein Mitternachts-Reset).
- **Routing** via expo-router unter `src/app/` (Tabs-Gruppe `(tabs)`, Modals unter `task/`).
- **Theme** zentral in `src/theme/` (Light Mode). Tagesfarben grün/gelb/rot konsistent mit `completion.dayColorHex`.
