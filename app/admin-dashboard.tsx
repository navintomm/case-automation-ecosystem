import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, Dimensions, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withTiming, Easing, withSpring } from 'react-native-reanimated';
import { colors, radius } from '../theme/tokens';
import { useAdminStore } from '../store/adminStore';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { LineChart } from 'react-native-chart-kit';
import { useThemeStore } from '../store/themeStore';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { users } = useAdminStore();
  
  const advocateCount = users.filter(u => u.role === 'Advocate').length;
  const clerkCount = users.filter(u => u.role === 'Clerk').length;
  const activeMatters = 124;
  const docsGenerated = 892;

  const { colors, mode } = useThemeStore();
  const styles = useStyles(colors);

  const [refreshing, setRefreshing] = useState(false);
  const headerOpacity = useSharedValue(0);

  const handleMockAction = (feature: string) => {
    Toast.show({
      type: 'info',
      text1: 'Feature in Development',
      text2: `Mock Data: ${feature} coming soon!`,
    });
  };
  
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: withSpring(headerOpacity.value === 1 ? 0 : -20) }]
  }));

  const renderStatCard = (icon: any, value: number | string, label: string, color: string, delay: number) => (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={[styles.statCard, isTablet && styles.statCardTablet]}>
      <View style={[styles.statIconWrapper, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statNum}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <View style={styles.statSparkline}>
        {/* A subtle decorative element simulating a sparkline or trend */}
        <View style={[styles.sparklineDot, { backgroundColor: color }]} />
        <View style={[styles.sparklineLine, { backgroundColor: `${color}40` }]} />
      </View>
    </Animated.View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const auditTrail = [
    { id: 1, action: 'Draft generated', user: 'Adv. Priya Menon', target: 'CC-09', time: '10 mins ago', icon: 'document-text', color: '#10B981' },
    { id: 2, action: 'Task allocated', user: 'Adv. Priya Menon', target: 'Task: File Consumer Complaint -> Clerk Anitha', time: '1 hr ago', icon: 'person-add', color: '#3B82F6' },
    { id: 3, action: 'Party name modified', user: 'Clerk Anitha', target: 'Rajesh P. vs State -> Rajesh P. vs State of Kerala', time: '2 hrs ago', icon: 'create', color: '#F59E0B' },
    { id: 4, action: 'Matter opened', user: 'Adv. Arun Nair', target: 'Divorce Petition: Anjali R.', time: '5 hrs ago', icon: 'folder-open', color: '#8B5CF6' },
    { id: 5, action: 'WhatsApp Alert sent', user: 'System', target: 'Hearing Reminder -> Adv. Arun Nair', time: '1 day ago', icon: 'logo-whatsapp', color: '#25D366' },
  ];

  const ListHeader = (
    <View style={styles.scrollContent}>
        
        {/* Premium Header */}
        <Animated.View style={headerStyle}>
          <LinearGradient
            colors={['#4C1D95', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerDate}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
                <Text style={styles.headerTitle}>Admin Console</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <TouchableOpacity style={styles.profileBtn} onPress={() => router.replace('/')}>
                  <View style={[styles.profileAvatar, { backgroundColor: 'transparent', borderColor: 'transparent' }]}>
                    <Ionicons name="log-out-outline" size={28} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/admin-profile' as any)}>
                  <View style={styles.profileAvatar}>
                    <Text style={styles.profileInitials}>AD</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.headerBottom}>
              <Text style={styles.headerGreeting}>Welcome back, System Administrator</Text>
              <Text style={styles.headerSubGreeting}>All systems are operating normally.</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* System Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>System Overview</Text>
        </View>
        <View style={styles.statsGrid}>
          {renderStatCard('people', advocateCount, 'Advocates', '#3B82F6', 100)}
          {renderStatCard('clipboard', clerkCount, 'Clerks', '#F59E0B', 200)}
          {renderStatCard('folder-open', activeMatters, 'Active Matters', '#8B5CF6', 300)}
          {renderStatCard('document-text', docsGenerated, 'Docs Generated', '#10B981', 400)}
        </View>

        {/* Quick Links */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickLinksGrid}>
            <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/admin-users' as any)}>
              <View style={[styles.qlIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="person-add" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.qlText}>Users</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/knowledge-repository' as any)}>
              <View style={[styles.qlIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="library" size={24} color="#D97706" />
              </View>
              <Text style={styles.qlText}>Knowledge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickLinkItem} onPress={() => handleMockAction('Audit Logs')}>
              <View style={[styles.qlIconBox, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="list" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.qlText}>Audit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickLinkItem} onPress={() => handleMockAction('Server Management')}>
              <View style={[styles.qlIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="server" size={24} color="#059669" />
              </View>
              <Text style={styles.qlText}>Servers</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Analytics Section */}
        <Animated.View entering={FadeInDown.delay(550).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Office Productivity Dashboard</Text>
          </View>
          <Text style={{ fontFamily: 'Inter_500Medium', color: colors.textMuted, marginHorizontal: 20, marginBottom: 12 }}>Document Generation Trends (This Month)</Text>
          <View style={[styles.statCard, { padding: 8, marginBottom: 24 }]}>
            <LineChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{ data: [12, 19, 15, 25, 22, 30, 45] }]
              }}
              width={isTablet ? width - 80 : width - 56}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(154, 163, 178, ${opacity})`,
                propsForDots: { r: "5", strokeWidth: "2", stroke: "#7C3AED" },
                propsForBackgroundLines: { stroke: "#E2E0DA", strokeDasharray: "" }
              }}
              bezier
              style={{ borderRadius: 16 }}
            />
          </View>

          <Text style={{ fontFamily: 'Inter_500Medium', color: colors.textMuted, marginHorizontal: 20, marginBottom: 12 }}>Advocate Workload (Active Matters)</Text>
          <View style={[styles.statCard, { padding: 8, marginBottom: 24 }]}>
            <LineChart
              data={{
                labels: ["Adv. Priya", "Adv. Arun", "Adv. Rajesh", "Adv. Meena"],
                datasets: [{ data: [14, 8, 22, 5] }]
              }}
              width={isTablet ? width - 80 : width - 56}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(154, 163, 178, ${opacity})`,
                propsForDots: { r: "5", strokeWidth: "2", stroke: "#3B82F6" },
                propsForBackgroundLines: { stroke: "#E2E0DA", strokeDasharray: "" },
                fillShadowGradient: "#3B82F6",
                fillShadowGradientOpacity: 0.2,
              }}
              style={{ borderRadius: 16 }}
            />
          </View>
        </Animated.View>

        {/* Recent Activity Timeline */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>System Audit Trail</Text>
            <TouchableOpacity onPress={() => handleMockAction('View Full Audit Log')}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timelineContainer}>
            {auditTrail.map((act, idx, arr) => (
              <Animated.View entering={FadeInRight.delay(700 + (idx * 100))} key={act.id} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineIconBox, { backgroundColor: `${act.color}15`, borderColor: `${act.color}30` }]}>
                    <Ionicons name={act.icon as any} size={16} color={act.color} />
                  </View>
                  {idx !== arr.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineContentHeader}>
                    <Text style={styles.timelineAction}>{act.action}</Text>
                    <Text style={styles.timelineTime}>{act.time}</Text>
                  </View>
                  <Text style={styles.timelineTarget}>{act.target}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[] as any[]} // empty data, we render everything in header for now, or we could render activities here
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />}
      />
    </SafeAreaView>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  scrollContent: {
    paddingBottom: 100, // space for global tabs
  },
  headerGradient: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 12 : 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerDate: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#FFFFFF',
  },
  profileBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInitials: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#7C3AED',
  },
  headerBottom: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  headerGreeting: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubGreeting: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1E293B',
  },
  sectionAction: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#7C3AED',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: isTablet ? '23%' : '46%',
    backgroundColor: colors.cardBg,
    borderRadius: radius.xl,
    padding: 20,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
  },
  statCardTablet: {
    minWidth: 160,
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statContent: {
    zIndex: 2,
  },
  statNum: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
  },
  statSparkline: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6,
  },
  sparklineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sparklineLine: {
    width: 24,
    height: 2,
    marginLeft: 4,
    borderRadius: 1,
  },
  quickLinksGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  quickLinkItem: {
    alignItems: 'center',
    width: '22%',
  },
  qlIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  qlText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
  },
  activitySection: {
    marginBottom: 24,
  },
  timelineContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.xl,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
    minHeight: 24,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
    paddingTop: 4,
  },
  timelineContentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineAction: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
  timelineTime: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  timelineTarget: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    lineHeight: 18,
  },
});
