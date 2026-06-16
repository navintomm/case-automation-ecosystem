import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { useNotificationsStore } from '../store/notificationsStore';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotificationsStore();
  
  const unreadCount = getUnreadCount();

  const handlePress = (id: string, targetScreen?: string) => {
    markAsRead(id);
    if (targetScreen) {
      router.push(targetScreen as any);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'matter': return <Ionicons name="folder" size={20} color={colors.navy} />;
      case 'task': return <Ionicons name="checkmark-circle" size={20} color={colors.gold} />;
      case 'system': return <Ionicons name="information-circle" size={20} color={colors.textMuted} />;
      default: return <Ionicons name="notifications" size={20} color={colors.navy} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications {unreadCount > 0 && `(${unreadCount})`}</Text>
        <TouchableOpacity 
          style={styles.markBtn} 
          onPress={markAllAsRead}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.markBtnText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>You're all caught up!</Text>
          </View>
        ) : (
          notifications.map(notif => (
            <TouchableOpacity 
              key={notif.id} 
              style={[styles.notificationCard, !notif.read && styles.unreadCard]}
              onPress={() => handlePress(notif.id, notif.navigateTo)}
            >
              <View style={styles.iconBox}>
                {getIconForType(notif.type)}
                {!notif.read && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{notif.title}</Text>
                <Text style={styles.message} numberOfLines={2}>{notif.sub}</Text>
                <Text style={styles.time}>{notif.time}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  markBtn: {
    padding: 4,
  },
  markBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadCard: {
    backgroundColor: '#F8F9FA', // very light grey/blue
    borderColor: 'rgba(201, 150, 58, 0.3)', // subtle gold border
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
    lineHeight: 18,
    marginBottom: 8,
  },
  time: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
  },
});
