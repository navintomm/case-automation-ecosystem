import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, cardShadow } from '../theme/tokens';
import { useClerkStore, Task } from '../store/clerkStore';

type FilterStatus = Task['status'];

const FILTERS: FilterStatus[] = ['Pending', 'In Progress', 'Completed'];

const PRIORITY_BADGE: Record<Task['priority'], { bg: string; text: string }> = {
  Urgent: { bg: '#FDE8E8', text: colors.error },
  High:   { bg: '#FEF3C7', text: colors.warning },
  Normal: { bg: colors.cream, text: colors.textSecond },
};

const STATUS_BADGE: Record<Task['status'], { bg: string; text: string }> = {
  Pending:     { bg: '#FEF3C7', text: '#B45309' },
  'In Progress': { bg: '#DBEAFE', text: '#1D4ED8' },
  Completed:   { bg: '#DCFCE7', text: '#166534' },
};

function ClerkTaskCard({ task, onPress }: { task: Task; onPress: () => void }) {
  const pb = PRIORITY_BADGE[task.priority];
  const sb = STATUS_BADGE[task.status];

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => Alert.alert('Delete', 'Task will be deleted.')}
    >
      <Ionicons name="trash-outline" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={styles.taskCard}
        onPress={onPress}
        accessibilityLabel={`Task: ${task.documentType}`}
        accessibilityRole="button"
      >
        {/* Row 1: doc type + priority badge */}
        <View style={styles.taskRow}>
          <Text style={styles.taskDocType} numberOfLines={1}>{task.documentType}</Text>
          <View style={[styles.badge, { backgroundColor: pb.bg }]}>
            <Text style={[styles.badgeText, { color: pb.text }]}>{task.priority}</Text>
          </View>
        </View>

        {/* Row 2: court */}
        <Text style={styles.taskCourt} numberOfLines={1}>{task.court}</Text>

        {/* Row 3: party names */}
        <Text style={styles.taskParty} numberOfLines={1}>{task.primaryParty}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Row 4: due, by, status */}
        <View style={styles.taskFooter}>
          <View style={styles.taskFooterLeft}>
            <Ionicons name="calendar-outline" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
            <Text style={styles.taskFooterSmall}>Due: {task.deadline}</Text>
          </View>
          <Text style={styles.taskFooterBy} numberOfLines={1}>By: {task.allocatedBy}</Text>
          <View style={[styles.badge, { backgroundColor: sb.bg }]}>
            <Text style={[styles.badgeText, { color: sb.text }]}>{task.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export default function ClerkPortalScreen() {
  const router = useRouter();
  const tasks  = useClerkStore((s) => s.tasks);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('Pending');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filtered = tasks.filter((t) => t.status === activeFilter);

  // Initials for avatar (mock clerk)
  const initials = 'AK';



  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerAppName}>CASE</Text>
            <Text style={styles.headerPortalLabel}>Clerk Portal</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.replace('/')}>
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/clerk-profile' as any)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
              accessibilityRole="button"
              accessibilityLabel={`Filter: ${f}`}
            >
              <Text style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.sortBtn} accessibilityLabel="Sort" accessibilityRole="button">
          <Ionicons name="funnel-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={filtered}
        keyExtractor={(task) => task.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.navy} />
        }
        renderItem={({ item: task }) => (
          <ClerkTaskCard
            task={task}
            onPress={() => router.push(`/clerk-task-detail?id=${task.id}` as any)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No tasks in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },

  // Header
  headerSafe: {
    backgroundColor: colors.navy,
  },
  headerBar: {
    height: Platform.OS === 'ios' ? 56 : 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.navy,
  },
  headerLeft: {
    flex: 1,
  },
  headerAppName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  headerPortalLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },


  // Filter bar
  filterBar: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  filterScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: colors.navy,
  },
  filterPillText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecond,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
  },
  sortBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Task list
  list: {
    flex: 1,
  },
  listContent: {
    padding: 14,
    gap: 12,
    paddingBottom: 32,
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },

  // Task Card
  taskCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskDocType: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    flex: 1,
    marginRight: 8,
  },
  taskCourt: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 4,
  },
  taskParty: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 10,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskFooterSmall: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  taskFooterBy: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 4,
  },

  // Shared badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: radius.md,
    marginBottom: 4,
  },
});
