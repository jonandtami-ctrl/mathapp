import React from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import EmptyState from '../../components/EmptyState';

export default function RewardsTab() {
  return (
    <ScreenContainer>
      <EmptyState
        icon="🎁"
        title="Rewards are coming soon"
        message="Avatars, themes, and coin-unlockable cosmetics arrive alongside the XP/coin system in Phase 2 and monetization in Phase 6."
      />
    </ScreenContainer>
  );
}
