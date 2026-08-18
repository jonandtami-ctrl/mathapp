import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { formatSigned, makeId, randomInt, xpForDifficulty } from '../utils';

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
  let a = randomInt(2, factorMax);
  let b = randomInt(2, grade === 3 ? factorMax : Math.min(factorMax, 12));

  // Grade 7-8 practices sign rules (negative × negative = positive, etc.),
  // real middle-school integer-operations content.
  const useIntegers = grade >= 7 && difficulty >= 2;
  if (useIntegers) {
    if (Math.random() < 0.5) a = -a;
    if (Math.random() < 0.5) b = -b;
  }

  const answer = a * b;

  return {
    id: makeId('multiplication'),
    grade,
    category: 'multiplication',
    difficulty,
    text: `${formatSigned(a)} × ${formatSigned(b)} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    vertical: { top: String(a), operator: '×', bottom: String(b) },
    explanation: `${formatSigned(a)} × ${formatSigned(b)} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
