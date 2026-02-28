// Push Notifications Hook for Lushy
// Handles permission requests, token registration, and notification listeners
// NOTE: Push notifications do NOT work in Expo Go (SDK 53+). Use a development build.

import { supabase } from '@/lib/supabase';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Check if running in Expo Go (push notifications don't work there since SDK 53)
const isExpoGo = Constants.appOwnership === 'expo';

export interface PushNotificationState {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    isRegistered: boolean;
    isExpoGo: boolean;
}

export function usePushNotifications(userId: string | null) {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    // Register for push notifications
    const registerForPushNotifications = async (): Promise<string | null> => {
        // Skip if running in Expo Go - push notifications removed in SDK 53
        if (isExpoGo) {
            console.log('⚠️ Push notifications not available in Expo Go. Use a development build.');
            return null;
        }

        // Must be a physical device
        if (!Device.isDevice) {
            console.log('Push notifications require a physical device');
            return null;
        }

        // Check/request permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Push notification permission not granted');
            return null;
        }

        // Set up Android notification channel
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Lushy Bookings',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#4A7C59', // Lushy green
            });
        }

        // Get the Expo push token
        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: projectId,
            });
            return tokenData.data;
        } catch (error) {
            // Silently fail in development - this is expected in Expo Go
            console.log('Push token unavailable (expected in Expo Go)');
            return null;
        }
    };

    // Save push token to Supabase
    const savePushToken = async (token: string, uid: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ push_token: token })
                .eq('id', uid);

            if (error) {
                console.error('Error saving push token:', error);
                return false;
            }

            console.log('✅ Push token saved to Supabase');
            return true;
        } catch (error) {
            console.error('Error saving push token:', error);
            return false;
        }
    };

    // Initialize push notifications when user is logged in
    useEffect(() => {
        if (!userId) {
            setIsRegistered(false);
            return;
        }

        // Skip entire setup if in Expo Go
        if (isExpoGo) {
            console.log('📱 Running in Expo Go - push notifications disabled');
            return;
        }

        const init = async () => {
            const token = await registerForPushNotifications();

            if (token) {
                setExpoPushToken(token);
                const saved = await savePushToken(token, userId);
                setIsRegistered(saved);
            }
        };

        init();

        // Listen for incoming notifications (foreground) - only outside Expo Go
        try {
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
                console.log('📬 Notification received:', notification.request.content.title);
            });

            // Listen for notification taps/responses
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                const data = response.notification.request.content.data;
                console.log('👆 Notification tapped:', data);
            });
        } catch (error) {
            console.log('Could not set up notification listeners:', error);
        }

        return () => {
            try {
                if (notificationListener.current) {
                    notificationListener.current.remove();
                }
                if (responseListener.current) {
                    responseListener.current.remove();
                }
            } catch (error) {
                // Ignore cleanup errors
            }
        };
    }, [userId]);

    return {
        expoPushToken,
        notification,
        isRegistered,
        isExpoGo,
    };
}

