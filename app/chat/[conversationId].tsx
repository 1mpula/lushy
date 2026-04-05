// Individual Chat Screen - Premium UI (Light Theme)
// Real-time messaging with a specific conversation

import { ChatInput } from '@/components/molecules/ChatInput';
import { MessageBubble } from '@/components/molecules/MessageBubble';
import { useTheme } from '@/context/ThemeContext';
import { Message, useChat } from '@/context/ChatContext';
import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
    const { user, userRole } = useUser();
    const { conversations, getMessages, sendMessage, markAsRead, subscribeToMessages } = useChat();

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const hasLoadedRef = useRef(false);

    // Get conversation details
    const conversation = conversations.find(c => c.id === conversationId);
    const otherName = userRole === 'client'
        ? conversation?.professionalName
        : conversation?.clientName;

    // Get initials
    const getInitials = (name: string) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?';
    };

    // Load messages - only once
    useEffect(() => {
        if (!conversationId || hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        const loadMessages = async () => {
            setIsLoading(true);
            const msgs = await getMessages(conversationId);
            setMessages(msgs);
            setIsLoading(false);
            markAsRead(conversationId);
        };

        loadMessages();
    }, [conversationId]);

    // Real-time subscription - separate effect
    useEffect(() => {
        if (!conversationId) return;

        const unsubscribe = subscribeToMessages(conversationId, (newMessage) => {
            // Prevent duplicate messages
            setMessages(prev => {
                if (prev.some(m => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
            });
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
            markAsRead(conversationId);
        });

        return unsubscribe;
    }, [conversationId]);

    // Handle send message
    const handleSend = async (content: string) => {
        if (!conversationId || isSending) return;

        setIsSending(true);
        const success = await sendMessage(conversationId, content);
        setIsSending(false);

        if (success) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    // Render message item
    const renderMessage = useCallback(({ item, index }: { item: Message; index: number }) => (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 200, delay: Math.min(index * 30, 300) }}
        >
            <MessageBubble
                content={item.content}
                senderId={item.senderId}
                createdAt={item.createdAt}
                isRead={item.isRead}
            />
        </MotiView>
    ), []);

    if (!user) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }]}>
                <Text style={[styles.errorText, { color: theme === 'dark' ? '#FFF' : '#333' }]}>Please sign in to chat</Text>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Light Gradient Background */}
            <LinearGradient
                colors={theme === 'dark' 
                    ? ['#121212', '#181818', '#121212'] 
                    : ['#FFF8FA', '#FFFFFF', '#FFF5F8']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Premium Header */}
                <BlurView intensity={80} tint={theme === 'dark' ? 'dark' : 'light'} style={[styles.headerBlur, { borderBottomColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
                    <View style={styles.header}>
                        <Pressable
                            style={styles.backButton}
                            onPress={() => router.back()}
                            hitSlop={10}
                        >
                            <View style={[styles.backButtonInner, { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                                <Ionicons name="chevron-back" size={22} color={theme === 'dark' ? '#FFFFFF' : '#333333'} />
                            </View>
                        </Pressable>

                        <View style={styles.headerCenter}>
                            {/* Avatar */}
                            <LinearGradient
                                colors={['#FF4081', '#FF80AB']}
                                style={styles.avatar}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.avatarText}>{getInitials(otherName || '')}</Text>
                            </LinearGradient>
                            <View style={styles.headerInfo}>
                                <Text style={[styles.headerName, { color: theme === 'dark' ? '#FFFFFF' : '#333333' }]} numberOfLines={1}>{otherName || 'Chat'}</Text>
                                <View style={styles.onlineStatus}>
                                    <View style={styles.onlineDot} />
                                    <Text style={styles.onlineText}>Active now</Text>
                                </View>
                            </View>
                        </View>

                        <Pressable style={styles.moreButton} hitSlop={10}>
                            <Ionicons name="ellipsis-vertical" size={20} color="#757575" />
                        </Pressable>
                    </View>
                </BlurView>

                {/* Messages Area */}
                <KeyboardAvoidingView
                    style={styles.chatContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <MotiView
                                from={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring' }}
                            >
                                <ActivityIndicator size="large" color="#FF4081" />
                            </MotiView>
                        </View>
                    ) : messages.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MotiView
                                from={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                            >
                                <LinearGradient
                                    colors={['#FF4081', '#FF80AB']}
                                    style={styles.emptyIcon}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Ionicons name="chatbubbles" size={40} color="#FFFFFF" />
                                </LinearGradient>
                            </MotiView>
                            <Text style={[styles.emptyText, { color: theme === 'dark' ? '#FFFFFF' : '#333333' }]}>Start the conversation</Text>
                            <Text style={styles.emptySubtext}>
                                Say hello to {otherName || 'them'} 👋
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderMessage}
                            contentContainerStyle={[
                                styles.messagesList,
                                { paddingBottom: 16 }
                            ]}
                            onLayout={() => {
                                flatListRef.current?.scrollToEnd({ animated: false });
                            }}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={20}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                        />
                    )}

                    {/* Premium Input Area */}
                    <View style={[styles.inputWrapper, { 
                        paddingBottom: insets.bottom || 16,
                        backgroundColor: theme === 'dark' ? 'rgba(18, 18, 18, 0.98)' : 'rgba(255, 248, 250, 0.98)',
                        borderTopColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
                    }]}>
                        <ChatInput
                            onSend={handleSend}
                            disabled={isSending}
                            placeholder={`Message ${otherName || 'them'}...`}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    headerBlur: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    backButton: {
        marginRight: 8,
    },
    backButtonInner: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        color: '#333333',
        fontSize: 17,
        fontWeight: '600',
    },
    onlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ADE80',
        marginRight: 6,
    },
    onlineText: {
        color: '#4ADE80',
        fontSize: 12,
        fontWeight: '500',
    },
    moreButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyText: {
        color: '#333333',
        fontSize: 22,
        fontWeight: '700',
    },
    emptySubtext: {
        color: '#757575',
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
    },
    messagesList: {
        paddingVertical: 16,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    inputWrapper: {
        backgroundColor: 'rgba(255, 248, 250, 0.98)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.06)',
    },
    errorText: {
        color: '#333333',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
    },
});
