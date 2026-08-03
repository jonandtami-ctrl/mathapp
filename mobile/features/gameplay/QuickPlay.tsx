import React, { useMemo } from 'react';
import QuestionSession from './QuestionSession';
import { generateQuickPlaySet } from '../questions';
import type { Grade } from '../../types';
import type { QuizResult } from '../../hooks/useActiveProfile';

type QuickPlayProps = {
  grade: Grade;
  onFinish: (result: QuizResult) => void;
};

export default function QuickPlay({ grade, onFinish }: QuickPlayProps) {
  const initialQuestions = useMemo(() => generateQuickPlaySet(grade), [grade]);

  return <QuestionSession initialQuestions={initialQuestions} onFinish={onFinish} />;
}
