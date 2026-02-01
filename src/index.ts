import './style.css';
import { Observable, Subject } from 'rxjs';
import { filter, concatMap, mergeMap, switchMap, exhaustMap, withLatestFrom, takeUntil } from 'rxjs/operators';

import { SushiWithSoja, sushiBelt$, soja$, iWantThis, getSushiFromPlate } from './helpers'

// Main sushi stream: filter plates, flatten to sushi pieces, add soy sauce
const sushi$: Observable<SushiWithSoja> = sushiBelt$.pipe(
  filter(plate => iWantThis(plate)),
  // Try different flattening operators: concatMap, mergeMap, switchMap, exhaustMap
  concatMap(plate => getSushiFromPlate(plate).pipe(
    withLatestFrom(soja$)
  ))
);

// Subject to signal stream termination
const stop$ = new Subject<void>();

document.getElementById('stopBtn')?.addEventListener('click', () => {
  stop$.next();
  console.log('SUSHI GESTOPPT 💥💥');
});

document.getElementById('startBtn')?.addEventListener('click', () => {
  console.log('SUSHI GESTARTET 🍣🍣')

  // Log all plates from the belt
  sushiBelt$.pipe(takeUntil(stop$))
    .subscribe(plate => console.log('🍽 Teller', plate.id, plate.contents))

  // Log consumed sushi with soy sauce
  sushi$.pipe(takeUntil(stop$))
    .subscribe(sushi => console.log('🍣', sushi));
});
