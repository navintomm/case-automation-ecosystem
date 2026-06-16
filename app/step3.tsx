import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  BackHandler,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, cardShadow } from '../theme/tokens';
import { useCaseStore } from '../store/caseStore';
import StepHeader from '../components/layout/StepHeader';
import BottomNavBar from '../components/layout/BottomNavBar';
import CaseDatePicker from '../components/ui/CaseDatePicker';
import PrayerBuilder from '../components/ui/PrayerBuilder';
import AdvisorAlertBanner from '../components/advisor/AdvisorAlertBanner';

export default function Step3Screen() {
  const router = useRouter();

  // Zustand State
  const {
    chronology,
    factualSynopsis,
    legalStrategy,
    causeOfAction,
    causeOfActionDate,
    setField,
  } = useCaseStore();

  // Local Heights for auto-expanding inputs
  const [chronoHeight, setChronoHeight] = useState(120);
  const [factsHeight, setFactsHeight] = useState(140);
  const [strategyHeight, setStrategyHeight] = useState(120);

  const handleNext = () => {
    router.push('/step4');
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.push('/step2');
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();
    }, [])
  );

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX < -50) handleNext(); // swipe left
      if (event.translationX > 50) router.push('/step2'); // swipe right
    });

  return (
    <RNSafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GestureDetector gesture={swipeGesture}>
        <View style={{ flex: 1 }}>
          <StepHeader currentStep={3} title="Case Strategy" />

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
            <AdvisorAlertBanner step="step3" />

            {/* Signature Underline Motif */}
            <View style={styles.motifContainer}>
              <Text style={styles.sectionTitle}>{"Strategy & Reliefs"}</Text>
              <View style={styles.goldMotif} />
            </View>

            {/* 3.1 Chronology of Events */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>3.1 Timeline of Events (Chronology)</Text>
              <Text style={styles.helperText}>
                Enter dates and events in chronological sequence. One event per line.
              </Text>
              <TextInput
                style={[styles.multilineInput, { height: chronoHeight }]}
                multiline
                value={chronology}
                onChangeText={(text) => setField('chronology', text)}
                onContentSizeChange={(e) => {
                  setChronoHeight(Math.min(300, Math.max(120, e.nativeEvent.contentSize.height)));
                }}
                placeholder="12.01.2026 – Impugned order passed by the authority.&#10;20.01.2026 – Certified copy of order obtained.&#10;05.02.2026 – Detailed representation submitted before the Director."
                placeholderTextColor={colors.textMuted}
                {...Platform.select({
                  web: {
                    outlineStyle: 'none',
                  },
                })}
              />
            </View>

            {/* 3.2 Factual Synopsis */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.sectionLabel}>3.2 Facts of the Case (Synopsis)</Text>
                <Text style={styles.charCounter}>
                  {factualSynopsis.length} chars
                </Text>
              </View>
              <Text style={styles.helperText}>
                Plain language notes summarizing the facts. Bullet points or short paragraphs are fine.
              </Text>
              <TextInput
                style={[styles.multilineInput, { height: factsHeight }]}
                multiline
                value={factualSynopsis}
                onChangeText={(text) => setField('factualSynopsis', text)}
                onContentSizeChange={(e) => {
                  setFactsHeight(Math.min(300, Math.max(140, e.nativeEvent.contentSize.height)));
                }}
                placeholder="Briefly describe what happened. E.g., The petitioner was appointed as a Clerk in 2018. Without any inquiry or notice, the termination order was passed..."
                placeholderTextColor={colors.textMuted}
                {...Platform.select({
                  web: {
                    outlineStyle: 'none',
                  },
                })}
              />
            </View>

            {/* 3.3 Legal Strategy */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>3.3 Legal Grounds & Strategy</Text>
              <Text style={styles.helperText}>
                Statutory provisions, judicial precedents, urgency factors, or constitutional grounds.
              </Text>
              <TextInput
                style={[styles.multilineInput, { height: strategyHeight }]}
                multiline
                value={legalStrategy}
                onChangeText={(text) => setField('legalStrategy', text)}
                onContentSizeChange={(e) => {
                  setStrategyHeight(Math.min(300, Math.max(120, e.nativeEvent.contentSize.height)));
                }}
                placeholder="E.g., Violates Article 14 of the Constitution. Order passed in violation of natural justice principles. Governed by Section 10 of Kerala Education Rules..."
                placeholderTextColor={colors.textMuted}
                {...Platform.select({
                  web: {
                    outlineStyle: 'none',
                  },
                })}
              />
            </View>

            {/* 3.4 Cause of Action & Date */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>3.4 Cause of Action details</Text>
              <Text style={styles.helperText}>
                Identify when and how the right to sue/petition arose.
              </Text>
              
              <View style={styles.rowLayout}>
                <View style={[styles.flexField, { marginRight: 12 }]}>
                  <Text style={styles.fieldLabel}>Cause of Action</Text>
                  <TextInput
                    style={styles.singleLineInput}
                    value={causeOfAction}
                    onChangeText={(text) => setField('causeOfAction', text)}
                    placeholder="e.g. Passing of impugned order"
                    placeholderTextColor={colors.textMuted}
                    {...Platform.select({
                      web: {
                        outlineStyle: 'none',
                      },
                    })}
                  />
                </View>
                <View style={styles.flexField}>
                  <CaseDatePicker
                    label="Date of Cause of Action"
                    value={causeOfActionDate}
                    onDateChange={(val) => setField('causeOfActionDate', val)}
                  />
                </View>
              </View>
            </View>

            {/* 3.5 Prayer & Reliefs */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>3.5 Reliefs Sought (Prayer)</Text>
              <Text style={styles.helperText}>
                List the exact reliefs and stay prayers to be claimed before the court.
              </Text>
              <PrayerBuilder />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Nav Bar */}
      <BottomNavBar currentStep={3} onNext={handleNext} />
        </View>
      </GestureDetector>
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
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 2,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  charCounter: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  multilineInput: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowLayout: {
    flexDirection: 'row',
    width: '100%',
  },
  flexField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  singleLineInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
});
