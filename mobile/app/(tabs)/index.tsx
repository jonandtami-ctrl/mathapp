import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import { useActiveProfile } from '../../hooks/useActiveProfile';
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

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.xp}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
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
    marginBottom: spacing.xxl,
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
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
