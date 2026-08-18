import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { formatSigned, makeId, randomInt, xpForDifficulty } from '../utils';

const GRADE_MAX: Record<Grade, number> = {
  1: 20,
  2: 60,
  3: 150,
  4: 500,
  5: 2000,
  6: 8000,
  7: 20000,
  8: 50000,
};
const DIFFICULTY_FACTOR: Record<Difficulty, number> = { 1: 0.2, 2: 0.55, 3: 1 };

export function generateSubtraction(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const max = Math.max(10, Math.floor(GRADE_MAX[grade] * DIFFICULTY_FACTOR[difficulty]));

  // Grade 7-8 works with true integer subtraction (negative operands and
  // results allowed), matching real middle-school curriculum. Younger grades
  // keep results non-negative to avoid introducing negative numbers early.
  const useIntegers = grade >= 7 && difficulty >= 2;
  let a: number;
  let b: number;
  if (useIntegers) {
    a = randomInt(1, max) * (Math.random() < 0.5 ? -1 : 1);
    b = randomInt(1, max) * (Math.random() < 0.5 ? -1 : 1);
  } else {
    a = randomInt(1, max);
    b = randomInt(1, a);
  }
  const answer = a - b;

  return {
    id: makeId('subtraction'),
    grade,
    category: 'subtraction',
    difficulty,
    text: `${formatSigned(a)} - ${formatSigned(b)} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    vertical: { top: String(a), operator: '-', bottom: String(b) },
    explanation: `${formatSigned(a)} - ${formatSigned(b)} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
