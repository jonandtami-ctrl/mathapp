import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import AchievementPath from '../../features/achievements/AchievementPath';
import { ACHIEVEMENTS } from '../../features/achievements';
import { useProfile } from '../../features/profile/ProfileContext';
import { colors, radii, spacing, typography } from '../../constants/theme';

export default function RewardsTab() {
  const { profile, loading } = useProfile();

  if (loading || !profile) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading rewards..." />
      </ScreenContainer>
    );
  }

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.isUnlocked(profile)).length;

  return (
    <ScreenContainer>
      <Text style={styles.title}>🗺️ Achievement Trail</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>🪙 {profile.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {unlockedCount}/{ACHIEVEMENTS.length}
          </Text>
          <Text style={styles.statLabel}>Milestones</Text>
        </View>
      </View>

      <Text style={styles.sectionSubtitle}>
        📍 marks your next milestone. Cosmetic unlocks (avatars, themes, frames) are coming once the
        parent-gated coin shop is built.
      </Text>

      <AchievementPath profile={profile} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.heading1.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.track,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textHeading,
  },
  statLabel: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});
