import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  useWindowDimensions,
  Alert,
  BackHandler,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, cardShadow } from '../theme/tokens';
import { useCaseStore, Party } from '../store/caseStore';
import StepHeader from '../components/layout/StepHeader';
import BottomNavBar from '../components/layout/BottomNavBar';
import CaseDropdown from '../components/ui/CaseDropdown';
import CaseInput from '../components/ui/CaseInput';
import CaseDatePicker from '../components/ui/CaseDatePicker';
import PartyCard from '../components/ui/PartyCard';
import AddPartyModal from '../components/modals/AddPartyModal';
import AdvisorAlertBanner from '../components/advisor/AdvisorAlertBanner';

import { KERALA_DISTRICTS, COURTS_BY_DISTRICT } from '../constants/courts';
import { DOCUMENT_TYPE_GROUPS, DocumentTypeItem } from '../constants/documentTypes';

export default function Step1Screen() {
  const router = useRouter();
  
  // Zustand State
  const {
    district,
    court,
    documentType,
    caseNumbers,
    parties,
    advocate,
    draftingDate,
    language,
    setField,
    setCaseNumber,
    setAdvocateField,
    addParty,
    removeParty,
    reorderDocuments, // not used here
  } = useCaseStore();

  // Local UI State
  const [activeSection, setActiveSection] = useState<string | null>('district');
  const [addPartyModalVisible, setAddPartyModalVisible] = useState(false);
  const [modalDefaultRole, setModalDefaultRole] = useState('Petitioner');
  const [expandedDocGroup, setExpandedDocGroup] = useState<string | null>(null);
  
  // Track if user enabled existing case proceedings
  const [hasExistingProceedings, setHasExistingProceedings] = useState(
    () => Object.values(caseNumbers).some(v => !!v)
  );
  
  const { width } = useWindowDimensions();
  const isMobile = width < 480;
  
  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reorder Parties in Zustand
  const moveParty = (index: number, direction: 'up' | 'down') => {
    const updated = [...parties];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < parties.length) {
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      setField('parties', updated);
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    if (!district) newErrors.district = 'District is required';
    if (!court) newErrors.court = 'Court/Tribunal is required';
    if (!documentType) newErrors.documentType = 'Document type is required';
    if (!advocate.name || advocate.name.trim() === '') {
      newErrors.advocateName = 'Advocate name is required';
    }
    if (parties.length === 0) {
      newErrors.parties = 'Add at least one party to proceed';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please complete all required fields.',
        position: 'bottom',
      });
      return;
    }

    setErrors({});
    router.push('/step2');
  };

  const handleDistrictChange = (val: string) => {
    setField('district', val);
    setField('court', ''); // Reset court selection when district changes
    if (errors.district) {
      setErrors((prev) => ({ ...prev, district: '' }));
    }
  };

  const leftRoles = ['petitioner', 'plaintiff', 'appellant', 'applicant', 'complainant'];
  const rightRoles = ['respondent', 'defendant', 'opposite party', 'accused'];

  const leftParties = parties.filter(p => leftRoles.includes(p.role.toLowerCase()));
  const rightParties = parties.filter(p => rightRoles.includes(p.role.toLowerCase()));
  const otherParties = parties.filter(p => !leftRoles.includes(p.role.toLowerCase()) && !rightRoles.includes(p.role.toLowerCase()));

  const handleOpenPartyModal = (role: string) => {
    setModalDefaultRole(role);
    setAddPartyModalVisible(true);
  };

  const handleCourtChange = (val: string) => {
    setField('court', val);
    if (errors.court) {
      setErrors((prev) => ({ ...prev, court: '' }));
    }
  };

  const handleBackFromStep1 = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Leave this matter? Unsaved changes may be lost.')) {
        router.push('/');
      }
    } else {
      Alert.alert(
        'Leave this matter?',
        'Unsaved changes may be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => router.push('/') },
        ]
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackFromStep1();
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();
    }, [])
  );

  const handleDocTypeChange = (item: DocumentTypeItem) => {
    setField('documentType', item.name);
    if (errors.documentType) {
      setErrors((prev) => ({ ...prev, documentType: '' }));
    }
  };

  // Auto-fill Advocate Details on mount
  React.useEffect(() => {
    if (!advocate.name) {
      setAdvocateField('name', 'Adv. Hari Prasad K.');
      setAdvocateField('rollNumber', 'K/1245/2012');
      setAdvocateField('firmName', 'Apex Chambers');
      setAdvocateField('email', 'hariprasad.k@example.com');
      setAdvocateField('mobile', '9876543210');
    }
  }, []);

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX < -50) handleNext(); // swipe left
    });

  return (
    <RNSafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GestureDetector gesture={swipeGesture}>
        <View style={{ flex: 1 }}>
          <StepHeader currentStep={1} title="Basic Details" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.responsiveWrapper}>
            {/* ADVISOR Alert Banner */}
            <AdvisorAlertBanner step="step1" />

            {/* Signature Underline Motif */}
            <View style={styles.motifContainer}>
              <Text style={styles.sectionTitle}>Draft Matter Initialization</Text>
              <View style={styles.goldMotif} />
            </View>

            {/* 1.1 District Card */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setActiveSection('district')}
              style={[
                styles.card,
                activeSection === 'district' && styles.cardActive,
              ]}
            >
              <CaseDropdown
                label="District"
                value={district}
                options={KERALA_DISTRICTS}
                placeholder="Select district"
                onSelect={handleDistrictChange}
                error={errors.district}
              />
            </TouchableOpacity>

            {/* 1.2 Court Card */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => district && setActiveSection('court')}
              style={[
                styles.card,
                activeSection === 'court' && styles.cardActive,
              ]}
            >
              <CaseDropdown
                label="Court / Tribunal"
                value={court}
                options={district ? COURTS_BY_DISTRICT[district] || [] : []}
                placeholder="Select court"
                disabled={!district}
                disabledPlaceholder="Select a district first"
                onSelect={handleCourtChange}
                error={errors.court}
              />
            </TouchableOpacity>

            {/* 1.3 Document Type Accordion */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setActiveSection('documentType')}
              style={[
                styles.card,
                activeSection === 'documentType' && styles.cardActive,
              ]}
            >
              <Text style={styles.cardTitle}>Document Type</Text>
              {errors.documentType && (
                <Text style={styles.errorText}>{errors.documentType}</Text>
              )}

              {DOCUMENT_TYPE_GROUPS.map((group) => {
                const isExpanded = expandedDocGroup === group.name;
                return (
                  <View key={group.name} style={styles.accordionGroup}>
                    <TouchableOpacity
                      style={styles.accordionHeader}
                      onPress={() => setExpandedDocGroup(isExpanded ? null : group.name)}
                    >
                      <Text style={styles.accordionTitle}>{group.name}</Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={colors.navy}
                      />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.accordionItems}>
                        {group.items.map((item) => {
                          const isSelected = documentType === item.name;
                          return (
                            <TouchableOpacity
                              key={item.id}
                              style={[
                                styles.docTypeItem,
                                isSelected && styles.docTypeItemSelected,
                              ]}
                              onPress={() => handleDocTypeChange(item)}
                            >
                              {/* Left Border highlight & Radio dot */}
                              <View style={styles.radioRow}>
                                <View
                                  style={[
                                    styles.radioCircle,
                                    isSelected && styles.radioCircleSelected,
                                  ]}
                                >
                                  {isSelected && <View style={styles.radioDot} />}
                                </View>
                                <Text
                                  style={[
                                    styles.docTypeName,
                                    isSelected && styles.docTypeNameSelected,
                                  ]}
                                >
                                  {item.name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </TouchableOpacity>

            {/* 1.4 Existing Case Proceedings Card (Optional) */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setActiveSection('references')}
              style={[
                styles.card,
                activeSection === 'references' && styles.cardActive,
              ]}
            >
              <View style={[styles.cardHeaderRow, { paddingBottom: 12 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, paddingRight: 8 }}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setHasExistingProceedings(!hasExistingProceedings);
                      if (!hasExistingProceedings) setActiveSection('references');
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: hasExistingProceedings ? colors.gold : colors.border,
                      backgroundColor: hasExistingProceedings ? colors.gold : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {hasExistingProceedings && <Ionicons name="checkmark" size={16} color="#FFF" />}
                  </TouchableOpacity>
                  <Text style={styles.cardTitle}>Existing Case Proceeding Details</Text>
                </View>
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalBadgeText}>Optional</Text>
                </View>
              </View>

              <View style={{ opacity: hasExistingProceedings ? 1 : 0.4 }} pointerEvents={hasExistingProceedings ? 'auto' : 'none'}>
                <View style={styles.grid2Col}>
                  <View style={styles.gridItem}>
                    <CaseInput
                      label="Existing Case No."
                      placeholder="e.g. WP(C) 1234/2026"
                      value={caseNumbers.existing || ''}
                      onChangeText={(val) => setCaseNumber('existing', val)}
                    />
                  </View>
                  <View style={styles.gridItem}>
                    <CaseInput
                      label="Previous Case No."
                      placeholder="e.g. OS 450/2024"
                      value={caseNumbers.previous || ''}
                      onChangeText={(val) => setCaseNumber('previous', val)}
                    />
                  </View>
                </View>

                <View style={styles.grid2Col}>
                  <View style={styles.gridItem}>
                    <CaseInput
                      label="Connected Case No."
                      placeholder="e.g. IA 1/2026"
                      value={caseNumbers.connected || ''}
                      onChangeText={(val) => setCaseNumber('connected', val)}
                    />
                  </View>
                  <View style={styles.gridItem}>
                    <CaseInput
                      label="FIR Number"
                      placeholder="e.g. Cr 120/2026 Puzhakkal"
                      value={caseNumbers.fir || ''}
                      onChangeText={(val) => setCaseNumber('fir', val)}
                    />
                  </View>
                </View>

                <View style={styles.grid2Col}>
                  <View style={styles.gridItem}>
                    <CaseInput
                      label="Appeal Number"
                      placeholder="e.g. RFA 50/2026"
                      value={caseNumbers.appeal || ''}
                      onChangeText={(val) => setCaseNumber('appeal', val)}
                    />
                  </View>
                  <View style={styles.gridItem}>
                    <CaseInput
                      label="Execution Number"
                      placeholder="e.g. EP 12/2026"
                      value={caseNumbers.execution || ''}
                      onChangeText={(val) => setCaseNumber('execution', val)}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* 1.5 Parties Card */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setActiveSection('parties')}
              style={[
                styles.card,
                activeSection === 'parties' && styles.cardActive,
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Parties to the Proceeding</Text>
              </View>

              {errors.parties && (
                <Text style={[styles.errorText, { marginBottom: 8 }]}>
                  {errors.parties}
                </Text>
              )}

              {parties.length === 0 ? (
                <View style={styles.emptyPartiesContainer}>
                  <Text style={styles.emptyPartiesText}>No parties added yet</Text>
                  <Text style={styles.emptyPartiesSubtext}>
                    Tap below to begin adding Petitioners or Respondents.
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 16 }}>
                    <TouchableOpacity
                      onPress={() => handleOpenPartyModal('Petitioner')}
                      style={[styles.addPartyButton, { marginRight: 12 }]}
                    >
                      <Text style={styles.addPartyButtonText}>+ Add Petitioner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleOpenPartyModal('Respondent')}
                      style={styles.addPartyButton}
                    >
                      <Text style={styles.addPartyButtonText}>+ Add Respondent</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'column' }}>
                  <View style={[styles.partyColumnsContainer, isMobile && { flexDirection: 'column' }]}>
                    {/* Left Column (Petitioners) */}
                    <View style={[styles.partyColumn, isMobile && { paddingRight: 0, borderRightWidth: 0, marginBottom: 16 }]}>
                      <Text style={styles.columnHeader}>PETITIONERS / APPELLANTS</Text>
                      <View style={[styles.columnContent, { borderLeftColor: colors.gold }]}>
                        {leftParties.map((party, index) => (
                          <PartyCard
                            key={party.id}
                            party={party}
                            onDelete={() => removeParty(party.id)}
                            onMoveUp={() => moveParty(parties.indexOf(party), 'up')}
                            onMoveDown={() => moveParty(parties.indexOf(party), 'down')}
                            isFirst={index === 0}
                            isLast={index === leftParties.length - 1}
                          />
                        ))}
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                          <TouchableOpacity
                            onPress={() => handleOpenPartyModal('Petitioner')}
                            style={[styles.columnAddButton, { flex: 1, marginTop: 0 }]}
                          >
                            <Text style={styles.columnAddButtonText}>+ Petitioner</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleOpenPartyModal('Plaintiff')}
                            style={[styles.columnAddButton, { flex: 1, marginTop: 0 }]}
                          >
                            <Text style={styles.columnAddButtonText}>+ Plaintiff</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Right Column (Respondents) */}
                    <View style={[styles.partyColumn, { paddingRight: 0 }, isMobile && { paddingLeft: 0 }]}>
                      <Text style={styles.columnHeader}>RESPONDENTS / DEFENDANTS</Text>
                      <View style={[styles.columnContent, { borderLeftColor: colors.navy }]}>
                        {rightParties.map((party, index) => (
                          <PartyCard
                            key={party.id}
                            party={party}
                            onDelete={() => removeParty(party.id)}
                            onMoveUp={() => moveParty(parties.indexOf(party), 'up')}
                            onMoveDown={() => moveParty(parties.indexOf(party), 'down')}
                            isFirst={index === 0}
                            isLast={index === rightParties.length - 1}
                          />
                        ))}
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                          <TouchableOpacity
                            onPress={() => handleOpenPartyModal('Respondent')}
                            style={[styles.columnAddButton, { flex: 1, marginTop: 0 }]}
                          >
                            <Text style={styles.columnAddButtonText}>+ Respondent</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleOpenPartyModal('Defendant')}
                            style={[styles.columnAddButton, { flex: 1, marginTop: 0 }]}
                          >
                            <Text style={styles.columnAddButtonText}>+ Defendant</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Other Parties (Full Width) */}
                  {otherParties.length > 0 && (
                    <View style={styles.otherPartiesContainer}>
                      <Text style={styles.columnHeader}>OTHER PARTIES</Text>
                      {otherParties.map((party, index) => (
                        <PartyCard
                          key={party.id}
                          party={party}
                          onDelete={() => removeParty(party.id)}
                          onMoveUp={() => moveParty(parties.indexOf(party), 'up')}
                          onMoveDown={() => moveParty(parties.indexOf(party), 'down')}
                          isFirst={index === 0}
                          isLast={index === otherParties.length - 1}
                        />
                      ))}
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>

            {/* 1.6 Advocate Details */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setActiveSection('advocate')}
              style={[
                styles.card,
                activeSection === 'advocate' && styles.cardActive,
              ]}
            >
              <Text style={styles.cardTitle}>Advocate Details</Text>

              <CaseInput
                label="Advocate Name"
                placeholder="e.g. Adv. Hari Prasad K."
                value={advocate.name}
                onChangeText={(val) => {
                  setAdvocateField('name', val);
                  if (errors.advocateName) {
                    setErrors((prev) => ({ ...prev, advocateName: '' }));
                  }
                }}
                error={errors.advocateName}
              />

              <CaseInput
                label="Roll Number"
                placeholder="e.g. K/1245/2012"
                isOptional
                value={advocate.rollNumber || ''}
                onChangeText={(val) => setAdvocateField('rollNumber', val)}
              />

              <CaseInput
                label="Law Firm Name"
                placeholder="e.g. Apex Chambers"
                isOptional
                value={advocate.firmName || ''}
                onChangeText={(val) => setAdvocateField('firmName', val)}
              />

              <CaseInput
                label="Office Address"
                placeholder="Enter office location details..."
                multiline
                numberOfLines={3}
                isOptional
                value={advocate.address || ''}
                onChangeText={(val) => setAdvocateField('address', val)}
              />

              <CaseInput
                label="Mobile"
                placeholder="10-digit number"
                keyboardType="phone-pad"
                isOptional
                value={advocate.mobile || ''}
                onChangeText={(val) => setAdvocateField('mobile', val)}
              />

              <CaseInput
                label="Email"
                placeholder="e.g. advocate@domain.com"
                keyboardType="email-address"
                isOptional
                value={advocate.email || ''}
                onChangeText={(val) => setAdvocateField('email', val)}
              />
            </TouchableOpacity>

            {/* 1.7 Date Card */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setActiveSection('date')}
              style={[
                styles.card,
                activeSection === 'date' && styles.cardActive,
              ]}
            >
              <CaseDatePicker
                label="Drafting Date"
                value={draftingDate}
                onDateChange={(val) => setField('draftingDate', val)}
              />
            </TouchableOpacity>

            {/* 1.8 Language Card */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setActiveSection('language')}
              style={[
                styles.card,
                activeSection === 'language' && styles.cardActive,
              ]}
            >
              <Text style={styles.cardTitle}>Drafting Language</Text>
              <View style={styles.languageContainer}>
                {(['English', 'Malayalam'] as const).map((lang) => {
                  const isActive = language === lang;
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.langButton,
                        isActive ? styles.langButtonActive : styles.langButtonInactive,
                      ]}
                      onPress={() => setField('language', lang)}
                    >
                      <Text
                        style={[
                          styles.langText,
                          isActive ? styles.langTextActive : styles.langTextInactive,
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Nav Bar */}
      <BottomNavBar currentStep={1} onNext={handleNext} onBackFromStep1={handleBackFromStep1} />
        </View>
      </GestureDetector>

      {/* Add Party Form Modal */}
      <AddPartyModal
        visible={addPartyModalVisible}
        onClose={() => setAddPartyModalVisible(false)}
        onSave={(party) => addParty(party)}
        defaultRole={modalDefaultRole}
      />
    </RNSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  responsiveWrapper: {
    maxWidth: 780,
    width: '100%',
    alignSelf: 'center',
  },
  motifContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.navy,
    marginBottom: 4,
  },
  goldMotif: {
    width: 40,
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  cardActive: {
    borderLeftColor: colors.gold,
    borderColor: 'rgba(201, 150, 58, 0.3)',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  optionalBadge: {
    backgroundColor: colors.cream,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionalBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
  },
  grid2Col: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 6,
  },
  addPartyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addPartyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  emptyPartiesContainer: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPartiesText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecond,
    marginBottom: 4,
  },
  emptyPartiesSubtext: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
  },
  partiesList: {
    marginTop: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  partyColumnsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  partyColumn: {
    flex: 1,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.cream,
  },
  columnHeader: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  columnContent: {
    borderLeftWidth: 3,
    paddingLeft: 12,
  },
  columnAddButton: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    marginTop: 8,
  },
  columnAddButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  otherPartiesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cream,
  },
  accordionGroup: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    height: 40,
    backgroundColor: colors.cream,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  accordionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  accordionItems: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
  },
  docTypeItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream,
  },
  docTypeItemSelected: {
    backgroundColor: colors.goldLighter,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: colors.gold,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  docTypeName: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  docTypeNameSelected: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  languageContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    padding: 3,
  },
  langButton: {
    flex: 1,
    height: 38,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: colors.navy,
  },
  langButtonInactive: {
    backgroundColor: 'transparent',
  },
  langText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  langTextInactive: {
    color: colors.textSecond,
  },
});
