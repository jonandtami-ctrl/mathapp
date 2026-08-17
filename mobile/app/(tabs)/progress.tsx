import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ProgressBar from '../../components/ProgressBar';
import { useProfile } from '../../features/profile/ProfileContext';
import { CATEGORY_META } from '../../features/questions';
import { getImprovementTips } from '../../features/progress/tips';
import { colors, gradeAccents, gradients, radii, spacing, typography } from '../../constants/theme';

function scoreTier(accuracy: number): { label: string; emoji: string } {
  if (accuracy >= 0.9) return { label: 'Superstar!', emoji: '🌟' };
  if (accuracy >= 0.75) return { label: 'Awesome!', emoji: '🚀' };
  if (accuracy >= 0.5) return { label: 'Nice work!', emoji: '👍' };
  return { label: 'Just getting started!', emoji: '🌱' };
}

export default function ProgressTab() {
  const { profile, loading, resetProfile } = useProfile();

  function confirmReset() {
    Alert.alert(
      'Reset Profile?',
      'This deletes all progress, XP, coins, and Adventure Mode stars, and takes you back to the grade-choice screen. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetProfile },
      ],
    );
  }

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
          icon="📊"
          title="No score yet!"
          message="Play a Quick Play session or an Adventure level to start building your score."
        />
      </ScreenContainer>
    );
  }

  const accuracy = profile.correctAnswers / profile.questionsAttempted;
  const tier = scoreTier(accuracy);
  const tips = getImprovementTips(profile);
  const practicedCategories = CATEGORY_META.filter((c) => profile.categoryStats[c.key]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>📊 My Score</Text>

      <LinearGradient colors={gradients.mixed} style={styles.hero}>
        <Text style={styles.heroEmoji}>{tier.emoji}</Text>
        <Text style={styles.heroAccuracy}>{Math.round(accuracy * 100)}%</Text>
        <Text style={styles.heroLabel}>{tier.label}</Text>
        <View style={styles.heroStatsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{profile.questionsAttempted}</Text>
            <Text style={styles.heroStatLabel}>Answered</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>🔥 {profile.highestAnswerStreak}</Text>
            <Text style={styles.heroStatLabel}>Best Streak</Text>
          </View>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>💡 Tips to Improve</Text>
      {tips.map((tip, i) => (
        <View key={i} style={styles.tipCard}>
          <Text style={styles.tipIcon}>{tip.icon}</Text>
          <Text style={styles.tipMessage}>{tip.message}</Text>
        </View>
      ))}

      {practicedCategories.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Topics practised</Text>
          {practicedCategories.map((c, i) => {
            const stat = profile.categoryStats[c.key]!;
            const catAccuracy = stat.attempted === 0 ? 0 : stat.correct / stat.attempted;
            return (
              <View key={c.key} style={styles.categoryRow}>
                <Text style={styles.categoryLabel}>
                  {c.icon} {c.label}
                </Text>
                <View style={styles.barTrack}>
                  <LinearGradient
                    colors={gradeAccents[i % gradeAccents.length]}
                    style={[styles.barFill, { width: `${Math.max(6, catAccuracy * 100)}%` }]}
                  />
                </View>
                <Text style={styles.categoryDetail}>
                  {stat.correct}/{stat.attempted} correct
                </Text>
              </View>
            );
          })}
        </>
      ) : null}

      <TouchableOpacity onPress={confirmReset} style={styles.resetLink}>
        <Text style={styles.resetLinkText}>Reset Profile</Text>
      </TouchableOpacity>
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
  hero: {
    borderRadius: radii.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroEmoji: {
    fontSize: 40,
  },
  heroAccuracy: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.surface,
    marginTop: spacing.xs,
  },
  heroLabel: {
    fontSize: typography.bodyBold.fontSize,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: spacing.lg,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },
  heroStatLabel: {
    fontSize: typography.small.fontSize,
    color: '#ffffffcc',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.track,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipMessage: {
    flex: 1,
    fontSize: typography.small.fontSize,
    color: colors.textBody,
    lineHeight: 18,
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
  barTrack: {
    width: '100%',
    height: 8,
    backgroundColor: colors.track,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  categoryDetail: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  resetLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resetLinkText: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
