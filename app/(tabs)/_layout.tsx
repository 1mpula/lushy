import { Redirect, Tabs } from 'expo-router';
import { Calendar as CalendarIcon, Home, MessageCircle, PieChart, User } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChat } from '@/context/ChatContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const { userRole, isAuthenticated, isLoading } = useUser();
  const { totalUnread } = useChat();
  const insets = useSafeAreaInsets();

  // Account for navigation bar / safe area
  const bottomInset = insets.bottom;

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#FF4081" />
      </View>
    );
  }

  // Redirect to landing page if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF4081',
        tabBarInactiveTintColor: theme === 'dark' ? '#9BA1A6' : '#757575',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          height: 60 + bottomInset,
          paddingBottom: 10 + bottomInset,
          paddingTop: 10,
          backgroundColor: theme === 'dark' ? '#1A1A1A' : '#ffffff',
        }
      }}>

      {/* Client Tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          href: userRole === 'provider' ? null : undefined,
        }}
        redirect={userRole === 'provider'}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <CalendarIcon size={24} color={color} />,
          href: userRole === 'provider' ? null : undefined,
        }}
      />

      {/* Provider Tabs */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <PieChart size={24} color={color} />,
          href: userRole === 'client' || !userRole ? null : undefined,
        }}
      />

      {/* Messages Tab - Shared */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
          tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#4A7C59',
            fontSize: 10,
            minWidth: 18,
            height: 18,
          },
        }}
      />

      {/* Shared Tabs */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

