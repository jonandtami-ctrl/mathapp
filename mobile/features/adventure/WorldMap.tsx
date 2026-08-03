import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WORLDS } from './worlds';
import { getWorldStarTotal, isWorldUnlocked } from './progress';
import { colors, radii, spacing, typography } from '../../constants/theme';
import type { AdventureProgress } from '../../types';
import type { WorldId } from './types';

type WorldMapProps = {
  progress: AdventureProgress;
  onSelectWorld: (worldId: WorldId) => void;
};

export default function WorldMap({ progress, onSelectWorld }: WorldMapProps) {
  return (
    <View>
      <Text style={styles.title}>🗺️ Adventure Mode</Text>
      <Text style={styles.subtitle}>Earn stars to unlock the next world!</Text>

      {WORLDS.map((world, index) => {
        const unlocked = isWorldUnlocked(index, progress);
        const { earned, max } = getWorldStarTotal(world, progress);

        return (
          <TouchableOpacity
            key={world.id}
            activeOpacity={unlocked ? 0.85 : 1}
            disabled={!unlocked}
            onPress={() => onSelectWorld(world.id)}
            style={styles.cardWrapper}
          >
            <LinearGradient
              colors={unlocked ? world.colors : ['#bbb', '#999']}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.icon}>{unlocked ? world.icon : '🔒'}</Text>
              <View style={styles.textBlock}>
                <Text style={styles.name}>{world.name}</Text>
                {unlocked ? (
                  <Text style={styles.stars}>⭐ {earned}/{max} stars</Text>
                ) : (
                  <Text style={styles.stars}>Beat the previous world's boss to unlock</Text>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
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
    marginBottom: spacing.xl,
    fontSize: typography.small.fontSize,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  icon: {
    fontSize: 34,
  },
  textBlock: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.surface,
  },
  stars: {
    fontSize: typography.small.fontSize,
    color: '#ffffffdd',
    marginTop: 2,
  },
});
