import type { Grade } from '../../../types';
import type { Difficulty, EngineQuestion } from '../types';
import { makeId, randomInt, xpForDifficulty } from '../utils';

type Op = '+' | '-' | '×';

const GRADE_TERM_MAX: Record<Grade, number> = {
  1: 5,
  2: 8,
  3: 10,
  4: 12,
  5: 15,
  6: 20,
  7: 25,
  8: 30,
};

// Evaluates left-to-right respecting × before +/-, no division/parentheses in v1.
function evaluate(terms: number[], ops: Op[]): number {
  const values = [...terms];
  const operators = [...ops];

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '×') {
      values[i] = values[i] * values[i + 1];
      values.splice(i + 1, 1);
      operators.splice(i, 1);
      i -= 1;
    }
  }

  let result = values[0];
  for (let i = 0; i < operators.length; i++) {
    result = operators[i] === '+' ? result + values[i + 1] : result - values[i + 1];
  }
  return result;
}

export function generateOrderOfOperations(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const termCount = difficulty === 3 ? 4 : 3;
  const max = GRADE_TERM_MAX[grade];

  let terms: number[] = [];
  let ops: Op[] = [];
  let answer = -1;
  let attempts = 0;

  // Keep the result non-negative for a friendlier experience; retry if not
  // (text/answer are always derived together from the same terms+ops, so they
  // stay consistent even if every attempt happens to land negative).
  while (answer < 0 && attempts < 30) {
    terms = Array.from({ length: termCount }, () => randomInt(1, max));
    ops = Array.from({ length: termCount - 1 }, () => (Math.random() < 0.5 ? '+' : '-'));
    ops[randomInt(0, ops.length - 1)] = '×'; // force at least one multiplication so precedence matters
    answer = evaluate(terms, ops);
    attempts += 1;
  }

  const text = terms.reduce((acc, term, i) => (i === 0 ? String(term) : `${acc} ${ops[i - 1]} ${term}`), '');

  return {
    id: makeId('orderOfOperations'),
    grade,
    category: 'orderOfOperations',
    difficulty,
    text: `${text} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    explanation: `Multiply first, then add/subtract left to right: ${text} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
