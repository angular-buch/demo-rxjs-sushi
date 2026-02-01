# 🍣 Sushi mit RxJS

Eine interaktive Demo, die RxJS-Flattening-Operatoren anhand eines Sushi-Restaurant-Beispiels erklärt.

## Konzept

Stell dir ein Sushi-Restaurant mit Laufband vor:
- Das **Laufband** (`sushiBelt$`) ist ein Observable, das Teller mit Sushi liefert
- Mit `filter()` entscheiden wir, welche Teller wir nehmen
- Die **Flattening-Operatoren** bestimmen, wie wir die Sushi-Röllchen essen

### Die vier Strategien

| Operator | Verhalten |
|----------|-----------|
| `concatMap` | Gierig, aber ruhig – erst den aktuellen Teller leer essen |
| `mergeMap` | Alles durcheinander – von mehreren Tellern parallel essen |
| `switchMap` | Verschwenderisch – alten Teller wegwerfen, neuen nehmen |
| `exhaustMap` | Bescheiden – keine neuen Teller, solange einer da ist |

## Installation

```bash
npm install
```

## Starten

```bash
npm run dev
```

Öffne die Browser-Konsole, um die Sushi-Ströme zu beobachten!

## Deployment

Das Projekt wird automatisch via GitHub Actions auf GitHub Pages deployed, wenn auf den `main`-Branch gepusht wird.

```bash
npm run build   # Manueller Build nach dist/
```
