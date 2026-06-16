import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TextInputProps } from 'react-native';
import { colors, radius } from '../../theme/tokens';

interface CaseInputProps extends TextInputProps {
  label: string;
  isOptional?: boolean;
  error?: string;
  containerStyle?: any;
}

export default function CaseInput({
  label,
  isOptional = false,
  error,
  containerStyle,
  style,
  ...props
}: CaseInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {isOptional && (
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>Optional</Text>
          </View>
        )}
      </View>
      
      <TextInput
        style={[
          styles.input,
          props.multiline && styles.multilineInput,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur && props.onBlur(e);
        }}
        {...props}
      />
      
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  optionalBadge: {
    backgroundColor: colors.cream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionalText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  multilineInput: {
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: colors.gold,
    ...Platform.select({
      web: {
        boxShadow: `0 0 0 2px ${colors.gold}`,
      },
    }),
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
});
