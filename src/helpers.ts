import { Observable, timer, Subject } from 'rxjs';
import { take, map, share } from 'rxjs/operators';

export type Sushi = string;

type Soja = 'SOJA';
const soja: Soja = 'SOJA';

export type SushiWithSoja = [Sushi, Soja];

export interface Plate {
  contents: Sushi[];
  id: number;
}

// Available plate templates with different sushi combinations
const plates: Omit<Plate, 'id'>[] = [
  { contents: ['A', 'A', 'A'] },
  { contents: ['B', 'B'] },
  { contents: ['A', 'B', 'C'] },
  { contents: ['C', 'C', 'C', 'C'] },
  { contents: ['C'] },
];

// Continuous soy sauce stream (hot observable)
const sojaSubject$ = new Subject<Soja>();
export const soja$ = sojaSubject$.asObservable();
timer(0, 600).pipe(map(() => soja))
  .subscribe(sojaSubject$);

// The sushi belt: emits plates every 2 seconds (hot observable)
export const sushiBelt$: Observable<Plate> = timer(100, 2000).pipe(
  map(id => ({ ...plates[randomNumber(0, plates.length)], id })),
  share()
);

// Generate random number within range
function randomNumber(min = 0, max = 5000): number {
  return Math.floor((Math.random() * max) + min)
}

// Predicate: randomly decide if we want to take a plate (60% chance)
export function iWantThis(plate: Plate): boolean {
  const want = Math.random() > 0.4;
  if (want) { console.log('🤩 DAS WILL ICH! Teller ' + plate.id) }

  return want;
}

// Convert plate to cold observable emitting individual sushi pieces
export function getSushiFromPlate(plate: Plate): Observable<Sushi> {
  return timer(randomNumber(), randomNumber()).pipe(
    take(plate.contents.length),
    map(i => plate.contents[i] + ' ' + plate.id)
  )
}
