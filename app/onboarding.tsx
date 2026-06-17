import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '../store/onboardingStore';
import { colors, radius } from '../theme/tokens';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation,
  withSpring,
  FadeInDown,
  FadeInRight,
  FadeInLeft,
  ZoomIn
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'scale',
    iconColor: '#C9963A',
    accentColor: '#C9963A',
    tag: 'Welcome',
    title: 'Welcome to CASE',
    subtitle: 'Case Automation & Smart Ecosystem',
    description: 'The complete AI-powered legal drafting workspace built exclusively for advocates. Prepare court-ready documents in minutes, not hours.',
  },
  {
    id: '2',
    icon: 'document-text',
    iconColor: '#C9963A',
    accentColor: '#C9963A',
    tag: 'Step-by-Step Drafting',
    title: 'Draft with AI',
    subtitle: 'Four simple steps to a complete filing package',
    description: 'Enter basic details, upload documents, describe your strategy, and select companion documents. CASE handles the rest — formatting, numbering, and court-specific conventions included.',
  },
  {
    id: '3',
    icon: 'chatbubble-ellipses',
    iconColor: '#C9963A',
    accentColor: '#C9963A',
    tag: 'AI Assistant',
    title: 'Meet ADVISOR',
    subtitle: 'Your context-aware legal AI',
    description: 'ADVISOR reads your case details in real time and answers your questions — court fee, limitation periods, missing documents, interim relief — all specific to your matter.',
  },
  {
    id: '4',
    icon: 'shield-checkmark',
    iconColor: '#22843F',
    accentColor: '#22843F',
    tag: 'Smart Verification',
    title: 'Verified Before Generated',
    subtitle: 'No draft leaves without a full audit',
    description: 'The Smart Verification Engine checks every matter for missing information, limitation issues, jurisdictional concerns, and filing defects before a single word is drafted.',
  },
  {
    id: '5',
    icon: 'library',
    iconColor: '#2563EB',
    accentColor: '#2563EB',
    tag: 'Knowledge Repository',
    title: 'Your Office Never Forgets',
    subtitle: 'Institutional memory that grows over time',
    description: 'Every filing defect, registry objection, and court practice your office encounters is stored and reused. ADVISOR learns from your experience to protect every future matter.',
  },
];

// --- Custom Illustrations ---

const Illus1 = () => (
  <View style={styles.illusCenter}>
    <Ionicons name="scale" size={200} color={colors.navy} style={{ position: 'absolute', opacity: 0.06 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {['Writ Petition', 'Bail App', 'Complaint'].map((doc, i) => (
        <Animated.View 
          entering={ZoomIn.delay(i * 300).springify()}
          key={i} 
          style={[styles.docCard, { 
            position: i === 1 ? 'relative' : 'absolute',
            zIndex: i === 1 ? 2 : 1,
            transform: [
              { rotate: `${(i - 1) * 12}deg` }, 
              { translateY: Math.abs(i - 1) * 15 },
              { translateX: (i - 1) * 30 }
            ] 
          }]}
        >
          <View style={styles.docPill}><Text style={styles.docPillText}>{doc}</Text></View>
          <View style={styles.docLine} />
          <View style={styles.docLine} />
          <View style={[styles.docLine, { width: '60%' }]} />
        </Animated.View>
      ))}
    </View>
  </View>
);

const Illus2 = () => (
  <View style={styles.illusCenterRow}>
    {[1, 2, 3, 4].map((step, i) => (
      <React.Fragment key={i}>
        <Animated.View entering={ZoomIn.delay(i * 200)} style={styles.stepCol}>
          <View style={[styles.stepNode, i === 0 && styles.stepNodeActive]}>
            <Text style={[styles.stepNodeText, i === 0 && { color: '#FFF' }]}>{step}</Text>
          </View>
          <Text style={styles.stepLabel}>Step {step}</Text>
        </Animated.View>
        {i < 3 && (
          <Animated.View entering={FadeInRight.delay(i * 200)} style={styles.stepLine} />
        )}
      </React.Fragment>
    ))}
  </View>
);

const Illus3 = () => (
  <View style={styles.illusCenterCol}>
    <Animated.View entering={FadeInDown.delay(200)} style={styles.chatUser}>
      <Text style={styles.chatUserText}>Do I need a delay condonation petition?</Text>
    </Animated.View>
    <Animated.View entering={FadeInDown.delay(600)} style={styles.chatAdvisor}>
      <Text style={styles.chatAdvisorLabel}>ADVISOR</Text>
      <Text style={styles.chatAdvisorText}>Yes — your chronology shows a 45-day gap. Court requires condonation for gaps over 30 days.</Text>
    </Animated.View>
  </View>
);

const Illus4 = () => (
  <View style={styles.illusCenterCol}>
    {['Party details complete', 'Limitation checked'].map((t, i) => (
      <Animated.View entering={FadeInLeft.delay(i * 200)} key={i} style={styles.verifyRow}>
        <Ionicons name="checkmark-circle" size={20} color="#22843F" />
        <Text style={styles.verifyText}>{t}</Text>
      </Animated.View>
    ))}
    <Animated.View entering={FadeInRight.delay(600).springify()} style={[styles.verifyRow, { borderColor: '#F59E0B' }]}>
      <Ionicons name="warning" size={20} color="#F59E0B" />
      <Text style={[styles.verifyText, { color: '#F59E0B' }]}>Cause of action missing</Text>
    </Animated.View>
  </View>
);

const Illus5 = () => (
  <View style={styles.illusGrid}>
    {[
      { label: 'Filing Defects', color: '#EF4444', icon: 'document-attach' },
      { label: 'Court Practices', color: '#1B2A4A', icon: 'business' },
      { label: 'Drafting Lessons', color: '#8B5CF6', icon: 'pencil' },
      { label: 'Office Rules', color: '#10B981', icon: 'shield-checkmark' }
    ].map((item, i) => (
      <Animated.View entering={ZoomIn.delay(i * 150)} key={i} style={[styles.gridCard, { borderLeftColor: item.color }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
        <Text style={styles.gridCardText}>{item.label}</Text>
      </Animated.View>
    ))}
  </View>
);

const getIllustration = (id: string) => {
  switch (id) {
    case '1': return <Illus1 />;
    case '2': return <Illus2 />;
    case '3': return <Illus3 />;
    case '4': return <Illus4 />;
    case '5': return <Illus5 />;
    default: return null;
  }
};

const Slide = ({ slide, index, scrollX }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP);
    const scale = interpolate(scrollX.value, inputRange, [0.92, 1, 0.92], Extrapolation.CLAMP);
    
    return {
      opacity,
      transform: [{ scale }]
    };
  });

  return (
    <Animated.View style={[styles.slideContainer, animatedStyle]}>
      <ScrollView 
        contentContainerStyle={styles.slideInner}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Illustration Zone */}
        <View style={styles.illustrationZone}>
          {getIllustration(slide.id)}
        </View>

        {/* Text Zone */}
        <View style={styles.textZone}>
          <View style={[styles.tagPill, { backgroundColor: slide.accentColor + '15', borderColor: slide.accentColor + '30' }]}>
            <Text style={[styles.tagPillText, { color: slide.accentColor }]}>{slide.tag}</Text>
          </View>

          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useOnboardingStore(s => s.completeOnboarding);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const scrollX = useSharedValue(0);
  const interactionStarted = useRef(false);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!interactionStarted.current && currentIndex < SLIDES.length - 1) {
        const nextIndex = currentIndex + 1;
        flatListRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    interactionStarted.current = true;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandText}>CASE</Text>
          <View style={styles.brandLine} />
        </View>
        <TouchableOpacity onPress={handleFinish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef as any}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <Slide slide={item} index={index} scrollX={scrollX} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => { interactionStarted.current = true; }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => {
              const isActive = Math.round(scrollX.value / width) === index;
              return {
                width: withSpring(isActive ? 24 : 6),
                backgroundColor: isActive ? colors.gold : colors.border,
              };
            });
            return <Animated.View key={index} style={[styles.dot, dotStyle]} />;
          })}
        </View>

        <TouchableOpacity 
          style={[styles.nextBtn, currentIndex === SLIDES.length - 1 && styles.nextBtnFinish]} 
          onPress={handleNext}
        >
          <Text style={[styles.nextBtnText, currentIndex === SLIDES.length - 1 && { color: colors.navy }]}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons 
            name={currentIndex === SLIDES.length - 1 ? 'checkmark' : 'arrow-forward'} 
            size={18} 
            color={currentIndex === SLIDES.length - 1 ? colors.navy : '#FFFFFF'} 
            style={{ marginLeft: 6 }} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 10,
  },
  brandText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: colors.navy,
  },
  brandLine: {
    height: 3,
    width: 20,
    backgroundColor: colors.gold,
    marginTop: 4,
    borderRadius: 2,
  },
  skipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.textMuted,
  },
  slideContainer: {
    width,
    flex: 1,
    paddingBottom: 120, // Make extra room for footer on all devices
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideInner: {
    width: '100%',
    maxWidth: 500,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  illustrationZone: {
    flex: 1,
    minHeight: 120,
    maxHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textZone: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    paddingTop: 8,
  },
  tagPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  tagPillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 26,
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#C9963A',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#5A6478',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '100%',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F5F0',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  nextBtn: {
    backgroundColor: colors.navy,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextBtnFinish: {
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  nextBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  // Illustration Styles
  illusCenter: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docCard: {
    backgroundColor: '#FFF',
    width: 110,
    height: 140,
    borderRadius: radius.md,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docPill: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  docPillText: {
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  docLine: {
    height: 4,
    backgroundColor: '#E2E0DA',
    borderRadius: 2,
    marginBottom: 8,
    width: '90%',
  },
  illusCenterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  stepCol: {
    alignItems: 'center',
    width: 32,
  },
  stepNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepNodeActive: {
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  stepNodeText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: colors.gold,
  },
  stepLabel: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
    marginTop: 8,
    width: 50,
    textAlign: 'center',
    position: 'absolute',
    top: 36,
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.gold,
    opacity: 0.5,
    marginTop: 16,
    marginHorizontal: -2,
  },
  illusCenterCol: {
    width: '100%',
    paddingHorizontal: 30,
    gap: 16,
  },
  chatUser: {
    backgroundColor: colors.navy,
    padding: 14,
    borderRadius: radius.lg,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  chatUserText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  chatAdvisor: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: radius.lg,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  chatAdvisorLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: colors.gold,
    marginBottom: 6,
  },
  chatAdvisorText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: radius.md,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verifyText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  illusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  gridCard: {
    backgroundColor: '#FFF',
    width: '45%',
    padding: 16,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  gridCardText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  }
});
