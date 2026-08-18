import type { Difficulty } from './types';

let idCounter = 0;

export function makeId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}-${Math.floor(Math.random() * 1e6)}`;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  return b === 0 ? a : gcd(b, a % b);
}

export function simplifyFraction(numerator: number, denominator: number): [number, number] {
  const divisor = gcd(numerator, denominator) || 1;
  return [numerator / divisor, denominator / divisor];
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function xpForDifficulty(difficulty: Difficulty): number {
  return { 1: 10, 2: 15, 3: 20 }[difficulty];
}

// Renders negative numbers with parentheses (e.g. "(-8)") so they read
// unambiguously inside an expression like "5 + (-8)".
export function formatSigned(n: number): string {
  return n < 0 ? `(${n})` : String(n);
}

/**
 * Builds a shuffled multiple-choice list containing the correct answer plus
 * `count` distinct plausible distractors produced by `distractorFn`.
 */
export function makeChoices(correct: string, distractorFn: () => string, count = 3): string[] {
  const choices = new Set<string>([correct]);
  let attempts = 0;
  while (choices.size < count + 1 && attempts < 50) {
    choices.add(distractorFn());
    attempts += 1;
  }
  return shuffle(Array.from(choices));
}

// Pads two numbers' decimal strings with trailing zeros so their decimal
// points line up when stacked vertically (e.g. 3.5 and 12.75 -> "3.50", "12.75").
export function alignDecimalStrings(a: number, b: number): [string, string] {
  const placesOf = (n: number) => (String(n).split('.')[1] ?? '').length;
  const places = Math.max(placesOf(a), placesOf(b));
  return [a.toFixed(places), b.toFixed(places)];
}

export function isNumericAnswerCorrect(submitted: string, expected: string, tolerance = 0.001): boolean {
  const a = Number(submitted);
  const b = Number(expected);
  if (Number.isNaN(a) || Number.isNaN(b)) return submitted.trim() === expected.trim();
  return Math.abs(a - b) < tolerance;
}
