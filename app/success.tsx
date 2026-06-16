import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeIn,
  useReducedMotion,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { colors, radius } from '../theme/tokens';
import { useClerkStore } from '../store/clerkStore';
import { useCaseStore } from '../store/caseStore';

export default function SuccessScreen() {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();

  const allocatedClerkName = useClerkStore((s) => s.allocatedClerkName);
  const resetCase          = useCaseStore((s) => s.reset);
  const resetAllocation    = useClerkStore((s) => s.resetAllocationDraft);
  const setAllocated       = useClerkStore((s) => s.setAllocatedClerkName);

  // Animated checkmark ring scale + opacity
  const ringScale   = useSharedValue(isReducedMotion ? 1 : 0.4);
  const ringOpacity = useSharedValue(isReducedMotion ? 1 : 0);
  const checkOpacity = useSharedValue(0);

  useEffect(() => {
    if (!isReducedMotion) {
      ringScale.value   = withTiming(1, { duration: 600 });
      ringOpacity.value = withTiming(1, { duration: 400 });
      checkOpacity.value = withDelay(500, withTiming(1, { duration: 300 }));
    } else {
      checkOpacity.value = 1;
    }
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  const handleOpenDocs = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Google Docs integration coming soon.',
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const handleStartNew = () => {
    resetCase();
    resetAllocation();
    setAllocated(null);
    router.replace('/');
  };

  const handleDashboard = () => {
    router.replace('/');
  };

  const subtitle = allocatedClerkName
    ? `Assigned to ${allocatedClerkName}`
    : 'Saved to your workspace';

  const handleBackToVerify = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Go back to verification? You will need to regenerate this draft.')) {
        router.push('/verify');
      }
    } else {
      Alert.alert(
        'Go back to verification?',
        'You will need to regenerate this draft.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Back', style: 'destructive', onPress: () => router.push('/verify') },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={styles.container}>
        {/* Back Arrow Top Left */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBackToVerify}
          accessibilityLabel="Go back to verification"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
      {/* Checkmark Animation */}
      <Animated.View entering={isReducedMotion ? undefined : FadeIn.duration(300)} style={styles.checkContainer}>
        <Animated.View style={[styles.checkRing, ringStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={52} color={colors.gold} />
          </Animated.View>
        </Animated.View>
      </Animated.View>

      {/* Text */}
      <Animated.View
        entering={isReducedMotion ? undefined : FadeIn.duration(400).delay(500)}
        style={styles.textSection}
      >
        <Text style={styles.title}>Draft Generated</Text>
        <View style={styles.subtitleRow}>
          {allocatedClerkName && (
            <Ionicons name="person-circle-outline" size={16} color={colors.textSecond} style={{ marginRight: 6 }} />
          )}
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        entering={isReducedMotion ? undefined : FadeIn.duration(400).delay(700)}
        style={styles.actionsSection}
      >
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleOpenDocs}
          accessibilityLabel="Open in Google Docs"
          accessibilityRole="button"
        >
          <Ionicons name="logo-google" size={18} color={colors.navy} style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Open in Google Docs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={handleStartNew}
          accessibilityLabel="Start New Matter"
          accessibilityRole="button"
        >
          <Text style={styles.outlineBtnText}>Start New Matter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={handleDashboard}
          accessibilityLabel="Return to Dashboard"
          accessibilityRole="button"
        >
          <Text style={styles.linkBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 24,
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  checkContainer: {
    marginBottom: 32,
  },
  checkRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: colors.gold,
    backgroundColor: colors.goldLighter,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 44,
  },
  title: {
    fontSize: 28,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecond,
    textAlign: 'center',
  },
  actionsSection: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    gap: 12,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  outlineBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  linkBtn: {
    paddingVertical: 8,
  },
  linkBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
