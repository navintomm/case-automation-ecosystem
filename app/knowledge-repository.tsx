import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors, radius } from '../theme/tokens';
import { useKnowledgeStore, KnowledgeEntry } from '../store/knowledgeStore';
import { useClerkStore } from '../store/clerkStore';

const FILTER_OPTIONS = [
  'All',
  'Court Practices',
  'Filing Defects',
  'Registry Objections',
  'Drafting Lessons',
  'Litigation Lessons',
  'Office Practices',
  'Procedural Variations',
];

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  'Court Practices':       { bg: colors.navy,      text: '#FFFFFF' },
  'Filing Defects':        { bg: colors.error,     text: '#FFFFFF' },
  'Registry Objections':   { bg: colors.warning,   text: '#FFFFFF' },
  'Drafting Lessons':      { bg: '#7C3AED',         text: '#FFFFFF' },
  'Litigation Lessons':    { bg: '#B45309',         text: '#FFFFFF' },
  'Office Practices':      { bg: colors.verified,   text: '#FFFFFF' },
  'Procedural Variations': { bg: '#0891B2',         text: '#FFFFFF' },
};

const FREQUENCY_ICONS: Record<string, string> = {
  Always: '🔴',
  Frequent: '🟠',
  Occasional: '🟡',
  Rare: '⚪',
};

export default function KnowledgeRepositoryScreen() {
  const router = useRouter();
  const { entries, activeFilter, searchQuery, setFilter, setSearch, deleteEntry } =
    useKnowledgeStore();
  const { activeRole } = useClerkStore();

  // Redirect clerks
  React.useEffect(() => {
    if (activeRole === 'clerk') {
      router.replace('/clerk-portal' as any);
    }
  }, [activeRole]);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtered entries (computed)
  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesFilter = activeFilter === 'All' || e.category === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.court.toLowerCase().includes(q) ||
        e.caseType.toLowerCase().includes(q) ||
        e.recommendation.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [entries, activeFilter, searchQuery]);

  const handleDelete = (entry: KnowledgeEntry) => {
    // BUG-012: Confirm before destructive action
    const doDelete = () => {
      deleteEntry(entry.id);
      Toast.show({
        type: 'success',
        text1: 'Entry Deleted',
        text2: `"${entry.title.slice(0, 40)}..." has been removed.`,
        position: 'bottom',
        visibilityTime: 2500,
      });
    };

    if (Platform.OS === 'web') {
      // web: use native browser confirm
      if (window.confirm(`Delete "${entry.title.slice(0, 60)}"?\nThis action cannot be undone.`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Delete Entry',
        `Delete "${entry.title.slice(0, 60)}"? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  const handleEdit = (entry: KnowledgeEntry) => {
    router.push({ pathname: '/knowledge-add', params: { id: entry.id } } as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Knowledge Repository</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/knowledge-add' as any)}
            accessibilityLabel="Add new knowledge entry"
          >
            <Text style={styles.addBtnText}>+ Add Entry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Search + Filters */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputRow}>
          <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by court, case type, keyword..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
            {...Platform.select({ web: { outlineStyle: 'none' } })}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTER_OPTIONS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {/* Entries List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No entries found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter, or add a new entry.
            </Text>
          </View>
        ) : (
          filtered.map((entry) => (
            <KnowledgeCard
              key={entry.id}
              entry={entry}
              expanded={expandedId === entry.id}
              onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              onEdit={() => handleEdit(entry)}
              onDelete={() => handleDelete(entry)}
            />
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Knowledge Card ───────────────────────────────────────────────────────────

interface KnowledgeCardProps {
  entry: KnowledgeEntry;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function KnowledgeCard({ entry, expanded, onToggle, onEdit, onDelete }: KnowledgeCardProps) {
  const catStyle = CATEGORY_STYLES[entry.category] ?? { bg: colors.navy, text: '#FFFFFF' };

  return (
    <View style={cardStyles.card}>
      {/* Top Row: Category + Court badges */}
      <View style={cardStyles.badgeRow}>
        <View style={[cardStyles.categoryBadge, { backgroundColor: catStyle.bg }]}>
          <Text style={[cardStyles.categoryBadgeText, { color: catStyle.text }]}>
            {entry.category}
          </Text>
        </View>
        <View style={cardStyles.courtBadge}>
          <Text style={cardStyles.courtBadgeText} numberOfLines={1}>
            {entry.court}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={cardStyles.title}>{entry.title}</Text>
      <Text style={cardStyles.subtitle}>
        {entry.court} · {entry.caseType}
      </Text>

      {/* Divider */}
      <View style={cardStyles.divider} />

      {/* Recommendation */}
      <Text style={cardStyles.recommendation} numberOfLines={expanded ? undefined : 3}>
        {entry.recommendation}
      </Text>
      <TouchableOpacity onPress={onToggle} style={cardStyles.readMoreBtn}>
        <Text style={cardStyles.readMoreText}>{expanded ? 'Show less' : 'Read more'}</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={cardStyles.divider} />

      {/* Footer Meta */}
      <View style={cardStyles.metaRow}>
        <View style={cardStyles.metaItem}>
          <Ionicons name="warning-outline" size={12} color={colors.warning} />
          <Text style={cardStyles.metaText}>
            {FREQUENCY_ICONS[entry.frequency]} {entry.frequency}
          </Text>
        </View>
        <View style={cardStyles.metaItem}>
          <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
          <Text style={cardStyles.metaText}>{entry.recordedAt}</Text>
        </View>
        <View style={cardStyles.metaItem}>
          <Ionicons name="person-outline" size={12} color={colors.textMuted} />
          <Text style={cardStyles.metaText}>{entry.recordedBy}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={cardStyles.actionsRow}>
        <TouchableOpacity style={cardStyles.editBtn} onPress={onEdit}>
          <Ionicons name="pencil-outline" size={13} color={colors.navy} />
          <Text style={cardStyles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cardStyles.deleteBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={13} color={colors.error} />
          <Text style={cardStyles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  headerSafe: { backgroundColor: colors.navy },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.navyLight,
  },
  backBtn: { width: 36, justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  addBtn: { alignItems: 'flex-end' },
  addBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  filtersRow: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  filterPill: {
    height: 32,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterPillText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecond,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  resultsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  scrollContent: { paddingHorizontal: 16 },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecond,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    }),
  },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  categoryBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  courtBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  courtBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 10 },
  recommendation: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    lineHeight: 21,
    marginBottom: 6,
  },
  readMoreBtn: { marginBottom: 10 },
  readMoreText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.gold,
  },
  metaRow: { flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  actionsRow: { flexDirection: 'row', gap: 10 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.navy,
    backgroundColor: '#FFFFFF',
  },
  editBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  deleteBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.error,
  },
});
