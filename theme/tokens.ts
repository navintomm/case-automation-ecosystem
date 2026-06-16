import { Platform } from 'react-native';

export const colors = {
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
