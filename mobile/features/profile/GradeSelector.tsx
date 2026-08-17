import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradeAccents, radii, spacing, typography } from '../../constants/theme';
import type { Grade } from '../../types';

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];

type GradeSelectorProps = {
  selectedGrade: Grade;
  onSelect: (grade: Grade) => void;
  label?: string;
};

export default function GradeSelector({ selectedGrade, onSelect, label = 'Grade' }: GradeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {GRADES.map((grade, index) => {
          const isSelected = selectedGrade === grade;
          return (
            <TouchableOpacity key={grade} activeOpacity={0.85} onPress={() => onSelect(grade)}>
              <LinearGradient colors={gradeAccents[index]} style={[styles.chip, isSelected && styles.chipSelected]}>
                <Text style={styles.chipText}>{grade}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
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
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.55,
  },
  chipSelected: {
    borderColor: colors.textHeading,
    opacity: 1,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.surface,
  },
});
