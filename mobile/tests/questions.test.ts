import { CATEGORY_META, generateQuestion, generateQuickPlaySet } from '../features/questions';
import type { EngineQuestion } from '../features/questions';
import type { Difficulty } from '../features/questions/types';
import type { Grade } from '../types';

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];
const DIFFICULTIES: Difficulty[] = [1, 2, 3];
const DRAWS_PER_COMBO = 5;

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  return b === 0 ? a : gcd(b, a % b);
}

function simplify(n: number, d: number): string {
  const g = gcd(n, d) || 1;
  const sn = n / g;
  const sd = d / g;
  return sd === 1 ? String(sn) : `${sn}/${sd}`;
}

// Negative operands are rendered as "(-8)"; strip the parens before parsing.
function parseSignedToken(token: string): number {
  const trimmed = token.trim();
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return Number(trimmed.slice(1, -1));
  }
  return Number(trimmed);
}

function parseSignedPair(text: string, separator: string): [number, number] {
  const [a, b] = text.replace(' = ?', '').split(separator);
  return [parseSignedToken(a), parseSignedToken(b)];
}

// Independent left-to-right, ×-before-+/- evaluator with single-group
// parentheses support, reimplemented separately from the generator so this
// test can't just be validating itself against itself.
function evaluateExpression(text: string): number {
  const expr = text.replace(' = ?', '');

  const parenMatch = expr.match(/\(([^()]+)\)/);
  let working = expr;
  if (parenMatch) {
    const [gA, gOp, gB] = parenMatch[1].split(' ');
    const groupValue = gOp === '+' ? Number(gA) + Number(gB) : Number(gA) - Number(gB);
    working = expr.replace(parenMatch[0], String(groupValue));
  }

  const tokens = working.split(' ');
  const values: number[] = [Number(tokens[0])];
  const ops: string[] = [];
  for (let i = 1; i < tokens.length; i += 2) {
    ops.push(tokens[i]);
    values.push(Number(tokens[i + 1]));
  }
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === '×') {
      values[i] = values[i] * values[i + 1];
      values.splice(i + 1, 1);
      ops.splice(i, 1);
      i -= 1;
    }
  }
  let result = values[0];
  for (let i = 0; i < ops.length; i++) {
    result = ops[i] === '+' ? result + values[i + 1] : result - values[i + 1];
  }
  return result;
}

function checkGeometryQuestion(q: EngineQuestion) {
  const rectMatch = q.text.match(/A rectangle is (\d+) units wide and (\d+) units tall\. What is its (perimeter|area)\?/);
  if (rectMatch) {
    const [, w, h, kind] = rectMatch;
    const width = Number(w);
    const height = Number(h);
    const expected = kind === 'perimeter' ? 2 * (width + height) : width * height;
    expect(Number(q.answer)).toBe(expected);
    return;
  }

  const triMatch = q.text.match(/A triangle has a base of (\d+) units and a height of (\d+) units\. What is its area\?/);
  if (triMatch) {
    const [, b, h] = triMatch;
    expect(Number(q.answer)).toBe((Number(b) * Number(h)) / 2);
    return;
  }

  const circMatch = q.text.match(/A circle has a radius of (\d+) units\. What is its (circumference|area)\?/);
  if (circMatch) {
    const [, r, kind] = circMatch;
    const radius = Number(r);
    const expected = kind === 'circumference' ? 2 * 3.14 * radius : 3.14 * radius * radius;
    expect(Number(q.answer)).toBeCloseTo(Number(expected.toFixed(2)), 2);
    return;
  }

  throw new Error(`Unrecognized geometry question text: "${q.text}"`);
}

describe('question engine: structural validity', () => {
  for (const meta of CATEGORY_META) {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        it(`${meta.key} grade ${grade} difficulty ${difficulty} produces valid questions`, () => {
          for (let i = 0; i < DRAWS_PER_COMBO; i++) {
            const q = generateQuestion(meta.key, grade, difficulty);

            expect(q.id).toBeTruthy();
            expect(q.grade).toBe(grade);
            expect(q.category).toBe(meta.key);
            expect(q.difficulty).toBe(difficulty);
            expect(q.text.length).toBeGreaterThan(0);
            expect(q.explanation.length).toBeGreaterThan(0);
            expect(q.xpValue).toBeGreaterThan(0);
            expect(q.answer).not.toBe('NaN');
            expect(q.answer).not.toMatch(/Infinity/);

            if (q.inputMode === 'choice') {
              expect(q.choices).toBeDefined();
              const choices = q.choices!;
              expect(choices.length).toBeGreaterThanOrEqual(2);
              expect(new Set(choices).size).toBe(choices.length); // no duplicate distractors
              expect(choices).toContain(q.answer);
            } else {
              expect(Number.isFinite(Number(q.answer))).toBe(true);
            }
          }
        });
      }
    }
  }
});

describe('question engine: mathematical correctness', () => {
  it('addition: a + b = answer (integers allowed grade 7-8)', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('addition', grade, difficulty);
        const [a, b] = parseSignedPair(q.text, ' + ');
        expect(a + b).toBe(Number(q.answer));
      }
    }
  });

  it('subtraction: a - b = answer; non-negative below grade 7', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('subtraction', grade, difficulty);
        const [a, b] = parseSignedPair(q.text, ' - ');
        expect(a - b).toBe(Number(q.answer));
        if (grade < 7 || difficulty === 1) {
          expect(Number(q.answer)).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('multiplication: a × b = answer (integers allowed grade 7-8)', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('multiplication', grade, difficulty);
        const [a, b] = parseSignedPair(q.text, ' × ');
        expect(a * b).toBe(Number(q.answer));
      }
    }
  });

  it('division: divisor × answer = dividend (integers allowed grade 7-8)', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('division', grade, difficulty);
        const [dividend, divisor] = parseSignedPair(q.text, ' ÷ ');
        expect(divisor * Number(q.answer)).toBe(dividend);
      }
    }
  });

  it('decimals: add/subtract/multiply all check out within floating-point tolerance', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('decimals', grade, difficulty);
        if (q.text.includes(' × ')) {
          const [a, b] = q.text.replace(' = ?', '').split(' × ').map(Number);
          expect(Math.abs(a * b - Number(q.answer))).toBeLessThan(0.01);
        } else {
          const isAddition = q.text.includes(' + ');
          const [a, b] = q.text.replace(' = ?', '').split(isAddition ? ' + ' : ' - ').map(Number);
          const expected = isAddition ? a + b : a - b;
          expect(Math.abs(expected - Number(q.answer))).toBeLessThan(0.01);
        }
      }
    }
  });

  it('order of operations: independently-evaluated expression matches answer', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('orderOfOperations', grade, difficulty);
        expect(evaluateExpression(q.text)).toBe(Number(q.answer));
      }
    }
  });

  it('fractions: independently-recomputed add/subtract/multiply result matches answer', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('fractions', grade, difficulty);
        const match = q.text.match(/^(\d+)\/(\d+) (\+|-|×) (\d+)\/(\d+) = \?$/);
        expect(match).not.toBeNull();
        const [, n1, d1, op, n2, d2] = match!;
        const num1 = Number(n1);
        const den1 = Number(d1);
        const num2 = Number(n2);
        const den2 = Number(d2);

        let combinedNum: number;
        let combinedDen: number;
        if (op === '×') {
          combinedNum = num1 * num2;
          combinedDen = den1 * den2;
        } else {
          combinedDen = den1 * den2;
          combinedNum = op === '+' ? num1 * den2 + num2 * den1 : num1 * den2 - num2 * den1;
        }
        expect(simplify(Math.abs(combinedNum), combinedDen)).toBe(q.answer);
      }
    }
  });

  it('geometry: rectangle/triangle/circle questions are all internally consistent', () => {
    for (const grade of GRADES) {
      for (const difficulty of [2, 3] as Difficulty[]) {
        for (let i = 0; i < 15; i++) {
          checkGeometryQuestion(generateQuestion('geometry', grade, difficulty));
        }
      }
    }
  });

  it('geometry: shape-identification answer is a real shape and present in choices', () => {
    const shapeNames = ['Triangle', 'Square', 'Pentagon', 'Hexagon', 'Octagon'];
    for (const grade of GRADES) {
      const q = generateQuestion('geometry', grade, 1);
      expect(shapeNames).toContain(q.answer);
      expect(q.choices).toContain(q.answer);
    }
  });
});

describe('question engine: grade-appropriate curriculum gating', () => {
  it('order of operations: grade 1-2 never forces multiplication precedence', () => {
    for (const grade of [1, 2] as Grade[]) {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < 10; i++) {
          const q = generateQuestion('orderOfOperations', grade, difficulty);
          expect(q.text).not.toContain('×');
        }
      }
    }
  });

  it('order of operations: grade 6-8 sometimes uses parentheses', () => {
    let sawParens = false;
    for (let i = 0; i < 60; i++) {
      const q = generateQuestion('orderOfOperations', 8, 3);
      if (q.text.includes('(')) sawParens = true;
    }
    expect(sawParens).toBe(true);
  });

  it('fractions: grade 1-2 is always addition of same-denominator fractions', () => {
    for (const grade of [1, 2] as Grade[]) {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < 10; i++) {
          const q = generateQuestion('fractions', grade, difficulty);
          expect(q.text).toContain('+');
          expect(q.text).not.toContain('×');
        }
      }
    }
  });

  it('fractions: grade 6-8 sometimes multiplies fractions', () => {
    let sawMultiply = false;
    for (let i = 0; i < 60; i++) {
      const q = generateQuestion('fractions', 8, 3);
      if (q.text.includes('×')) sawMultiply = true;
    }
    expect(sawMultiply).toBe(true);
  });

  it('addition/subtraction/multiplication/division: no negative numbers below grade 7', () => {
    for (const grade of [1, 2, 3, 4, 5, 6] as Grade[]) {
      for (const category of ['addition', 'subtraction', 'multiplication', 'division'] as const) {
        for (const difficulty of DIFFICULTIES) {
          for (let i = 0; i < 5; i++) {
            const q = generateQuestion(category, grade, difficulty);
            expect(q.text).not.toContain('(');
          }
        }
      }
    }
  });

  it('addition/subtraction/multiplication/division: grade 7-8 sometimes uses negative numbers', () => {
    let sawNegative = false;
    for (const category of ['addition', 'subtraction', 'multiplication', 'division'] as const) {
      for (let i = 0; i < 40; i++) {
        const q = generateQuestion(category, 8, 3);
        if (q.text.includes('(')) sawNegative = true;
      }
    }
    expect(sawNegative).toBe(true);
  });

  it('word problems: grade 1-2 are addition/subtraction only', () => {
    for (const grade of [1, 2] as Grade[]) {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < 10; i++) {
          const q = generateQuestion('wordProblems', grade, difficulty);
          expect(q.explanation).not.toContain('×');
          expect(q.explanation).not.toContain('÷');
        }
      }
    }
  });

  it('word problems: grade 5-8 sometimes includes division', () => {
    let sawDivision = false;
    for (let i = 0; i < 60; i++) {
      const q = generateQuestion('wordProblems', 8, 3);
      if (q.explanation.includes('÷')) sawDivision = true;
    }
    expect(sawDivision).toBe(true);
  });

  it('decimals: grade 6-8 sometimes multiplies decimals', () => {
    let sawMultiply = false;
    for (let i = 0; i < 60; i++) {
      const q = generateQuestion('decimals', 8, 3);
      if (q.text.includes('×')) sawMultiply = true;
    }
    expect(sawMultiply).toBe(true);
  });

  it('geometry: grade 7-8 sometimes uses triangle or circle questions, not just rectangles', () => {
    let sawAdvanced = false;
    for (let i = 0; i < 60; i++) {
      const q = generateQuestion('geometry', 8, 3);
      if (q.text.includes('triangle') || q.text.includes('circle')) sawAdvanced = true;
    }
    expect(sawAdvanced).toBe(true);
  });
});

describe('Quick Play session generation', () => {
  for (const grade of GRADES) {
    it(`grade ${grade}: 10 questions, escalating difficulty, no exact-duplicate text`, () => {
      const set = generateQuickPlaySet(grade);
      expect(set).toHaveLength(10);

      const texts = set.map((q) => q.text);
      expect(new Set(texts).size).toBe(texts.length);

      const difficulties = set.map((q) => q.difficulty);
      expect(difficulties.slice(0, 3).every((d) => d === 1)).toBe(true);
      expect(difficulties.slice(3, 7).every((d) => d === 2)).toBe(true);
      expect(difficulties.slice(7, 10).every((d) => d === 3)).toBe(true);

      set.forEach((q) => expect(q.grade).toBe(grade));
    });
  }
});
