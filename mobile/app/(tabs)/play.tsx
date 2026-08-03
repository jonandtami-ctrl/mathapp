import React, { useState } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import ModeSelect from '../../features/gameplay/ModeSelect';
import QuizFlow from '../../features/gameplay/QuizFlow';
import ResultsSummary from '../../features/gameplay/ResultsSummary';
import type { GameMode } from '../../types';

type PlayState = 'select' | 'quiz' | 'results';

export default function PlayTab() {
  const [state, setState] = useState<PlayState>('select');
  const [mode, setMode] = useState<GameMode | null>(null);
  const [lastScore, setLastScore] = useState(0);

  function startQuiz(selectedMode: GameMode) {
    setMode(selectedMode);
    setState('quiz');
  }

  function finishQuiz(score: number) {
    setLastScore(score);
    setState('results');
  }

  function goToSelect() {
    setMode(null);
    setState('select');
  }

  return (
    <ScreenContainer>
      {state === 'select' && <ModeSelect onSelectMode={startQuiz} />}
      {state === 'quiz' && mode && <QuizFlow mode={mode} onFinish={finishQuiz} />}
      {state === 'results' && mode && (
        <ResultsSummary score={lastScore} mode={mode} onRetry={startQuiz} onHome={goToSelect} />
      )}
    </ScreenContainer>
  );
}
