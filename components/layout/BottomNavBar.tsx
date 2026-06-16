import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/tokens';

interface BottomNavBarProps {
  currentStep: number;
  onNext: () => void;
  isNextDisabled?: boolean;
  onBackFromStep1?: () => void;
}

export default function BottomNavBar({
  currentStep,
  onNext,
  isNextDisabled = false,
  onBackFromStep1,
}: BottomNavBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (currentStep === 1 && onBackFromStep1) {
      onBackFromStep1();
    } else if (currentStep > 1) {
      router.back();
    }
  };

  const handleSaveDraft = () => {
    Toast.show({
      type: 'success',
      text1: 'Draft Saved',
      text2: 'Your legal case file draft has been updated locally.',
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const getNextLabel = () => {
    if (currentStep === 4) return 'Verify & Generate →';
    return 'Next →';
  };

  const isBackDisabled = currentStep === 1 && !onBackFromStep1;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={[styles.button, styles.backButton, isBackDisabled && styles.disabledButton]}
        onPress={handleBack}
        disabled={isBackDisabled}
        accessibilityLabel="Go to previous step"
        accessibilityRole="button"
      >
        <Text style={[styles.backText, isBackDisabled && styles.disabledText]}>
          ← Back
        </Text>
      </TouchableOpacity>

      {/* Save Draft Button */}
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={handleSaveDraft}
        accessibilityLabel="Save Draft"
        accessibilityRole="button"
      >
        <Text style={styles.saveText}>Save Draft</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.button,
          styles.nextButton,
          isNextDisabled && styles.disabledNextButton,
        ]}
        onPress={onNext}
        disabled={isNextDisabled}
        accessibilityLabel={getNextLabel()}
        accessibilityRole="button"
      >
        <Text style={[styles.nextText, isNextDisabled && styles.disabledNextText]}>
          {getNextLabel()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 76,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    alignItems: 'flex-start',
  },
  disabledButton: {
    opacity: 0.5,
  },
  backText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  disabledText: {
    color: colors.textMuted,
  },
  saveButton: {
    flex: 1.2,
    borderWidth: 1.5,
    borderColor: colors.navy,
    marginRight: 8,
  },
  saveText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  nextButton: {
    flex: 1.8,
    backgroundColor: colors.gold,
  },
  disabledNextButton: {
    backgroundColor: colors.border,
  },
  nextText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  disabledNextText: {
    color: colors.textMuted,
  },
});
