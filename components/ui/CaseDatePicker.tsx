import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';

// Dynamically import DateTimePicker on native platforms to prevent web compile issues
let DateTimePicker: any;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

interface CaseDatePickerProps {
  label: string;
  value: string; // formatted as YYYY-MM-DD
  onDateChange: (date: string) => void;
  containerStyle?: any;
}

export default function CaseDatePicker({
  label,
  value,
  onDateChange,
  containerStyle,
}: CaseDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const getFormattedDisplayDate = () => {
    if (!value) return 'Select Date';
    // Format YYYY-MM-DD to DD.MM.YYYY
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return value;
  };

  const handleNativeChange = (event: any, selectedDate?: Date) => {
    // Hide picker for Android, keep for iOS (standard behaviour)
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      onDateChange(`${yyyy}-${mm}-${dd}`);
    }
  };

  const currentPickerDate = value ? new Date(value) : new Date();

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerBox}>
          <Text style={styles.dateText}>{getFormattedDisplayDate()}</Text>
          <Ionicons name="calendar-outline" size={18} color={colors.gold} />
          
          {/* Invisible HTML Date Input Overlay */}
          <input
            type="date"
            value={value}
            onChange={(e) => onDateChange(e.target.value)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              border: 'none',
            }}
            aria-label={label}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity
        style={styles.pickerBox}
        onPress={() => setShowPicker(true)}
        accessibilityLabel={`${label}, ${getFormattedDisplayDate()}`}
        accessibilityRole="button"
      >
        <Text style={styles.dateText}>{getFormattedDisplayDate()}</Text>
        <Ionicons name="calendar-outline" size={18} color={colors.gold} />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={isNaN(currentPickerDate.getTime()) ? new Date() : currentPickerDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleNativeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  pickerBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    position: 'relative',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
});
