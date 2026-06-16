import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { useAdminStore } from '../store/adminStore';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export default function AdminUsersScreen() {
  const router = useRouter();
  const { users, addUser, updateUserStatus } = useAdminStore();
  
  const [filter, setFilter] = useState<'All' | 'Advocates' | 'Clerks' | 'Suspended'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Advocate' | 'Clerk'>('Advocate');

  const filteredUsers = users.filter(u => {
    if (filter === 'All') return true;
    if (filter === 'Advocates') return u.role === 'Advocate' && u.status !== 'Suspended';
    if (filter === 'Clerks') return u.role === 'Clerk' && u.status !== 'Suspended';
    if (filter === 'Suspended') return u.status === 'Suspended';
    return true;
  });

  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    
    addUser({
      id: `USR-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Active',
      lastActive: 'Just now',
    });
    
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewRole('Advocate');
    
    Toast.show({
      type: 'success',
      text1: 'User Added',
      text2: `${newName} has been added as ${newRole}.`,
      position: 'top',
    });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    updateUserStatus(id, newStatus as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['All', 'Advocates', 'Clerks', 'Suspended'] as const).map(f => (
            <TouchableOpacity 
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* User List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No users found in this category.</Text>
          </View>
        ) : (
          filteredUsers.map(user => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <View style={[styles.statusBadge, user.status === 'Suspended' && styles.statusBadgeSuspended]}>
                  <Text style={[styles.statusText, user.status === 'Suspended' && styles.statusTextSuspended]}>
                    {user.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.userFooter}>
                <View style={styles.userMeta}>
                  <Text style={styles.userRole}>{user.role}</Text>
                  <Text style={styles.userActive}>• Last active: {user.lastActive}</Text>
                </View>
                
                <View style={styles.userActions}>
                  <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="create-outline" size={18} color={colors.navy} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.iconBtn}
                    onPress={() => handleToggleStatus(user.id, user.status)}
                  >
                    <Ionicons 
                      name={user.status === 'Active' ? "ban-outline" : "checkmark-circle-outline"} 
                      size={18} 
                      color={user.status === 'Active' ? colors.error : colors.success} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>Add User</Text>
      </TouchableOpacity>

      {/* Add User Modal */}
      {showAddModal && (
        <>
          <View style={styles.backdrop} />
          <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.bottomSheet}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Add New User</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Arun Nair"
                value={newName}
                onChangeText={setNewName}
              />

              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="arun@lawfirm.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={newEmail}
                onChangeText={setNewEmail}
              />

              <Text style={styles.label}>Role</Text>
              <View style={styles.roleRow}>
                {(['Advocate', 'Clerk'] as const).map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleBtn, newRole === r && styles.roleBtnActive]}
                    onPress={() => setNewRole(r)}
                  >
                    <Text style={[styles.roleBtnText, newRole === r && styles.roleBtnTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={[styles.submitBtn, (!newName || !newEmail) && { opacity: 0.5 }]}
                onPress={handleAddUser}
                disabled={!newName || !newEmail}
              >
                <Text style={styles.submitBtnText}>Create User</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  backBtn: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  filterStrip: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderColor: '#7C3AED',
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecond,
  },
  filterChipTextActive: {
    color: '#7C3AED',
    fontFamily: 'Inter_600SemiBold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  statusBadge: {
    backgroundColor: '#EAFCEF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.success,
  },
  statusBadgeSuspended: {
    backgroundColor: '#FDE8E8',
  },
  statusTextSuspended: {
    color: colors.error,
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  userActive: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginLeft: 8,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: radius.full,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    zIndex: 11,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    ...Platform.select({ web: { outlineStyle: 'none' as any } }),
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderColor: '#7C3AED',
  },
  roleBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
  },
  roleBtnTextActive: {
    color: '#7C3AED',
    fontFamily: 'Inter_600SemiBold',
  },
  submitBtn: {
    backgroundColor: '#7C3AED',
    height: 52,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  submitBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
});
