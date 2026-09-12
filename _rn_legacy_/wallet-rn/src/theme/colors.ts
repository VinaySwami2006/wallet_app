export const AppColors = {
  // Primary Vibrant Blues
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryContainer: '#EFF6FF',

  // Hero Gradients
  heroGradientStart: '#3B82F6',
  heroGradientEnd: '#1E40AF',

  // Background & Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',

  // Borders
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',

  // Text & Content
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  // Semantics
  success: '#10B981',
  successBg: '#ECFDF5',
  expense: '#EF4444',
  expenseBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
};

export const Typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  headlineMedium: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  bodyPrimary: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  bodySecondary: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  primaryGlow: {
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const BorderRadius = {
  micro: 10,
  small: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 28,
  pill: 999,
};
