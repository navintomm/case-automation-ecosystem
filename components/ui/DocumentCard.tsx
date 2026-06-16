import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, cardShadow } from '../../theme/tokens';
import { UploadedDoc } from '../../store/caseStore';

interface DocumentCardProps {
  doc: UploadedDoc;
  onRemove: () => void;
  onDescriptionChange: (desc: string) => void;
}

export default function DocumentCard({
  doc,
  onRemove,
  onDescriptionChange,
}: DocumentCardProps) {
  const getDocTypeStyles = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'pdf') {
      return {
        bg: '#FDF0F0', // light red
        text: colors.error,
        icon: 'document-text',
      };
    }
    if (t === 'docx' || t === 'doc') {
      return {
        bg: '#F0F4FD', // light blue
        text: '#2B6CB0',
        icon: 'document',
      };
    }
    if (['jpg', 'jpeg', 'png', 'tiff', 'gif'].includes(t)) {
      return {
        bg: '#F0FDF4', // light green
        text: colors.verified,
        icon: 'image',
      };
    }
    return {
      bg: colors.cream,
      text: colors.textSecond,
      icon: 'attach',
    };
  };

  const docStyle = getDocTypeStyles(doc.type);
  const isDescriptionEmpty = !doc.description || doc.description.trim() === '';

  return (
    <View style={styles.card}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.leftGroup}>
          <View style={[styles.typeBadge, { backgroundColor: docStyle.bg }]}>
            <Ionicons name={docStyle.icon as any} size={16} color={docStyle.text} />
            <Text style={[styles.typeBadgeText, { color: docStyle.text }]}>
              {doc.type.toUpperCase()}
            </Text>
          </View>
          
          <Text style={styles.fileName} numberOfLines={1}>
            {doc.name}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={`Remove ${doc.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Description input with status dot */}
      <View style={styles.descriptionContainer}>
        {isDescriptionEmpty && (
          <View 
            style={styles.warningDot} 
            accessibilityLabel="Missing description warning"
          />
        )}
        <TextInput
          style={[
            styles.descriptionInput,
            isDescriptionEmpty && styles.descriptionInputWarning,
          ]}
          value={doc.description}
          onChangeText={onDescriptionChange}
          placeholder="What is this document? e.g. Impugned order dated 12.01.2026"
          placeholderTextColor={colors.textMuted}
          {...Platform.select({
            web: {
              outlineStyle: 'none',
            },
          })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
    ...cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 3,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  warningDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
    position: 'absolute',
    left: -10,
    top: 15,
  },
  descriptionInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    backgroundColor: colors.cream,
  },
  descriptionInputWarning: {
    borderColor: 'rgba(217, 119, 6, 0.4)', // warning colored border
  },
});
