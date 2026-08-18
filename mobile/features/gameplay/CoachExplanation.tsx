import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing, typography } from '../../constants/theme';

const INTRO_LINES = [
  "No worries! Here's how it works:",
  "Let's break it down together:",
  "Here's a quick tip:",
  'Almost! Check this out:',
  "Let's figure this one out:",
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

type CoachExplanationProps = {
  explanation: string;
};

// Shown whenever a question is answered incorrectly - frames the
// explanation as coming from a friendly Coach character instead of a dry
// system message, matching Einstein's results-screen persona but for
// in-the-moment teaching.
export default function CoachExplanation({ explanation }: CoachExplanationProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const intro = useMemo(() => pickRandom(INTRO_LINES), [explanation]);

  useEffect(() => {
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 60 }).start();
  }, [explanation, anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <Animated.View style={[styles.wrapper, { opacity: anim, transform: [{ scale }] }]}>
      <LinearGradient colors={['#ff9a56', '#38ef7d']} style={styles.avatar}>
        <Text style={styles.avatarEmoji}>🧑‍🏫</Text>
      </LinearGradient>
      <View style={styles.bubble}>
        <View style={styles.bubbleTail} />
        <Text style={styles.bubbleName}>Coach says:</Text>
        <Text style={styles.bubbleIntro}>{intro}</Text>
        <Text style={styles.bubbleText}>{explanation}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.md,
    width: '100%',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 24,
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    position: 'relative',
  },
  bubbleTail: {
    position: 'absolute',
    left: -6,
    top: 14,
    width: 12,
    height: 12,
    backgroundColor: colors.surface,
    transform: [{ rotate: '45deg' }],
  },
  bubbleName: {
    fontSize: typography.smallBold.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    marginBottom: 2,
  },
  bubbleIntro: {
    fontSize: typography.small.fontSize,
    fontWeight: '600',
    color: colors.textBody,
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: typography.small.fontSize,
    color: colors.textBody,
    lineHeight: 18,
  },
});
