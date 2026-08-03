import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { ACHIEVEMENTS } from '../../features/achievements';
import { colors, radii, spacing, typography } from '../../constants/theme';

export default function RewardsTab() {
  const { profile, loading } = useActiveProfile();

  if (loading || !profile) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading rewards..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>🎁 Rewards</Text>

      <View style={styles.coinBanner}>
        <Text style={styles.coinValue}>🪙 {profile.coins}</Text>
        <Text style={styles.coinLabel}>coins earned</Text>
      </View>

      <Text style={styles.sectionTitle}>Achievements</Text>
      <Text style={styles.sectionSubtitle}>
        Cosmetic unlocks (avatars, themes, frames) are coming once the parent-gated coin shop is built.
      </Text>

      {ACHIEVEMENTS.map((achievement) => {
        const unlocked = achievement.isUnlocked(profile);
        return (
          <View key={achievement.id} style={[styles.achievementRow, !unlocked && styles.achievementLocked]}>
            <Text style={styles.achievementIcon}>{unlocked ? achievement.icon : '🔒'}</Text>
            <View style={styles.achievementText}>
              <Text style={[styles.achievementName, !unlocked && styles.mutedText]}>{achievement.name}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          </View>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.heading1.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  coinBanner: {
    backgroundColor: colors.track,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  coinValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textHeading,
  },
  coinLabel: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.track,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementText: {
    flex: 1,
  },
  achievementName: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.textBody,
  },
  mutedText: {
    color: colors.textMuted,
  },
  achievementDescription: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
});
