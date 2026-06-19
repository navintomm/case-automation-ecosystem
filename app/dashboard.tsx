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
  ScrollView,
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
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

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
        <View style={[styles.taskRow, item.priority === 'high' && { borderLeftWidth: 3, borderLeftColor: colors.error }]}>
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Ionicons name="ellipse-outline" size={22} color={colors.textMuted} style={{ opacity: 0.5 }} />
          </TouchableOpacity>
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
      <View style={styles.statsContainer}>
        {[
          { label: 'Active Case Files', value: activeMatters.length.toString(), color: colors.navy, icon: 'folder-open' },
          { label: 'Pending Tasks', value: tasks.length.toString(), color: colors.warning, icon: 'time' },
          { label: 'Due Today', value: '3', color: colors.error, icon: 'alert-circle' },
          { label: 'Completed', value: '8', color: '#10B981', icon: 'checkmark-done' }, // Emerald green for completed
        ].map((item, index) => (
          <View key={index} style={styles.statCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Ionicons name={item.icon as any} size={22} color={item.color} style={{ opacity: 0.8 }} />
              <Text style={[styles.statNumber, { color: item.color }]}>{item.value}</Text>
            </View>
            <Text style={styles.statLabel} numberOfLines={1}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Active Matters Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Case Files</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={16} color={viewMode === 'list' ? '#FFF' : colors.navy} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'kanban' && styles.toggleBtnActive]}
            onPress={() => setViewMode('kanban')}
          >
            <Ionicons name="grid" size={16} color={viewMode === 'kanban' ? '#FFF' : colors.navy} />
          </TouchableOpacity>
        </View>
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
          <Text style={styles.emptyText}>No active case files found.</Text>
        </View>
      ) : viewMode === 'kanban' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kanbanBoard}>
          {['Draft', 'In Progress', 'Awaiting Review'].map(status => {
            const columnMatters = activeMatters.filter(m => m.status === status);
            return (
              <View key={status} style={styles.kanbanColumn}>
                <View style={styles.kanbanHeader}>
                  <Text style={styles.kanbanTitle}>{status}</Text>
                  <View style={styles.kanbanBadge}>
                    <Text style={styles.kanbanBadgeText}>{columnMatters.length}</Text>
                  </View>
                </View>
                {columnMatters.map(m => (
                  <View key={m.id} style={{ marginBottom: 12 }}>
                    {renderActiveMatter({ item: m })}
                  </View>
                ))}
                {columnMatters.length === 0 && (
                  <View style={styles.kanbanEmpty}>
                    <Text style={styles.kanbanEmptyText}>No cases</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
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
          <Text style={styles.headerSub}>{greeting}, Adv. Priya</Text>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
    width: '48%',
    alignItems: 'flex-start',
    ...cardShadow,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.navy,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
    marginTop: 8,
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
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.gold,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: radius.md,
    padding: 4,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  toggleBtnActive: {
    backgroundColor: colors.navy,
  },
  kanbanBoard: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 16,
  },
  kanbanColumn: {
    width: 280,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.lg,
    padding: 12,
  },
  kanbanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  kanbanTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.navy,
  },
  kanbanBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  kanbanBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  kanbanEmpty: {
    height: 80,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kanbanEmptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
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
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    ...cardShadow,
  },
  taskContent: {
    flex: 1,
  },
  taskDesc: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 4,
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
