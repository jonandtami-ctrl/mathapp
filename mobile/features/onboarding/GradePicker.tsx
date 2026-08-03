import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';
import { colors, radii, spacing, typography } from '../../constants/theme';
import type { Grade } from '../../types';

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];

type GradePickerProps = {
  onConfirm: (grade: Grade) => void;
};

export default function GradePicker({ onConfirm }: GradePickerProps) {
  const [selected, setSelected] = useState<Grade | null>(null);

  return (
    <View>
      <Text style={styles.title}>⚡ Welcome to Epic Math!</Text>
      <Text style={styles.subtitle}>What grade are you in?</Text>

      <View style={styles.grid}>
        {GRADES.map((grade) => {
          const isSelected = selected === grade;
          return (
            <TouchableOpacity key={grade} activeOpacity={0.85} onPress={() => setSelected(grade)} style={styles.slot}>
              <LinearGradient
                colors={isSelected ? ['#6d5bd0', '#8f7ff0'] : ['#eeeeee', '#dddddd']}
                style={styles.gradeCard}
              >
                <Text style={[styles.gradeText, isSelected && styles.gradeTextSelected]}>{grade}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        label="Let's Go! →"
        fullWidth
        disabled={selected === null}
        onPress={() => selected !== null && onConfirm(selected)}
        style={styles.confirmButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.heading1.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.xxl,
    fontSize: typography.body.fontSize,
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
  },
  gradeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textBody,
  },
  gradeTextSelected: {
    color: colors.surface,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
