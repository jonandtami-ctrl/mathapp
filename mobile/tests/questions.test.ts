import { CATEGORY_META, generateQuestion, generateQuickPlaySet } from '../features/questions';
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

// Independent left-to-right, ×-before-+/- evaluator, reimplemented separately
// from the generator so this test can't just be validating itself.
function evaluateExpression(text: string): number {
  const expr = text.replace(' = ?', '');
  const tokens = expr.split(' ');
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
  it('addition: a + b = answer, and matches the displayed operands', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('addition', grade, difficulty);
        const [a, b] = q.text.replace(' = ?', '').split(' + ').map(Number);
        expect(a + b).toBe(Number(q.answer));
      }
    }
  });

  it('subtraction: a - b = answer, and result is non-negative', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('subtraction', grade, difficulty);
        const [a, b] = q.text.replace(' = ?', '').split(' - ').map(Number);
        expect(a - b).toBe(Number(q.answer));
        expect(Number(q.answer)).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('multiplication: a × b = answer', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('multiplication', grade, difficulty);
        const [a, b] = q.text.replace(' = ?', '').split(' × ').map(Number);
        expect(a * b).toBe(Number(q.answer));
      }
    }
  });

  it('division: divisor × answer = dividend, no remainder', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('division', grade, difficulty);
        const [dividend, divisor] = q.text.replace(' = ?', '').split(' ÷ ').map(Number);
        expect(divisor * Number(q.answer)).toBe(dividend);
      }
    }
  });

  it('decimals: a op b = answer within floating-point tolerance', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('decimals', grade, difficulty);
        const isAddition = q.text.includes(' + ');
        const [a, b] = q.text.replace(' = ?', '').split(isAddition ? ' + ' : ' - ').map(Number);
        const expected = isAddition ? a + b : a - b;
        expect(Math.abs(expected - Number(q.answer))).toBeLessThan(0.01);
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

  it('fractions: independently-simplified result matches answer', () => {
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        const q = generateQuestion('fractions', grade, difficulty);
        const match = q.text.match(/^(\d+)\/(\d+) (\+|-) (\d+)\/(\d+) = \?$/);
        expect(match).not.toBeNull();
        const [, n1, d1, op, n2, d2] = match!;
        const num1 = Number(n1);
        const den1 = Number(d1);
        const num2 = Number(n2);
        const den2 = Number(d2);
        const combinedNum = op === '+' ? num1 * den2 + num2 * den1 : num1 * den2 - num2 * den1;
        const combinedDen = den1 * den2;
        expect(simplify(Math.abs(combinedNum), combinedDen)).toBe(q.answer);
      }
    }
  });

  it('geometry: perimeter/area questions match width × height math', () => {
    for (const grade of GRADES) {
      const q = generateQuestion('geometry', grade, 2); // difficulty 2 => perimeter
      const match = q.text.match(/(\d+) units wide and (\d+) units tall.*(perimeter|area)/);
      expect(match).not.toBeNull();
      const [, w, h, kind] = match!;
      const width = Number(w);
      const height = Number(h);
      const expected = kind === 'perimeter' ? 2 * (width + height) : width * height;
      expect(Number(q.answer)).toBe(expected);
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
