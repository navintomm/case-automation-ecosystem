import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors, radius } from '../theme/tokens';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

export default function ReviewDocumentScreen() {
  const router = useRouter();
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesText, setChangesText] = useState('');

  const handleApprove = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Approve this draft and generate PDF filing package?');
      if (confirm) {
        router.push('/pdf-ready' as any);
      }
    } else {
      Alert.alert(
        'Approve Draft',
        'Approve this draft and generate PDF filing package?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Approve', style: 'default', onPress: () => router.push('/pdf-ready' as any) },
        ]
      );
    }
  };

  const handleRequestChanges = () => {
    setShowChangesModal(true);
  };

  const submitChanges = () => {
    if (!changesText.trim()) return;
    setShowChangesModal(false);
    setChangesText('');
    Toast.show({
      type: 'success',
      text1: 'Changes noted.',
      text2: 'ADVISOR will incorporate in regeneration.',
      position: 'top',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Draft</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleApprove}>
          <Text style={styles.saveBtnText}>Approve</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.docCard}>
          <View style={styles.amberStrip}>
            <Text style={styles.amberStripText}>DRAFT — PENDING REVIEW</Text>
          </View>
          
          <View style={styles.docContent}>
            <Text style={styles.causeTitle}>IN THE HIGH COURT OF KERALA AT ERNAKULAM</Text>
            <Text style={styles.causeTitle}>WP(C) NO. _____ OF 2026</Text>
            
            <View style={{ marginVertical: 20 }}>
              <Text style={styles.partyText}>Suresh Kumar ...................................... Petitioner</Text>
              <Text style={[styles.partyText, { textAlign: 'center' }]}>Vs</Text>
              <Text style={styles.partyText}>State of Kerala ................................. Respondent</Text>
            </View>

            <Text style={styles.sectionHeading}>I. FACTUAL SYNOPSIS</Text>
            <Text style={styles.docParagraph}>
              1. That the Petitioner is a law-abiding citizen of India residing at the address mentioned in the cause title. The Petitioner is aggrieved by the arbitrary and illegal actions of the Respondent authority.
            </Text>
            <Text style={styles.docParagraph}>
              2. That on 12.05.2026, the Respondent issued a notice without providing the Petitioner an opportunity to be heard, violating the principles of natural justice.
            </Text>

            <Text style={styles.sectionHeading}>II. GROUNDS</Text>
            <Text style={styles.docParagraph}>
              A. BECAUSE the impugned order is arbitrary, illegal, and violates Article 14 of the Constitution of India.
            </Text>
            <Text style={styles.docParagraph}>
              B. BECAUSE the Respondent authority failed to consider the relevant evidence submitted by the Petitioner.
            </Text>

            <Text style={styles.sectionHeading}>III. PRAYER</Text>
            <Text style={styles.docParagraph}>
              In light of the above facts and circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to:
            </Text>
            <Text style={styles.docParagraph}>
              a) Issue a writ of certiorari quashing the impugned notice dated 12.05.2026.
            </Text>
            <Text style={styles.docParagraph}>
              b) Pass any other order as this Hon'ble Court deems fit.
            </Text>
            
            {/* Pad bottom for scroll */}
            <View style={{ height: 60 }} />
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fabBtn, styles.fabOutline]} onPress={handleRequestChanges}>
          <Text style={styles.fabOutlineText}>Request Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fabBtn, styles.fabFill]} onPress={handleApprove}>
          <Text style={styles.fabFillText}>Approve & Generate PDFs</Text>
        </TouchableOpacity>
      </View>

      {/* Changes Modal (Bottom Sheet mock) */}
      {showChangesModal && (
        <>
          <View style={styles.backdrop} />
          <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.bottomSheet}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Request Changes</Text>
                <TouchableOpacity onPress={() => setShowChangesModal(false)}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.sheetInput}
                placeholder="Describe the changes needed..."
                placeholderTextColor={colors.textMuted}
                multiline
                autoFocus
                value={changesText}
                onChangeText={setChangesText}
              />
              <TouchableOpacity 
                style={[styles.sheetBtn, !changesText.trim() && { opacity: 0.5 }]} 
                onPress={submitChanges}
                disabled={!changesText.trim()}
              >
                <Text style={styles.sheetBtnText}>Send to ADVISOR</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingBottom: 100, // space for fab
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    minHeight: 600,
  },
  amberStrip: {
    backgroundColor: colors.warning,
    paddingVertical: 8,
    alignItems: 'center',
  },
  amberStripText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  docContent: {
    padding: 24,
  },
  causeTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  partyText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  sectionHeading: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 12,
  },
  docParagraph: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  fabBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabOutline: {
    borderWidth: 1.5,
    borderColor: colors.navy,
  },
  fabOutlineText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  fabFill: {
    backgroundColor: colors.gold,
  },
  fabFillText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    zIndex: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  sheetInput: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    marginBottom: 16,
    ...Platform.select({ web: { outlineStyle: 'none' as any } }),
  },
  sheetBtn: {
    backgroundColor: colors.gold,
    height: 48,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
});
