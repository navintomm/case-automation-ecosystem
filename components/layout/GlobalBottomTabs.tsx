import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';
import { useClerkStore } from '../../store/clerkStore';

export default function GlobalBottomTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const activeRole = useClerkStore((s) => s.activeRole); // 'advocate' | 'clerk' | 'admin'

  // Do not show global tabs if we are in the drafting wizard steps or specific auth flows
  const hiddenRoutes = ['/', '/login-advocate', '/login-clerk', '/login-admin', '/step1', '/step2', '/step3', '/step4', '/verify', '/allocate', '/success'];
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  const renderTab = (
    label: string,
    icon: keyof typeof Ionicons.glyphMap,
    route: string,
    isCenterAction: boolean = false
  ) => {
    const isActive = pathname === route;

    if (isCenterAction) {
      return (
        <TouchableOpacity
          key={label}
          style={styles.centerTabContainer}
          onPress={() => router.push(route as any)}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <View style={styles.centerActionCircle}>
            <Ionicons name={icon} size={28} color="#FFFFFF" />
          </View>
          <Text style={[styles.tabLabel, { color: colors.gold, marginTop: 4 }]}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={label}
        style={styles.tabItem}
        onPress={() => router.push(route as any)}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Ionicons
          name={isActive ? icon : `${icon}-outline` as any}
          size={24}
          color={isActive ? colors.gold : colors.textMuted}
        />
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {activeRole === 'advocate' && (
        <>
          {renderTab('Home', 'home', '/dashboard')}
          {renderTab('Matters', 'folder', '/matter-detail')} {/* Note: matter-detail usually needs ID, but mocked for now */}
          {renderTab('+Draft', 'add', '/create-draft', true)}
          {renderTab('Tasks', 'checkmark-circle', '/dashboard')} {/* Pointing to dashboard for now */}
          {renderTab('Knowledge', 'library', '/knowledge-repository')}
        </>
      )}

      {activeRole === 'clerk' && (
        <>
          {renderTab('My Tasks', 'clipboard', '/clerk-portal')}
          {renderTab('Completed', 'checkmark-done-circle', '/clerk-portal')}
          {renderTab('Knowledge', 'library', '/knowledge-repository')}
        </>
      )}

      {activeRole === 'admin' && (
        <>
          {renderTab('Dashboard', 'grid', '/admin-dashboard')}
          {renderTab('Users', 'people', '/admin-users')}
          {renderTab('Knowledge', 'library', '/knowledge-repository')}
          {renderTab('Activity', 'pulse', '/admin-dashboard')}
          {renderTab('Settings', 'settings', '/admin-dashboard')}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 16 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  centerTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20, // pop out
  },
  centerActionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
