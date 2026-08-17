import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradeAccents, radii, spacing, typography } from '../../constants/theme';
import type { Grade } from '../../types';

const TOP_ROW: Grade[] = [1, 2, 3, 4];
const BOTTOM_ROW: Grade[] = [5, 6, 7, 8];

type GradeSelectorProps = {
  selectedGrade: Grade;
  onSelect: (grade: Grade) => void;
  label?: string;
};

function GradeChip({
  grade,
  isSelected,
  onSelect,
}: {
  grade: Grade;
  isSelected: boolean;
  onSelect: (grade: Grade) => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, friction: 5 }).start();
  }

  function pressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
    onSelect(grade);
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPressIn={pressIn} onPressOut={pressOut} style={styles.chipSlot}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient colors={gradeAccents[grade - 1]} style={[styles.chip, isSelected && styles.chipSelected]}>
          <Text style={styles.chipText}>{grade}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function GradeSelector({ selectedGrade, onSelect, label = 'Grade' }: GradeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {TOP_ROW.map((grade) => (
          <GradeChip key={grade} grade={grade} isSelected={selectedGrade === grade} onSelect={onSelect} />
        ))}
      </View>
      <View style={styles.row}>
        {BOTTOM_ROW.map((grade) => (
          <GradeChip key={grade} grade={grade} isSelected={selectedGrade === grade} onSelect={onSelect} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.smallBold.fontSize,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  chipSlot: {
    width: '23%',
  },
  chip: {
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    opacity: 0.55,
  },
  chipSelected: {
    borderColor: colors.textHeading,
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  chipText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.surface,
  },
});
