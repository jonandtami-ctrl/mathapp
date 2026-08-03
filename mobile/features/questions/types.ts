import type { Category, Grade } from '../../types';

export type Difficulty = 1 | 2 | 3;

export type InputMode = 'numeric' | 'choice';

export type EngineQuestion = {
  id: string;
  grade: Grade;
  category: Category;
  difficulty: Difficulty;
  text: string;
  answer: string; // canonical correct answer, always compared as a normalized string
  inputMode: InputMode;
  choices?: string[]; // present when inputMode === 'choice', includes the answer
  explanation: string;
  visualAid?: string;
  xpValue: number;
};

export type Generator = (grade: Grade, difficulty: Difficulty) => EngineQuestion;
