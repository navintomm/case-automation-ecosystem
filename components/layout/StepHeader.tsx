import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';
import StepProgressBar from './StepProgressBar';
import NavigationDrawer from './NavigationDrawer';
import { useAdvisorStore } from '../../store/advisorStore';
import { useAutoSave } from '../../hooks/useAutoSave';

interface StepHeaderProps {
  currentStep: number;
  title: string;
}

export default function StepHeader({ currentStep, title }: StepHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setDrawerOpen: notifyDrawer } = useAdvisorStore();
  const saveState = useAutoSave();

  const openDrawer = () => {
    setDrawerOpen(true);
    notifyDrawer(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    notifyDrawer(false);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          {/* Header Content */}
          <View style={styles.headerBar}>
            {/* Hamburger Menu */}
            <TouchableOpacity
              style={styles.menuButton}
              onPress={openDrawer}
              accessibilityLabel="Open navigation menu"
              accessibilityRole="button"
            >
              <Ionicons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.stepLabel}>
                STEP {currentStep} OF 4
              </Text>
              <Text style={styles.stepTitle}>
                {title}
              </Text>
            </View>

            <View style={styles.rightContainer}>
              {saveState !== 'idle' && (
                <View style={styles.autoSaveBadge}>
                  <Ionicons 
                    name={saveState === 'saving' ? 'sync' : 'checkmark-done'} 
                    size={12} 
                    color={colors.textMuted} 
                  />
                  <Text style={styles.autoSaveText}>
                    {saveState === 'saving' ? 'Saving...' : 'Saved'}
                  </Text>
                </View>
              )}

              {/* ADVISOR quick-access button */}
              <TouchableOpacity
                style={styles.advisorButton}
                onPress={() => {
                  const el = document.getElementById('advisor-floating-bubble');
                  if (el) el.click();
                }}
                accessibilityLabel="Open ADVISOR"
                accessibilityRole="button"
              >
                <Ionicons name="sparkles" size={16} color={colors.gold} style={{ marginRight: 4 }} />
                <Text style={styles.advisorText}>ADVISOR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar */}
          <StepProgressBar currentStep={currentStep} />
        </View>
      </SafeAreaView>

      {/* Navigation Drawer (rendered outside SafeAreaView so it covers full screen) */}
      <NavigationDrawer
        visible={drawerOpen}
        onClose={closeDrawer}
        activeRoute={`step${currentStep}`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.navy,
  },
  headerContainer: {
    backgroundColor: colors.navy,
    borderBottomWidth: 1,
    borderBottomColor: '#243560',
  },
  headerBar: {
    height: Platform.OS === 'ios' ? 56 : 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  autoSaveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
  },
  autoSaveText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
  },
  advisorButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  advisorText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: colors.gold,
    letterSpacing: 0.5,
  },
});
