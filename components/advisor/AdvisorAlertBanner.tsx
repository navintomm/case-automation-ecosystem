import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';
import { useAdvisorStore } from '../../store/advisorStore';

interface AdvisorAlertBannerProps {
  step: string;
}

export default function AdvisorAlertBanner({ step }: AdvisorAlertBannerProps) {
  const { alerts, openPanel } = useAdvisorStore();
  const stepAlerts = alerts[step] ?? [];

  if (stepAlerts.length === 0) return null;

  const firstAlert = stepAlerts[0];
  const additionalCount = stepAlerts.length - 1;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={openPanel}
      activeOpacity={0.85}
      accessibilityLabel="ADVISOR alert — tap to view details"
      accessibilityRole="button"
    >
      {/* Left Icon */}
      <View style={styles.iconCol}>
        <Ionicons name="sparkles" size={16} color={colors.gold} />
      </View>

      {/* Content */}
      <View style={styles.contentCol}>
        <Text style={styles.advisorLabel}>ADVISOR</Text>
        <Text style={styles.alertText} numberOfLines={2}>
          {firstAlert}
        </Text>
        {additionalCount > 0 && (
          <Text style={styles.moreLink}>+{additionalCount} more</Text>
        )}
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: radius.md,
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  iconCol: {
    marginRight: 10,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  contentCol: {
    flex: 1,
    marginRight: 8,
  },
  advisorLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: colors.gold,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  alertText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  moreLink: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.gold,
    marginTop: 4,
  },
});
