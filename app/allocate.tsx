import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { useCaseStore } from '../store/caseStore';
import { useClerkStore, mockClerks } from '../store/clerkStore';
import CaseDatePicker from '../components/ui/CaseDatePicker';

type Priority = 'Normal' | 'High' | 'Urgent';

export default function AllocateScreen() {
  const router = useRouter();
  const caseStore = useCaseStore();
  const { allocationDraft, setAllocationField, setAllocatedClerkName } = useClerkStore();

  // Local state (mirrors the store draft)
  const [selectedClerkId, setSelectedClerkId]   = useState(allocationDraft.selectedClerkId);
  const [priority, setPriority]                 = useState<Priority>(allocationDraft.priority);
  const [deadline, setDeadline]                 = useState(allocationDraft.deadline);
  const [instructions, setInstructions]         = useState(allocationDraft.instructions);
  const [clerkOpen, setClerkOpen]               = useState(false);

  // Derived
  const primaryParty = caseStore.parties[0]?.name ?? '—';
  const court        = caseStore.court        || '—';
  const documentType = caseStore.documentType || '—';
  const selectedClerk = mockClerks.find((c) => c.id === selectedClerkId);

  const priorityColors: Record<Priority, { bg: string; text: string }> = {
    Normal: { bg: colors.cream,    text: colors.textSecond },
    High:   { bg: '#D97706',       text: '#FFFFFF' },
    Urgent: { bg: colors.error,    text: '#FFFFFF' },
  };

  const handleAllocate = () => {
    // Persist to store
    setAllocationField('selectedClerkId', selectedClerkId);
    setAllocationField('selectedClerkName', selectedClerk?.name ?? '');
    setAllocationField('priority', priority);
    setAllocationField('deadline', deadline);
    setAllocationField('instructions', instructions);
    setAllocatedClerkName(selectedClerk?.name ?? null);
    router.push('/success' as any);
  };

  const handleSkip = () => {
    setAllocatedClerkName(null);
    router.push('/success' as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Allocate Work</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Matter Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardSectionLabel}>Matter Summary</Text>
            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>Ready for Allocation</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="document-text-outline" size={15} color={colors.textMuted} style={styles.summaryIcon} />
            <Text style={styles.summaryValue}>{documentType}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="people-outline" size={15} color={colors.textMuted} style={styles.summaryIcon} />
            <Text style={styles.summaryValue} numberOfLines={1}>{primaryParty}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="business-outline" size={15} color={colors.textMuted} style={styles.summaryIcon} />
            <Text style={styles.summaryValue}>{court}</Text>
          </View>
        </View>

        {/* Allocation Form Card */}
        <View style={styles.card}>
          {/* Field 1 — Assign To */}
          <Text style={styles.fieldLabel}>Assign To</Text>
          <TouchableOpacity
            style={[styles.dropdownTrigger, clerkOpen && styles.dropdownTriggerOpen]}
            onPress={() => setClerkOpen((v) => !v)}
            accessibilityRole="combobox"
            accessibilityLabel="Assign to clerk"
          >
            {selectedClerk ? (
              <View style={styles.clerkSelected}>
                <Text style={styles.clerkSelectedName}>{selectedClerk.name}</Text>
                <Text style={styles.clerkSelectedRole}>{selectedClerk.role}</Text>
              </View>
            ) : (
              <Text style={styles.dropdownPlaceholder}>Select a clerk…</Text>
            )}
            <Ionicons name={clerkOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecond} />
          </TouchableOpacity>

          {/* Inline clerk list */}
          {clerkOpen && (
            <View style={styles.clerkList}>
              {mockClerks.map((clerk) => (
                <TouchableOpacity
                  key={clerk.id}
                  style={[
                    styles.clerkOption,
                    selectedClerkId === clerk.id && styles.clerkOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedClerkId(clerk.id);
                    setClerkOpen(false);
                  }}
                >
                  <View>
                    <Text style={[styles.clerkOptionName, selectedClerkId === clerk.id && styles.clerkOptionNameSelected]}>
                      {clerk.name}
                    </Text>
                    <Text style={styles.clerkOptionRole}>{clerk.role}</Text>
                  </View>
                  {selectedClerkId === clerk.id && (
                    <Ionicons name="checkmark" size={18} color={colors.gold} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Field 2 — Priority */}
          <Text style={[styles.fieldLabel, { marginTop: 20 }]}>Priority</Text>
          <View style={styles.pillRow}>
            {(['Normal', 'High', 'Urgent'] as Priority[]).map((p) => {
              const isActive = priority === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.pill,
                    isActive && { backgroundColor: priorityColors[p].bg },
                    !isActive && styles.pillInactive,
                  ]}
                  onPress={() => setPriority(p)}
                  accessibilityRole="button"
                  accessibilityLabel={`Priority ${p}`}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isActive && { color: priorityColors[p].text },
                      !isActive && styles.pillTextInactive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Field 3 — Deadline */}
          <Text style={[styles.fieldLabel, { marginTop: 20 }]}>Filing Deadline</Text>
          <CaseDatePicker
            label=""
            value={deadline}
            onDateChange={setDeadline}
            containerStyle={styles.datePicker}
          />

          {/* Field 4 — Instructions */}
          <Text style={[styles.fieldLabel, { marginTop: 4 }]}>Instructions for Clerk</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g. Print 3 copies. File original in court. Attach vakalatnama."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={instructions}
            onChangeText={setInstructions}
            accessibilityLabel="Instructions for clerk"
            {...Platform.select({ web: { outlineStyle: 'none' } })}
          />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.allocateBtn}
          onPress={handleAllocate}
          accessibilityLabel="Allocate and Generate Draft"
          accessibilityRole="button"
        >
          <Text style={styles.allocateBtnText}>Allocate &amp; Generate Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleSkip}
          accessibilityLabel="Skip Allocation"
          accessibilityRole="button"
        >
          <Text style={styles.skipBtnText}>Skip Allocation</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  headerSafe: {
    backgroundColor: colors.navy,
  },
  headerBar: {
    height: Platform.OS === 'ios' ? 56 : 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.navy,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardSectionLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  readyBadge: {
    backgroundColor: '#EAFCEF',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  readyBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.verified,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryIcon: {
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    flex: 1,
  },

  // Form
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 8,
  },

  // Clerk Dropdown
  dropdownTrigger: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  dropdownTriggerOpen: {
    borderColor: colors.borderFocus,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  clerkSelected: {
    flex: 1,
  },
  clerkSelectedName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  clerkSelectedRole: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  clerkList: {
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: colors.borderFocus,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginBottom: 4,
  },
  clerkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream,
  },
  clerkOptionSelected: {
    backgroundColor: colors.goldLighter,
  },
  clerkOptionName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  clerkOptionNameSelected: {
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  clerkOptionRole: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },

  // Priority pills
  pillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    flex: 1,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillInactive: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  pillTextInactive: {
    color: colors.textSecond,
  },

  // Date picker override
  datePicker: {
    marginBottom: 0,
  },

  // Notes input
  notesInput: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    minHeight: 100,
    lineHeight: 20,
  },

  // Action buttons
  allocateBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  allocateBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
});
