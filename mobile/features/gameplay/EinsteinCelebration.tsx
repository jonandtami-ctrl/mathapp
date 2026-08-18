import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing, typography } from '../../constants/theme';

const HIGH_ACCURACY_LINES = [
  "Genius-level work! Even I double-check my math sometimes!",
  "E=mc²... and YOU equal Math Champion!",
  "Relatively speaking, that was brilliant!",
  "Imagination got you far, but that math was all skill!",
];

const MID_ACCURACY_LINES = [
  'Great job! Every expert was once a beginner.',
  'Your brain is growing stronger with every question!',
  "Nice thinking - that's the scientific method in action!",
  'Curiosity plus practice: the real formula for genius!',
];

const LOW_ACCURACY_LINES = [
  "I failed plenty of times before I got things right. Keep going!",
  "Mistakes are proof you're trying. On to the next one!",
  'Great effort! Practice makes progress, not perfection.',
  "A person who never made a mistake never tried anything new!",
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

type EinsteinCelebrationProps = {
  accuracy: number; // 0 - 1
};

export default function EinsteinCelebration({ accuracy }: EinsteinCelebrationProps) {
  const anim = useRef(new Animated.Value(0)).current;

  const line = useMemo(() => {
    const pool = accuracy >= 0.9 ? HIGH_ACCURACY_LINES : accuracy >= 0.6 ? MID_ACCURACY_LINES : LOW_ACCURACY_LINES;
    return pickRandom(pool);
  }, [accuracy]);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 60 }),
    ]).start();
  }, [anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <Animated.View style={[styles.wrapper, { opacity: anim, transform: [{ scale }] }]}>
      <LinearGradient colors={['#6d5bd0', '#4facfe']} style={styles.avatar}>
        <Text style={styles.avatarEmoji}>🧑‍🔬</Text>
      </LinearGradient>
      <View style={styles.bubble}>
        <View style={styles.bubbleTail} />
        <Text style={styles.bubbleName}>Professor Einstein says:</Text>
        <Text style={styles.bubbleText}>{line}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.track,
    borderRadius: radii.lg,
    padding: spacing.md,
    position: 'relative',
  },
  bubbleTail: {
    position: 'absolute',
    left: -6,
    top: 16,
    width: 12,
    height: 12,
    backgroundColor: colors.track,
    transform: [{ rotate: '45deg' }],
  },
  bubbleName: {
    fontSize: typography.smallBold.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: typography.small.fontSize,
    color: colors.textBody,
    lineHeight: 18,
  },
});
