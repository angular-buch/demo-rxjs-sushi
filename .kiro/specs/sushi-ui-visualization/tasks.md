# Implementation Plan: Sushi UI Visualization

## Übersicht

Dieser Plan beschreibt die schrittweise Implementierung der visuellen UI-Darstellung für das RxJS Sushi-Belt-Demo. Die Implementierung erfolgt in TypeScript und folgt dem modularen Ansatz mit minimalen Änderungen am bestehenden Code.

**Erweiterung:** Ausgewählte Teller werden vom Sushi-Band zu einem Tisch-Bereich animiert.

## Tasks

- [x] 1. UI-Modul Grundstruktur erstellen
  - [x] 1.1 Erstelle `src/ui.ts` mit Basis-Exports und Konfiguration
    - Definiere UI_CONFIG Konstanten (Animation-Dauer, Max-Log-Einträge, Emojis)
    - Exportiere leere Funktions-Stubs für alle Callbacks
    - _Requirements: 5.1, 5.2_

  - [x] 1.2 Implementiere `initUI()` Funktion
    - Erstelle DOM-Container für Sushi-Belt, Technical-Log und Consumed-Display
    - Füge Container in das bestehende HTML ein
    - _Requirements: 5.5_

- [x] 2. Technical Log implementieren
  - [x] 2.1 Implementiere `logToUI()` Funktion
    - Erstelle Log-Einträge mit Timestamp und Typ-Styling
    - Implementiere Auto-Scroll zum neuesten Eintrag
    - Implementiere Limit von 50 Einträgen (älteste entfernen)
    - _Requirements: 3.2, 3.3, 3.6, 3.7_

  - [ ]* 2.2 Write property test für Log Entry Limit
    - **Property 4: Log Entry Limit Invariant**
    - **Validates: Requirements 3.7**

  - [ ]* 2.3 Write property test für Auto-Scroll
    - **Property 7: Auto-Scroll Behavior**
    - **Validates: Requirements 3.6**

- [x] 3. Sushi-Belt Visualisierung implementieren
  - [x] 3.1 Implementiere `onPlateAppear()` Funktion
    - Erstelle Plate-Visual DOM-Element mit ID und Inhalt
    - Starte CSS-Animation für Bewegung von links nach rechts
    - Setze Timeout für automatische Entfernung nach Animation
    - Füge Log-Eintrag hinzu
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 3.2_

  - [ ]* 3.2 Write property test für Plate Rendering
    - **Property 1: Plate Rendering Completeness**
    - **Validates: Requirements 1.2, 1.5**

  - [ ]* 3.3 Write property test für Animation Lifecycle
    - **Property 5: Plate Animation Lifecycle**
    - **Validates: Requirements 1.3, 1.4**

  - [x] 3.4 Implementiere `onPlateSelected()` Funktion
    - Finde Plate-Visual anhand der ID
    - Füge "selected" CSS-Klasse hinzu für Hervorhebung
    - Füge Log-Eintrag hinzu
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 3.5 Write property test für Selection Feedback
    - **Property 2: Plate Selection Visual Feedback**
    - **Validates: Requirements 2.1, 2.2**

- [x] 4. Checkpoint - Basis-Funktionalität testen
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Consumed Sushi Display implementieren
  - [x] 5.1 Implementiere `onSushiConsumed()` Funktion
    - Erstelle Consumed-Item DOM-Element mit Sushi-Typ, ID und Soja
    - Füge Element zum Consumed-Display hinzu
    - Füge Log-Eintrag hinzu
    - _Requirements: 4.1, 4.2, 3.3_

  - [ ]* 5.2 Write property test für Consumed Rendering
    - **Property 6: Consumed Sushi Rendering**
    - **Validates: Requirements 4.1, 4.2**

  - [ ]* 5.3 Write property test für Log Entry Creation
    - **Property 3: Log Entry Creation**
    - **Validates: Requirements 2.3, 3.2, 3.3**

- [x] 6. Start/Stop Funktionen implementieren
  - [x] 6.1 Implementiere `onStart()` und `onStop()` Funktionen
    - Füge Start/Stop Log-Nachrichten hinzu
    - Bereinige aktive Animationen bei Stop
    - _Requirements: 3.4, 3.5_

- [x] 7. CSS-Styling hinzufügen
  - [x] 7.1 Erweitere `src/style.css` mit UI-Komponenten-Styles
    - Styling für Sushi-Belt-Container und Plate-Visuals
    - Animation-Keyframes für Plate-Bewegung
    - Styling für Technical-Log und Log-Einträge
    - Styling für Consumed-Display
    - Selected-State Styling mit Glow-Effekt
    - _Requirements: 1.1, 2.1, 6.1, 6.2, 6.3_

  - [x] 7.2 Implementiere responsive Styles
    - Media-Query für Bildschirmbreite unter 768px
    - Vertikales Stacking der Bereiche auf kleinen Bildschirmen
    - _Requirements: 7.1, 7.2_

- [x] 8. Integration in bestehenden Code
  - [x] 8.1 Aktualisiere `src/index.html`
    - Entferne Hinweis auf Konsole
    - Füge Container-Platzhalter für UI hinzu
    - _Requirements: 3.1, 6.4_

  - [x] 8.2 Aktualisiere `src/index.ts` mit UI-Integration
    - Importiere UI-Funktionen aus ui.ts
    - Rufe initUI() beim Laden auf
    - Ersetze console.log Aufrufe durch UI-Callbacks
    - Behalte minimale Änderungen bei
    - _Requirements: 5.3, 5.4_

- [x] 9. Final Checkpoint - Vollständige Integration testen
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Table Area implementieren
  - [x] 10.1 Erweitere `initUI()` um Table Area Container
    - Erstelle `#table-area` Container mit Überschrift
    - Erstelle `#table-surface` für Teller-Platzierung
    - _Requirements: 8.1, 8.2_

  - [x] 10.2 Implementiere Table Area CSS-Styling
    - Styling für `#table-area` und `#table-surface`
    - Holz-Textur oder Tisch-ähnliches Design
    - Positionierung unterhalb des Sushi-Bandes
    - Responsive Anpassungen für kleine Bildschirme
    - _Requirements: 6.2, 7.2, 8.2_

- [x] 11. Teller-zu-Tisch Animation implementieren
  - [x] 11.1 Erweitere `onPlateSelected()` mit Tisch-Animation
    - Stoppe die Band-Animation für den ausgewählten Teller
    - Berechne aktuelle Position und Zielposition auf dem Tisch
    - Starte CSS-Transition zum Tisch
    - _Requirements: 2.4_

  - [x] 11.2 Implementiere `animatePlateToTable()` Hilfsfunktion
    - Setze CSS-Custom-Properties für Zielposition
    - Füge `.moving-to-table` CSS-Klasse hinzu
    - Implementiere Animation-Keyframes für Bewegung zum Tisch
    - _Requirements: 2.4_

  - [ ]* 11.3 Write property test für Animation Trigger
    - **Property 8: Plate-to-Table Animation Trigger**
    - **Validates: Requirements 2.4**

- [x] 12. Teller-Transfer und Tisch-Verwaltung
  - [x] 12.1 Implementiere Teller-Transfer nach Animation
    - Entferne Teller vom Band nach Animation-Ende
    - Erstelle neues Teller-Element auf dem Tisch
    - Verwalte `tablePlates` Map für Tisch-Teller
    - _Requirements: 2.5, 8.3_

  - [x] 12.2 Implementiere CSS für Teller auf dem Tisch
    - `.plate-visual.on-table` Styling
    - Positionierung mehrerer Teller nebeneinander
    - _Requirements: 8.3, 8.4_

  - [ ]* 12.3 Write property test für Plate Transfer
    - **Property 9: Plate Transfer Completeness**
    - **Validates: Requirements 2.5, 8.3**

  - [ ]* 12.4 Write property test für Multiple Plates
    - **Property 11: Multiple Plates on Table Invariant**
    - **Validates: Requirements 8.4**

- [x] 13. Teller-Entfernung bei Konsum
  - [x] 13.1 Erweitere `onSushiConsumed()` um Teller-Entfernung
    - Finde entsprechenden Teller auf dem Tisch anhand der Plate-ID
    - Entferne Teller-Element vom Tisch
    - Aktualisiere `tablePlates` Map
    - _Requirements: 2.6, 8.5_

  - [ ]* 13.2 Write property test für Table Plate Lifecycle
    - **Property 10: Table Plate Lifecycle**
    - **Validates: Requirements 2.6, 8.5**

- [x] 14. Checkpoint - Tisch-Animation testen
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Animation CSS-Keyframes
  - [x] 15.1 Implementiere `.moving-to-table` Animation
    - CSS-Keyframes für Bewegung mit `transform: translate()`
    - Verwende CSS-Custom-Properties für dynamische Zielposition
    - Transition-Dauer aus UI_CONFIG
    - _Requirements: 2.4_

- [x] 16. Final Checkpoint - Vollständige Tisch-Animation testen
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks mit `*` markiert sind optional und können für ein schnelleres MVP übersprungen werden
- Jeder Task referenziert spezifische Requirements für Nachverfolgbarkeit
- Checkpoints stellen inkrementelle Validierung sicher
- Property Tests validieren universelle Korrektheitseigenschaften
- Unit Tests validieren spezifische Beispiele und Edge Cases
- Tasks 1-9 sind bereits implementiert (bestehende Funktionalität)
- Tasks 10-16 sind neu für die Tisch-Animation Erweiterung
