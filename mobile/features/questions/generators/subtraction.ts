import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { makeId, randomInt, xpForDifficulty } from '../utils';

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
  const a = randomInt(1, max);
  const b = randomInt(1, a); // keep result non-negative for v1
  const answer = a - b;

  return {
    id: makeId('subtraction'),
    grade,
    category: 'subtraction',
    difficulty,
    text: `${a} - ${b} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    explanation: `${a} - ${b} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
