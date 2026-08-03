import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { makeId, randomInt, xpForDifficulty } from '../utils';

// [minFactorMax, maxFactorMax] range for the larger of the two factors, scaled by difficulty within a grade.
const GRADE_FACTOR_MAX: Record<Grade, [number, number, number]> = {
  1: [2, 3, 5],
  2: [3, 5, 8],
  3: [5, 8, 12],
  4: [12, 15, 20],
  5: [20, 40, 60],
  6: [40, 75, 120],
  7: [60, 100, 150],
  8: [90, 140, 200],
};

export function generateMultiplication(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const factorMax = GRADE_FACTOR_MAX[grade][difficulty - 1];
  const a = randomInt(2, factorMax);
  const b = randomInt(2, grade === 3 ? factorMax : Math.min(factorMax, 12));
  const answer = a * b;

  return {
    id: makeId('multiplication'),
    grade,
    category: 'multiplication',
    difficulty,
    text: `${a} × ${b} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    explanation: `${a} × ${b} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
