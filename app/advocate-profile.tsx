import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors as staticColors, radius } from '../theme/tokens';
import Toast from 'react-native-toast-message';
import { useThemeStore } from '../store/themeStore';

export default function AdvocateProfileScreen() {
  const router = useRouter();
  const { mode, colors, toggleTheme } = useThemeStore();
  const styles = useStyles(colors);

  const handleSignOut = () => {
    router.replace('/' as any);
  };

  const handleMockAction = (feature: string) => {
    Toast.show({
      type: 'info',
      text1: 'Feature in Development',
      text2: `Mock Data: ${feature} section is coming soon!`,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <View style={[styles.header, { backgroundColor: colors.navy }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advocate Profile</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.gold, shadowColor: colors.gold }]}>
            <Text style={[styles.avatarText, { color: colors.navy }]}>P</Text>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]}>Adv. Priya</Text>
          <Text style={[styles.email, { color: colors.textMuted }]}>priya@case.law</Text>
          
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: colors.navy }]}>Senior Advocate</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Account Settings</Text>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => handleMockAction('Change Password')}>
            <View style={styles.menuLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.navy} />
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => handleMockAction('Notification Preferences')}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.navy} />
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>Notification Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => handleMockAction('Personal Details')}>
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={20} color={colors.navy} />
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>Personal Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={toggleTheme}>
            <View style={styles.menuLeft}>
              <Ionicons name={mode === 'light' ? 'moon' : 'sunny'} size={20} color={colors.navy} />
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>
                {mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.version}>Project CASE Advocate Portal v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
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
  },
  backBtn: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: colors.cardBg,
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
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
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
    backgroundColor: 'rgba(201,150,58,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(201,150,58,0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
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
    borderColor: staticColors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: staticColors.textPrimary,
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
    color: staticColors.error,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: staticColors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});
