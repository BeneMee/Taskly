# Taskly — Spezifikation

Eine Daily-Habit- / To-Do-App, gebaut mit **Expo** und lauffähig in **Expo Go** (kein Custom-Native-Build nötig).

## Ziel

Tägliche Routine-Aufgaben abhaken, optional bestimmten Wochentagen zuordnen, Fortschritt über Woche & Monat verfolgen und durch einen farbcodierten Login-Streak motiviert bleiben.

## Funktionale Anforderungen

1. **Tägliche Aufgaben** – Aufgaben sind wiederkehrende Vorlagen (Habit-Style). Sie erscheinen jeden Tag (oder an zugeordneten Wochentagen) automatisch und starten als „offen".
2. **Wochentags-Zuordnung** – Eine Aufgabe ist entweder `täglich` oder an ausgewählte Wochentage (Mo–So) gebunden.
3. **Drei Zustände pro Tag** – `offen` (Default) · `erledigt` (abgehakt) · `ignoriert`.
   - `ignoriert` ist **neutral**: zählt weder als erledigt noch als verpasst und wird aus der Erfüllungsquote herausgerechnet.
4. **Tracking & Diagramme** – Erledigte Aufgaben werden pro Tag erfasst und für **Woche** und **Monat** visualisiert.
5. **Daily Login Streak** – Das Öffnen der App an einem Tag hält die Streak am Leben. Jeder Tag wird **farbcodiert**:
   - 🟢 **grün** = alle (nicht ignorierten) Aufgaben erledigt (100 %)
   - 🟡 **gelb** = mindestens die Hälfte erledigt (≥ 50 %)
   - 🔴 **rot** = eingeloggt, aber < 50 % erledigt
   - ⚪ neutral = an dem Tag nicht eingeloggt / keine Aufgaben
6. **Drag & Drop** – Aufgaben lassen sich per Drag & Drop sortieren; die Reihenfolge wird persistiert.

## Nicht-funktionale Anforderungen

- **Expo Go kompatibel** – ausschließlich Bibliotheken ohne Custom-Native-Code.
- **Offline / lokal** – alle Daten lokal via AsyncStorage, kein Backend, keine Anmeldung, keine laufenden Kosten.
- **Deployment-freundlich** – keine Expo-Go-spezifischen Hacks; ein späterer EAS-Build oder Web-Export ist ohne Umbau möglich.
- **Sprache** – UI auf Deutsch.
- **Theme** – Light Mode, freundlich.

## Annahmen / Defaults (leicht änderbar)

- Wochenstart = Montag.
- Grün-Schwelle = 100 %, Gelb-Schwelle = ≥ 50 %.
- Wochentag-Indizes: 0 = Montag … 6 = Sonntag.

Details zu Architektur und Datenmodell: siehe [docs/architecture.md](docs/architecture.md). Vollständige Anforderungsliste: [docs/requirements.md](docs/requirements.md).
