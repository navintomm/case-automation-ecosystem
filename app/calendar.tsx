import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, cardShadow } from '../theme/tokens';
import { useMattersStore } from '../store/mattersStore';

export default function CalendarScreen() {
  const router = useRouter();
  const { matters } = useMattersStore();
  
  // Find today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Map matters to calendar marks
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    
    matters.forEach(m => {
      if (m.nextHearingDate) {
        const dateStr = m.nextHearingDate;
        
        // Color coding logic
        const hearingDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0,0,0,0);
        hearingDate.setHours(0,0,0,0);
        
        const diffTime = hearingDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let dotColor = '#10B981'; // Green (comfortable)
        if (diffDays <= 1) {
          dotColor = colors.error; // Red (today/tomorrow)
        } else if (diffDays <= 7) {
          dotColor = colors.warning; // Amber (this week)
        }

        if (!marks[dateStr]) {
          marks[dateStr] = { dots: [] };
        }
        
        marks[dateStr].dots.push({ color: dotColor, key: m.id });
      }
    });

    // Mark the currently selected date
    if (!marks[selectedDate]) {
      marks[selectedDate] = {};
    }
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: colors.navy,
    };

    return marks;
  }, [matters, selectedDate]);

  // Matters for the selected date
  const selectedMatters = useMemo(() => {
    return matters.filter(m => m.nextHearingDate === selectedDate);
  }, [matters, selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hearing Calendar</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.calendarContainer}>
          <Calendar
            current={todayStr}
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markingType={'multi-dot'}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: colors.navy,
              selectedDayBackgroundColor: colors.navy,
              selectedDayTextColor: '#ffffff',
              todayTextColor: colors.gold,
              dayTextColor: colors.textPrimary,
              textDisabledColor: '#d9e1e8',
              dotColor: colors.gold,
              selectedDotColor: '#ffffff',
              arrowColor: colors.gold,
              monthTextColor: colors.navy,
              indicatorColor: colors.gold,
              textDayFontFamily: 'Inter_400Regular',
              textMonthFontFamily: 'Inter_600SemiBold',
              textDayHeaderFontFamily: 'Inter_500Medium',
            }}
          />
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            Hearings on {new Date(selectedDate).toLocaleDateString()}
          </Text>

          {selectedMatters.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-clear-outline" size={32} color={colors.textMuted} />
              <Text style={styles.emptyText}>No hearings scheduled for this date.</Text>
            </View>
          ) : (
            selectedMatters.map(m => (
              <TouchableOpacity key={m.id} style={styles.matterCard} onPress={() => router.push('/matter-detail')}>
                <View style={styles.matterHeader}>
                  <Text style={styles.matterTitle} numberOfLines={1}>{m.title}</Text>
                  <View style={[styles.priorityBadge, m.priority === 'Urgent' && { backgroundColor: colors.error }]}>
                    <Text style={styles.priorityText}>{m.priority}</Text>
                  </View>
                </View>
                <View style={styles.matterBody}>
                  <Text style={styles.courtText}><Ionicons name="business" size={12}/> {m.court || 'Court not specified'}</Text>
                  <Text style={styles.typeText}><Ionicons name="document-text" size={12}/> {m.documentType}</Text>
                </View>
              </TouchableOpacity>
            ))
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
  header: {
    backgroundColor: colors.navy,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  container: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: radius.lg,
    padding: 8,
    ...cardShadow,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  matterCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: radius.lg,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    ...cardShadow,
  },
  matterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  matterTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  matterBody: {
    gap: 4,
  },
  courtText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  typeText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
});
