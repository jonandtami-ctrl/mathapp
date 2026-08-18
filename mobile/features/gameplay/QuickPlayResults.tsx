import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Confetti from '../../components/Confetti';
import EinsteinCelebration from './EinsteinCelebration';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { QuizResult } from '../profile/ProfileContext';

type QuickPlayResultsProps = {
  result: QuizResult;
  onPlayAgain: () => void;
  onHome: () => void;
};

function tierMessage(accuracy: number): string {
  if (accuracy >= 0.9) return "You're a math superstar! 🏆";
  if (accuracy >= 0.7) return 'Great job out there! 🌟';
  if (accuracy >= 0.4) return "Nice work — you're getting stronger!";
  return "Keep practicing, you'll get there!";
}

export default function QuickPlayResults({ result, onPlayAgain, onHome }: QuickPlayResultsProps) {
  const [burstId, setBurstId] = useState(0);
  const accuracy = result.totalCount === 0 ? 0 : result.correctCount / result.totalCount;

  useEffect(() => {
    if (accuracy >= 0.7) setBurstId((b) => b + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <Confetti burstId={burstId} />
      <Text style={styles.title}>Quick Play Complete!</Text>
      <Text style={styles.score}>
        {result.correctCount} / {result.totalCount} correct
      </Text>
      <Text style={styles.message}>{tierMessage(accuracy)}</Text>

      <EinsteinCelebration accuracy={accuracy} />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{result.xpEarned}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{result.coinsEarned}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{Math.round(accuracy * 100)}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.slot} onPress={onPlayAgain}>
          <LinearGradient colors={gradients.primaryButton} style={styles.button}>
            <Text style={styles.buttonText}>Play Again</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.slot} onPress={onHome}>
          <LinearGradient colors={gradients.successButton} style={styles.button}>
            <Text style={styles.buttonText}>Back to Menu</Text>
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
  score: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textBody,
  },
  message: {
    textAlign: 'center',
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
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
