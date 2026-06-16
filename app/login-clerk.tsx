import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, cardShadow } from '../theme/tokens';
import { useClerkStore } from '../store/clerkStore';

export default function ClerkLoginScreen() {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();
  const setActiveRole = useClerkStore((s) => s.setActiveRole);

  const [employeeId, setEmployeeId]   = useState('');
  const [password, setPassword]       = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [idFocus, setIdFocus]         = useState(false);
  const [passFocus, setPassFocus]     = useState(false);
  const [loading, setLoading]         = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const cardEntering = isReducedMotion
    ? undefined
    : FadeInUp.duration(500).delay(150).springify();

  const handleSignIn = () => {
    setLoading(true);
    setActiveRole('clerk');
    setTimeout(() => {
      setLoading(false);
      router.push('/clerk-portal' as any);
    }, 500);
  };

  const handleDemoMode = () => {
    setActiveRole('clerk');
    router.push('/clerk-portal' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Background */}
      <View style={styles.gradientBg} />

      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Hero */}
          <View style={styles.heroSection}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
            <Text style={styles.heroTitle}>Clerk Login</Text>
            <View style={styles.goldRule} />
          </View>

          {/* Form Card */}
          <Animated.View entering={cardEntering} style={styles.card}>
            {/* Employee ID */}
            <Text style={styles.fieldLabel}>Employee ID</Text>
            <View
              style={[
                styles.inputWrapper,
                idFocus && styles.inputWrapperFocused,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="e.g. CLK-2024-001"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="next"
                value={employeeId}
                onChangeText={setEmployeeId}
                onFocus={() => setIdFocus(true)}
                onBlur={() => setIdFocus(false)}
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel="Employee ID"
              />
            </View>

            {/* Password */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                passFocus && styles.inputWrapperFocused,
                { flexDirection: 'row', alignItems: 'center' },
              ]}
            >
              <TextInput
                ref={passwordRef}
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPass}
                returnKeyType="done"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
                onSubmitEditing={handleSignIn}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setShowPass((p) => !p)}
                style={styles.eyeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={showPass ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleSignIn}
              disabled={loading}
              accessibilityLabel="Sign In"
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.primaryBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Demo Mode */}
            <TouchableOpacity
              style={styles.demoRow}
              onPress={handleDemoMode}
              accessibilityLabel="Demo Mode"
              accessibilityRole="button"
            >
              <Text style={styles.demoText}>Demo Mode</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Switch to Advocate */}
          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => router.replace('/login-advocate' as any)}
            accessibilityLabel="Login as Advocate"
            accessibilityRole="button"
          >
            <Text style={styles.switchText}>
              Advocate?{' '}
              <Text style={styles.switchLink}>Login here</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  gradientBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.navy,
    ...Platform.select({
      web: {
        backgroundImage: `linear-gradient(160deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
      },
    }),
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 48,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: 20,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 28,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  goldRule: {
    width: 40,
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 999,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 24,
    ...cardShadow,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  inputWrapperFocused: {
    borderColor: colors.borderFocus,
  },
  input: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    ...Platform.select({ web: { outlineStyle: 'none' as any } }),
  },
  eyeBtn: {
    padding: 6,
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    backgroundColor: colors.navy,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  demoRow: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 4,
  },
  demoText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  switchRow: {
    marginTop: 28,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  switchLink: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
    textDecorationLine: 'underline',
  },
});
