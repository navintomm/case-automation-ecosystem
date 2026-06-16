import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors, radius } from '../theme/tokens';
import { useClerkStore, Task, ClerkNote } from '../store/clerkStore';

type TaskStatus = Task['status'];

const STATUS_CONFIG: Record<TaskStatus, { activeColor: string; activeText: string }> = {
  Pending:       { activeColor: '#D97706', activeText: '#FFFFFF' },
  'In Progress': { activeColor: '#2563EB', activeText: '#FFFFFF' },
  Completed:     { activeColor: '#22843F', activeText: '#FFFFFF' },
};

const PRIORITY_BADGE: Record<Task['priority'], { bg: string; text: string }> = {
  Urgent: { bg: '#FDE8E8', text: colors.error },
  High:   { bg: '#FEF3C7', text: colors.warning },
  Normal: { bg: colors.cream, text: colors.textSecond },
};

export default function ClerkTaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const tasks           = useClerkStore((s) => s.tasks);
  const updateTaskStatus = useClerkStore((s) => s.updateTaskStatus);
  const addNoteToTask   = useClerkStore((s) => s.addNoteToTask);

  const task = tasks.find((t) => t.id === id);

  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task?.status ?? 'Pending');
  const [noteText, setNoteText]             = useState('');
  const [localNotes, setLocalNotes]         = useState<ClerkNote[]>(task?.notes ?? []);

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Task not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pb = PRIORITY_BADGE[task.priority];

  const handleSendNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;

    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')}.${now.getFullYear()} · ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const newNote: ClerkNote = { text: trimmed, timestamp };
    setLocalNotes((prev) => [...prev, newNote]);
    addNoteToTask(task.id, newNote);
    setNoteText('');
  };

  const handleSave = () => {
    updateTaskStatus(task.id, selectedStatus);
    Toast.show({
      type: 'success',
      text1: 'Updated successfully',
      text2: `Status set to "${selectedStatus}"`,
      position: 'bottom',
      visibilityTime: 3000,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{task.documentType}</Text>
          <View style={[styles.headerPriorityBadge, { backgroundColor: pb.bg }]}>
            <Text style={[styles.headerPriorityText, { color: pb.text }]}>{task.priority}</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section 1 — Task Info */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Task Information</Text>

            <InfoRow label="Document Type"  value={task.documentType} />
            <InfoRow label="Court"          value={task.court} />
            <InfoRow label="Parties"        value={task.primaryParty} />
            <InfoRow label="Allocated By"   value={task.allocatedBy} />
            <InfoRow label="Allocated On"   value={task.allocatedAt} />
            <InfoRow label="Filing Deadline" value={task.deadline} isLast />
          </View>

          {/* Section 2 — Instructions */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Advocate's Instructions</Text>
            <Text style={styles.instructionsText}>{task.instructions}</Text>
          </View>

          {/* Section 3 — Status Update */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Update Status</Text>
            <View style={styles.statusRow}>
              {(['Pending', 'In Progress', 'Completed'] as TaskStatus[]).map((s) => {
                const isActive = selectedStatus === s;
                const cfg = STATUS_CONFIG[s];
                return (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusPill,
                      isActive
                        ? { backgroundColor: cfg.activeColor }
                        : styles.statusPillInactive,
                    ]}
                    onPress={() => setSelectedStatus(s)}
                    accessibilityRole="button"
                    accessibilityLabel={`Set status to ${s}`}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isActive ? { color: cfg.activeText } : styles.statusPillTextInactive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 4 — Notes */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes to Advocate</Text>

            {/* Existing notes */}
            {localNotes.length === 0 ? (
              <Text style={styles.noNotesText}>No notes yet. Add one below.</Text>
            ) : (
              <View style={styles.notesList}>
                {localNotes.map((note, idx) => (
                  <View key={idx} style={styles.noteBubble}>
                    <Text style={styles.noteText}>{note.text}</Text>
                    <Text style={styles.noteTimestamp}>{note.timestamp}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Input row */}
            <View style={styles.noteInputRow}>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note…"
                placeholderTextColor={colors.textMuted}
                value={noteText}
                onChangeText={setNoteText}
                returnKeyType="send"
                onSubmitEditing={handleSendNote}
                accessibilityLabel="Add a note"
                {...Platform.select({ web: { outlineStyle: 'none' } })}
              />
              <TouchableOpacity
                style={[styles.sendBtn, !noteText.trim() && styles.sendBtnDisabled]}
                onPress={handleSendNote}
                disabled={!noteText.trim()}
                accessibilityLabel="Send note"
                accessibilityRole="button"
              >
                <Ionicons name="send" size={18} color={noteText.trim() ? colors.gold : colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            accessibilityLabel="Save Changes"
            accessibilityRole="button"
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Info Row sub-component ───────────────────────────────────────────────────
function InfoRow({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[infoStyles.row, !isLast && infoStyles.rowBorder]}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    flex: 1,
  },
  value: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
});

// ─── Main styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 16,
  },
  backLink: { padding: 8 },
  backLinkText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },

  // Header
  headerSafe: {
    backgroundColor: colors.navy,
  },
  headerBar: {
    height: Platform.OS === 'ios' ? 56 : 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.navy,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  headerPriorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  headerPriorityText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    padding: 14,
    paddingBottom: 16,
    gap: 14,
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 12,
  },

  // Instructions
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // Status
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusPill: {
    flex: 1,
    height: 38,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusPillInactive: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusPillText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  statusPillTextInactive: {
    color: colors.textSecond,
  },

  // Notes
  noNotesText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  notesList: {
    gap: 10,
    marginBottom: 14,
  },
  noteBubble: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: 12,
  },
  noteText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    lineHeight: 19,
    marginBottom: 4,
  },
  noteTimestamp: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  noteInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingLeft: 16,
    paddingRight: 6,
    height: 46,
  },
  noteInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    height: '100%',
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.goldLighter,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: 'transparent',
  },

  // Save button footer
  saveContainer: {
    padding: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    width: '100%',
    height: 50,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
});
