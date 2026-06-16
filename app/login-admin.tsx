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

export default function AdminLoginScreen() {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();
  
  // NOTE: Admin might have their own store, but for role tracking we reuse clerkStore's activeRole for now,
  // or just navigate to the admin dashboard.
  const setActiveRole = useClerkStore((s) => s.setActiveRole);

  const [adminId, setAdminId]       = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [idFocus, setIdFocus]       = useState(false);
  const [passFocus, setPassFocus]   = useState(false);
  const [loading, setLoading]       = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const cardEntering = isReducedMotion
    ? undefined
    : FadeInUp.duration(500).delay(150).springify();

  const handleSignIn = () => {
    setLoading(true);
    setActiveRole('admin');
    setTimeout(() => {
      setLoading(false);
      router.push('/admin-dashboard' as any);
    }, 500);
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
            <Text style={styles.heroTitle}>Admin Login</Text>
            <View style={styles.purpleRule} />
          </View>

          {/* Form Card */}
          <Animated.View entering={cardEntering} style={styles.card}>
            {/* Admin ID */}
            <Text style={styles.fieldLabel}>Admin ID</Text>
            <View
              style={[
                styles.inputWrapper,
                idFocus && styles.inputWrapperFocused,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter Admin ID"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                value={adminId}
                onChangeText={setAdminId}
                onFocus={() => setIdFocus(true)}
                onBlur={() => setIdFocus(false)}
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel="Admin ID"
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
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

          </Animated.View>

          {/* Switch Roles */}
          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => router.replace('/login-advocate' as any)}
            accessibilityLabel="Login as Advocate"
            accessibilityRole="button"
          >
            <Text style={styles.switchText}>
              Not an admin?{' '}
              <Text style={styles.switchLink}>Login as Advocate</Text>
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
  purpleRule: {
    width: 40,
    height: 3,
    backgroundColor: '#7C3AED',
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
    borderColor: '#7C3AED',
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
    backgroundColor: '#7C3AED',
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
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
    color: '#7C3AED',
    textDecorationLine: 'underline',
  },
});
