export const MODES = [
  { key: 'times', icon: '🔢', label: 'Times Tables', sub: '1 - 12', colors: ['#4facfe', '#7b5ffc'] },
  { key: 'subtraction', icon: '➖', label: 'Subtraction', colors: ['#ff9a56', '#ff6a88'] },
  { key: 'division', icon: '➗', label: 'Division', colors: ['#38ef7d', '#11998e'] },
  { key: 'percentages', icon: '💯', label: 'Percentages', colors: ['#f78ca0', '#f9748f'] },
  { key: 'mixed', icon: '🎲', label: 'Mixed Bag', colors: ['#f78ca0', '#a06cd5', '#4facfe'], wide: true },
];

export function getModeTheme(modeKey) {
  return MODES.find((m) => m.key === modeKey) || MODES[0];
}

export const BG_GRADIENT = ['#6d5bd0', '#35b0ab', '#ff9a56'];
