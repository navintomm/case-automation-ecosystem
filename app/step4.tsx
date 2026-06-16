import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  LayoutAnimation,
  BackHandler,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, cardShadow } from '../theme/tokens';
import { useCaseStore, Witness } from '../store/caseStore';
import StepHeader from '../components/layout/StepHeader';
import BottomNavBar from '../components/layout/BottomNavBar';
import CompanionCheckbox from '../components/ui/CompanionCheckbox';
import AddWitnessModal from '../components/modals/AddWitnessModal';
import { COMPANION_DOCS_GROUPS } from '../constants/companionDocs';
import AdvisorAlertBanner from '../components/advisor/AdvisorAlertBanner';

export default function Step4Screen() {
  const router = useRouter();

  // Zustand State
  const {
    companionDocs,
    witnesses,
    valuation,
    toggleCompanionDoc,
    addWitness,
    removeWitness,
    setField,
  } = useCaseStore();

  // Local UI State
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>('4.1');
  const [witnessModalVisible, setWitnessModalVisible] = useState(false);

  const toggleGroup = (groupId: string) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  const getSelectedCountInGroup = (groupId: string) => {
    const group = COMPANION_DOCS_GROUPS.find((g) => g.id === groupId);
    if (!group) return 0;
    return group.items.reduce((count, item) => {
      return count + (companionDocs[item.id] ? 1 : 0);
    }, 0);
  };

  const handleNext = () => {
    router.push('/verify');
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.push('/step3');
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();
    }, [])
  );

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX < -50) handleNext(); // swipe left
      if (event.translationX > 50) router.push('/step3'); // swipe right
    });

  // Check if Witness List (4.6.witness_list) is checked
  const isWitnessChecked = !!companionDocs['4.6.witness_list'];

  // Check if Valuation is checked (either statement or court fee)
  const isValuationChecked =
    !!companionDocs['4.7.valuation_stmt'] || !!companionDocs['4.7.court_fee'];

  return (
    <RNSafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GestureDetector gesture={swipeGesture}>
        <View style={{ flex: 1 }}>
          <StepHeader currentStep={4} title="Companion Documents" />

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
        <View style={styles.responsiveWrapper}>
          {/* ADVISOR Alert Banner */}
          <AdvisorAlertBanner step="step4" />

          {/* Signature Underline Motif */}
          <View style={styles.motifContainer}>
            <Text style={styles.sectionTitle}>Companions Checklist</Text>
            <View style={styles.goldMotif} />
          </View>

          {/* Accordion List */}
          {COMPANION_DOCS_GROUPS.map((group) => {
            const isExpanded = expandedGroupId === group.id;
            const selectedCount = getSelectedCountInGroup(group.id);

            return (
              <View key={group.id} style={styles.groupContainer}>
                {/* Header Row */}
                <TouchableOpacity
                  style={[
                    styles.groupHeader,
                    isExpanded && styles.groupHeaderExpanded,
                  ]}
                  onPress={() => toggleGroup(group.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${group.title}, ${selectedCount} selected`}
                >
                  <View style={styles.groupHeaderLeft}>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                    {selectedCount > 0 && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>{selectedCount}</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.navy}
                  />
                </TouchableOpacity>

                {/* Expanded Content Card */}
                {isExpanded && (
                  <View style={styles.groupContent}>
                    {group.items.map((item) => {
                      const isChecked = !!companionDocs[item.id];
                      return (
                        <View key={item.id}>
                          <CompanionCheckbox
                            label={item.label}
                            checked={isChecked}
                            onToggle={() => toggleCompanionDoc(item.id)}
                            alwaysOn={item.alwaysOn}
                          />

                          {/* 4.6 Witness Sub-Form */}
                          {item.id === '4.6.witness_list' && isChecked && (
                            <View style={styles.subFormContainer}>
                              <Text style={styles.subFormTitle}>Witnesses List</Text>
                              
                              {witnesses.length === 0 ? (
                                <Text style={styles.emptyWitnessText}>
                                  No witnesses added. Click below to add.
                                </Text>
                              ) : (
                                witnesses.map((wit) => (
                                  <View key={wit.id} style={styles.witnessBadge}>
                                    <View style={{ flex: 1 }}>
                                      <Text style={styles.witnessName}>{wit.name}</Text>
                                      <Text style={styles.witnessPurpose} numberOfLines={1}>
                                        Fact: {wit.purpose}
                                      </Text>
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => removeWitness(wit.id)}
                                      style={styles.witnessDelete}
                                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                      accessibilityLabel={`Delete witness ${wit.name}`}
                                    >
                                      <Ionicons name="trash-outline" size={14} color={colors.error} />
                                    </TouchableOpacity>
                                  </View>
                                ))
                              )}

                              <TouchableOpacity
                                style={styles.addWitnessBtn}
                                onPress={() => setWitnessModalVisible(true)}
                              >
                                <Text style={styles.addWitnessBtnText}>+ Add Witness</Text>
                              </TouchableOpacity>
                            </View>
                          )}

                          {/* 4.7 Valuation Sub-Form */}
                          {item.hasSubForm === 'valuation' && isChecked && (
                            <View style={styles.subFormContainer}>
                              <Text style={styles.subFormTitle}>Valuation Amount</Text>
                              <View style={styles.valuationInputWrapper}>
                                <Text style={styles.currencySymbol}>₹</Text>
                                <TextInput
                                  style={styles.valuationInput}
                                  value={valuation}
                                  onChangeText={(text) => setField('valuation', text.replace(/[^0-9]/g, ''))}
                                  placeholder="e.g. 150000"
                                  keyboardType="numeric"
                                  placeholderTextColor={colors.textMuted}
                                  {...Platform.select({
                                    web: {
                                      outlineStyle: 'none',
                                    },
                                  })}
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <BottomNavBar currentStep={4} onNext={handleNext} />
        </View>
      </GestureDetector>

      {/* Add Witness Modal */}
      <AddWitnessModal
        visible={witnessModalVisible}
        onClose={() => setWitnessModalVisible(false)}
        onSave={(witness) => addWitness(witness)}
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
  groupContainer: {
    marginBottom: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...cardShadow,
  },
  groupHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  groupHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cream,
    backgroundColor: '#FAFAFA',
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  countBadge: {
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 4,
  },
  countBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  groupContent: {
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  subFormContainer: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    borderRadius: radius.sm,
    padding: 12,
    marginLeft: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subFormTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyWitnessText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 8,
  },
  witnessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: 8,
    borderRadius: radius.sm,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  witnessName: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  witnessPurpose: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
    marginTop: 2,
  },
  witnessDelete: {
    padding: 6,
  },
  addWitnessBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  addWitnessBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  valuationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 40,
    paddingHorizontal: 10,
  },
  currencySymbol: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginRight: 6,
  },
  valuationInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
});
