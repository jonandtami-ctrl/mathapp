import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import ModeSelect from '../../features/gameplay/ModeSelect';
import QuizFlow from '../../features/gameplay/QuizFlow';
import ResultsSummary from '../../features/gameplay/ResultsSummary';
import QuickPlay from '../../features/gameplay/QuickPlay';
import QuickPlayResults from '../../features/gameplay/QuickPlayResults';
import { useActiveProfile, type QuizResult } from '../../hooks/useActiveProfile';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { GameMode } from '../../types';

type PlayState =
  | 'menu'
  | 'quickplay'
  | 'quickplay-results'
  | 'classic-select'
  | 'classic-quiz'
  | 'classic-results';

export default function PlayTab() {
  const { profile, loading, recordQuizResult } = useActiveProfile();
  const [state, setState] = useState<PlayState>('menu');
  const [classicMode, setClassicMode] = useState<GameMode | null>(null);
  const [classicScore, setClassicScore] = useState(0);
  const [quickPlayResult, setQuickPlayResult] = useState<QuizResult | null>(null);

  if (loading || !profile) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading..." />
      </ScreenContainer>
    );
  }

  function startClassic(mode: GameMode) {
    setClassicMode(mode);
    setState('classic-quiz');
  }

  function finishClassic(score: number) {
    setClassicScore(score);
    setState('classic-results');
  }

  async function finishQuickPlay(result: QuizResult) {
    setQuickPlayResult(result);
    await recordQuizResult(result);
    setState('quickplay-results');
  }

  return (
    <ScreenContainer>
      {state === 'menu' && (
        <View>
          <Text style={styles.title}>🎮 Play</Text>

          <TouchableOpacity onPress={() => setState('quickplay')} activeOpacity={0.85}>
            <LinearGradient colors={gradients.mixed} style={styles.quickPlayCard}>
              <Text style={styles.quickPlayIcon}>⚡</Text>
              <Text style={styles.quickPlayTitle}>Quick Play</Text>
              <Text style={styles.quickPlaySubtitle}>
                10 mixed questions for Grade {profile.grade} — earn XP and coins!
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.divider}>or try Classic Practice</Text>
          <ModeSelect onSelectMode={startClassic} />
        </View>
      )}

      {state === 'quickplay' && <QuickPlay grade={profile.grade} onFinish={finishQuickPlay} />}

      {state === 'quickplay-results' && quickPlayResult && (
        <QuickPlayResults
          result={quickPlayResult}
          onPlayAgain={() => setState('quickplay')}
          onHome={() => setState('menu')}
        />
      )}

      {state === 'classic-quiz' && classicMode && <QuizFlow mode={classicMode} onFinish={finishClassic} />}

      {state === 'classic-results' && classicMode && (
        <ResultsSummary
          score={classicScore}
          mode={classicMode}
          onRetry={startClassic}
          onHome={() => setState('menu')}
        />
      )}
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
  quickPlayCard: {
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  quickPlayIcon: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  quickPlayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.surface,
  },
  quickPlaySubtitle: {
    fontSize: typography.small.fontSize,
    color: '#ffffffdd',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  divider: {
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.lg,
    fontSize: typography.small.fontSize,
  },
});
