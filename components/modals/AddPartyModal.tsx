import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { colors, radius } from '../../theme/tokens';
import { Party } from '../../store/caseStore';
import CaseInput from '../ui/CaseInput';
import CaseDropdown from '../ui/CaseDropdown';
import { PARTY_ROLES } from '../../constants/partyRoles';

const partySchema = z.object({
  role: z.string().min(1, 'Party role is required'),
  name: z.string().min(1, 'Name is required'),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Age must be a valid positive number',
  }),
  relationType: z.enum(['Father', 'Mother', 'Spouse']),
  relationName: z.string().min(1, 'Relation name is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  pinCode: z.string().optional().refine((val) => !val || /^\d{6}$/.test(val), {
    message: 'PIN Code must be 6 digits',
  }),
  state: z.string().optional(),
  country: z.string().optional(),
  representative: z.string().optional(),
  guardian: z.string().optional(),
  mobile: z.string().optional().refine((val) => !val || /^\d{10}$/.test(val), {
    message: 'Mobile must be a 10-digit number',
  }),
  email: z.string().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Invalid email address',
  }),
});

type PartyFormValues = z.infer<typeof partySchema>;

interface AddPartyModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (party: Party) => void;
  defaultRole?: string;
}

export default function AddPartyModal({
  visible,
  onClose,
  onSave,
  defaultRole,
}: AddPartyModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      role: defaultRole || 'Petitioner',
      name: '',
      age: '',
      relationType: 'Father',
      relationName: '',
      address: '',
      pinCode: '',
      state: 'Kerala',
      country: 'India',
      representative: '',
      guardian: '',
      mobile: '',
      email: '',
    },
  });

  // Keep role in sync if defaultRole prop changes
  React.useEffect(() => {
    if (visible && defaultRole) {
      reset((prev) => ({ ...prev, role: defaultRole }));
    }
  }, [visible, defaultRole, reset]);

  const onSubmit = (data: PartyFormValues) => {
    const newParty: Party = {
      id: Math.random().toString(36).substring(2, 9),
      ...data,
    };
    onSave(newParty);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.modalContent,
              Platform.OS === 'web' && styles.modalContentWeb,
            ]}
          >
            <SafeAreaView style={{ flex: 1 }}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Party Details</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Form Body */}
              <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Role */}
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { onChange, value } }) => (
                    <CaseDropdown
                      label="Party Role"
                      value={value}
                      options={PARTY_ROLES}
                      placeholder="Select role"
                      onSelect={onChange}
                      error={errors.role?.message}
                      searchable={false}
                    />
                  )}
                />

                {/* Name */}
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Party Name"
                      placeholder="e.g. Ramesh Kumar K."
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.name?.message}
                    />
                  )}
                />

                {/* Age */}
                <Controller
                  control={control}
                  name="age"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Age"
                      placeholder="e.g. 45"
                      keyboardType="numeric"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.age?.message}
                    />
                  )}
                />

                {/* Relation Type Toggle */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.groupLabel}>Relationship Type</Text>
                  <Controller
                    control={control}
                    name="relationType"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.relationToggleContainer}>
                        {(['Father', 'Mother', 'Spouse'] as const).map((type) => {
                          const isActive = value === type;
                          return (
                            <TouchableOpacity
                              key={type}
                              style={[
                                styles.togglePill,
                                isActive ? styles.togglePillActive : styles.togglePillInactive,
                              ]}
                              onPress={() => onChange(type)}
                            >
                              <Text
                                style={[
                                  styles.toggleText,
                                  isActive ? styles.toggleTextActive : styles.toggleTextInactive,
                                ]}
                              >
                                {type}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  />
                </View>

                {/* Relation Name */}
                <Controller
                  control={control}
                  name="relationName"
                  render={({ field: { onChange, onBlur, value } }) => {
                    return (
                      <CaseInput
                        label="Parent / Spouse Name"
                        placeholder="e.g. Madhavan Pillai"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        error={errors.relationName?.message}
                      />
                    );
                  }}
                />

                {/* Address */}
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Residential Address"
                      placeholder="Enter full address details (House Name, Place, Pin)..."
                      multiline
                      numberOfLines={3}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.address?.message}
                    />
                  )}
                />

                {/* PIN Code */}
                <Controller
                  control={control}
                  name="pinCode"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="PIN Code"
                      placeholder="e.g. 682001"
                      keyboardType="numeric"
                      isOptional
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.pinCode?.message}
                    />
                  )}
                />

                {/* State */}
                <Controller
                  control={control}
                  name="state"
                  render={({ field: { onChange, value } }) => (
                    <CaseDropdown
                      label="State"
                      value={value || 'Kerala'}
                      options={['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Delhi', 'Other']}
                      placeholder="Select State"
                      onSelect={onChange}
                      error={errors.state?.message}
                    />
                  )}
                />

                {/* Country */}
                <Controller
                  control={control}
                  name="country"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Country"
                      placeholder="e.g. India"
                      isOptional
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.country?.message}
                    />
                  )}
                />

                {/* Representative */}
                <Controller
                  control={control}
                  name="representative"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Represented by (if applicable)"
                      placeholder="e.g. Power of Attorney holder"
                      isOptional
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.representative?.message}
                    />
                  )}
                />

                {/* Legal Guardian */}
                <Controller
                  control={control}
                  name="guardian"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Guardian (if minor)"
                      placeholder="e.g. Legal Guardian Name"
                      isOptional
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.guardian?.message}
                    />
                  )}
                />

                {/* Mobile (Optional) */}
                <Controller
                  control={control}
                  name="mobile"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Mobile Number"
                      placeholder="10-digit phone number"
                      keyboardType="phone-pad"
                      isOptional
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.mobile?.message}
                    />
                  )}
                />

                {/* Email (Optional) */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Email Address"
                      placeholder="e.g. name@domain.com"
                      keyboardType="email-address"
                      isOptional
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.email?.message}
                    />
                  )}
                />
              </ScrollView>

              {/* Submit Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit(onSubmit)}
                  accessibilityLabel="Save Party"
                  accessibilityRole="button"
                >
                  <Text style={styles.saveButtonText}>Add Party</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 42, 74, 0.4)',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    maxHeight: '90%',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 16,
  },
  modalContentWeb: {
    maxWidth: 600,
    maxHeight: '85%',
    alignSelf: 'center',
    borderRadius: radius.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  relationToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    padding: 3,
  },
  togglePill: {
    flex: 1,
    height: 36,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  togglePillActive: {
    backgroundColor: colors.navy,
  },
  togglePillInactive: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInactive: {
    color: colors.textSecond,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: colors.gold,
    height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
});
