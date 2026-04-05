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
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
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
    <CustomThemeProvider>
      <RootLayoutContent />
    </CustomThemeProvider>
  );
}

import { Text, View } from 'react-native';

function RootLayoutContent() {
  const { theme } = useTheme();

  return (
    <View className={`flex-1 ${theme}`}>
      <UserProvider>
        <ProfessionalProvider>
          <ServiceProvider>
            <RatingProvider>
              <SavedPostsProvider>
                <BookingProvider>
                  <ChatProvider>
                    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
                      <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="auth" options={{ headerShown: false }} />
                        <Stack.Screen name="settings" options={{ headerShown: false }} />
                        <Stack.Screen name="chat/[conversationId]" options={{ headerShown: false }} />
                        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                      </Stack>
                      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                    </ThemeProvider>
                  </ChatProvider>
                </BookingProvider>
              </SavedPostsProvider>
            </RatingProvider>
          </ServiceProvider>
        </ProfessionalProvider>
      </UserProvider>
    </View>
  );
}

