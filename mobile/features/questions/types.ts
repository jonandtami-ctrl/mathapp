import type { Category, Grade } from '../../types';

export type Difficulty = 1 | 2 | 3;

export type InputMode = 'numeric' | 'choice';

// Textbook-style stacked layout for simple two-operand arithmetic (top
// operand, operator + bottom operand, then a divider line) - top/bottom are
// pre-formatted display strings, not raw numbers, so decimals can be
// zero-padded for place-value alignment.
export type VerticalLayout = {
  top: string;
  operator: '+' | '-' | '×' | '÷';
  bottom: string;
};

export type EngineQuestion = {
  id: string;
  grade: Grade;
  category: Category;
  difficulty: Difficulty;
  text: string;
  answer: string; // canonical correct answer, always compared as a normalized string
  inputMode: InputMode;
  choices?: string[]; // present when inputMode === 'choice', includes the answer
  vertical?: VerticalLayout; // present when this question can render as a stacked problem
  explanation: string;
  visualAid?: string;
  xpValue: number;
};

export type Generator = (grade: Grade, difficulty: Difficulty) => EngineQuestion;
