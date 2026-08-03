import React from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import EmptyState from '../../components/EmptyState';

export default function ProgressTab() {
  return (
    <ScreenContainer>
      <EmptyState
        icon="📈"
        title="Progress tracking is coming soon"
        message="Accuracy charts, skill mastery, and streaks arrive once the question engine and scoring system are built in Phase 2."
      />
    </ScreenContainer>
  );
}
