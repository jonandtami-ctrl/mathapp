import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';
import type { VerticalLayout } from '../features/questions/types';

type VerticalProblemProps = {
  vertical: VerticalLayout;
};

// Textbook-style stacked arithmetic problem: top operand, then the operator
// beside the bottom operand, then a divider line - the way kids actually
// see addition/subtraction/multiplication/division on paper.
export default function VerticalProblem({ vertical }: VerticalProblemProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.digits}>{vertical.top}</Text>
      <View style={styles.row}>
        <Text style={styles.operator}>{vertical.operator}</Text>
        <Text style={[styles.digits, styles.bottomDigits]}>{vertical.bottom}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 200,
    alignSelf: 'center',
    marginVertical: spacing.lg,
  },
  digits: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textBody,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operator: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginRight: spacing.sm,
  },
  bottomDigits: {
    flex: 1,
  },
  line: {
    height: 4,
    backgroundColor: colors.textBody,
    borderRadius: 2,
    marginTop: spacing.xs,
    width: '100%',
  },
});
