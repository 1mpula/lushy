// Conversation Card Component - Premium UI (Light Pink Theme)
// Matches the app's overall design language

import { Conversation } from '@/context/ChatContext';
import { useUser } from '@/context/UserContext';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop';

interface ConversationCardProps {
    conversation: Conversation;
    onPress: () => void;
    index?: number;
}

export function ConversationCard({ conversation, onPress, index = 0 }: ConversationCardProps) {
    const { userRole } = useUser();
    const { theme } = useTheme();

    // Show the other party's name
    const displayName = userRole === 'client'
        ? conversation.professionalName
        : conversation.clientName;

    // Get unread count for current user
    const unreadCount = userRole === 'client'
        ? conversation.unreadCountClient
        : conversation.unreadCountPro;

    const hasUnread = unreadCount > 0;

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?';
    };

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300, delay: index * 50 }}
            className="px-4 mb-3"
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                className={`flex-row items-center p-5 rounded-3xl border shadow-xl`}
                style={{ 
                    backgroundColor: hasUnread 
                        ? (theme === 'dark' ? '#2D1F24' : '#FFF0F5') 
                        : (theme === 'dark' ? '#1A1A1A' : '#FFFFFF'),
                    borderColor: hasUnread 
                        ? 'rgba(255, 64, 129, 0.4)' 
                        : (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'),
                    shadowColor: hasUnread ? '#FF4081' : '#000',
                    shadowOpacity: hasUnread ? 0.15 : 0.04
                }}
            >
                {/* Avatar */}
                <View className="relative shadow-md shadow-pink-200">
                    <View className={`p-0.5 rounded-full`} style={{ backgroundColor: hasUnread ? 'rgba(255, 64, 129, 0.2)' : (theme === 'dark' ? '#333333' : '#F3F4F6') }}>
                        <Image
                            source={{ uri: DEFAULT_AVATAR }}
                            className={`w-14 h-14 rounded-full border-2`}
                            style={{ borderColor: hasUnread ? '#FF4081' : (theme === 'dark' ? '#444444' : '#E5E7EB') }}
                        />
                    </View>
                    {/* Online indicator */}
                    <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-[3px] shadow-sm" style={{ borderColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF' }} />
                </View>

                {/* Content */}
                <View className="flex-1 ml-4">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text
                            className={`text-base flex-1 mr-2 ${hasUnread ? 'font-bold' : 'font-semibold'}`}
                            numberOfLines={1}
                            style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                        >
                            {displayName}
                        </Text>
                        <Text className={`text-xs ${hasUnread ? 'font-bold' : ''}`} style={{ color: hasUnread ? '#FF4081' : (theme === 'dark' ? '#9CA3AF' : '#6B7280') }}>
                            {formatDate(conversation.lastMessageAt)}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <Text
                            className={`text-sm flex-1 mr-2 ${hasUnread ? 'text-foreground font-medium' : 'text-mediumGray'}`}
                            numberOfLines={1}
                        >
                            {conversation.lastMessage || 'Tap to start chatting'}
                        </Text>
                        {hasUnread && (
                            <View className="bg-primary rounded-full min-w-6 h-6 px-2 items-center justify-center">
                                <Text className="text-white text-xs font-bold">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </MotiView>
    );
}
