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

export function generateAddition(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const max = Math.max(10, Math.floor(GRADE_MAX[grade] * DIFFICULTY_FACTOR[difficulty]));

  // Grade 7-8 works with integers (negative numbers), matching real
  // middle-school curriculum rather than just bigger positive numbers.
  const useIntegers = grade >= 7 && difficulty >= 2;
  const a = randomInt(1, max) * (useIntegers && Math.random() < 0.5 ? -1 : 1);
  const b = randomInt(1, max) * (useIntegers && Math.random() < 0.5 ? -1 : 1);
  const answer = a + b;

  return {
    id: makeId('addition'),
    grade,
    category: 'addition',
    difficulty,
    text: `${formatSigned(a)} + ${formatSigned(b)} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    vertical: { top: String(a), operator: '+', bottom: String(b) },
    explanation: `${formatSigned(a)} + ${formatSigned(b)} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
