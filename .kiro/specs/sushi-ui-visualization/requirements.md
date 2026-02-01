# Requirements Document

## Einleitung

Dieses Dokument beschreibt die Anforderungen für die visuelle UI-Darstellung des RxJS Sushi-Belt-Demos. Aktuell werden alle Ausgaben nur in der Browser-Konsole geloggt. Die neue Funktionalität soll eine animierte Visualisierung eines Running-Sushi-Bandes im UI darstellen, während gleichzeitig ein technischer Log sichtbar bleibt.

## Glossar

- **Sushi_Belt_UI**: Die visuelle Komponente, die das animierte Sushi-Band im Browser darstellt
- **Plate_Visual**: Die visuelle Repräsentation eines Tellers auf dem Sushi-Band
- **Technical_Log**: Der Bereich im UI, der den technischen Ablauf der RxJS-Streams anzeigt
- **UI_Module**: Die neue separate Datei, die alle UI-Funktionen bereitstellt
- **Consumed_Sushi_Display**: Der Bereich, der konsumierte Sushi-Stücke mit Soja anzeigt
- **Table_Area**: Der Bereich im UI, der den Tisch des Benutzers darstellt, auf dem ausgewählte Teller landen

## Requirements

### Requirement 1: Visuelle Sushi-Band-Animation

**User Story:** Als Benutzer möchte ich ein animiertes Sushi-Band sehen, damit ich den RxJS-Stream visuell nachvollziehen kann.

#### Acceptance Criteria

1. WHEN das Sushi-Band gestartet wird, THEN THE Sushi_Belt_UI SHALL ein horizontales Band mit animierten Tellern anzeigen
2. WHEN ein neuer Teller vom sushiBelt$ Observable emittiert wird, THEN THE Sushi_Belt_UI SHALL einen neuen Plate_Visual am Anfang des Bandes einfügen
3. WHILE ein Plate_Visual auf dem Band ist, THE Sushi_Belt_UI SHALL diesen von links nach rechts über das Band animieren
4. WHEN ein Plate_Visual das Ende des Bandes erreicht, THEN THE Sushi_Belt_UI SHALL diesen vom DOM entfernen
5. THE Plate_Visual SHALL den Teller-Inhalt (Sushi-Typen A, B, C) und die Teller-ID anzeigen

### Requirement 2: Teller-Auswahl und Tisch-Animation

**User Story:** Als Benutzer möchte ich sehen, wie ausgewählte Teller vom Sushi-Band zu meinem Tisch wandern, damit ich die filter-Operation des Streams visuell nachvollziehen kann.

#### Acceptance Criteria

1. WHEN die iWantThis-Funktion einen Teller akzeptiert, THEN THE Plate_Visual SHALL visuell hervorgehoben werden (z.B. grüner Rahmen, Glow-Effekt)
2. WHEN die iWantThis-Funktion einen Teller ablehnt, THEN THE Plate_Visual SHALL normal weiterlaufen ohne Hervorhebung
3. WHEN ein Teller ausgewählt wird, THEN THE Technical_Log SHALL einen entsprechenden Eintrag anzeigen
4. WHEN die iWantThis-Funktion einen Teller akzeptiert, THEN THE Plate_Visual SHALL vom Sushi-Band zum Table_Area animiert werden
5. WHEN ein Teller zum Table_Area animiert wird, THEN THE Plate_Visual SHALL vom Sushi-Band entfernt werden
6. WHEN ein Teller auf dem Table_Area ankommt, THEN THE Plate_Visual SHALL dort verbleiben bis das Sushi konsumiert wird

### Requirement 3: Technischer Log im UI

**User Story:** Als Entwickler möchte ich den technischen Ablauf im UI sehen, damit ich die RxJS-Operationen nachvollziehen kann, ohne die Browser-Konsole öffnen zu müssen.

#### Acceptance Criteria

1. THE Technical_Log SHALL permanent im UI sichtbar sein
2. WHEN ein Teller auf dem Band erscheint, THEN THE Technical_Log SHALL einen Eintrag mit Teller-ID und Inhalt anzeigen
3. WHEN ein Sushi mit Soja konsumiert wird, THEN THE Technical_Log SHALL einen entsprechenden Eintrag anzeigen
4. WHEN das Band gestoppt wird, THEN THE Technical_Log SHALL eine Stopp-Nachricht anzeigen
5. WHEN das Band gestartet wird, THEN THE Technical_Log SHALL eine Start-Nachricht anzeigen
6. THE Technical_Log SHALL automatisch zum neuesten Eintrag scrollen
7. THE Technical_Log SHALL maximal die letzten 50 Einträge anzeigen, um Performance zu gewährleisten

### Requirement 4: Konsumiertes Sushi Anzeige

**User Story:** Als Benutzer möchte ich sehen, welches Sushi ich konsumiert habe, damit ich das Ergebnis des Streams visuell nachvollziehen kann.

#### Acceptance Criteria

1. WHEN ein Sushi mit Soja vom sushi$ Observable emittiert wird, THEN THE Consumed_Sushi_Display SHALL das Sushi-Stück visuell anzeigen
2. THE Consumed_Sushi_Display SHALL den Sushi-Typ, die Teller-ID und das Soja-Symbol anzeigen
3. THE Consumed_Sushi_Display SHALL parallel zum Sushi-Band sichtbar sein

### Requirement 5: Modulare Code-Struktur

**User Story:** Als Entwickler möchte ich, dass die UI-Logik in einer separaten Datei liegt, damit der bestehende Code minimal verändert wird.

#### Acceptance Criteria

1. THE UI_Module SHALL in einer neuen Datei `src/ui.ts` implementiert werden
2. THE UI_Module SHALL Funktionen exportieren, die als Callbacks für die RxJS-Subscriptions verwendet werden können
3. WHEN die UI-Funktionen verwendet werden, THEN THE helpers.ts SHALL unverändert bleiben
4. WHEN die UI-Funktionen verwendet werden, THEN THE index.ts SHALL nur minimale Änderungen erfordern (Import und Callback-Ersetzung)
5. THE UI_Module SHALL eine Initialisierungsfunktion bereitstellen, die die notwendigen DOM-Elemente erstellt

### Requirement 6: Parallele Ansicht

**User Story:** Als Benutzer möchte ich die Visualisierung und den technischen Log gleichzeitig sehen, damit ich beide Perspektiven vergleichen kann.

#### Acceptance Criteria

1. THE Sushi_Belt_UI SHALL im oberen Bereich des Bildschirms angezeigt werden
2. THE Table_Area SHALL unterhalb des Sushi-Bandes angezeigt werden
3. THE Technical_Log SHALL im unteren Bereich oder seitlich angezeigt werden
4. THE Consumed_Sushi_Display SHALL neben oder unter dem Sushi-Band angezeigt werden
5. WHILE das Band läuft, THE Benutzer SHALL alle vier Bereiche gleichzeitig sehen können ohne zu scrollen

### Requirement 7: Responsive Design

**User Story:** Als Benutzer möchte ich die Visualisierung auf verschiedenen Bildschirmgrößen nutzen können.

#### Acceptance Criteria

1. THE Sushi_Belt_UI SHALL sich an verschiedene Bildschirmbreiten anpassen
2. THE Table_Area SHALL sich an verschiedene Bildschirmbreiten anpassen
3. IF die Bildschirmbreite unter 768px liegt, THEN THE Layout SHALL die Bereiche vertikal stapeln
4. THE Plate_Visual SHALL eine angemessene Größe für Touch-Geräte haben

### Requirement 8: Tisch-Bereich Darstellung

**User Story:** Als Benutzer möchte ich einen sichtbaren Tisch-Bereich haben, auf dem meine ausgewählten Teller landen.

#### Acceptance Criteria

1. THE Table_Area SHALL permanent im UI sichtbar sein
2. THE Table_Area SHALL visuell als Tisch erkennbar sein (z.B. Holz-Textur, Tischform)
3. WHEN ein Teller auf dem Table_Area landet, THEN THE Plate_Visual SHALL dort sichtbar platziert werden
4. THE Table_Area SHALL mehrere Teller gleichzeitig anzeigen können
5. WHEN ein Sushi vom Teller konsumiert wird, THEN THE Plate_Visual SHALL vom Table_Area entfernt werden
