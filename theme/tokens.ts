import { Platform } from 'react-native';

export const lightColors = {
  navy:        '#1B2A4A',
  navyLight:   '#243560',
  navyLighter: '#324575',
  gold:        '#C9963A',
  goldLight:   '#F0C96B',
  goldLighter: '#FCF8F0',
  cream:       '#F7F5F0',
  white:       '#FFFFFF',
  cardBg:      '#FFFFFF',
  verified:    '#22843F',
  success:     '#22843F',
  warning:     '#D97706',
  error:       '#C0392B',
  textPrimary: '#1A1A2E',
  textSecond:  '#5A6478',
  textMuted:   '#9AA3B2',
  border:      '#E2E0DA',
  borderFocus: '#C9963A',
};

export const darkColors = {
  navy:        '#0B1120',      // Deeper black/navy
  navyLight:   '#162032',
  navyLighter: '#1E293B',
  gold:        '#EAB308',      // Brighter gold for dark mode
  goldLight:   '#FDE047',
  goldLighter: '#FEF08A',
  cream:       '#020617',      // Very dark background instead of cream
  white:       '#0F172A',      // Cards are dark slate
  cardBg:      '#0F172A',
  verified:    '#4ADE80',
  success:     '#4ADE80',
  warning:     '#F59E0B',
  error:       '#F87171',
  textPrimary: '#F8FAFC',      // White text
  textSecond:  '#CBD5E1',      // Light gray text
  textMuted:   '#64748B',      // Darker gray text
  border:      '#1E293B',      // Dark borders
  borderFocus: '#EAB308',
};

// Fallback for static imports (will use light theme)
export const colors = lightColors;

export const typography = {
  displayFont: 'DMSerifDisplay_400Regular',
  bodyFont:    'Inter_400Regular',
  bodyMedium:  'Inter_500Medium',
  bodySemiBold:'Inter_600SemiBold',
  bodyBold:    'Inter_700Bold',
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const radius = {
  sm: 6, md: 10, lg: 16, xl: 24, full: 999,
};

export const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  }
});
