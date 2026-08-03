import React from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import EmptyState from '../../components/EmptyState';

export default function ParentTab() {
  return (
    <ScreenContainer>
      <EmptyState
        icon="👪"
        title="Parent dashboard is coming soon"
        message="PIN-protected progress reports, goals, and subscription management arrive in Phase 5, after accounts (Phase 4) exist."
      />
    </ScreenContainer>
  );
}
