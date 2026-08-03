import { gradients } from '../../constants/theme';
import type { GameMode } from '../../types';

export type ModeMeta = {
  key: GameMode;
  icon: string;
  label: string;
  sub?: string;
  colors: readonly [string, string, ...string[]];
  wide?: boolean;
};

export const MODES: ModeMeta[] = [
  { key: 'times', icon: '🔢', label: 'Times Tables', sub: '1 - 12', colors: gradients.times },
  { key: 'subtraction', icon: '➖', label: 'Subtraction', colors: gradients.subtraction },
  { key: 'division', icon: '➗', label: 'Division', colors: gradients.division },
  { key: 'percentages', icon: '💯', label: 'Percentages', colors: gradients.percentages },
  { key: 'mixed', icon: '🎲', label: 'Mixed Bag', colors: gradients.mixed, wide: true },
];

export function getModeMeta(mode: GameMode): ModeMeta {
  return MODES.find((m) => m.key === mode) ?? MODES[0];
}
