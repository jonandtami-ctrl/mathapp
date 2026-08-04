import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { makeId, randomInt, xpForDifficulty } from '../utils';

const GRADE_WHOLE_MAX: Record<Grade, number> = {
  1: 3,
  2: 5,
  3: 10,
  4: 30,
  5: 100,
  6: 500,
  7: 1000,
  8: 3000,
};

function randomDecimal(wholeMax: number, decimalPlaces: number): number {
  const whole = randomInt(0, wholeMax);
  const fractionMax = 10 ** decimalPlaces - 1;
  const fraction = randomInt(0, fractionMax);
  return Number(`${whole}.${String(fraction).padStart(decimalPlaces, '0')}`);
}

function generateAddSubtract(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const decimalPlaces = difficulty === 1 ? 1 : 2;
  const wholeMax = Math.max(3, Math.floor(GRADE_WHOLE_MAX[grade] * (difficulty / 3)));
  const isAddition = Math.random() < 0.5;

  let a = randomDecimal(wholeMax, decimalPlaces);
  let b = randomDecimal(wholeMax, decimalPlaces);
  if (!isAddition && b > a) [a, b] = [b, a];

  const rawAnswer = isAddition ? a + b : a - b;
  const answer = Number(rawAnswer.toFixed(decimalPlaces));
  const operator = isAddition ? '+' : '-';

  return {
    id: makeId('decimals'),
    grade,
    category: 'decimals',
    difficulty,
    text: `${a} ${operator} ${b} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    explanation: `${a} ${operator} ${b} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}

// Grade 6+ multiplies decimals (real curriculum content, distinct from
// add/subtract). Kept to 1 decimal place on each operand so the product
// stays readable (at most 2 decimal places).
function generateMultiply(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const wholeMax = Math.min(20, Math.max(3, Math.floor(GRADE_WHOLE_MAX[grade] * (difficulty / 3))));
  const a = randomDecimal(wholeMax, 1);
  const bIsWhole = Math.random() < 0.4;
  const b = bIsWhole ? randomInt(2, 9) : randomDecimal(Math.min(wholeMax, 9), 1);

  const answer = Number((a * b).toFixed(2));

  return {
    id: makeId('decimals'),
    grade,
    category: 'decimals',
    difficulty,
    text: `${a} × ${b} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    explanation: `${a} × ${b} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}

export function generateDecimals(grade: Grade, difficulty: Difficulty): EngineQuestion {
  if (grade >= 6 && Math.random() < 0.35) return generateMultiply(grade, difficulty);
  return generateAddSubtract(grade, difficulty);
}
