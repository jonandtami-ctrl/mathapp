import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { makeId, randomInt, xpForDifficulty } from '../utils';

const GRADE_DIVISOR_MAX: Record<Grade, [number, number, number]> = {
  1: [2, 3, 4],
  2: [3, 5, 6],
  3: [5, 8, 12],
  4: [10, 12, 15],
  5: [12, 15, 20],
  6: [15, 20, 25],
  7: [18, 24, 30],
  8: [20, 28, 36],
};

const GRADE_QUOTIENT_MAX: Record<Grade, [number, number, number]> = {
  1: [2, 3, 5],
  2: [4, 6, 8],
  3: [5, 8, 12],
  4: [12, 15, 20],
  5: [15, 25, 40],
  6: [20, 40, 60],
  7: [30, 50, 80],
  8: [40, 60, 100],
};

export function generateDivision(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const divisor = randomInt(2, GRADE_DIVISOR_MAX[grade][difficulty - 1]);
  const quotient = randomInt(2, GRADE_QUOTIENT_MAX[grade][difficulty - 1]);
  const dividend = divisor * quotient;

  return {
    id: makeId('division'),
    grade,
    category: 'division',
    difficulty,
    text: `${dividend} ÷ ${divisor} = ?`,
    answer: String(quotient),
    inputMode: 'numeric',
    explanation: `${dividend} ÷ ${divisor} = ${quotient}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
