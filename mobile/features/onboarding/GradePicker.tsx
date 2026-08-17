import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';
import { colors, gradeAccents, radii, spacing, typography } from '../../constants/theme';
import type { Grade } from '../../types';

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];

type GradePickerProps = {
  onConfirm: (grade: Grade) => void;
};

export default function GradePicker({ onConfirm }: GradePickerProps) {
  const [selected, setSelected] = useState<Grade | null>(null);

  const logoAnim = useRef(new Animated.Value(0)).current;
  const gridAnims = useRef(GRADES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 60 }).start();
    Animated.stagger(
      60,
      gridAnims.map((anim) => Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 7, tension: 70 })),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoScale = logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <View>
      <Animated.View style={{ opacity: logoAnim, transform: [{ scale: logoScale }] }}>
        <LinearGradient colors={['#6d5bd0', '#7b5ffc', '#4facfe']} style={styles.logoBadge}>
          <Text style={styles.logoText}>⚡ EPIC MATH</Text>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.tagline}>Choose your grade to start your adventure!</Text>
      <Text style={styles.symbolRow}>✚ ➖ ✖️ ➗</Text>

      <View style={styles.grid}>
        {GRADES.map((grade, index) => {
          const isSelected = selected === grade;
          const anim = gridAnims[index];
          const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

          return (
            <Animated.View key={grade} style={[styles.slot, { opacity: anim, transform: [{ scale }] }]}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => setSelected(grade)}>
                <LinearGradient colors={gradeAccents[index]} style={[styles.gradeCard, isSelected && styles.gradeCardSelected]}>
                  <Text style={styles.gradeText}>{grade}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <Button
        label="Start My Adventure! 🚀"
        fullWidth
        disabled={selected === null}
        onPress={() => selected !== null && onConfirm(selected)}
        style={styles.confirmButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoBadge: {
    alignSelf: 'center',
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
    shadowColor: '#6d5bd0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: 1,
  },
  tagline: {
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    fontSize: typography.body.fontSize,
  },
  symbolRow: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: spacing.xl,
    opacity: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  slot: {
    width: '23%',
    marginBottom: spacing.md,
  },
  gradeCard: {
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  gradeCardSelected: {
    borderColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradeText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.surface,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
