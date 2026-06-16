import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, radius } from '../theme/tokens';
import { useClerkStore } from '../store/clerkStore';

export default function AdminProfileScreen() {
  const router = useRouter();
  const { setActiveRole } = useClerkStore();

  const handleSignOut = () => {
    setActiveRole(null);
    router.replace('/' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Profile</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <Text style={styles.name}>System Administrator</Text>
          <Text style={styles.email}>admin@case.law</Text>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Super Admin</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.menuText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.menuText}>Notification Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.menuText}>Two-Factor Authentication</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.version}>Project CASE Admin Console v1.0.0</Text>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: 'rgba(124,58,237,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDE8E8',
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.2)',
  },
  signOutText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.error,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.borderFocus, // gold color
    textAlign: 'center',
    marginTop: 20,
  },
});
