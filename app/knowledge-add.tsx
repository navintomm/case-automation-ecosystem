import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors, radius } from '../theme/tokens';
import { useKnowledgeStore, KnowledgeEntry } from '../store/knowledgeStore';
import CaseDropdown from '../components/ui/CaseDropdown';
import { KERALA_DISTRICTS } from '../constants/courts';

const CATEGORIES = [
  'Court Practices',
  'Filing Defects',
  'Registry Objections',
  'Drafting Lessons',
  'Litigation Lessons',
  'Office Practices',
  'Procedural Variations',
];

const FREQUENCY_OPTIONS: Array<'Always' | 'Frequent' | 'Occasional' | 'Rare'> = [
  'Always',
  'Frequent',
  'Occasional',
  'Rare',
];

export default function KnowledgeAddScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { entries, addEntry, editEntry } = useKnowledgeStore();

  const isEdit = !!id;
  const existingEntry = isEdit ? entries.find((e) => e.id === id) : undefined;

  // Form State
  const [category, setCategory] = useState(existingEntry?.category ?? '');
  const [court, setCourt] = useState(existingEntry?.court ?? '');
  const [district, setDistrict] = useState(existingEntry?.district ?? '');
  const [caseType, setCaseType] = useState(existingEntry?.caseType ?? '');
  const [documentType, setDocumentType] = useState(existingEntry?.documentType ?? '');
  const [title, setTitle] = useState(existingEntry?.title ?? '');
  const [recommendation, setRecommendation] = useState(existingEntry?.recommendation ?? '');
  const [frequency, setFrequency] = useState<'Always' | 'Frequent' | 'Occasional' | 'Rare'>(
    existingEntry?.frequency ?? 'Occasional'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!category) errs.category = 'Category is required';
    if (!court.trim()) errs.court = 'Court is required';
    if (!district) errs.district = 'District is required';
    if (!caseType.trim()) errs.caseType = 'Case type is required';
    if (!title.trim()) errs.title = 'Issue / Title is required';
    if (!recommendation.trim()) errs.recommendation = 'Recommendation is required';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields.',
        position: 'bottom',
      });
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;

    if (isEdit && id) {
      editEntry(id, {
        category,
        court: court.trim(),
        district,
        caseType: caseType.trim(),
        documentType: documentType.trim() || undefined,
        title: title.trim(),
        recommendation: recommendation.trim(),
        frequency,
      });
      Toast.show({
        type: 'success',
        text1: 'Entry Updated',
        text2: 'Knowledge Repository entry has been updated.',
        position: 'bottom',
      });
    } else {
      const newEntry: KnowledgeEntry = {
        id: Math.random().toString(36).substring(2, 9),
        category,
        court: court.trim(),
        district,
        caseType: caseType.trim(),
        documentType: documentType.trim() || undefined,
        title: title.trim(),
        recommendation: recommendation.trim(),
        frequency,
        recordedBy: 'Adv. User',
        recordedAt: dateStr,
      };
      addEntry(newEntry);
      Toast.show({
        type: 'success',
        text1: 'Entry Saved',
        text2: 'New entry added to Knowledge Repository.',
        position: 'bottom',
      });
    }

    router.back();
  };

  const handleMockAttach = () => {
    Toast.show({
      type: 'info',
      text1: 'Document Attach',
      text2: 'File upload is UI-only in this build.',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEdit ? 'Edit Entry' : 'New Knowledge Entry'}
          </Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            {/* Section: Classification */}
            <Text style={styles.sectionLabel}>Classification</Text>

            {/* Category */}
            <View style={styles.fieldGroup}>
              <CaseDropdown
                label="Category"
                value={category}
                options={CATEGORIES}
                placeholder="Select category"
                onSelect={(val) => {
                  setCategory(val);
                  if (errors.category) setErrors((e) => ({ ...e, category: '' }));
                }}
                error={errors.category}
              />
            </View>

            {/* District */}
            <View style={styles.fieldGroup}>
              <CaseDropdown
                label="District"
                value={district}
                options={KERALA_DISTRICTS}
                placeholder="Select district"
                onSelect={(val) => {
                  setDistrict(val);
                  if (errors.district) setErrors((e) => ({ ...e, district: '' }));
                }}
                error={errors.district}
              />
            </View>

            {/* Court */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Court <Text style={styles.req}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.court && styles.inputError]}
                value={court}
                onChangeText={(v) => {
                  setCourt(v);
                  if (errors.court) setErrors((e) => ({ ...e, court: '' }));
                }}
                placeholder="e.g. High Court of Kerala, Family Court Thrissur"
                placeholderTextColor={colors.textMuted}
                {...Platform.select({ web: { outlineStyle: 'none' } })}
              />
              {errors.court ? <Text style={styles.errorText}>{errors.court}</Text> : null}
            </View>

            {/* Case Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Case Type <Text style={styles.req}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.caseType && styles.inputError]}
                value={caseType}
                onChangeText={(v) => {
                  setCaseType(v);
                  if (errors.caseType) setErrors((e) => ({ ...e, caseType: '' }));
                }}
                placeholder="e.g. Writ Petition, MACT Claim, Bail Application"
                placeholderTextColor={colors.textMuted}
                {...Platform.select({ web: { outlineStyle: 'none' } })}
              />
              {errors.caseType ? <Text style={styles.errorText}>{errors.caseType}</Text> : null}
            </View>

            {/* Document Type (optional) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Document Type <Text style={styles.optional}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={documentType}
                onChangeText={setDocumentType}
                placeholder="e.g. Counter Affidavit"
                placeholderTextColor={colors.textMuted}
                {...Platform.select({ web: { outlineStyle: 'none' } })}
              />
            </View>

            <View style={styles.divider} />

            {/* Section: Content */}
            <Text style={styles.sectionLabel}>Observation</Text>

            {/* Issue / Title */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Issue / Title <Text style={styles.req}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={title}
                onChangeText={(v) => {
                  setTitle(v);
                  if (errors.title) setErrors((e) => ({ ...e, title: '' }));
                }}
                placeholder="Brief title of the issue or observation"
                placeholderTextColor={colors.textMuted}
                {...Platform.select({ web: { outlineStyle: 'none' } })}
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>

            {/* Recommendation */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Practical Recommendation <Text style={styles.req}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                  errors.recommendation && styles.inputError,
                ]}
                value={recommendation}
                onChangeText={(v) => {
                  setRecommendation(v);
                  if (errors.recommendation) setErrors((e) => ({ ...e, recommendation: '' }));
                }}
                multiline
                numberOfLines={5}
                placeholder="Describe the observation, defect, or practice in detail. Include corrective action."
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
                {...Platform.select({ web: { outlineStyle: 'none' } })}
              />
              {errors.recommendation ? (
                <Text style={styles.errorText}>{errors.recommendation}</Text>
              ) : null}
            </View>

            <View style={styles.divider} />

            {/* Section: Meta */}
            <Text style={styles.sectionLabel}>Frequency</Text>

            <View style={styles.frequencyRow}>
              {FREQUENCY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.frequencyPill,
                    frequency === opt && styles.frequencyPillActive,
                  ]}
                  onPress={() => setFrequency(opt)}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      frequency === opt && styles.frequencyTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Supporting Document (mock) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Supporting Document <Text style={styles.optional}>(Optional)</Text>
              </Text>
              <TouchableOpacity style={styles.attachBtn} onPress={handleMockAttach}>
                <Ionicons name="attach" size={18} color={colors.gold} />
                <Text style={styles.attachBtnText}>Attach a file</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save to Repository</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  headerSafe: { backgroundColor: colors.navy },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.navyLight,
  },
  closeBtn: { width: 36, justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollContent: { padding: 16 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    }),
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
    marginTop: 4,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  req: { color: colors.error },
  optional: { color: colors.textMuted, fontFamily: 'Inter_400Regular' },
  input: {
    backgroundColor: colors.cream,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  multilineInput: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.error,
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  frequencyRow: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  frequencyPill: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  frequencyPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  frequencyText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecond,
  },
  frequencyTextActive: {
    color: '#FFFFFF',
  },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: colors.goldLighter,
  },
  attachBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.gold,
  },
  saveBtn: {
    height: 50,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  saveBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
});
