import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, cardShadow } from '../../theme/tokens';
import { Party } from '../../store/caseStore';

interface PartyCardProps {
  party: Party;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  drag?: () => void; // for native drag-and-drop
}

export default function PartyCard({
  party,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  drag,
}: PartyCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    // Smooth transition
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpanded(!expanded);
  };

  const getRoleBadgeStyles = (role: string) => {
    const r = role.toLowerCase();
    if (r === 'petitioner' || r === 'plaintiff' || r === 'appellant') {
      return {
        bg: colors.gold,
        text: colors.navy,
      };
    }
    if (r === 'respondent' || r === 'defendant') {
      return {
        bg: colors.navy,
        text: '#FFFFFF',
      };
    }
    if (r === 'accused') {
      return {
        bg: '#FDF0F0', // error-tint light red
        text: colors.error,
      };
    }
    // Default fallback
    return {
      bg: colors.cream,
      text: colors.textSecond,
    };
  };

  const badgeColors = getRoleBadgeStyles(party.role);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {/* Reordering and Badge */}
        <View style={styles.leftContainer}>
          {/* Drag Handle or Arrows */}
          {Platform.OS === 'web' ? (
            <View style={styles.webReorder}>
              <TouchableOpacity
                onPress={onMoveUp}
                disabled={isFirst}
                style={[styles.arrowButton, isFirst && styles.disabledArrow]}
                accessibilityLabel="Move party up"
              >
                <Ionicons
                  name="chevron-up"
                  size={16}
                  color={isFirst ? colors.textMuted : colors.textSecond}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onMoveDown}
                disabled={isLast}
                style={[styles.arrowButton, isLast && styles.disabledArrow]}
                accessibilityLabel="Move party down"
              >
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={isLast ? colors.textMuted : colors.textSecond}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              onLongPress={drag} 
              style={styles.dragHandle}
              accessibilityLabel="Drag to reorder"
            >
              <Ionicons name="reorder-three" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          )}

          {/* Role Badge */}
          <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
            <Text style={[styles.badgeText, { color: badgeColors.text }]}>
              {party.role.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={`Remove ${party.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Body Content */}
      <View style={styles.cardBody}>
        <Text style={styles.nameText}>{party.name}</Text>
        
        <Text style={styles.subDetail}>
          {party.age} yrs • {party.relationType}: {party.relationName}
        </Text>
        
        {/* Address */}
        <Text style={styles.addressText} numberOfLines={expanded ? undefined : 2}>
          {party.address}
        </Text>

        {/* Collapsible Section */}
        {expanded && (
          <View style={styles.expandedContent}>
            {party.mobile && (
              <View style={styles.expandedRow}>
                <Text style={styles.expandedLabel}>Mobile:</Text>
                <Text style={styles.expandedVal}>{party.mobile}</Text>
              </View>
            )}
            {party.email && (
              <View style={styles.expandedRow}>
                <Text style={styles.expandedLabel}>Email:</Text>
                <Text style={styles.expandedVal}>{party.email}</Text>
              </View>
            )}
          </View>
        )}

        {/* Show More toggle */}
        {(party.mobile || party.email) && (
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={toggleExpand}
            accessibilityLabel={expanded ? "Show less details" : "Show more details"}
            accessibilityRole="button"
          >
            <Text style={styles.toggleText}>
              {expanded ? 'Show Less' : 'Show More'}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.gold}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    padding: 16,
    ...cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream,
    paddingBottom: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webReorder: {
    flexDirection: 'row',
    marginRight: 10,
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    paddingHorizontal: 2,
  },
  arrowButton: {
    padding: 4,
  },
  disabledArrow: {
    opacity: 0.3,
  },
  dragHandle: {
    paddingRight: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cardBody: {
    width: '100%',
  },
  nameText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subDetail: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
    lineHeight: 18,
    marginBottom: 8,
  },

  expandedContent: {
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  expandedRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  expandedLabel: {
    width: 90,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecond,
  },
  expandedVal: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  toggleText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.gold,
    marginRight: 4,
  },
});
