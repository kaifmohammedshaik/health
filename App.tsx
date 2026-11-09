import React, { useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoreProvider, useStore } from './lib/ai/store';
import { usePalette, font } from './lib/ai/theme';
import type { RootStackParamList, TabParamList } from './lib/ai/nav';

import OnboardingScreen from './screens/OnboardingScreen';
import LockScreen from './screens/LockScreen';
import HomeScreen from './screens/HomeScreen';
import QueueScreen from './screens/QueueScreen';
import ConsultScreen from './screens/ConsultScreen';
import LearnScreen from './screens/LearnScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewScreeningScreen from './screens/NewScreeningScreen';
import LiveCameraScreen from './screens/LiveCameraScreen';
import AnalyzingScreen from './screens/AnalyzingScreen';
import ResultsScreen from './screens/ResultsScreen';
import SymptomCheckScreen from './screens/SymptomCheckScreen';
import ReferralDetailScreen from './screens/ReferralDetailScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import CallScreen from './screens/CallScreen';
import ArticleScreen from './screens/ArticleScreen';
import HistoryScreen from './screens/HistoryScreen';
import AuditScreen from './screens/AuditScreen';
import ModelsScreen from './screens/ModelsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const p = usePalette();
  const { vault } = useStore();
  const urgent = vault.referrals.filter((r) => (r.triage === 'emergency' || r.triage === 'urgent') && (r.status === 'pending' || r.status === 'sent')).length;
  const icons: Record<keyof TabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
    Home: ['home', 'home-outline'],
    Queue: ['git-branch', 'git-branch-outline'],
    Consult: ['videocam', 'videocam-outline'],
    Learn: ['book', 'book-outline'],
    Profile: ['shield-checkmark', 'shield-checkmark-outline'],
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: p.primary,
        tabBarInactiveTintColor: p.textMuted,
        tabBarLabelStyle: { fontFamily: font.bold, fontSize: 11 },
        tabBarStyle: { backgroundColor: p.card, borderTopColor: p.border, height: Platform.OS === 'web' ? 64 : undefined, paddingTop: 6, paddingBottom: Platform.OS === 'web' ? 8 : undefined },
        tabBarIcon: ({ focused, color, size }) => <Ionicons name={icons[route.name][focused ? 0 : 1]} size={size - 1} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Queue" component={QueueScreen} options={{ title: 'Referrals', tabBarBadge: urgent || undefined, tabBarBadgeStyle: { backgroundColor: p.danger, fontFamily: font.bold, fontSize: 10 } }} />
      <Tab.Screen name="Consult" component={ConsultScreen} options={{ title: 'Teleconsult' }} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Privacy' }} />
    </Tab.Navigator>
  );
}

function Root() {
  const { phase } = useStore();
  const p = usePalette();
  const base = p.dark ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: p.bg, card: p.card, text: p.text, primary: p.primary, border: p.border } };
  if (phase === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: p.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={p.primary} />
      </View>
    );
  }
  const header = {
    headerStyle: { backgroundColor: p.bg },
    headerShadowVisible: false,
    headerTintColor: p.text,
    headerTitleStyle: { fontFamily: font.heavy, fontSize: 17 },
    headerBackButtonDisplayMode: 'minimal' as const,
    contentStyle: { backgroundColor: p.bg },
  };
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={p.dark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={header}>
        {phase === 'setup' ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : phase === 'locked' ? (
          <Stack.Screen name="Lock" component={LockScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="NewScreening" component={NewScreeningScreen} options={{ title: 'New screening' }} />
            <Stack.Screen name="LiveCamera" component={LiveCameraScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
            <Stack.Screen name="Analyzing" component={AnalyzingScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="Result" component={ResultsScreen} options={{ title: 'AI screening result' }} />
            <Stack.Screen name="SymptomCheck" component={SymptomCheckScreen} options={{ title: 'Symptom checker' }} />
            <Stack.Screen name="ReferralDetail" component={ReferralDetailScreen} options={{ title: 'Referral' }} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Book teleconsultation', presentation: 'modal' }} />
            <Stack.Screen name="Call" component={CallScreen} options={{ headerShown: false, presentation: 'fullScreenModal', gestureEnabled: false }} />
            <Stack.Screen name="Article" component={ArticleScreen} options={{ title: '' }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Screening history' }} />
            <Stack.Screen name="Audit" component={AuditScreen} options={{ title: 'Security & audit log' }} />
            <Stack.Screen name="Models" component={ModelsScreen} options={{ title: 'On-device AI models' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    // PWA: register service worker for offline app-shell caching
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StoreProvider>
          <Root />
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
