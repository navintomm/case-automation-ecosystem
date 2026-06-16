import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function LandingScreen() {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;

  const enteringAnimation = isReducedMotion
    ? undefined
    : FadeInUp.duration(400).delay(200).springify();

  return (
    <SafeAreaView style={{ flex: 1, width: '100%', overflow: 'hidden' }} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      
      {/* Background Layer 1: Deep navy gradient */}
      <LinearGradient
        colors={['#0F1A30', '#1B2A4A', '#1F3260']}
        locations={[0, 0.5, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Layer 2: Subtle radial glow behind the cards */}
      <View style={{
        position: 'absolute',
        width: 600,
        height: 400,
        borderRadius: 300,
        backgroundColor: '#C9963A',
        opacity: 0.04,
        alignSelf: 'center',
        top: '30%',
      }} />

      {/* Layer 3: ONE single large faint scales-of-justice icon */}
      <Ionicons
        name="scale"
        size={320}
        color="#C9963A"
        style={{
          position: 'absolute',
          bottom: -60,
          right: -60,
          opacity: 0.04,
        }}
      />

      <View style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',    // true vertical center
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
        gap: 0,
      }}>

        {/* Top section — logo + title */}
        <Animated.View entering={enteringAnimation} style={{ alignItems: 'center', marginBottom: 40 }}>

          {/* Icon */}
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'rgba(201, 150, 58, 0.12)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            borderWidth: 1,
            borderColor: 'rgba(201, 150, 58, 0.25)',
          }}>
            <Ionicons name="scale" size={32} color="#C9963A" />
          </View>

          {/* Main title — lighter weight, more elegant */}
          <Text style={{
            fontFamily: 'DMSerifDisplay_400Regular',
            fontSize: 38,           // reduced from 72px — less aggressive
            color: '#FFFFFF',
            letterSpacing: 6,
            textAlign: 'center',
            marginBottom: 10,
          }}>
            CASE
          </Text>

          {/* Subtitle — two lines, more descriptive */}
          <Text style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: 'rgba(255,255,255,0.55)',
            textAlign: 'center',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            Case Automation & Smart Ecosystem
          </Text>

          <Text style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            color: 'rgba(255,255,255,0.35)',
            textAlign: 'center',
          }}>
            Intelligent Legal Drafting Workspace
          </Text>

          {/* Gold rule — signature motif */}
          <View style={{
            width: 40,
            height: 3,
            borderRadius: 2,
            backgroundColor: '#C9963A',
            marginTop: 20,
          }} />

        </Animated.View>

        {/* Cards section */}
        <Animated.View entering={enteringAnimation} style={{ width: '100%', alignItems: 'center' }}>
          {/* Sign in label */}
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 16,
            textAlign: 'center',
          }}>
            Sign in as
          </Text>

          {/* Cards row */}
          <View style={[{
            flexDirection: 'row',
            gap: 12,
            width: '100%',
            maxWidth: 780,
            justifyContent: 'center',
            paddingHorizontal: 8,
          }, isNarrow && {
            flexDirection: 'column',
            maxWidth: 320,
          }]}>

            {/* Advocate Card */}
            <TouchableOpacity
              style={[{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                borderRadius: 16,
                paddingVertical: 28,      // more breathing room top/bottom
                paddingHorizontal: 16,
                alignItems: 'center',
                gap: 8,
                // iOS shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.18,
                shadowRadius: 20,
                // Android
                elevation: 10,
                // Subtle top border accent
                borderTopWidth: 3,
                borderTopColor: '#C9963A',  // gold for Advocate
              }, isNarrow && {
                paddingVertical: 20,
                flexDirection: 'row',          // icon + text side by side
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/login-advocate');
              }}
              activeOpacity={0.92}
            >
              <View style={[{ alignItems: 'center' }, isNarrow && { flexDirection: 'row', gap: 12, flex: 1 }]}>
                {/* Icon circle */}
                <View style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: 'rgba(201, 150, 58, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: isNarrow ? 0 : 4,
                }}>
                  <Ionicons name="briefcase-outline" size={24} color="#C9963A" />
                </View>

                <View style={[{ alignItems: 'center' }, isNarrow && { alignItems: 'flex-start', flex: 1 }]}>
                  {/* Role name */}
                  <Text style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 15,
                    color: '#1A1A2E',
                    textAlign: isNarrow ? 'left' : 'center',
                  }}>
                    Advocate
                  </Text>

                  {/* Sub label */}
                  <Text style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 11,
                    color: '#9AA3B2',
                    textAlign: isNarrow ? 'left' : 'center',
                    marginBottom: isNarrow ? 0 : 16,
                  }}>
                    Draft, review & allocate
                  </Text>
                </View>
              </View>

              {/* Login button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#C9963A',
                  borderRadius: 999,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  width: isNarrow ? 'auto' : '100%',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/login-advocate');
                }}
              >
                <Text style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 13,
                  color: '#1B2A4A',
                }}>
                  {isNarrow ? 'Login' : 'Login as Advocate'}
                </Text>
              </TouchableOpacity>

            </TouchableOpacity>

            {/* Clerk card */}
            <TouchableOpacity
              style={[{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                borderRadius: 16,
                paddingVertical: 28,      // more breathing room top/bottom
                paddingHorizontal: 16,
                alignItems: 'center',
                gap: 8,
                // iOS shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.18,
                shadowRadius: 20,
                // Android
                elevation: 10,
                // Subtle top border accent
                borderTopWidth: 3,
                borderTopColor: '#1B2A4A',  // navy for Clerk
              }, isNarrow && {
                paddingVertical: 20,
                flexDirection: 'row',          // icon + text side by side
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/login-clerk');
              }}
              activeOpacity={0.92}
            >
              <View style={[{ alignItems: 'center' }, isNarrow && { flexDirection: 'row', gap: 12, flex: 1 }]}>
                {/* Icon circle */}
                <View style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: 'rgba(27, 42, 74, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: isNarrow ? 0 : 4,
                }}>
                  <Ionicons name="clipboard-outline" size={24} color="#1B2A4A" />
                </View>

                <View style={[{ alignItems: 'center' }, isNarrow && { alignItems: 'flex-start', flex: 1 }]}>
                  {/* Role name */}
                  <Text style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 15,
                    color: '#1A1A2E',
                    textAlign: isNarrow ? 'left' : 'center',
                  }}>
                    Clerk
                  </Text>

                  {/* Sub label */}
                  <Text style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 11,
                    color: '#9AA3B2',
                    textAlign: isNarrow ? 'left' : 'center',
                    marginBottom: isNarrow ? 0 : 16,
                  }}>
                    View & manage assigned work
                  </Text>
                </View>
              </View>

              {/* Login button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#1B2A4A',
                  borderRadius: 999,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  width: isNarrow ? 'auto' : '100%',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/login-clerk');
                }}
              >
                <Text style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 13,
                  color: '#FFFFFF',
                }}>
                  {isNarrow ? 'Login' : 'Login as Clerk'}
                </Text>
              </TouchableOpacity>

            </TouchableOpacity>

            {/* Admin card */}
            <TouchableOpacity
              style={[{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                borderRadius: 16,
                paddingVertical: 28,      // more breathing room top/bottom
                paddingHorizontal: 16,
                alignItems: 'center',
                gap: 8,
                // iOS shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.18,
                shadowRadius: 20,
                // Android
                elevation: 10,
                // Subtle top border accent
                borderTopWidth: 3,
                borderTopColor: '#7C3AED',  // purple for Admin
              }, isNarrow && {
                paddingVertical: 20,
                flexDirection: 'row',          // icon + text side by side
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/login-admin');
              }}
              activeOpacity={0.92}
            >
              <View style={[{ alignItems: 'center' }, isNarrow && { flexDirection: 'row', gap: 12, flex: 1 }]}>
                {/* Icon circle */}
                <View style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: isNarrow ? 0 : 4,
                }}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#7C3AED" />
                </View>

                <View style={[{ alignItems: 'center' }, isNarrow && { alignItems: 'flex-start', flex: 1 }]}>
                  {/* Role name */}
                  <Text style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 15,
                    color: '#1A1A2E',
                    textAlign: isNarrow ? 'left' : 'center',
                  }}>
                    Administrator
                  </Text>

                  {/* Sub label */}
                  <Text style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 11,
                    color: '#9AA3B2',
                    textAlign: isNarrow ? 'left' : 'center',
                    marginBottom: isNarrow ? 0 : 16,
                  }}>
                    Manage users, system & knowledge
                  </Text>
                </View>
              </View>

              {/* Login button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#7C3AED',
                  borderRadius: 999,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  width: isNarrow ? 'auto' : '100%',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/login-admin');
                }}
              >
                <Text style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 13,
                  color: '#FFFFFF',
                }}>
                  {isNarrow ? 'Login' : 'Login as Admin'}
                </Text>
              </TouchableOpacity>

            </TouchableOpacity>

          </View>
        </Animated.View>

        {/* Footer */}
        <View style={{
          position: 'absolute',
          bottom: 24,
          alignItems: 'center',
          gap: 4,
        }}>
          {/* Thin gold divider line */}
          <View style={{
            width: 32,
            height: 1,
            backgroundColor: 'rgba(201, 150, 58, 0.4)',
            marginBottom: 8,
          }} />

          <Text style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: 0.5,
            textAlign: 'center',
          }}>
            Built for advocates. Controlled by advocates.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
