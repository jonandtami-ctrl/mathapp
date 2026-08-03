import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadow, spacing, typography } from '../../constants/theme';
import { MODES } from './modes';
import type { GameMode } from '../../types';

type ModeSelectProps = {
  onSelectMode: (mode: GameMode) => void;
};

export default function ModeSelect({ onSelectMode }: ModeSelectProps) {
  return (
    <View>
      <Text style={styles.title}>🧮 Math Practice</Text>
      <Text style={styles.subtitle}>Pick something to practice. Each set has 20 questions.</Text>
      <View style={styles.menu}>
        {MODES.map((mode) => (
          <TouchableOpacity
            key={mode.key}
            activeOpacity={0.8}
            style={mode.wide ? styles.wideSlot : styles.slot}
            onPress={() => onSelectMode(mode.key)}
          >
            <LinearGradient colors={mode.colors} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.icon}>{mode.icon}</Text>
              <Text style={styles.label}>{mode.label}</Text>
              {mode.sub ? <Text style={styles.sub}>{mode.sub}</Text> : null}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.heading1.fontSize,
    fontWeight: typography.heading1.fontWeight,
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.xxl,
    fontSize: typography.body.fontSize,
  },
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
    marginBottom: spacing.lg,
  },
  wideSlot: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: radii.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
  },
  sub: {
    color: '#ffffffcc',
    fontSize: 12,
    marginTop: 2,
  },
});
