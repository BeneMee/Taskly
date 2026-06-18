# Taskly 📋

Eine freundliche **Daily-Habit- / To-Do-App**, gebaut mit [Expo](https://expo.dev) (SDK 54) und lauffähig in **Expo Go** — ganz ohne Custom-Native-Build.

Tägliche Routinen abhaken, Aufgaben Wochentagen und Kategorien zuordnen, den Fortschritt über Woche und Monat verfolgen und mit einem farbcodierten Login-Streak motiviert bleiben.

## ✨ Features

- **Wiederkehrende Aufgaben** (Habit-Style) — täglich oder an bestimmte Wochentage (Mo–So) gebunden
- **Drei Zustände** pro Tag: offen · erledigt · *ignoriert* (neutral, zählt nicht in die Quote)
- **Kategorien** mit farbigem Tag: 🟢 Social · 🟡 Leisure · 🔴 Work (optional)
- **Farbcodierter Login-Streak** — 🟢 alles geschafft · 🟡 ≥ 50 % · 🔴 nur eingeloggt
- **Statistik** — Wochen-Balkendiagramm + Monats-Kalender-Heatmap
- **Drag & Drop** zum Sortieren der Aufgaben
- **Lokal & offline** — alle Daten via AsyncStorage, kein Backend, kein Account

## 🚀 Schnellstart

> Voraussetzung: **Node.js** und die **Expo Go**-App (SDK 54) auf dem Handy.

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Dev-Server starten
npm start
```

Dann den QR-Code mit **Expo Go** scannen (Handy und PC im selben WLAN).

### Auf anderem Netzwerk / Gerät teilen

```bash
npx expo start --tunnel
```

Erzeugt eine öffentliche `exp://…exp.direct`-URL, die in Expo Go von überall geöffnet werden kann (solange der Dev-Server läuft).

## 🧪 Tests & Checks

```bash
npm test            # Jest-Unit-Tests (reine Logik in src/lib)
npx tsc --noEmit    # TypeScript-Typecheck
```

## 🧱 Tech-Stack

| Zweck | Bibliothek |
|---|---|
| Framework | Expo SDK 54, React Native 0.81, TypeScript |
| Navigation | expo-router (file-based) |
| State + Persistenz | zustand + AsyncStorage |
| Drag & Drop | react-native-reorderable-list (Reanimated 4) |
| Diagramme | plain React Native Views (keine Chart-Lib) |
| Datum | date-fns |

## 📁 Projektstruktur

```
src/
  app/            expo-router Screens
    (tabs)/       Heute · Aufgaben · Statistik
    task/         Modals zum Anlegen/Bearbeiten
  components/     UI-Komponenten (TaskRow, StreakBadge, CategoryTag, Charts …)
  lib/            reine Logik (dates, tasks, completion, categories) + Tests
  store/          zustand-Store mit Persistenz
  theme/          zentrales Light-Theme
docs/             Architektur & Requirements
SPEC.md           Spezifikation
```

## 📝 Hinweise

- Das Projekt ist bewusst auf **SDK 54** gepinnt (Expo Go des Entwicklers unterstützt nur SDK 54) und vermeidet Expo-Go-spezifischen Code, damit später ein EAS-Build oder Web-Export ohne Umbau möglich ist.
- Mehr Details: [SPEC.md](SPEC.md) · [docs/architecture.md](docs/architecture.md)

---

🤖 Mitentwickelt mit [Claude Code](https://claude.com/claude-code)
