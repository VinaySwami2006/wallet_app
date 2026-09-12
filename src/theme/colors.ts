export const AppColors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  primaryContainer: '#EFF6FF',

  heroGradientStart: '#3B82F6',
  heroGradientEnd: '#1E40AF',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',

  success: '#10B981',
  successBg: '#ECFDF5',
  expense: '#EF4444',
  expenseBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',

  accent: '#8B5CF6',

  /** Dark navy chrome — home screen + floating nav (matches the reference). */
  dark: {
    background: '#0F172A',
    surface: '#1A2130',
    surfaceElevated: '#222735',
    border: '#2A3446',
    textPrimary: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    accent: '#8B5CF6',
    accentSoft: 'rgba(139,92,246,0.16)',
    gold: '#F6C453',
    goldSoft: 'rgba(246,196,83,0.15)',
    sky: '#7DD3FC',
    skySoft: 'rgba(125,211,252,0.16)',
    teal: '#2DD4BF',
    violetDeep: '#4C1D95',
    successUp: '#34D399',
    lossDown: '#F87171',
    btc: '#F7931A',
    btcBg: 'rgba(247,147,26,0.14)',
    eth: '#A5B4FC',
    ethBg: 'rgba(129,140,248,0.18)',
  },
};

export const Typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    color: AppColors.textPrimary,
  },
  headlineMedium: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: AppColors.textPrimary,
  },
  bodyPrimary: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: AppColors.textPrimary,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: AppColors.textSecondary,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: AppColors.textMuted,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: AppColors.textOnPrimary,
  },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  primaryGlow: {
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const BorderRadius = {
  micro: 10,
  small: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 28,
};
