import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn, useReducedMotion, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { colors, radius } from '../theme/tokens';

const STEPS = [
  'Applying court-specific formatting',
  'Processing party details',
  'Building factual narrative',
  'Drafting grounds and arguments',
  'Generating prayer section',
  'Preparing companion documents',
  'Finalizing document structure',
  'Saving to Google Drive',
];

export default function GeneratingScreen() {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Document float animation
  const floatY = useSharedValue(0);
  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const docStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  // Spinner animation
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Progress simulation
  useEffect(() => {
    if (currentStepIndex < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 300); // 300ms per step
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentStepIndex]);

  const handleOpenReview = () => {
    router.replace('/review-document' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Animated.View style={[styles.docIconContainer, !isReducedMotion && docStyle]}>
          <Ionicons name="document-text" size={64} color={colors.gold} />
          <View style={styles.glow} />
        </Animated.View>
        <Text style={styles.title}>Generating Your Draft</Text>
        <Text style={styles.subtitle}>Please wait while CASE prepares your documents</Text>
      </View>

      {/* Progress List */}
      <View style={styles.card}>
        {STEPS.map((step, index) => {
          const status = index < currentStepIndex ? 'completed' : index === currentStepIndex ? 'active' : 'pending';
          
          return (
            <Animated.View 
              key={step} 
              style={styles.stepRow}
              entering={isReducedMotion ? undefined : FadeInDown.delay(index * 100)}
            >
              <View style={styles.iconBox}>
                {status === 'completed' && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
                {status === 'active' && (
                  <Animated.View style={!isReducedMotion && spinStyle}>
                    <Ionicons name="sync" size={20} color={colors.gold} />
                  </Animated.View>
                )}
                {status === 'pending' && <Ionicons name="ellipse-outline" size={20} color={colors.textMuted} />}
              </View>
              <Text style={[styles.stepText, status === 'active' && styles.stepTextActive]}>{step}</Text>
            </Animated.View>
          );
        })}
      </View>

      <Text style={styles.bottomNote}>Your document will open in Google Docs for review once ready</Text>

      {/* Action Button */}
      {isComplete && (
        <Animated.View entering={FadeIn} style={styles.btnWrapper}>
          <TouchableOpacity style={styles.btn} onPress={handleOpenReview}>
            <Text style={styles.btnText}>Open Document for Review →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: 20,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  docIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gold,
    opacity: 0.1,
    zIndex: -1,
  },
  title: {
    fontSize: 26,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.navy,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  stepTextActive: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  bottomNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  btnWrapper: {
    marginBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  btn: {
    backgroundColor: colors.gold,
    height: 52,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
});
