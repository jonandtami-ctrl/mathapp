import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { useProfile } from '../../features/profile/ProfileContext';
import { colors, spacing, typography } from '../../constants/theme';

export default function ParentTab() {
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
        <LoadingState message="Loading..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>👪 Parent</Text>

      <EmptyState
        icon="🔒"
        title="Full parent dashboard is coming soon"
        message="PIN protection, progress reports, goals, and subscription management arrive in Phase 5, after accounts (Phase 4) exist. Grade level can be changed anytime from the Home tab."
      />

      <Text style={styles.sectionTitle}>Reset</Text>
      <Text style={styles.sectionSubtitle}>
        Deletes all progress and starts over from the grade-choice screen. Useful for testing.
      </Text>
      <Button label="Reset Profile" gradientColors={['#e2504a', '#b6221e']} onPress={confirmReset} />
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
  sectionTitle: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    marginTop: spacing.xxl,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
});
