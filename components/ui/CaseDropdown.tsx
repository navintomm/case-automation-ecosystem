import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';

interface Option {
  label: string;
  value: string;
}

interface CaseDropdownProps {
  label: string;
  value: string;
  options: string[] | Option[];
  placeholder: string;
  disabled?: boolean;
  disabledPlaceholder?: string;
  onSelect: (val: string) => void;
  error?: string;
  searchable?: boolean;
}

export default function CaseDropdown({
  label,
  value,
  options,
  placeholder,
  disabled = false,
  disabledPlaceholder,
  onSelect,
  error,
  searchable = true,
}: CaseDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const formattedOptions: Option[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });

  const getSelectedLabel = () => {
    const matched = formattedOptions.find((o) => o.value === value);
    return matched ? matched.label : '';
  };

  const filteredOptions = searchQuery
    ? formattedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : formattedOptions;

  const handleSelect = (val: string) => {
    onSelect(val);
    setModalVisible(false);
    setSearchQuery('');
  };

  const displayPlaceholder = disabled && disabledPlaceholder ? disabledPlaceholder : placeholder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.selector,
          disabled && styles.selectorDisabled,
          modalVisible && styles.selectorFocused,
          !!error && styles.selectorError,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        accessibilityLabel={`${label}, ${getSelectedLabel() || displayPlaceholder}`}
        accessibilityRole="combobox"
      >
        <Text
          style={[
            styles.selectorText,
            !value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {getSelectedLabel() || displayPlaceholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={disabled ? colors.textMuted : colors.textSecond}
        />
      </TouchableOpacity>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {/* Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              Platform.OS === 'web' && styles.modalContentWeb,
            ]}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select {label}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {searchable && (
                <View style={styles.searchBarContainer}>
                  <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search options..."
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    {...Platform.select({
                      web: {
                        outlineStyle: 'none',
                      },
                    })}
                  />
                </View>
              )}

              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const isSelected = item.value === value;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionItemSelected,
                      ]}
                      onPress={() => handleSelect(item.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={18} color={colors.gold} />
                      )}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No matches found</Text>
                  </View>
                }
              />
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  selector: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  selectorDisabled: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
  },
  selectorFocused: {
    borderColor: colors.gold,
    ...Platform.select({
      web: {
        boxShadow: `0 0 0 2px ${colors.gold}`,
      },
    }),
  },
  selectorError: {
    borderColor: colors.error,
  },
  selectorText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  disabledText: {
    color: colors.textMuted,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 42, 74, 0.4)', // dark overlay using navy tint
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalContentWeb: {
    maxWidth: 480,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    marginBottom: 12,
    height: 38,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream,
  },
  optionItemSelected: {
    backgroundColor: '#FCF8F0', // light gold tint
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  optionTextSelected: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
});
