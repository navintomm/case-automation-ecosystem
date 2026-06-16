import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Animated,
  KeyboardAvoidingView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { colors, radius } from '../../theme/tokens';
import { useAdvisorStore, AdvisorMessage, mockReplies } from '../../store/advisorStore';
import { useCaseStore } from '../../store/caseStore';

// ─── Suggested Questions ──────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  'Is delay condonation needed?',
  'Which documents are missing?',
  'What court fee applies?',
  'Should I seek interim relief?',
  'Any limitation issue?',
  'What companion docs do I need?',
];

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const animate = (val: typeof dot1, delay: number) => {
      val.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0.3, { duration: 300 })
          ),
          -1,
          false
        )
      );
    };
    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View style={typingStyles.container}>
      <View style={typingStyles.bubble}>
        <Text style={typingStyles.label}>ADVISOR</Text>
        <View style={typingStyles.dots}>
          <Reanimated.View style={[typingStyles.dot, dot1Style]} />
          <Reanimated.View style={[typingStyles.dot, dot2Style]} />
          <Reanimated.View style={[typingStyles.dot, dot3Style]} />
        </View>
      </View>
    </View>
  );
}

const typingStyles = StyleSheet.create({
  container: { paddingHorizontal: 12, marginBottom: 8, alignItems: 'flex-start' },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderBottomLeftRadius: 4,
    padding: 12,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
    marginBottom: 6,
  },
  dots: { flexDirection: 'row', gap: 5, paddingVertical: 2 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
});

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: AdvisorMessage }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <View style={bubbleStyles.userRow}>
        <View style={bubbleStyles.userBubble}>
          <Text style={bubbleStyles.userText}>{msg.text}</Text>
        </View>
        <Text style={bubbleStyles.timestampRight}>{msg.timestamp}</Text>
      </View>
    );
  }

  return (
    <View style={bubbleStyles.advisorRow}>
      <View style={bubbleStyles.advisorBubble}>
        <Text style={bubbleStyles.advisorLabel}>ADVISOR</Text>
        <Text style={bubbleStyles.advisorText}>{msg.text}</Text>
        {msg.isAlert && (
          <View style={bubbleStyles.alertStrip}>
            <Ionicons name="warning" size={12} color={colors.warning} />
            <Text style={bubbleStyles.alertStripText}>Proactive alert — tap ADVISOR banner to dismiss</Text>
          </View>
        )}
      </View>
      <Text style={bubbleStyles.timestampLeft}>{msg.timestamp}</Text>
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  userRow: { alignItems: 'flex-end', paddingHorizontal: 12, marginBottom: 10 },
  userBubble: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  userText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#FFFFFF', lineHeight: 20 },
  timestampRight: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  advisorRow: { alignItems: 'flex-start', paddingHorizontal: 12, marginBottom: 10 },
  advisorBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  advisorLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: colors.gold, marginBottom: 4 },
  advisorText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  alertStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: radius.sm,
    padding: 6,
    marginTop: 8,
    gap: 6,
  },
  alertStripText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.warning, flex: 1 },
  timestampLeft: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 4,
  },
});

// ─── Panel Content ────────────────────────────────────────────────────────────

function AdvisorPanelContent({ onClose }: { onClose: () => void }) {
  const { messages, addMessage } = useAdvisorStore();
  const caseStore = useCaseStore();

  // Use uncontrolled ref on web to prevent double-entry keystroke bug (BUG-002)
  const [inputText, setInputText] = useState('');
  const webInputRef = useRef<TextInput>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showContextHint, setShowContextHint] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const contextPills = [
    caseStore.documentType || 'No doc type',
    caseStore.court || 'No court',
    caseStore.district ? `Step 1` : 'Pre-step',
    `${caseStore.uploadedDocs.length} docs uploaded`,
    `${caseStore.parties.length} ${caseStore.parties.length === 1 ? 'party' : 'parties'}`,
  ];

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getMockReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('delay') || q.includes('condon')) return mockReplies.delay;
    if (q.includes('document') || q.includes('missing') || q.includes('upload')) return mockReplies.documents;
    if (q.includes('fee') || q.includes('court fee')) return mockReplies.fee;
    if (q.includes('interim') || q.includes('injunction') || q.includes('relief')) return mockReplies.interim;
    if (q.includes('limitation') || q.includes('time bar')) return mockReplies.limitation;
    if (q.includes('companion') || q.includes('vakalath') || q.includes('affidavit')) return mockReplies.companion;
    return mockReplies.default;
  };

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      // Add user message
      addMessage({
        id: `user_${Date.now()}`,
        role: 'user',
        text: text.trim(),
        timestamp: timeStr,
      });

      setInputText('');
      // Clear uncontrolled web input too
      if (Platform.OS === 'web' && webInputRef.current) {
        (webInputRef.current as any).clear?.();
        (webInputRef.current as any).value = '';
      }
      setIsTyping(true);

      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false);
        addMessage({
          id: `adv_${Date.now()}`,
          role: 'advisor',
          text: getMockReply(text),
          timestamp: timeStr,
        });
      }, 1200);
    },
    [addMessage]
  );

  const handleInputFocus = () => {
    setShowContextHint(true);
    setTimeout(() => setShowContextHint(false), 3000);
  };

  return (
    <View style={panelStyles.container}>
      {/* Header */}
      <View style={panelStyles.header}>
        <View style={panelStyles.headerLeft}>
          <Ionicons name="sparkles" size={18} color={colors.gold} style={{ marginRight: 8 }} />
          <View>
            <Text style={panelStyles.headerTitle}>ADVISOR</Text>
            <Text style={panelStyles.headerSub}>Legal AI Assistant</Text>
          </View>
        </View>
        <View style={panelStyles.headerRight}>
          <TouchableOpacity onPress={onClose} style={panelStyles.headerBtn} accessibilityLabel="Close ADVISOR">
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Gold Rule */}
      <View style={panelStyles.goldRule} />

      {/* Context Awareness Bar */}
      <View style={panelStyles.contextBar}>
        <Text style={panelStyles.contextLabel}>Aware of:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={panelStyles.pillsRow}>
          {contextPills.map((pill, i) => (
            <View key={i} style={panelStyles.contextPill}>
              <Text style={panelStyles.contextPillText}>{pill}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollRef}
        style={panelStyles.messagesArea}
        contentContainerStyle={panelStyles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Suggested Questions */}
      {messages.length <= 3 && !isTyping && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={panelStyles.suggestionsScroll}
          contentContainerStyle={panelStyles.suggestionsRow}
        >
          {SUGGESTED_QUESTIONS.map((q) => (
            <TouchableOpacity
              key={q}
              style={panelStyles.suggestionChip}
              onPress={() => sendMessage(q)}
            >
              <Text style={panelStyles.suggestionText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input Row */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {showContextHint && (
          <Text style={panelStyles.contextHint}>ADVISOR is context-aware of this matter</Text>
        )}
        <View style={panelStyles.inputRow}>
          {Platform.OS === 'web' ? (
            // Uncontrolled input on web prevents double-entry bug (BUG-002)
            <TextInput
              ref={webInputRef}
              style={panelStyles.input}
              placeholder="Ask ADVISOR anything about this matter..."
              placeholderTextColor={colors.textMuted}
              defaultValue=""
              onFocus={handleInputFocus}
              multiline
              maxLength={500}
              returnKeyType="send"
              onChangeText={(t) => setInputText(t)}
              onSubmitEditing={() => {
                const val = (webInputRef.current as any)?.value ?? inputText;
                sendMessage(val);
              }}
              {...({ outlineStyle: 'none' } as any)}
            />
          ) : (
            <TextInput
              style={panelStyles.input}
              placeholder="Ask ADVISOR anything about this matter..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onFocus={handleInputFocus}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(inputText)}
            />
          )}
          <TouchableOpacity
            style={[panelStyles.sendBtn, !inputText.trim() && panelStyles.sendBtnDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={18} color={colors.navy} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Pulse Ring (Reanimated) ──────────────────────────────────────────────────

function PulseRing() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 1000 }),
        withTiming(1.0, { duration: 1000 })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Reanimated.View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: 29,
          borderWidth: 2,
          borderColor: colors.gold,
        },
        animStyle,
      ]}
      pointerEvents="none"
    />
  );
}

// ─── Main AdvisorBubble Component ─────────────────────────────────────────────

// Screens where ADVISOR bubble is active (advocate workflow only)
const ADVISOR_VISIBLE_ROUTES = new Set([
  '/step1', '/step2', '/step3', '/step4', '/verify', '/allocate',
]);

export default function AdvisorBubble() {
  const { isOpen, unreadCount, togglePanel, closePanel, drawerOpen } = useAdvisorStore();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  // Desktop Web: slide-in drawer from right
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDesktop) {
      Animated.spring(slideAnim, {
        toValue: isOpen ? 1 : 0,
        useNativeDriver: false,
        tension: 80,
        friction: 12,
      }).start();
    }
  }, [isOpen]);

  const drawerTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [440, 0],
  });

  // Mobile (Web or Native): use simple modal-like overlay
  const mobileSlide = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isDesktop) {
      Animated.spring(mobileSlide, {
        toValue: isOpen ? 1 : 0,
        useNativeDriver: true,
        tension: 80,
        friction: 14,
      }).start();
    }
  }, [isOpen]);

  const mobileTranslateY = mobileSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [800, 0],
  });
  const mobileOpacity = mobileSlide.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  // BUG-003: Route-gated visibility — only show on advocate workflow screens
  // Must be after all hooks!
  if (!ADVISOR_VISIBLE_ROUTES.has(pathname)) {
    return null;
  }

  return (
    <>
      {/* ── Floating Bubble ── */}
      <TouchableOpacity
        style={[styles.bubble, drawerOpen && { zIndex: 100 }]}
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          togglePanel();
        }}
        activeOpacity={0.85}
        accessibilityLabel="Open ADVISOR"
        accessibilityRole="button"
      >
        <PulseRing />
        <Ionicons name="chatbubble-ellipses" size={26} color={colors.navy} />
        {unreadCount > 0 && <View style={styles.badge} />}
      </TouchableOpacity>

      {/* ── Desktop Web: Right-side drawer ── */}
      {isDesktop && (
        <>
          {isOpen && (
            <Pressable style={styles.webBackdrop} onPress={closePanel} />
          )}
          <Animated.View
            style={[
              styles.webDrawer,
              { transform: [{ translateX: drawerTranslateX }] },
            ]}
            pointerEvents={isOpen ? 'auto' : 'none'}
          >
            <AdvisorPanelContent onClose={closePanel} />
          </Animated.View>
        </>
      )}

      {/* ── Mobile/Tablet: Slide-up panel ── */}
      {!isDesktop && isOpen && (
        <>
          <Animated.View style={[styles.mobileBackdrop, { opacity: mobileOpacity }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closePanel} />
          </Animated.View>
          <Animated.View
            style={[
              styles.mobileSheet,
              { transform: [{ translateY: mobileTranslateY }] },
            ]}
          >
            <AdvisorPanelContent onClose={closePanel} />
          </Animated.View>
        </>
      )}
    </>
  );
}

// ─── Panel Styles ─────────────────────────────────────────────────────────────

const panelStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.textMuted },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerBtn: { padding: 4 },
  goldRule: {
    width: 40,
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 999,
    alignSelf: 'center',
    marginVertical: 8,
  },
  contextBar: {
    backgroundColor: colors.cream,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contextLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.textMuted, marginRight: 8 },
  pillsRow: { flexDirection: 'row', gap: 6 },
  contextPill: {
    backgroundColor: colors.navy,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  contextPillText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#FFFFFF' },
  messagesArea: { flex: 1 },
  messagesContent: { paddingVertical: 12 },
  suggestionsScroll: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFFFFF',
    maxHeight: 52,
  },
  suggestionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  suggestionChip: {
    height: 34,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  suggestionText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.navy },
  contextHint: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
    paddingTop: 6,
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    maxHeight: 100,
    minHeight: 44,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});

// ─── Outer Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    // BUG-001: Raised to 88px so it sits above the BottomNavBar (~64px) and
    // does not intercept clicks on the "Next →" button
    bottom: 88,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  // Web drawer
  webBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 8888,
  },
  webDrawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 420,
    height: '100%',
    zIndex: 9000,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    overflow: 'hidden',
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  // Mobile sheet
  mobileBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 8888,
  },
  mobileSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
    zIndex: 9000,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
});
