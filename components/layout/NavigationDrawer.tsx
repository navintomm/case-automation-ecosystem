import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { colors, radius } from '../../theme/tokens';
import { useAdvisorStore } from '../../store/advisorStore';

interface NavigationDrawerProps {
  visible: boolean;
  onClose: () => void;
  activeRoute?: string;
}

interface DrawerItem {
  label: string;
  icon: string;
  iconFamily?: 'ionicons' | 'material';
  route?: string;
  action?: () => void;
  isGold?: boolean;
}

export default function NavigationDrawer({ visible, onClose, activeRoute }: NavigationDrawerProps) {
  const router = useRouter();
  const { openPanel } = useAdvisorStore();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -300,
          tension: 80,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigate = (route?: string, action?: () => void) => {
    onClose();
    if (action) {
      setTimeout(action, 250);
    } else if (route) {
      setTimeout(() => router.push(route as any), 250);
    }
  };

  const handleComingSoon = (label: string) => {
    onClose();
    setTimeout(() => {
      Toast.show({
        type: 'info',
        text1: `${label}`,
        text2: 'This feature is coming soon.',
        position: 'bottom',
        visibilityTime: 2500,
      });
    }, 250);
  };

  const handleSaveDraft = () => {
    onClose();
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: 'Draft Saved',
        text2: 'Your legal matter draft has been updated locally.',
        position: 'top',
        visibilityTime: 3000,
      });
    }, 250);
  };

  if (!visible && Platform.OS !== 'web') return null;

  return (
    <View style={styles.overlay} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer panel */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Logo Header */}
          <View style={styles.logoSection}>
            <MaterialCommunityIcons name="scale-balance" size={26} color={colors.gold} />
            <Text style={styles.logoText}>CASE</Text>
          </View>
          <View style={styles.goldRule} />

          {/* MATTER Section */}
          <Text style={styles.sectionLabel}>MATTER</Text>

          <DrawerItemRow
            icon="document-text-outline"
            label="Current Matter"
            isActive={true}
            onPress={() => handleNavigate(undefined, onClose)}
          />
          <DrawerItemRow
            icon="save-outline"
            label="Save Draft"
            onPress={handleSaveDraft}
          />

          <View style={styles.divider} />

          {/* TOOLS Section */}
          <Text style={styles.sectionLabel}>TOOLS</Text>

          <DrawerItemRow
            icon="sparkles"
            label="ADVISOR"
            isGold
            onPress={() =>
              handleNavigate(undefined, () => {
                openPanel();
              })
            }
          />
          <DrawerItemRow
            icon="library-outline"
            label="Knowledge Repository"
            onPress={() => handleNavigate('/knowledge-repository')}
          />

          <View style={styles.divider} />

          {/* ACCOUNT Section */}
          <Text style={styles.sectionLabel}>ACCOUNT</Text>

          <DrawerItemRow
            icon="person-outline"
            label="Profile"
            onPress={() => handleComingSoon('Profile')}
          />
          <DrawerItemRow
            icon="settings-outline"
            label="Settings"
            onPress={() => handleComingSoon('Settings')}
          />
          <DrawerItemRow
            icon="log-out-outline"
            label="Sign Out"
            onPress={() => handleNavigate('/')}
          />
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

// ─── Drawer Row ───────────────────────────────────────────────────────────────

interface DrawerItemRowProps {
  icon: string;
  label: string;
  isActive?: boolean;
  isGold?: boolean;
  onPress: () => void;
}

function DrawerItemRow({ icon, label, isActive, isGold, onPress }: DrawerItemRowProps) {
  return (
    <TouchableOpacity
      style={[styles.itemRow, isActive && styles.itemRowActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isActive && <View style={styles.activeBar} />}
      <Ionicons
        name={icon as any}
        size={20}
        color={isGold ? colors.gold : isActive ? colors.gold : '#FFFFFF'}
        style={styles.itemIcon}
      />
      <Text style={[styles.itemLabel, isGold && styles.itemLabelGold]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 8000,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    width: 280,
    backgroundColor: colors.navy,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 10,
  },
  logoText: {
    fontSize: 26,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  goldRule: {
    width: 40,
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 999,
    marginLeft: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: colors.textMuted,
    letterSpacing: 2,
    paddingHorizontal: 20,
    marginBottom: 4,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 20,
    position: 'relative',
  },
  itemRowActive: {
    backgroundColor: 'rgba(201, 150, 58, 0.12)',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  itemIcon: {
    marginRight: 14,
  },
  itemLabel: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
  },
  itemLabelGold: {
    color: colors.gold,
  },
});
