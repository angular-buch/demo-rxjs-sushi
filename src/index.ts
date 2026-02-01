import './style.css';
import { Observable, Subject } from 'rxjs';
import { filter, concatMap, mergeMap, switchMap, exhaustMap, withLatestFrom, takeUntil, tap } from 'rxjs/operators';

import { SushiWithSoja, sushiBelt$, soja$, iWantThis, getSushiFromPlate } from './helpers'
import { initUI, onPlateAppear, onPlateSelected, onSushiConsumed, onStart, onStop } from './ui'

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

// Subject to signal stream termination
const stop$ = new Subject<void>();

document.getElementById('stopBtn')?.addEventListener('click', () => {
  stop$.next();
  onStop();
});

document.getElementById('startBtn')?.addEventListener('click', () => {
  onStart();

  // Log all plates from the belt
  sushiBelt$.pipe(takeUntil(stop$))
    .subscribe(plate => onPlateAppear(plate))

  // Log consumed sushi with soy sauce
  sushi$.pipe(takeUntil(stop$))
    .subscribe(sushi => onSushiConsumed(sushi));
});
