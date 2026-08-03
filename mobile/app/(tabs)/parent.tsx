import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { useProfile } from '../../features/profile/ProfileContext';
import { colors, radii, spacing, typography } from '../../constants/theme';
import type { Grade } from '../../types';

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ParentTab() {
  const { profile, loading, updateGrade } = useProfile();

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

      <Text style={styles.sectionTitle}>{profile.nickname}'s Grade</Text>
      <Text style={styles.sectionSubtitle}>Controls the difficulty of Quick Play and Adventure Mode.</Text>
      <View style={styles.gradeRow}>
        {GRADES.map((grade) => {
          const isSelected = profile.grade === grade;
          return (
            <TouchableOpacity
              key={grade}
              onPress={() => updateGrade(grade)}
              style={[styles.gradeChip, isSelected && styles.gradeChipSelected]}
            >
              <Text style={[styles.gradeChipText, isSelected && styles.gradeChipTextSelected]}>{grade}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.divider} />

      <EmptyState
        icon="🔒"
        title="Full parent dashboard is coming soon"
        message="PIN protection, progress reports, goals, and subscription management arrive in Phase 5, after accounts (Phase 4) exist."
      />
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
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  gradeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gradeChip: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeChipSelected: {
    backgroundColor: colors.primary,
  },
  gradeChipText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textBody,
  },
  gradeChipTextSelected: {
    color: colors.surface,
  },
  divider: {
    height: 1,
    backgroundColor: colors.track,
    marginVertical: spacing.xxl,
  },
});
