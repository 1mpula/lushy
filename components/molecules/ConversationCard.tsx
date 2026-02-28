// Conversation Card Component - Premium UI (Light Pink Theme)
// Matches the app's overall design language

import { Conversation } from '@/context/ChatContext';
import { useUser } from '@/context/UserContext';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop';

interface ConversationCardProps {
    conversation: Conversation;
    onPress: () => void;
    index?: number;
}

export function ConversationCard({ conversation, onPress, index = 0 }: ConversationCardProps) {
    const { userRole } = useUser();

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
                className={`flex-row items-center p-5 rounded-3xl bg-white shadow-xl border ${hasUnread ? 'border-primary/40 shadow-pink-200/50 bg-pink-50/80' : 'border-white shadow-pink-100/40'}`}
            >
                {/* Avatar */}
                <View className="relative shadow-md shadow-pink-200">
                    <View className={`p-0.5 rounded-full ${hasUnread ? 'bg-primary/20' : 'bg-slate-100'}`}>
                        <Image
                            source={{ uri: DEFAULT_AVATAR }}
                            className={`w-14 h-14 rounded-full ${hasUnread ? 'border-[3px] border-primary' : 'border-2 border-white'}`}
                        />
                    </View>
                    {/* Online indicator */}
                    <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-white shadow-sm" />
                </View>

                {/* Content */}
                <View className="flex-1 ml-4">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text
                            className={`text-base flex-1 mr-2 ${hasUnread ? 'font-bold text-charcoal' : 'font-semibold text-charcoal'}`}
                            numberOfLines={1}
                        >
                            {displayName}
                        </Text>
                        <Text className={`text-xs ${hasUnread ? 'text-primary font-bold' : 'text-mediumGray'}`}>
                            {formatDate(conversation.lastMessageAt)}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <Text
                            className={`text-sm flex-1 mr-2 ${hasUnread ? 'text-charcoal font-medium' : 'text-mediumGray'}`}
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
