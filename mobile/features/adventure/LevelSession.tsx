import React, { useMemo } from 'react';
import QuestionSession, { type SessionOutcome } from '../gameplay/QuestionSession';
import { generateQuestionSet } from '../questions';
import type { Grade } from '../../types';
import type { LevelStage } from './types';

type LevelSessionProps = {
  stage: LevelStage;
  grade: Grade;
  onFinish: (outcome: SessionOutcome) => void;
};

export default function LevelSession({ stage, grade, onFinish }: LevelSessionProps) {
  const initialQuestions = useMemo(
    () => generateQuestionSet(stage.category, grade, stage.difficulty, stage.questionCount),
    [stage, grade],
  );

  return <QuestionSession initialQuestions={initialQuestions} onFinish={onFinish} />;
}
