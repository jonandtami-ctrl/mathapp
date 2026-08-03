import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ProgressBar from '../../components/ProgressBar';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { CATEGORY_META } from '../../features/questions';
import { colors, spacing, typography } from '../../constants/theme';

export default function ProgressTab() {
  const { profile, loading } = useActiveProfile();

  if (loading || !profile) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading progress..." />
      </ScreenContainer>
    );
  }

  if (profile.questionsAttempted === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="📈"
          title="No progress yet"
          message="Play a Quick Play session to start tracking accuracy and streaks."
        />
      </ScreenContainer>
    );
  }

  const accuracy = Math.round((profile.correctAnswers / profile.questionsAttempted) * 100);

  return (
    <ScreenContainer>
      <Text style={styles.title}>📈 Progress</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.questionsAttempted}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.highestAnswerStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Topics practised</Text>
      {CATEGORY_META.filter((c) => profile.categoryStats[c.key]).map((c) => {
        const stat = profile.categoryStats[c.key]!;
        const catAccuracy = stat.attempted === 0 ? 0 : stat.correct / stat.attempted;
        return (
          <View key={c.key} style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>
              {c.icon} {c.label}
            </Text>
            <ProgressBar progress={catAccuracy} height={8} />
            <Text style={styles.categoryDetail}>
              {stat.correct}/{stat.attempted} correct
            </Text>
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.track,
    borderRadius: 16,
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
  sectionTitle: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  categoryRow: {
    marginBottom: spacing.lg,
  },
  categoryLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.textBody,
    marginBottom: spacing.xs,
  },
  categoryDetail: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
