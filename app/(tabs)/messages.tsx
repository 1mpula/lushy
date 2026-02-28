// Messages Screen - Premium UI (Light Pink Theme)
// Matches the app's overall design language

import { ConversationCard } from '@/components/molecules/ConversationCard';
import { Header } from '@/components/molecules/Header';
import { useChat } from '@/context/ChatContext';
import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MessageCircle, RefreshCw } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MessagesScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { conversations, isLoading, totalUnread, refreshConversations } = useChat();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshConversations();
        setRefreshing(false);
    };

    const handleConversationPress = (conversationId: string) => {
        router.push(`/chat/${conversationId}`);
    };

    // If user is not logged in, show sign-in prompt
    if (!user) {
        return (
            <View className="flex-1 bg-slate-50">
                <LinearGradient
                    colors={['#FF4081', '#FF80AB', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ width: '100%', height: 280, position: 'absolute', top: 0, left: 0, opacity: 0.15 }}
                />
                <SafeAreaView className="flex-1" edges={['top']}>
                    <Header title="Messages" showBack={false} variant="overlay" />
                    <View className="flex-1 items-center justify-center px-8 pt-24 z-10">
                        <View className="bg-white p-8 rounded-3xl items-center shadow-xl shadow-pink-100/40 border border-white">
                            <MotiView
                                from={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-5"
                            >
                                <MessageCircle size={40} color="#FF4081" />
                            </MotiView>
                            <Text className="text-2xl font-bold text-charcoal font-heading text-center">Sign in to chat</Text>
                            <Text className="text-mediumGray text-center mt-2 font-body">Log in to message professionals</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    // Loading state
    if (isLoading && conversations.length === 0) {
        return (
            <View className="flex-1 bg-slate-50">
                <LinearGradient
                    colors={['#FF4081', '#FF80AB', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ width: '100%', height: 280, position: 'absolute', top: 0, left: 0, opacity: 0.15 }}
                />
                <SafeAreaView className="flex-1" edges={['top']}>
                    <Header title="Messages" showBack={false} variant="overlay" />
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#FF4081" />
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50">
            <LinearGradient
                colors={['#FF4081', '#FF80AB', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ width: '100%', height: 280, position: 'absolute', top: 0, left: 0, opacity: 0.15 }}
            />
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <Header
                    title="Messages"
                    showBack={false}
                    variant="overlay"
                    rightElement={
                        <View className="flex-row items-center gap-3">
                            {totalUnread > 0 && (
                                <View className="bg-primary rounded-full px-2.5 py-1 shadow-sm">
                                    <Text className="text-white text-xs font-bold">{totalUnread}</Text>
                                </View>
                            )}
                            <TouchableOpacity onPress={onRefresh} className="p-2 bg-white/80 backdrop-blur-md rounded-full border border-white shadow-sm">
                                <RefreshCw size={18} color="#757575" />
                            </TouchableOpacity>
                        </View>
                    }
                />

                {/* Empty State */}
                {conversations.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-8 pt-24 z-10">
                        <View className="bg-white p-8 rounded-3xl items-center shadow-xl shadow-pink-100/40 border border-white">
                            <MotiView
                                from={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-5"
                            >
                                <MessageCircle size={40} color="#FF4081" />
                            </MotiView>
                            <Text className="text-2xl font-bold text-charcoal font-heading text-center">No messages yet</Text>
                            <Text className="text-mediumGray text-center mt-2 font-body">Start a conversation with a professional</Text>
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <ConversationCard
                                conversation={item}
                                onPress={() => handleConversationPress(item.id)}
                                index={index}
                            />
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#FF4081"
                                colors={['#FF4081']}
                            />
                        }
                        contentContainerClassName="pt-32 pb-24 px-4"
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
