# Design: Eigene Kategorien & Aufgaben-Notizen

Datum: 2026-06-18 · Status: genehmigt (Design-Fragen bestätigt)

Zwei Features für Taskly (Expo SDK 54, Expo Go). UI Deutsch, Light Theme, kein Custom Native Code, Persistenz über AsyncStorage.

## Feature 1 — Eigene Kategorien

### Datenmodell (`src/lib/types.ts`)
- `CategoryId` wird zu `string`.
- Neu:
  ```ts
  export interface CustomCategory {
    id: string;
    label: string;
    color: string;   // Hex, z. B. '#34C759'
    soft: string;    // heller Hintergrund, abgeleitet
    builtin?: boolean;
  }
  ```
  `builtin` wird ergänzt (vom Fließtext der Anforderung gefordert: editierbar, nicht löschbar).

### `src/lib/categories.ts` (rein, store-/theme-unabhängig)
- `DEFAULT_CATEGORIES: CustomCategory[]` — die 3 bisherigen (social/leisure/work), je `builtin: true`.
- `getCategoryFrom(list, id?)` ersetzt `getCategory` — nimmt die Liste entgegen (testbar).
- `softFromColor(hex): string` — leitet `soft` durch Mischung des Hex mit Weiß bei ~15% Deckkraft ab (testbar).
- 8 vorgegebene Auswahlfarben als `CATEGORY_COLORS: string[]`.

`CategoryTag` und `CategoryPicker` lesen `categories` intern aus dem Store; Props bleiben kompatibel, Consumer (`TaskRow`, `tasks.tsx`, `index.tsx`) brauchen keine Änderung.

### Store (`src/store/useTaskStore.ts`)
- State `categories: CustomCategory[]` (Default = `DEFAULT_CATEGORIES`).
- Aktionen `addCategory(label, color)`, `updateCategory(id, patch)`, `removeCategory(id)`.
- `categories` in `partialize`.
- Key → `taskly-store-v2`. **Migration (Entscheidung: Legacy-Import):** Storage wird so gewrappt, dass bei leerem v2-Key einmalig `taskly-store-v1` gelesen wird; `templates`/`logs`/`openDates` werden übernommen, `categories` mit Defaults befüllt.
- `updateTask`-Patch um `notes` erweitert.

### Screens (Entscheidung: getrennte Routen)
- Tag-Icon-Button im Header von `tasks.tsx` → Route `category` (Modal).
- `src/app/category/index.tsx`: Liste mit Farb-Pill + Label; „+ Kategorie“ → `category/edit`. Löschen via Trash-Icon, mit Alert-Hinweis blockiert, falls eine Aufgabe die Kategorie nutzt; Builtins ohne Lösch-Affordanz.
- `src/app/category/edit.tsx` (optionaler Param `id`): Namensfeld + 8 tippbare Farbkreise; `soft` automatisch via `softFromColor`. Erstellen und Bearbeiten.

### Aufgaben-Modals
- Kategorie-Picker liest aus dem Store (bereits durch `CategoryPicker`-Anpassung abgedeckt).

## Feature 2 — Notizen
- `notes?: string` in `TaskTemplate`.
- Mehrzeiliges `TextInput` („Notizen“, Placeholder „Optionale Notizen zur Aufgabe…“, `numberOfLines={4}`, Stil wie Titelfeld) unter dem Titel in `task/new.tsx` und `task/[id].tsx`.
- In `tasks.tsx`: `document-text-outline`-Icon in der `metaRow`, wenn `notes` gesetzt ist.

## Tests
- `categories.test.ts` neu: `DEFAULT_CATEGORIES`, `getCategoryFrom`, `softFromColor`.
- Abschluss: `npx tsc --noEmit` fehlerfrei, `npm test` grün.
