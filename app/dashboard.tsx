import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { colors, radius, cardShadow } from '../theme/tokens';
import Toast from 'react-native-toast-message';
import { useMattersStore } from '../store/mattersStore';
import { useNotificationsStore } from '../store/notificationsStore';
import SkeletonCard from '../components/ui/SkeletonCard';

// MOCK TASKS FOR DEMO
const INITIAL_TASKS = [
  { id: 't1', desc: 'Review Suresh Kumar draft', assignee: 'Ravi Menon', due: 'Today', priority: 'high' },
  { id: 't2', desc: 'File Consumer Complaint', assignee: 'Anitha', due: 'Tomorrow', priority: 'medium' },
];

export default function AdvocateDashboard() {
  const router = useRouter();
  const { matters } = useMattersStore();
  const { getUnreadCount } = useNotificationsStore();
  
  const activeMatters = matters.filter(m => m.status !== 'Completed');
  const unreadNotifs = getUnreadCount();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleMockAction = (feature: string) => {
    Toast.show({
      type: 'info',
      text1: 'Feature in Development',
      text2: `Mock Data: ${feature} coming soon!`,
    });
  };

  const handleCreateDraft = () => {
    router.push('/create-draft' as any);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const renderActiveMatter = ({ item: matter }: any) => (
    <TouchableOpacity 
      style={styles.matterCard}
      onPress={() => router.push(`/matter-detail?id=${matter.id}` as any)}
    >
      <View style={styles.matterBadge}>
        <Text style={styles.matterBadgeText}>{matter.documentType || 'Draft'}</Text>
      </View>
      <Text style={styles.matterTitle} numberOfLines={2}>{matter.title}</Text>
      <Text style={styles.matterCourt} numberOfLines={1}>{matter.court || 'No court specified'}</Text>
      <View style={styles.matterFooter}>
        <Text style={styles.statusBadge}>{matter.status}</Text>
        <Text style={styles.stepText}>Step {matter.currentStep} of 4</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTask = ({ item }: any) => {
    const renderRightActions = () => (
      <TouchableOpacity 
        style={styles.deleteAction}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.taskRow}>
          <View style={[styles.priorityDot, { backgroundColor: item.priority === 'high' ? colors.error : colors.warning }]} />
          <View style={styles.taskContent}>
            <Text style={styles.taskDesc}>{item.desc}</Text>
            <Text style={styles.taskAssignee}>Assigned to: {item.assignee}</Text>
          </View>
          <View style={styles.taskRight}>
            <Text style={[styles.taskDue, item.due === 'Today' && { color: colors.error }]}>{item.due}</Text>
            <View style={styles.taskStatus}>
              <Text style={styles.taskStatusText}>Pending</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  const ListHeader = (
    <View>
      {/* Summary Stats Row */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsRow}
        data={[
          { label: 'Active Matters', value: activeMatters.length.toString(), color: colors.navy },
          { label: 'Pending Tasks', value: tasks.length.toString(), color: colors.warning },
          { label: 'Due Today', value: '3', color: colors.error },
          { label: 'Completed', value: '8', color: colors.navy },
        ]}
        keyExtractor={item => item.label}
        renderItem={({ item }) => (
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        )}
      />

      {/* Create Button */}
      <TouchableOpacity style={styles.createBtn} onPress={handleCreateDraft}>
        <Ionicons name="add-circle" size={20} color={colors.navy} style={{ marginRight: 8 }} />
        <Text style={styles.createBtnText}>Create New Draft</Text>
      </TouchableOpacity>

      {/* Active Matters Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Matters</Text>
        <TouchableOpacity onPress={() => handleMockAction('View All Matters')}>
          <Text style={styles.sectionAction}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={[styles.mattersRow, { flexDirection: 'row', paddingHorizontal: 20 }]}>
          <SkeletonCard />
          <View style={{ width: 16 }} />
          <SkeletonCard />
        </View>
      ) : activeMatters.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={32} color={colors.textMuted} />
          <Text style={styles.emptyText}>No active matters found.</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mattersRow}
          data={activeMatters}
          keyExtractor={item => item.id}
          renderItem={renderActiveMatter}
        />
      )}

      {/* Pending Works Section */}
      <View style={[styles.sectionHeader, { marginTop: 16 }]}>
        <Text style={styles.sectionTitle}>Pending Tasks</Text>
        <TouchableOpacity onPress={() => handleMockAction('Add Pending Task')}>
          <Text style={styles.sectionAction}>+ Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListEmpty = (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-circle-outline" size={32} color={colors.textMuted} />
      <Text style={styles.emptyText}>All tasks completed!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>CASE</Text>
          <Text style={styles.headerSub}>Good morning, Adv. Priya</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => router.push('/notifications' as any)}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            {unreadNotifs > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifs}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/advocate-profile' as any)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>P</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.navy} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.navy,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.navy,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 100, // Leave room for bottom tabs
  },
  statsRow: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
    minWidth: 100,
    alignItems: 'center',
    ...cardShadow,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
  },
  createBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    marginHorizontal: 20,
    marginBottom: 32,
  },
  createBtnText: {
    color: colors.navy,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  sectionAction: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  mattersRow: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  matterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    width: 220,
    padding: 16,
    ...cardShadow,
  },
  matterBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  matterBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  matterTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 4,
    height: 40,
  },
  matterCourt: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 12,
  },
  matterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  statusBadge: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: colors.navy,
  },
  stepText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    ...cardShadow,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskDesc: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  taskAssignee: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  taskRight: {
    alignItems: 'flex-end',
  },
  taskDue: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  taskStatus: {
    backgroundColor: colors.cream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskStatusText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
  },
  emptyState: {
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: radius.md,
    marginBottom: 12,
    marginRight: 20,
  },
});
