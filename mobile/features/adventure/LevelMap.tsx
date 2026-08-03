import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getStageProgress, isStageUnlocked } from './progress';
import Button from '../../components/Button';
import { colors, radii, spacing, typography } from '../../constants/theme';
import type { AdventureProgress } from '../../types';
import type { Stage, WorldDef } from './types';

type LevelMapProps = {
  world: WorldDef;
  progress: AdventureProgress;
  onSelectStage: (stage: Stage) => void;
  onBack: () => void;
};

function StarDisplay({ stars }: { stars: number }) {
  return (
    <Text style={styles.starLine}>
      {[0, 1, 2].map((i) => (i < stars ? '⭐' : '☆')).join('')}
    </Text>
  );
}

export default function LevelMap({ world, progress, onSelectStage, onBack }: LevelMapProps) {
  return (
    <View>
      <Text style={styles.title}>
        {world.icon} {world.name}
      </Text>

      {world.stages.map((stage) => {
        const unlocked = isStageUnlocked(world, stage, progress);
        const stageProgress = getStageProgress(progress, world.id, stage.id);
        const isBoss = stage.kind === 'boss';

        return (
          <TouchableOpacity
            key={stage.id}
            activeOpacity={unlocked ? 0.85 : 1}
            disabled={!unlocked}
            onPress={() => onSelectStage(stage)}
            style={styles.stageWrapper}
          >
            <LinearGradient
              colors={unlocked ? world.colors : ['#bbb', '#999']}
              style={[styles.stageCard, isBoss && styles.bossCard]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.stageIcon}>{!unlocked ? '🔒' : isBoss ? stage.bossEmoji : `${stage.stageIndex + 1}`}</Text>
              <View style={styles.stageTextBlock}>
                <Text style={styles.stageName}>{isBoss ? `Boss: ${stage.bossName}` : `Level ${stage.stageIndex + 1}`}</Text>
                {unlocked && stageProgress ? <StarDisplay stars={stageProgress.stars} /> : null}
                {!unlocked ? <Text style={styles.locked}>Earn a star on the previous stage to unlock</Text> : null}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}

      <Button label="← Back to World Map" fullWidth onPress={onBack} style={styles.backButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  stageWrapper: {
    marginBottom: spacing.md,
  },
  stageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  bossCard: {
    borderWidth: 2,
    borderColor: colors.gold,
  },
  stageIcon: {
    fontSize: 26,
    minWidth: 36,
    textAlign: 'center',
  },
  stageTextBlock: {
    flex: 1,
  },
  stageName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface,
  },
  starLine: {
    fontSize: 14,
    marginTop: 2,
  },
  locked: {
    fontSize: typography.small.fontSize,
    color: '#ffffffcc',
    marginTop: 2,
  },
  backButton: {
    marginTop: spacing.md,
  },
});
