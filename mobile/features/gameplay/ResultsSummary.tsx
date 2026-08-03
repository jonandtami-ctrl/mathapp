import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { QUESTIONS_PER_SET } from './questions';
import Confetti from '../../components/Confetti';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { GameMode } from '../../types';

type Tier = {
  stars: 0 | 1 | 2 | 3;
  title: string;
  message: string;
  confetti: boolean;
};

function getTier(score: number): Tier {
  if (score >= 18) return { stars: 3, title: 'Amazing! 🏆', message: "You're a math superstar!", confetti: true };
  if (score >= 14) return { stars: 2, title: 'Great Job! 🌟', message: 'Nice work, keep it up!', confetti: true };
  if (score >= 8) return { stars: 1, title: 'Good Effort! 👍', message: 'Practice makes perfect, try again!', confetti: false };
  return { stars: 0, title: 'Set Complete!', message: "Keep practicing, you'll get there!", confetti: false };
}

function Star({ lit, delay }: { lit: boolean; delay: number }) {
  const scale = useRef(new Animated.Value(lit ? 0 : 1)).current;

  useEffect(() => {
    if (lit) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      ]).start();
    }
  }, [lit]);

  return (
    <Animated.Text style={[styles.star, lit && styles.starLit, { transform: [{ scale }] }]}>
      {lit ? '★' : '☆'}
    </Animated.Text>
  );
}

type ResultsSummaryProps = {
  score: number;
  mode: GameMode;
  onRetry: (mode: GameMode) => void;
  onHome: () => void;
};

export default function ResultsSummary({ score, mode, onRetry, onHome }: ResultsSummaryProps) {
  const [burstId, setBurstId] = useState(0);
  const tier = getTier(score);

  useEffect(() => {
    if (tier.confetti) {
      setBurstId((b) => b + 1);
      const second = setTimeout(() => setBurstId((b) => b + 1), 300);
      return () => clearTimeout(second);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <Confetti burstId={burstId} />
      <Text style={styles.title}>{tier.title}</Text>
      <View style={styles.starsRow}>
        {[0, 1, 2].map((i) => (
          <Star key={i} lit={i < tier.stars} delay={i * 150} />
        ))}
      </View>
      <Text style={styles.summary}>
        You got {score} out of {QUESTIONS_PER_SET} correct!
      </Text>
      <Text style={styles.message}>{tier.message}</Text>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.slot} onPress={() => onRetry(mode)}>
          <LinearGradient colors={gradients.primaryButton} style={styles.button}>
            <Text style={styles.buttonText}>Try Again</Text>
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
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  star: {
    fontSize: 46,
    color: '#ddd',
  },
  starLit: {
    color: colors.gold,
    textShadowColor: 'rgba(255, 201, 60, 0.7)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  summary: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: spacing.xs,
    color: colors.textBody,
  },
  message: {
    textAlign: 'center',
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
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
