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
import WorldMap from '../../features/adventure/WorldMap';
import LevelMap from '../../features/adventure/LevelMap';
import LevelSession from '../../features/adventure/LevelSession';
import LevelResults from '../../features/adventure/LevelResults';
import BossBattle from '../../features/adventure/BossBattle';
import { getWorld } from '../../features/adventure/worlds';
import type { SessionOutcome } from '../../features/gameplay/QuestionSession';
import type { Stage, WorldId } from '../../features/adventure/types';
import { useActiveProfile, type QuizResult } from '../../hooks/useActiveProfile';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { GameMode } from '../../types';

type PlayState =
  | 'menu'
  | 'quickplay'
  | 'quickplay-results'
  | 'classic-select'
  | 'classic-quiz'
  | 'classic-results'
  | 'adventure-worldmap'
  | 'adventure-levelmap'
  | 'adventure-stage'
  | 'adventure-results';

export default function PlayTab() {
  const { profile, loading, recordQuizResult, recordLevelResult } = useActiveProfile();
  const [state, setState] = useState<PlayState>('menu');
  const [classicMode, setClassicMode] = useState<GameMode | null>(null);
  const [classicScore, setClassicScore] = useState(0);
  const [quickPlayResult, setQuickPlayResult] = useState<QuizResult | null>(null);
  const [selectedWorldId, setSelectedWorldId] = useState<WorldId | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [adventureOutcome, setAdventureOutcome] = useState<SessionOutcome | null>(null);

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

  function openWorld(worldId: WorldId) {
    setSelectedWorldId(worldId);
    setState('adventure-levelmap');
  }

  function openStage(stage: Stage) {
    setSelectedStage(stage);
    setState('adventure-stage');
  }

  async function finishStage(outcome: SessionOutcome) {
    if (!selectedWorldId || !selectedStage) return;
    setAdventureOutcome(outcome);
    await recordLevelResult({
      worldId: selectedWorldId,
      stageId: selectedStage.id,
      category: selectedStage.category,
      xpEarned: outcome.xpEarned,
      coinsEarned: outcome.coinsEarned,
      correctCount: outcome.correctCount,
      totalCount: outcome.totalCount,
    });
    setState('adventure-results');
  }

  const world = selectedWorldId ? getWorld(selectedWorldId) : null;

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

          <TouchableOpacity onPress={() => setState('adventure-worldmap')} activeOpacity={0.85}>
            <LinearGradient colors={gradients.successButton} style={styles.quickPlayCard}>
              <Text style={styles.quickPlayIcon}>🗺️</Text>
              <Text style={styles.quickPlayTitle}>Adventure Mode</Text>
              <Text style={styles.quickPlaySubtitle}>Explore 8 worlds, earn stars, defeat bosses!</Text>
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

      {state === 'adventure-worldmap' && (
        <WorldMap progress={profile.adventureProgress} onSelectWorld={openWorld} />
      )}

      {state === 'adventure-levelmap' && world && (
        <LevelMap
          world={world}
          progress={profile.adventureProgress}
          onSelectStage={openStage}
          onBack={() => setState('adventure-worldmap')}
        />
      )}

      {state === 'adventure-stage' &&
        selectedStage &&
        (selectedStage.kind === 'level' ? (
          <LevelSession stage={selectedStage} grade={profile.grade} onFinish={finishStage} />
        ) : (
          <BossBattle stage={selectedStage} grade={profile.grade} onFinish={finishStage} />
        ))}

      {state === 'adventure-results' && selectedStage && adventureOutcome && (
        <LevelResults
          stage={selectedStage}
          outcome={adventureOutcome}
          onRetry={() => setState('adventure-stage')}
          onBackToLevels={() => setState('adventure-levelmap')}
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
