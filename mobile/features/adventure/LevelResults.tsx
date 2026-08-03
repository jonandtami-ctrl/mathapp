import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Confetti from '../../components/Confetti';
import { computeStars } from './progress';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { SessionOutcome } from '../gameplay/QuestionSession';
import type { Stage } from './types';

type LevelResultsProps = {
  stage: Stage;
  outcome: SessionOutcome;
  onRetry: () => void;
  onBackToLevels: () => void;
};

export default function LevelResults({ stage, outcome, onRetry, onBackToLevels }: LevelResultsProps) {
  const [burstId, setBurstId] = useState(0);
  const accuracy = outcome.totalCount === 0 ? 0 : outcome.correctCount / outcome.totalCount;
  const stars = computeStars(accuracy);

  useEffect(() => {
    if (stars >= 2) setBurstId((b) => b + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <Confetti burstId={burstId} />
      <Text style={styles.title}>
        {stage.kind === 'level' ? `Level ${stage.stageIndex + 1} Complete!` : 'Stage Complete!'}
      </Text>
      <Text style={styles.starsRow}>{[0, 1, 2].map((i) => (i < stars ? '⭐' : '☆')).join(' ')}</Text>
      <Text style={styles.score}>
        {outcome.correctCount} / {outcome.totalCount} correct
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{outcome.xpEarned}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{outcome.coinsEarned}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
      </View>

      {stars === 0 ? (
        <Text style={styles.hint}>Get at least half correct to earn a star and unlock the next stage.</Text>
      ) : null}

      <View style={styles.menu}>
        <TouchableOpacity style={styles.slot} onPress={onRetry}>
          <LinearGradient colors={gradients.primaryButton} style={styles.button}>
            <Text style={styles.buttonText}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.slot} onPress={onBackToLevels}>
          <LinearGradient colors={gradients.successButton} style={styles.button}>
            <Text style={styles.buttonText}>Back to Levels</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.heading1.fontSize - 2,
    fontWeight: '700',
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  starsRow: {
    fontSize: 34,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  score: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textBody,
    marginBottom: spacing.xl,
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
  hint: {
    textAlign: 'center',
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
  },
  button: {
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
