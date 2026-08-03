import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radii, shadow, spacing } from '../constants/theme';

export default function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    ...shadow.card,
  },
});
