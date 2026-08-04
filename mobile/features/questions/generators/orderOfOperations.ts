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

// Evaluates left-to-right respecting × before +/-, no division in v1.
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

// Grade 1-2 hasn't learned operator precedence yet: a single +/- "number
// sentence" instead of a precedence puzzle.
function generateSimpleSentence(grade: Grade, difficulty: Difficulty): EngineQuestion {
  const max = GRADE_TERM_MAX[grade];
  const op: Op = Math.random() < 0.5 ? '+' : '-';

  let a = randomInt(1, max);
  let b = randomInt(1, max);
  if (op === '-' && b > a) [a, b] = [b, a]; // keep it non-negative

  const answer = op === '+' ? a + b : a - b;
  const text = `${a} ${op} ${b}`;

  return {
    id: makeId('orderOfOperations'),
    grade,
    category: 'orderOfOperations',
    difficulty,
    text: `${text} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    explanation: `${text} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}

// Grade 6+ has learned parentheses (real PEMDAS): occasionally group a +/-
// pair so it's evaluated before multiplication, same as real grouping rules.
function evaluateWithParens(terms: number[], ops: Op[], parenAt: number | null): number {
  if (parenAt === null) return evaluate(terms, ops);

  const groupOp = ops[parenAt];
  const groupValue = groupOp === '+' ? terms[parenAt] + terms[parenAt + 1] : terms[parenAt] - terms[parenAt + 1];

  const values = [...terms.slice(0, parenAt), groupValue, ...terms.slice(parenAt + 2)];
  const operators = [...ops.slice(0, parenAt), ...ops.slice(parenAt + 1)];
  return evaluate(values, operators);
}

function renderText(terms: number[], ops: Op[], parenAt: number | null): string {
  const parts: string[] = [];
  for (let i = 0; i < terms.length; i++) {
    const isGroupStart = parenAt !== null && i === parenAt;
    const isGroupEnd = parenAt !== null && i === parenAt + 1;
    let term = String(terms[i]);
    if (isGroupStart) term = `(${term}`;
    if (isGroupEnd) term = `${term})`;
    parts.push(i === 0 ? term : `${ops[i - 1]} ${term}`);
  }
  return parts.join(' ');
}

export function generateOrderOfOperations(grade: Grade, difficulty: Difficulty): EngineQuestion {
  if (grade <= 2) return generateSimpleSentence(grade, difficulty);

  const termCount = difficulty === 3 ? 4 : 3;
  const max = GRADE_TERM_MAX[grade];
  const usesParens = grade >= 6 && Math.random() < 0.6;

  let terms: number[] = [];
  let ops: Op[] = [];
  let parenAt: number | null = null;
  let answer = -1;
  let attempts = 0;

  // Keep the result non-negative for a friendlier experience; retry if not
  // (text/answer are always derived together from the same terms+ops, so they
  // stay consistent even if every attempt happens to land negative).
  while (answer < 0 && attempts < 30) {
    terms = Array.from({ length: termCount }, () => randomInt(1, max));
    ops = Array.from({ length: termCount - 1 }, () => (Math.random() < 0.5 ? '+' : '-'));
    ops[randomInt(0, ops.length - 1)] = '×'; // force at least one multiplication so precedence matters

    parenAt = null;
    if (usesParens) {
      const plusMinusIndices = ops.map((op, i) => (op !== '×' ? i : -1)).filter((i) => i >= 0);
      if (plusMinusIndices.length > 0) {
        parenAt = plusMinusIndices[randomInt(0, plusMinusIndices.length - 1)];
      }
    }

    answer = evaluateWithParens(terms, ops, parenAt);
    attempts += 1;
  }

  const text = renderText(terms, ops, parenAt);
  const explanationRule =
    parenAt !== null
      ? 'Solve the parentheses first, then multiply, then add/subtract left to right'
      : 'Multiply first, then add/subtract left to right';

  return {
    id: makeId('orderOfOperations'),
    grade,
    category: 'orderOfOperations',
    difficulty,
    text: `${text} = ?`,
    answer: String(answer),
    inputMode: 'numeric',
    explanation: `${explanationRule}: ${text} = ${answer}`,
    xpValue: xpForDifficulty(difficulty),
  };
}
