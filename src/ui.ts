/**
 * UI Module for Sushi Belt Visualization
 *
 * This module provides all UI functions for the visual representation
 * of the RxJS Sushi Belt demo.
 *
 * Requirements: 5.1, 5.2
 */

import type { Plate, SushiWithSoja } from './helpers';

// ============================================================================
// Types
// ============================================================================

interface PlateVisualState {
  plateId: number;
  element: HTMLElement;
  isSelected: boolean;
  isOnTable: boolean;
  animationTimeout: number | null;
}

// Map zur Verwaltung aller aktiven Plate Visuals
const activePlates: Map<number, PlateVisualState> = new Map();

// Map zur Verwaltung der Teller auf dem Tisch
const tablePlates: Map<number, PlateVisualState> = new Map();

// Export for testing purposes
export function getActivePlates(): Map<number, PlateVisualState> {
  return activePlates;
}

// Export for testing purposes
export function getTablePlates(): Map<number, PlateVisualState> {
  return tablePlates;
}

export type { PlateVisualState };

// ============================================================================
// Configuration
// ============================================================================

export const UI_CONFIG = {
  // Animation
  BELT_ANIMATION_DURATION: 8000,  // ms für komplette Durchfahrt
  PLATE_SPAWN_POSITION: -150,     // px vom linken Rand
  TABLE_ANIMATION_DURATION: 500,  // ms für Animation zum Tisch
  SELECTION_DELAY: 800,           // ms Verzögerung bevor Teller zum Tisch wandert (10% der Band-Animation)

  // Log
  MAX_LOG_ENTRIES: 50,

  // Sushi Emojis
  SUSHI_EMOJI: {
    'A': '🍣',
    'B': '🍙',
    'C': '🥟'
  } as Record<string, string>,

  SOJA_EMOJI: '🫘'
};

// ============================================================================
// Exported Functions (Stubs)
// ============================================================================

/**
 * Initialisierung - erstellt alle DOM-Container
 * Requirements: 5.5
 */
export function initUI(): void {
  // Prüfe ob bereits initialisiert
  if (document.getElementById('sushi-app')) {
    console.warn('[UI] initUI() wurde bereits aufgerufen');
    return;
  }

  // Hauptcontainer erstellen
  const sushiApp = document.createElement('div');
  sushiApp.id = 'sushi-app';

  // Sushi Belt Bereich erstellen
  const sushiBeltContainer = document.createElement('div');
  sushiBeltContainer.id = 'sushi-belt-container';

  const sushiBelt = document.createElement('div');
  sushiBelt.id = 'sushi-belt';

  sushiBeltContainer.appendChild(sushiBelt);

  // Unterer Bereich: Log und Consumed Display nebeneinander
  const bottomSection = document.createElement('div');
  bottomSection.id = 'bottom-section';

  // Technischer Log erstellen
  const technicalLog = document.createElement('div');
  technicalLog.id = 'technical-log';

  const logHeader = document.createElement('h3');
  logHeader.textContent = '📋 Technischer Log';

  const logEntries = document.createElement('div');
  logEntries.id = 'log-entries';

  technicalLog.appendChild(logHeader);
  technicalLog.appendChild(logEntries);

  // Konsumiertes Sushi erstellen
  const consumedSushi = document.createElement('div');
  consumedSushi.id = 'consumed-sushi';

  const consumedHeader = document.createElement('h3');
  consumedHeader.textContent = '🍱 Konsumiert';

  const consumedEntries = document.createElement('div');
  consumedEntries.id = 'consumed-entries';

  consumedSushi.appendChild(consumedHeader);
  consumedSushi.appendChild(consumedEntries);

  // Bottom Section zusammenbauen
  bottomSection.appendChild(technicalLog);
  bottomSection.appendChild(consumedSushi);

  // Tisch-Bereich für ausgewählte Teller erstellen (Requirements 8.1, 8.2)
  const tableArea = document.createElement('div');
  tableArea.id = 'table-area';

  const tableHeader = document.createElement('h3');
  tableHeader.textContent = '🪑 Mein Tisch';

  const tableSurface = document.createElement('div');
  tableSurface.id = 'table-surface';

  tableArea.appendChild(tableHeader);
  tableArea.appendChild(tableSurface);

  // Hauptcontainer zusammenbauen
  sushiApp.appendChild(sushiBeltContainer);
  sushiApp.appendChild(tableArea);  // Table Area zwischen Belt und Bottom Section
  sushiApp.appendChild(bottomSection);

  // In das bestehende HTML einfügen (nach dem Placeholder oder Paragraph)
  const placeholder = document.getElementById('sushi-ui-placeholder');
  if (placeholder && placeholder.parentNode) {
    placeholder.parentNode.insertBefore(sushiApp, placeholder);
    placeholder.remove();
  } else {
    // Fallback: Am Ende des Body einfügen
    document.body.appendChild(sushiApp);
  }
}

/**
 * Callback wenn ein Teller auf dem Band erscheint
 * @param plate - Der Teller, der auf dem Band erscheint
 * Requirements: 1.2, 1.3, 1.4, 1.5, 3.2
 */
export function onPlateAppear(plate: Plate): void {
  // Get the sushi belt container
  const sushiBelt = document.getElementById('sushi-belt');
  if (!sushiBelt) {
    console.warn('[UI] Element #sushi-belt nicht gefunden');
    return;
  }

  // Create plate-visual DOM element (Requirement 1.2)
  const plateElement = document.createElement('div');
  plateElement.className = 'plate-visual';
  plateElement.setAttribute('data-plate-id', String(plate.id));

  // Create plate-id span (Requirement 1.5)
  const plateIdSpan = document.createElement('span');
  plateIdSpan.className = 'plate-id';
  plateIdSpan.textContent = `#${plate.id}`;

  // Create plate-contents span with emojis (Requirement 1.5)
  const plateContentsSpan = document.createElement('span');
  plateContentsSpan.className = 'plate-contents';
  const contentsWithEmojis = plate.contents
    .map(sushi => UI_CONFIG.SUSHI_EMOJI[sushi] || sushi)
    .join(' ');
  plateContentsSpan.textContent = contentsWithEmojis;

  // Assemble plate element
  plateElement.appendChild(plateIdSpan);
  plateElement.appendChild(plateContentsSpan);

  // Add to sushi belt container (Requirement 1.2)
  sushiBelt.appendChild(plateElement);

  // Start CSS animation by adding 'animate' class (Requirement 1.3)
  // Use requestAnimationFrame to ensure the element is rendered before animation starts
  requestAnimationFrame(() => {
    plateElement.classList.add('animate');
  });

  // Set timeout for automatic removal after animation (Requirement 1.4)
  const animationTimeout = window.setTimeout(() => {
    // Remove element from DOM
    if (plateElement.parentNode) {
      plateElement.parentNode.removeChild(plateElement);
    }
    // Remove from activePlates map
    activePlates.delete(plate.id);
  }, UI_CONFIG.BELT_ANIMATION_DURATION);

  // Track the plate in activePlates Map
  const plateState: PlateVisualState = {
    plateId: plate.id,
    element: plateElement,
    isSelected: false,
    isOnTable: false,
    animationTimeout: animationTimeout
  };
  activePlates.set(plate.id, plateState);

  // Log entry for plate appearance (Requirement 3.2)
  const contentsString = plate.contents.join(', ');
  logToUI(`🍽 Teller ${plate.id}: ${contentsString}`, 'info');
}

/**
 * Callback wenn ein Teller ausgewählt wird (iWantThis = true)
 * Startet Animation vom Band zum Tisch nach kurzer Verzögerung
 * @param plate - Der ausgewählte Teller
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
export function onPlateSelected(plate: Plate): void {
  // Find plate-visual element by ID from activePlates Map
  const plateState = activePlates.get(plate.id);

  let plateElement: HTMLElement | null = null;

  if (plateState) {
    plateElement = plateState.element;

    // Add "selected" CSS class for visual highlighting immediately (Requirement 2.1)
    // The plate continues moving on the belt with the green glow
    plateElement.classList.add('selected');

    // Update isSelected flag in activePlates Map
    plateState.isSelected = true;

    // Delay the table animation so the selection is visible on the belt
    // The plate keeps moving for SELECTION_DELAY ms before being moved to table
    setTimeout(() => {
      // Stop the belt animation by removing 'animate' class (Requirement 2.4)
      plateElement!.classList.remove('animate');

      // Clear the belt animation timeout since the plate is being moved to table
      if (plateState.animationTimeout !== null) {
        window.clearTimeout(plateState.animationTimeout);
        plateState.animationTimeout = null;
      }

      // Animate the plate to the table (Requirement 2.4)
      animatePlateToTable(plateState);
    }, UI_CONFIG.SELECTION_DELAY);
  } else {
    // Fallback: Try to find by data-plate-id attribute
    plateElement = document.querySelector(`[data-plate-id="${plate.id}"]`) as HTMLElement | null;

    if (!plateElement) {
      // Graceful failure: plate element doesn't exist (Error Handling)
      console.warn(`[UI] Plate-Visual für Teller ${plate.id} nicht gefunden`);
      return;
    }

    // Add "selected" CSS class for visual highlighting immediately (Requirement 2.1)
    plateElement.classList.add('selected');

    // Capture plateElement for closure
    const capturedPlateElement = plateElement;

    // Delay the table animation so the selection is visible on the belt
    setTimeout(() => {
      // Stop the belt animation by removing 'animate' class (Requirement 2.4)
      capturedPlateElement.classList.remove('animate');

      // Create a temporary plate state for the fallback case
      const fallbackPlateState: PlateVisualState = {
        plateId: plate.id,
        element: capturedPlateElement,
        isSelected: true,
        isOnTable: false,
        animationTimeout: null
      };

      // Animate the plate to the table (Requirement 2.4)
      animatePlateToTable(fallbackPlateState);
    }, UI_CONFIG.SELECTION_DELAY);
  }

  // Log entry for plate selection (Requirement 2.3)
  const contentsString = plate.contents.join(', ');
  logToUI(`✅ Teller ${plate.id} ausgewählt: ${contentsString}`, 'success');
}

/**
 * Callback wenn Sushi konsumiert wird
 * Entfernt den Teller vom Tisch
 * @param sushi - Das konsumierte Sushi mit Soja
 * Requirements: 4.1, 4.2, 3.3, 2.6, 8.5
 */
export function onSushiConsumed(sushi: SushiWithSoja): void {
  // Get the consumed-entries container
  const consumedEntries = document.getElementById('consumed-entries');
  if (!consumedEntries) {
    console.warn('[UI] Element #consumed-entries nicht gefunden');
    return;
  }

  // Extract sushi string and soja from tuple
  const [sushiString, _soja] = sushi;

  // Parse sushi string to extract type and plate ID (format: "A 1" = type A, plate 1)
  const parts = sushiString.split(' ');
  const sushiType = parts[0] || '';
  const plateIdString = parts[1] || '';
  const plateIdNumber = parseInt(plateIdString, 10);

  // Get emoji for sushi type (Requirement 4.2)
  const sushiEmoji = UI_CONFIG.SUSHI_EMOJI[sushiType] || sushiType;

  // Create consumed-item DOM element (Requirement 4.1)
  const consumedItem = document.createElement('div');
  consumedItem.className = 'consumed-item';

  // Format: "🍣 A 1 + 🫘" (emoji, type, plate ID, soja emoji) (Requirement 4.2)
  consumedItem.textContent = `${sushiEmoji} ${sushiType} ${plateIdString} + ${UI_CONFIG.SOJA_EMOJI}`;

  // Append to consumed-entries container (Requirement 4.1)
  consumedEntries.appendChild(consumedItem);

  // Log entry for consumed sushi (Requirement 3.3)
  logToUI(`🍱 Sushi ${sushiType} ${plateIdString} mit Soja konsumiert`, 'success');

  // Remove plate from table when sushi is consumed (Requirements 2.6, 8.5)
  if (!isNaN(plateIdNumber)) {
    // Find the plate on the table using the plate ID
    const plateState = tablePlates.get(plateIdNumber);

    if (plateState) {
      // Remove plate element from the DOM (Requirement 8.5)
      if (plateState.element.parentNode) {
        plateState.element.parentNode.removeChild(plateState.element);
      }

      // Remove plate from tablePlates Map (Requirement 8.5)
      tablePlates.delete(plateIdNumber);

      // Log entry about plate removal from table
      logToUI(`🍽 Teller ${plateIdNumber} vom Tisch entfernt`, 'info');
    } else {
      // Graceful failure: plate not on table (Error Handling - Konsum ohne Teller auf Tisch)
      logToUI(`ℹ️ Teller ${plateIdNumber} war nicht auf dem Tisch`, 'info');
    }
  }
}

/**
 * Callback für Start-Event
 * Requirements: 3.5
 */
export function onStart(): void {
  // Log start message (Requirement 3.5)
  logToUI('🚀 Sushi-Band gestartet', 'info');
}

/**
 * Callback für Stop-Event
 * Requirements: 3.4
 */
export function onStop(): void {
  // Log stop message (Requirement 3.4)
  logToUI('🛑 Sushi-Band gestoppt', 'warning');

  // Animation-Cleanup: Clear all active animations and timeouts to avoid memory leaks
  // (Design Document: Error Handling - Animation-Cleanup)
  activePlates.forEach((plateState) => {
    // Clear the animation timeout if it exists
    if (plateState.animationTimeout !== null) {
      window.clearTimeout(plateState.animationTimeout);
    }

    // Remove the plate element from DOM
    if (plateState.element.parentNode) {
      plateState.element.parentNode.removeChild(plateState.element);
    }
  });

  // Clear the activePlates Map
  activePlates.clear();

  // Clear plates from the table as well
  tablePlates.forEach((plateState) => {
    if (plateState.element.parentNode) {
      plateState.element.parentNode.removeChild(plateState.element);
    }
  });

  // Clear the tablePlates Map
  tablePlates.clear();
}

/**
 * Log-Funktion für technische Ausgaben
 * @param message - Die Log-Nachricht
 * @param type - Der Typ der Nachricht (info, success, warning)
 * Requirements: 3.2, 3.3, 3.6, 3.7
 */
export function logToUI(message: string, type: 'info' | 'success' | 'warning' = 'info'): void {
  const logEntries = document.getElementById('log-entries');
  if (!logEntries) {
    console.warn('[UI] Element #log-entries nicht gefunden');
    return;
  }

  // Create log entry element
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;

  // Add timestamp
  const timestamp = new Date();
  const timeString = timestamp.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });

  // Set content with timestamp and message
  logEntry.textContent = `[${timeString}] ${message}`;

  // Append to log container
  logEntries.appendChild(logEntry);

  // Enforce max log entries limit (Requirement 3.7)
  while (logEntries.children.length > UI_CONFIG.MAX_LOG_ENTRIES) {
    const oldestEntry = logEntries.firstChild;
    if (oldestEntry) {
      logEntries.removeChild(oldestEntry);
    }
  }

  // Auto-scroll to newest entry (Requirement 3.6)
  logEntries.scrollTop = logEntries.scrollHeight;
}

// ============================================================================
// Helper Functions for Table Animation
// ============================================================================

/**
 * Creates a new plate element for display on the table
 * @param plateState - The plate state to create an element for
 * @returns The created HTMLElement for the table
 */
function createTablePlateElement(plateState: PlateVisualState): HTMLElement {
  const originalElement = plateState.element;

  // Clone the plate element structure
  const tablePlate = document.createElement('div');
  tablePlate.className = 'plate-visual on-table';
  tablePlate.setAttribute('data-plate-id', String(plateState.plateId));

  // Copy the plate ID span
  const plateIdSpan = document.createElement('span');
  plateIdSpan.className = 'plate-id';
  const originalIdSpan = originalElement.querySelector('.plate-id');
  plateIdSpan.textContent = originalIdSpan ? originalIdSpan.textContent : `#${plateState.plateId}`;

  // Copy the plate contents span
  const plateContentsSpan = document.createElement('span');
  plateContentsSpan.className = 'plate-contents';
  const originalContentsSpan = originalElement.querySelector('.plate-contents');
  plateContentsSpan.textContent = originalContentsSpan ? originalContentsSpan.textContent : '';

  tablePlate.appendChild(plateIdSpan);
  tablePlate.appendChild(plateContentsSpan);

  return tablePlate;
}

/**
 * Animates a plate from the belt to the table area
 * Sets CSS custom properties for target position, adds moving-to-table class,
 * and handles the transfer after animation completes.
 * @param plateState - The plate state to animate to the table
 * Requirements: 2.4
 */
function animatePlateToTable(plateState: PlateVisualState): void {
  const plateElement = plateState.element;
  const tableArea = document.getElementById('table-surface');

  if (!tableArea) {
    console.warn('[UI] Element #table-surface nicht gefunden');
    return;
  }

  // Get current position of the plate on the belt (Requirement 2.4)
  const plateRect = plateElement.getBoundingClientRect();

  // Get target position on the table surface (Requirement 2.4)
  const tableRect = tableArea.getBoundingClientRect();

  // Set the plate to fixed position at its current location first
  plateElement.style.left = `${plateRect.left}px`;
  plateElement.style.top = `${plateRect.top}px`;

  // Calculate the translation needed (target - current) (Requirement 2.4)
  // Position plates side by side on the table
  const targetX = tableRect.left + (tablePlates.size * 80) + 10 - plateRect.left;
  const targetY = tableRect.top + 20 - plateRect.top;

  // Set CSS custom properties for the animation (Requirement 2.4)
  plateElement.style.setProperty('--target-x', `${targetX}px`);
  plateElement.style.setProperty('--target-y', `${targetY}px`);

  // Add 'moving-to-table' class to trigger the CSS animation (Requirement 2.4)
  plateElement.classList.add('moving-to-table');

  // After animation: Remove plate from belt and place on table
  setTimeout(() => {
    // Create new element for the table
    const tablePlate = createTablePlateElement(plateState);
    tableArea.appendChild(tablePlate);

    // Add to tablePlates Map with updated state
    tablePlates.set(plateState.plateId, {
      ...plateState,
      element: tablePlate,
      isOnTable: true
    });

    // Remove original from belt
    plateElement.remove();
    activePlates.delete(plateState.plateId);
  }, UI_CONFIG.TABLE_ANIMATION_DURATION);
}
