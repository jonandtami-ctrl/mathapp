// Design tokens for Epic Math. Colors are the palette already validated in the
// original quiz prototype (src/theme.js) — kept as-is rather than switched to
// a different palette.

export const colors = {
  primary: '#6d5bd0',
  primaryLight: '#8f7ff0',
  teal: '#35b0ab',
  orange: '#ff9a56',
  pink: '#ff6a88',
  pinkDeep: '#f9748f',
  green: '#38ef7d',
  greenDeep: '#11998e',
  blue: '#4facfe',
  purpleDeep: '#7b5ffc',
  purpleAccent: '#a06cd5',
  gold: '#ffc93c',

  textHeading: '#35317a',
  textBody: '#1f2430',
  textMuted: '#555555',

  surface: '#ffffff',
  track: '#eeeeee',

  success: '#1a7a34',
  successBg: '#e3f8e8',
  error: '#b6221e',
  errorBg: '#fbe6e5',
} as const;

export const gradients = {
  background: [colors.primary, colors.teal, colors.orange] as const,
  primaryButton: [colors.primary, colors.primaryLight] as const,
  accentButton: [colors.teal, colors.blue] as const,
  successButton: [colors.green, colors.greenDeep] as const,
  times: [colors.blue, colors.purpleDeep] as const,
  subtraction: [colors.orange, colors.pink] as const,
  division: [colors.green, colors.greenDeep] as const,
  percentages: [colors.pink, colors.pinkDeep] as const,
  mixed: [colors.pink, colors.purpleAccent, colors.blue] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const typography = {
  heading1: { fontSize: 30, fontWeight: '700' as const },
  heading2: { fontSize: 22, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyBold: { fontSize: 16, fontWeight: '700' as const },
  small: { fontSize: 13, fontWeight: '400' as const },
  smallBold: { fontSize: 13, fontWeight: '700' as const },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
} as const;
