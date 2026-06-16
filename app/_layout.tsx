import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, TextInput } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

// Disable font scaling globally to prevent system text size from breaking layouts
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;
import Toast from 'react-native-toast-message';
import { colors } from '../theme/tokens';
import AdvisorBubble from '../components/advisor/AdvisorBubble';
import GlobalBottomTabs from '../components/layout/GlobalBottomTabs';
import '../global.css';

// ═══════════════════════════════════════════════════════
// PROJECT CASE — BACKEND INTEGRATION POINTS SUMMARY
// ═══════════════════════════════════════════════════════
//
// AUTH:        POST /api/auth/login → { token, role, userId }
// MATTERS:     GET/POST/PUT /api/matters
// DOCUMENTS:   POST /api/matters/:id/documents (Supabase Storage)
// GENERATION:  POST /api/generate → { googleDocUrl }
// ADVISOR:     POST /api/advisor → streamed text (Gemini API)
// KNOWLEDGE:   GET/POST/PUT/DELETE /api/knowledge
// USERS:       GET/POST/PUT /api/admin/users (Admin only)
// PDFS:        GET /api/matters/:id/pdfs → { downloadUrls }
// GOOGLE DOCS: Loaded via WebView with googleDocUrl from generation API
// GOOGLE DRIVE:expo-auth-session OAuth → Drive file picker
// NOTIFICATIONS:GET /api/notifications — replace mock store
//
// All above currently run on Zustand + AsyncStorage (mock/local)
// Swap each endpoint when backend (Node.js + Supabase + Gemini) is ready
// ═══════════════════════════════════════════════════════

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    DMSerifDisplay_400Regular,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.navy }}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login-advocate" />
        <Stack.Screen name="login-clerk" />
        <Stack.Screen name="login-admin" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="create-draft" />
        <Stack.Screen name="matter-detail" />
        <Stack.Screen name="generating" />
        <Stack.Screen name="review-document" />
        <Stack.Screen name="pdf-ready" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="admin-dashboard" />
        <Stack.Screen name="admin-users" />
        <Stack.Screen name="step1" />
        <Stack.Screen name="step2" />
        <Stack.Screen name="step3" />
        <Stack.Screen name="step4" />
        <Stack.Screen name="verify" options={{ presentation: 'modal' }} />
        <Stack.Screen name="allocate" />
        <Stack.Screen name="success" />
        <Stack.Screen name="clerk-portal" />
        <Stack.Screen name="clerk-task-detail" />
        <Stack.Screen name="knowledge-repository" />
        <Stack.Screen name="knowledge-add" options={{ presentation: 'modal' }} />
      </Stack>

      {/* ADVISOR global floating overlay — renders on top of all screens */}
      <AdvisorBubble />

      {/* Global Bottom Tabs for role-based navigation outside of wizard */}
      <GlobalBottomTabs />

          <Toast />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
