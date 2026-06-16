import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { useMattersStore } from '../store/mattersStore';

export default function MatterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getMatterById } = useMattersStore();
  
  const [activeTab, setActiveTab] = useState<'Timeline' | 'Documents' | 'Tasks'>('Timeline');

  // For real usage, we would fetch by ID. We fallback to the first mock if not found for testing.
  const matter = getMatterById(id || '1') || getMatterById('1');

  if (!matter) {
    return (
      <View style={styles.center}>
        <Text>Case File not found.</Text>
      </View>
    );
  }

  const handleResume = () => {
    // Navigate to the correct step based on currentStep
    router.push(`/step${matter.currentStep}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBtn} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{matter.title}</Text>
        <TouchableOpacity 
          style={styles.headerBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Status Strip */}
      <View style={[styles.statusStrip, matter.status === 'Completed' ? { backgroundColor: colors.success } : {}]}>
        <Text style={styles.statusText}>
          {matter.status === 'Completed' ? 'Completed' : `Step ${matter.currentStep} of 4 — ${matter.status}`}
        </Text>
        {matter.status !== 'Completed' && (
          <TouchableOpacity onPress={handleResume}>
            <Text style={styles.resumeText}>Resume →</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Matter Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{matter.documentType || 'Draft'}</Text>
            </View>
            <View style={[styles.priorityBadge, matter.priority === 'Urgent' && { backgroundColor: colors.error }]}>
              <Text style={styles.priorityText}>{matter.priority}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{matter.court || 'Court not specified'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>Owner: {matter.caseOwner}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>Staff: {matter.assignedStaff.length > 0 ? matter.assignedStaff.join(', ') : 'None'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>Created: {new Date(matter.createdAt).toLocaleDateString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="folder-open-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>Ref: {matter.reference || 'None'}</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {(['Timeline', 'Documents', 'Tasks'] as const).map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Timeline' && (
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineBody}>
                  <Text style={styles.timelineTitle}>Case File Created</Text>
                  <Text style={styles.timelineSub}>{matter.caseOwner}</Text>
                </View>
                <Text style={styles.timelineDate}>{new Date(matter.createdAt).toLocaleDateString()}</Text>
              </View>
              {matter.currentStep > 1 && (
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineBody}>
                    <Text style={styles.timelineTitle}>Step 1 Completed</Text>
                    <Text style={styles.timelineSub}>Basic Details Saved</Text>
                  </View>
                  <Text style={styles.timelineDate}>{new Date(matter.updatedAt).toLocaleDateString()}</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'Documents' && (
            <View style={styles.emptyTab}>
              <Ionicons name="document-text-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>No documents uploaded yet.</Text>
            </View>
          )}

          {activeTab === 'Tasks' && (
            <View style={styles.emptyTab}>
              <Ionicons name="checkmark-done-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>No tasks assigned for this case file.</Text>
            </View>
          )}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {matter.status !== 'Completed' ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleResume}>
              <Text style={styles.primaryBtnText}>Resume Drafting</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.outlineBtn} onPress={() => router.push('/pdf-ready' as any)}>
              <Text style={styles.outlineBtnText}>View Generated Documents</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  statusStrip: {
    backgroundColor: colors.gold,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  resumeText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  priorityBadge: {
    backgroundColor: colors.textMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
  },
  activeTabText: {
    color: colors.navy,
    fontFamily: 'Inter_600SemiBold',
  },
  tabContent: {
    minHeight: 150,
  },
  emptyTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gold,
    marginTop: 4,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineBody: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  timelineSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 2,
  },
  timelineDate: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  bottomActions: {
    marginTop: 40,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: colors.gold,
    height: 52,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    height: 52,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
});
