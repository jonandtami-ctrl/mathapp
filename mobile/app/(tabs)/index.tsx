import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import ProgressBar from '../../components/ProgressBar';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { getLevelInfo } from '../../constants/leveling';
import { colors, spacing, typography } from '../../constants/theme';

export default function HomeTab() {
  const { profile, loading } = useActiveProfile();
  const router = useRouter();

  if (loading || !profile) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading your profile..." />
      </ScreenContainer>
    );
  }

  const levelInfo = getLevelInfo(profile.xp);

  return (
    <ScreenContainer>
      <Text style={styles.logo}>⚡ Epic Math</Text>
      <View style={styles.profileRow}>
        <Text style={styles.avatar}>{profile.avatar}</Text>
        <View>
          <Text style={styles.nickname}>{profile.nickname}</Text>
          <Text style={styles.grade}>Grade {profile.grade}</Text>
        </View>
      </View>

      <View style={styles.levelRow}>
        <Text style={styles.levelLabel}>Level {levelInfo.level}</Text>
        <Text style={styles.levelXp}>
          {levelInfo.xpIntoLevel} / {levelInfo.xpForNextLevel} XP
        </Text>
      </View>
      <ProgressBar progress={levelInfo.progress} height={12} />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>🔥 {profile.dailyStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <Button label="Continue Playing →" fullWidth onPress={() => router.push('/play')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: typography.heading1.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  avatar: {
    fontSize: 48,
  },
  nickname: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '700',
    color: colors.textBody,
  },
  grade: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  levelLabel: {
    fontWeight: '700',
    color: colors.textHeading,
    fontSize: 15,
  },
  levelXp: {
    color: colors.textMuted,
    fontSize: typography.small.fontSize,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.track,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textHeading,
  },
  statLabel: {
    fontSize: typography.small.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
