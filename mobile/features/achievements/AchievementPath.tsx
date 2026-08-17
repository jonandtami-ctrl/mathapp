import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ACHIEVEMENTS } from './index';
import { colors, radii, spacing, typography } from '../../constants/theme';
import type { ChildProfile } from '../../types';

const ROW_HEIGHT = 128;
const NODE_SIZE = 64;
// Fraction of container width for each node's center, cycling to create a
// winding trail regardless of how many achievements exist.
const OFFSET_CYCLE = [0.2, 0.68, 0.5, 0.3, 0.72];
const LOCKED_COLORS = ['#c9c9c9', '#a8a8a8'] as const;
const UNLOCKED_COLORS = ['#ffc93c', '#ff9a56'] as const;

function offsetFor(index: number): number {
  return OFFSET_CYCLE[index % OFFSET_CYCLE.length];
}

type AchievementPathProps = {
  profile: ChildProfile;
};

export default function AchievementPath({ profile }: AchievementPathProps) {
  const [width, setWidth] = useState(0);

  function onLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
  }

  const unlockedFlags = ACHIEVEMENTS.map((a) => a.isUnlocked(profile));
  const nextGoalIndex = unlockedFlags.findIndex((u) => !u);
  const totalHeight = ACHIEVEMENTS.length * ROW_HEIGHT + NODE_SIZE;

  const centers = ACHIEVEMENTS.map((_, i) => ({
    x: offsetFor(i) * Math.max(width, 1),
    y: i * ROW_HEIGHT + NODE_SIZE / 2,
  }));

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      <View style={{ height: totalHeight }}>
        {width > 0 &&
          centers.slice(1).map((center, i) => {
            const prev = centers[i];
            const dx = center.x - prev.x;
            const dy = center.y - prev.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
            const midX = (center.x + prev.x) / 2;
            const midY = (center.y + prev.y) / 2;
            const isTraveled = unlockedFlags[i + 1] || unlockedFlags[i];

            return (
              <View
                key={`line-${i}`}
                style={[
                  styles.connector,
                  {
                    width: length,
                    left: midX - length / 2,
                    top: midY - 2,
                    backgroundColor: isTraveled ? colors.gold : '#dddddd',
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              />
            );
          })}

        {width > 0 &&
          ACHIEVEMENTS.map((achievement, i) => {
            const unlocked = unlockedFlags[i];
            const isNextGoal = i === nextGoalIndex;
            const center = centers[i];

            return (
              <View
                key={achievement.id}
                style={[styles.nodeWrapper, { left: center.x - NODE_SIZE / 2, top: center.y - NODE_SIZE / 2 }]}
              >
                {isNextGoal ? <Text style={styles.flag}>📍</Text> : null}
                <LinearGradient
                  colors={unlocked ? UNLOCKED_COLORS : LOCKED_COLORS}
                  style={[styles.node, unlocked && styles.nodeUnlocked]}
                >
                  <Text style={styles.nodeIcon}>{unlocked ? achievement.icon : '🔒'}</Text>
                </LinearGradient>
                <View style={[styles.labelBox, center.x > width / 2 ? styles.labelLeft : styles.labelRight]}>
                  <Text style={[styles.labelName, !unlocked && styles.labelMuted]} numberOfLines={2}>
                    {achievement.name}
                  </Text>
                  {!unlocked ? (
                    <Text style={styles.labelDescription} numberOfLines={2}>
                      {achievement.description}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  connector: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  nodeWrapper: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    alignItems: 'center',
  },
  flag: {
    position: 'absolute',
    top: -26,
    fontSize: 22,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  nodeUnlocked: {
    borderColor: colors.gold,
  },
  nodeIcon: {
    fontSize: 28,
  },
  labelBox: {
    position: 'absolute',
    top: NODE_SIZE + spacing.xs,
    width: 100,
  },
  labelLeft: {
    right: 0,
    alignItems: 'flex-end',
  },
  labelRight: {
    left: 0,
    alignItems: 'flex-start',
  },
  labelName: {
    fontSize: typography.smallBold.fontSize,
    fontWeight: '700',
    color: colors.textBody,
    textAlign: 'center',
  },
  labelMuted: {
    color: colors.textMuted,
  },
  labelDescription: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
});
