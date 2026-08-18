import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { formatSigned, makeId, randomInt, xpForDifficulty } from '../utils';

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
  let divisor = randomInt(2, GRADE_DIVISOR_MAX[grade][difficulty - 1]);
  let quotient = randomInt(2, GRADE_QUOTIENT_MAX[grade][difficulty - 1]);

  // Grade 7-8 practices sign rules for division, matching addition/
  // subtraction/multiplication's integer support at this grade band.
  const useIntegers = grade >= 7 && difficulty >= 2;
  if (useIntegers) {
    if (Math.random() < 0.5) divisor = -divisor;
    if (Math.random() < 0.5) quotient = -quotient;
  }

  const dividend = divisor * quotient;

  return {
    id: makeId('division'),
    grade,
    category: 'division',
    difficulty,
    text: `${formatSigned(dividend)} ÷ ${formatSigned(divisor)} = ?`,
    answer: String(quotient),
    inputMode: 'numeric',
    vertical: { top: String(dividend), operator: '÷', bottom: String(divisor) },
    explanation: `${formatSigned(dividend)} ÷ ${formatSigned(divisor)} = ${quotient}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
