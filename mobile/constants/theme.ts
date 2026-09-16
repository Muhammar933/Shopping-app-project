export const theme = {
  colors: {
    primary: '#111111',
    primaryHover: '#000000',
    accent: '#D4A373',
    background: '#FAFAF8',
    surface: '#FFFFFF',
    surfaceSubtle: '#F4F3EF',
    textPrimary: '#111111',
    textSecondary: '#666666',
    textTertiary: '#9E9E9E',
    border: '#E5E5E0',
    borderFocus: '#111111',
    success: '#2E7D32',
    error: '#D32F2F',
    warning: '#ED6C02',
    badge: '#111111',
  },
  typography: {
    display: {
      fontSize: 32,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    h1: {
      fontSize: 26,
      fontWeight: '600' as const,
      letterSpacing: -0.3,
    },
    h2: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 17,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400' as const,
      color: '#777777',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
  },
};
