import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { useMattersStore } from '../store/mattersStore';

const MOCK_ADVOCATES = ['Adv. Priya Menon', 'Adv. Arun Nair', 'Adv. Rones V. Anil'];
const MOCK_CLERKS = ['Ravi Menon', 'Anitha Krishnan', 'Deepa S.'];

export default function CreateDraftScreen() {
  const router = useRouter();
  const { addMatter } = useMattersStore();

  const [title, setTitle] = useState('');
  const [caseOwner, setCaseOwner] = useState(MOCK_ADVOCATES[0]);
  const [assignedStaff, setAssignedStaff] = useState<string[]>([]);
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [remarks, setRemarks] = useState('');
  const [reference, setReference] = useState('');

  // Dropdown toggles
  const [showOwnerDrop, setShowOwnerDrop] = useState(false);
  const [showStaffDrop, setShowStaffDrop] = useState(false);

  const toggleStaff = (staff: string) => {
    if (assignedStaff.includes(staff)) {
      setAssignedStaff(assignedStaff.filter((s) => s !== staff));
    } else {
      setAssignedStaff([...assignedStaff, staff]);
    }
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    const newId = `MTR-${Date.now()}`;
    addMatter({
      id: newId,
      title: title.trim(),
      caseOwner,
      assignedStaff,
      priority,
      remarks: remarks.trim(),
      reference: reference.trim(),
      status: 'Draft',
      currentStep: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // BACKEND INTEGRATION POINT
    // POST /api/matters — create new matter record
    // Body: { title, caseOwner, assignedStaff, priority, remarks, reference }
    // Response: { matterId, createdAt }
    // Currently: saves to mattersStore (Zustand) locally

    // Push to step 1 (In a real app we might pass ?matterId=newId)
    router.push('/step1' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Matter</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <View style={styles.formCard}>
            
            {/* Title */}
            <Text style={styles.fieldLabel}>Matter Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Writ Petition – Suresh Kumar vs State of Kerala"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Case Owner */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Case Owner</Text>
            <TouchableOpacity 
              style={styles.dropdownTrigger} 
              onPress={() => setShowOwnerDrop(!showOwnerDrop)}
            >
              <Text style={styles.dropdownText}>{caseOwner}</Text>
              <Ionicons name={showOwnerDrop ? "chevron-up" : "chevron-down"} size={20} color={colors.textMuted} />
            </TouchableOpacity>
            {showOwnerDrop && (
              <View style={styles.dropdownMenu}>
                {MOCK_ADVOCATES.map(adv => (
                  <TouchableOpacity 
                    key={adv} 
                    style={styles.dropdownItem}
                    onPress={() => { setCaseOwner(adv); setShowOwnerDrop(false); }}
                  >
                    <Text style={styles.dropdownItemText}>{adv}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Assign Staff */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Assign Staff Members</Text>
            <TouchableOpacity 
              style={styles.dropdownTrigger} 
              onPress={() => setShowStaffDrop(!showStaffDrop)}
            >
              <Text style={styles.dropdownText}>Select staff...</Text>
              <Ionicons name={showStaffDrop ? "chevron-up" : "chevron-down"} size={20} color={colors.textMuted} />
            </TouchableOpacity>
            {showStaffDrop && (
              <View style={styles.dropdownMenu}>
                {MOCK_CLERKS.map(staff => (
                  <TouchableOpacity 
                    key={staff} 
                    style={styles.dropdownItem}
                    onPress={() => toggleStaff(staff)}
                  >
                    <Text style={styles.dropdownItemText}>{staff}</Text>
                    {assignedStaff.includes(staff) && <Ionicons name="checkmark" size={18} color={colors.gold} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Staff Pills */}
            {assignedStaff.length > 0 && (
              <View style={styles.pillsRow}>
                {assignedStaff.map(staff => (
                  <View key={staff} style={styles.pill}>
                    <Text style={styles.pillText}>{staff}</Text>
                    <TouchableOpacity onPress={() => toggleStaff(staff)}>
                      <Ionicons name="close-circle" size={16} color={colors.gold} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Priority */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Priority</Text>
            <View style={styles.priorityRow}>
              {(['Normal', 'High', 'Urgent'] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityPill, priority === p && styles.priorityPillActive]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityPillText, priority === p && styles.priorityPillTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Preliminary Remarks */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Preliminary Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any initial notes or instructions for this matter"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={remarks}
              onChangeText={setRemarks}
            />

            {/* Matter Reference */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Matter Reference / File Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Internal file reference number"
              placeholderTextColor={colors.textMuted}
              value={reference}
              onChangeText={setReference}
            />

            {/* Action Button */}
            <TouchableOpacity 
              style={[styles.actionBtn, !title.trim() && styles.actionBtnDisabled]} 
              onPress={handleCreate}
              disabled={!title.trim()}
            >
              <Text style={styles.actionBtnText}>Create Matter & Begin Drafting</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  saveBtn: {
    padding: 4,
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    ...Platform.select({ web: { outlineStyle: 'none' as any } }),
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 48,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 4 },
      web: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityPill: {
    flex: 1,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  priorityPillText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
  },
  priorityPillTextActive: {
    color: '#FFFFFF',
  },
  actionBtn: {
    backgroundColor: colors.gold,
    height: 52,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
});
