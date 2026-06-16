import React from 'react';
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
import { Witness } from '../../store/caseStore';
import CaseInput from '../ui/CaseInput';

const witnessSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  purpose: z.string().min(1, 'Purpose of testimony is required'),
});

type WitnessFormValues = z.infer<typeof witnessSchema>;

interface AddWitnessModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (witness: Witness) => void;
}

export default function AddWitnessModal({
  visible,
  onClose,
  onSave,
}: AddWitnessModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WitnessFormValues>({
    resolver: zodResolver(witnessSchema),
    defaultValues: {
      name: '',
      address: '',
      purpose: '',
    },
  });

  const onSubmit = (data: WitnessFormValues) => {
    const newWitness: Witness = {
      id: Math.random().toString(36).substring(2, 9),
      ...data,
    };
    onSave(newWitness);
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
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Witness</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Witness Name */}
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Witness Name"
                      placeholder="e.g. Thomas Mathew"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.name?.message}
                    />
                  )}
                />

                {/* Address */}
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Address"
                      placeholder="Enter residential address..."
                      multiline
                      numberOfLines={3}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.address?.message}
                    />
                  )}
                />

                {/* Purpose */}
                <Controller
                  control={control}
                  name="purpose"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CaseInput
                      label="Purpose of Testimony"
                      placeholder="e.g. Eyewitness to the occurrence of accident"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.purpose?.message}
                    />
                  )}
                />
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit(onSubmit)}
                  accessibilityLabel="Add Witness"
                  accessibilityRole="button"
                >
                  <Text style={styles.saveButtonText}>Add Witness</Text>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    maxHeight: '80%',
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
    maxWidth: 480,
    maxHeight: '60%',
    alignSelf: 'center',
    borderRadius: radius.lg,
    marginBottom: 'auto',
    marginTop: 'auto',
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
