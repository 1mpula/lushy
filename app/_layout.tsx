import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import '../global.css';

import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { BookingProvider } from '@/context/BookingContext';
import { ChatProvider } from '@/context/ChatContext';
import { ProfessionalProvider } from '@/context/ProfessionalContext';
import { RatingProvider } from '@/context/RatingContext';
import { SavedPostsProvider } from '@/context/SavedPostsContext';
import { ServiceProvider } from '@/context/ServiceContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { UserProvider } from '@/context/UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    Outfit_400Regular,
    Outfit_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <ProfessionalProvider>
        <ServiceProvider>
          <RatingProvider>
            <SavedPostsProvider>
              <BookingProvider>
                <ChatProvider>
                  <SubscriptionProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                      <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="auth" options={{ headerShown: false }} />
                        <Stack.Screen name="settings" options={{ headerShown: false }} />
                        <Stack.Screen name="chat/[conversationId]" options={{ headerShown: false }} />
                        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                      </Stack>
                      <StatusBar style="auto" />
                    </ThemeProvider>
                  </SubscriptionProvider>
                </ChatProvider>
              </BookingProvider>
            </SavedPostsProvider>
          </RatingProvider>
        </ServiceProvider>
      </ProfessionalProvider>
    </UserProvider>
  );
}

