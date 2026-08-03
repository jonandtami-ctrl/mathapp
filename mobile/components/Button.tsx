import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, spacing, typography } from '../constants/theme';

type ButtonProps = TouchableOpacityProps & {
  label: string;
  gradientColors?: readonly [string, string, ...string[]];
  fullWidth?: boolean;
};

export default function Button({
  label,
  gradientColors = gradients.primaryButton,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      style={[fullWidth && styles.fullWidth, disabled && styles.disabled, style]}
      {...rest}
    >
      <LinearGradient colors={gradientColors} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.surface,
    fontSize: typography.bodyBold.fontSize,
    fontWeight: typography.bodyBold.fontWeight,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
