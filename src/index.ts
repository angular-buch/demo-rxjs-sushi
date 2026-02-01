import './style.css';
import { Observable } from 'rxjs';
import { filter, concatMap, mergeMap, switchMap, exhaustMap, withLatestFrom, tap } from 'rxjs/operators';

import { SushiWithSoja, sushiBelt$, soja$, iWantThis, getSushiFromPlate } from './helpers'
import { initUI, onPlateAppear, onPlateSelected, onSushiConsumed, onStart } from './ui'

// Initialize UI on load
initUI();

// Main sushi stream: filter plates, flatten to sushi pieces, add soy sauce
const sushi$: Observable<SushiWithSoja> = sushiBelt$.pipe(
  filter(plate => iWantThis(plate)),
  tap(plate => onPlateSelected(plate)),  // Call UI callback when plate is selected
  // Try different flattening operators: concatMap, mergeMap, switchMap, exhaustMap
  concatMap(plate => getSushiFromPlate(plate).pipe(
    withLatestFrom(soja$)
  ))
);

// Auto-start on page load
onStart();

// Log all plates from the belt
sushiBelt$.subscribe(plate => onPlateAppear(plate));

// Log consumed sushi with soy sauce
sushi$.subscribe(sushi => onSushiConsumed(sushi));
