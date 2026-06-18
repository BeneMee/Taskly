# Anforderungen

## User Stories

- Als Nutzer möchte ich tägliche Aufgaben anlegen und sie abhaken, um Routinen zu verfolgen.
- Als Nutzer möchte ich Aufgaben nur bestimmten Wochentagen zuordnen (z. B. „Sport: Mo/Mi/Fr").
- Als Nutzer möchte ich eine Aufgabe für heute ignorieren können, ohne dass sie negativ in meine Statistik einfließt.
- Als Nutzer möchte ich meinen Fortschritt für die aktuelle Woche und den aktuellen Monat als Diagramm sehen.
- Als Nutzer möchte ich einen Login-Streak sehen, dessen Tagesfarbe widerspiegelt, wie viel ich an dem Tag geschafft habe.
- Als Nutzer möchte ich die Reihenfolge meiner Aufgaben per Drag & Drop ändern.
- Als Nutzer möchte ich, dass meine Daten beim Neustart der App erhalten bleiben.

## Akzeptanzkriterien

| # | Kriterium |
|---|-----------|
| A1 | Eine als `täglich` angelegte Aufgabe erscheint an jedem Tag in der Heute-Liste. |
| A2 | Eine an Wochentage gebundene Aufgabe erscheint nur an diesen Wochentagen. |
| A3 | Tap auf eine Aufgabe wechselt zwischen `offen` und `erledigt`. |
| A4 | Eine Aufgabe kann als `ignoriert` markiert werden und zählt dann neutral. |
| A5 | Erfüllungsquote eines Tages = erledigt / (gesamt − ignoriert). |
| A6 | Tagesfarbe: grün = 100 %, gelb ≥ 50 %, rot = eingeloggt & < 50 %, sonst neutral. |
| A7 | Der Streak zählt aufeinanderfolgende Tage, an denen die App geöffnet wurde. |
| A8 | Wochen-Diagramm zeigt pro Wochentag die Erfüllung; Monats-Heatmap zeigt die Tagesfarben. |
| A9 | Reihenfolge per Drag & Drop änderbar und nach Neustart erhalten. |
| A10 | Alle Daten überleben App-Neustart (AsyncStorage). |

## Out of Scope (v1)

- Cloud-Sync / Accounts
- Push-Benachrichtigungen / Erinnerungen
- Mehrsprachigkeit
- Unteraufgaben, Tags, Prioritäten
