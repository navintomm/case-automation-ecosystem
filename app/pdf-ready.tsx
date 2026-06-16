import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn, useReducedMotion, useSharedValue, useAnimatedStyle, withSpring, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { colors, radius } from '../theme/tokens';

const DOCUMENTS = [
  'Writ Petition.pdf',
  'Supporting Affidavit.pdf',
  'Delay Condonation Petition.pdf',
  'Vakalath.pdf',
  'Document List.pdf',
];

export default function PdfReadyScreen() {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();

  // Animations for document fan-out
  const card1Rot = useSharedValue(0);
  const card1X = useSharedValue(0);
  const card3Rot = useSharedValue(0);
  const card3X = useSharedValue(0);
  
  const sealScale = useSharedValue(0);
  const sealOpacity = useSharedValue(0);

  useEffect(() => {
    if (!isReducedMotion) {
      // Fan out cards
      card1Rot.value = withDelay(300, withSpring(-15));
      card1X.value = withDelay(300, withSpring(-40));
      
      card3Rot.value = withDelay(600, withSpring(15));
      card3X.value = withDelay(600, withSpring(40));

      // Stamp seal
      sealScale.value = withDelay(1000, withSequence(
        withTiming(1.5, { duration: 0 }),
        withSpring(1, { damping: 12, stiffness: 100 })
      ));
      sealOpacity.value = withDelay(1000, withTiming(1, { duration: 200 }));
    } else {
      card1Rot.value = -15; card1X.value = -40;
      card3Rot.value = 15; card3X.value = 40;
      sealScale.value = 1; sealOpacity.value = 1;
    }
  }, []);

  const styleCard1 = useAnimatedStyle(() => ({
    transform: [{ translateX: card1X.value }, { rotate: `${card1Rot.value}deg` }],
  }));
  const styleCard3 = useAnimatedStyle(() => ({
    transform: [{ translateX: card3X.value }, { rotate: `${card3Rot.value}deg` }],
  }));
  const styleSeal = useAnimatedStyle(() => ({
    transform: [{ scale: sealScale.value }, { rotate: '-10deg' }],
    opacity: sealOpacity.value,
  }));

  const handleDownload = (name: string) => {
    Toast.show({
      type: 'info',
      text1: 'Download Starting',
      text2: `${name} download coming soon — Google Drive integration required.`,
      position: 'top',
    });
  };

  const handleDrive = () => {
    Toast.show({
      type: 'info',
      text1: 'Google Drive',
      text2: 'Google Drive integration coming soon.',
      position: 'top',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Animated Graphic */}
        <View style={styles.graphicContainer}>
          <Animated.View style={[styles.docCard, styles.docCardBack, styleCard1]}>
            <View style={styles.line} /><View style={styles.line} /><View style={[styles.line, { width: '60%' }]} />
          </Animated.View>
          <Animated.View style={[styles.docCard, styles.docCardBack, styleCard3]}>
            <View style={styles.line} /><View style={styles.line} /><View style={[styles.line, { width: '80%' }]} />
          </Animated.View>
          
          <View style={[styles.docCard, styles.docCardFront]}>
            <View style={styles.line} /><View style={styles.line} /><View style={styles.line} />
            <View style={styles.line} /><View style={[styles.line, { width: '40%' }]} />
            
            {/* Seal */}
            <Animated.View style={[styles.seal, styleSeal]}>
              <View style={styles.sealInner}>
                <Text style={styles.sealText}>APPROVED</Text>
              </View>
            </Animated.View>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(1200)} style={styles.textContainer}>
          <Text style={styles.title}>Filing Package Ready</Text>
          <Text style={styles.subtitle}>Your documents are ready for download and filing</Text>
        </Animated.View>

        {/* Document List */}
        <Animated.View entering={FadeInDown.delay(1400)} style={styles.listCard}>
          {DOCUMENTS.map((doc, idx) => (
            <View key={idx} style={[styles.listRow, idx === DOCUMENTS.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.listRowLeft}>
                <Ionicons name="document-text" size={20} color={colors.textMuted} />
                <Text style={styles.docName}>{doc}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDownload(doc)}>
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeIn.delay(1600)} style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleDrive}>
            <Ionicons name="logo-google" size={18} color={colors.navy} style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Open All in Google Drive</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.outlineBtn} onPress={() => router.replace('/dashboard' as any)}>
            <Text style={styles.outlineBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/create-draft' as any)}>
            <Text style={styles.linkText}>Start New Matter</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  graphicContainer: {
    height: 160,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  docCard: {
    position: 'absolute',
    width: 100,
    height: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docCardBack: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  docCardFront: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  line: {
    height: 4,
    backgroundColor: colors.cream,
    borderRadius: 2,
    marginBottom: 8,
    width: '100%',
  },
  seal: {
    position: 'absolute',
    bottom: 10,
    right: -10,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(201, 150, 58, 0.1)',
    borderWidth: 2,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sealInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sealText: {
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
    color: colors.gold,
    transform: [{ rotate: '-15deg' }],
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
  },
  listCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 40,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  downloadText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: colors.gold,
    height: 52,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    height: 52,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  linkBtn: {
    padding: 12,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
