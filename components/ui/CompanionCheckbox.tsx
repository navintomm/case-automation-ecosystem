import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';

interface CompanionCheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  alwaysOn?: boolean;
}

export default function CompanionCheckbox({
  label,
  checked,
  onToggle,
  alwaysOn = false,
}: CompanionCheckboxProps) {
  const isDisabled = alwaysOn;

  return (
    <TouchableOpacity
      style={[
        styles.row,
        isDisabled && styles.rowDisabled,
        checked && styles.rowChecked,
      ]}
      onPress={onToggle}
      disabled={isDisabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: isDisabled }}
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          isDisabled && styles.checkboxDisabled,
        ]}
      >
        {checked && (
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        )}
      </View>
      
      <Text
        style={[
          styles.label,
          checked && styles.labelChecked,
          isDisabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowChecked: {
    backgroundColor: colors.goldLighter, // light gold tint background
    borderColor: 'rgba(201, 150, 58, 0.15)',
  },
  rowDisabled: {
    opacity: 0.8,
    backgroundColor: colors.cream,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  checkboxDisabled: {
    backgroundColor: '#E2E0DA',
    borderColor: '#C4C2BC',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    flex: 1,
  },
  labelChecked: {
    fontFamily: 'Inter_500Medium',
    color: colors.navy,
  },
  labelDisabled: {
    color: colors.textSecond,
  },
});
