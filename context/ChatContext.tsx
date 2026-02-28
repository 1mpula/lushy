// Chat Context - Real-time messaging for Lushy
// Handles conversations list, messages, and Supabase Realtime subscriptions

import { supabase } from '@/lib/supabase';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

// Types
export interface Conversation {
    id: string;
    clientId: string;
    professionalId: string;
    bookingId?: string;
    lastMessage?: string;
    lastMessageAt: string;
    lastSenderId?: string;
    unreadCountClient: number;
    unreadCountPro: number;
    createdAt: string;
    // Joined fields
    clientName?: string;
    clientAvatar?: string;
    professionalName?: string;
    professionalAvatar?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    messageType: 'text' | 'booking_request' | 'system';
    isRead: boolean;
    createdAt: string;
}

interface ChatContextType {
    conversations: Conversation[];
    isLoading: boolean;
    totalUnread: number;
    refreshConversations: () => Promise<void>;
    getOrCreateConversation: (professionalId: string) => Promise<string | null>;
    getMessages: (conversationId: string) => Promise<Message[]>;
    sendMessage: (conversationId: string, content: string) => Promise<boolean>;
    markAsRead: (conversationId: string) => Promise<void>;
    subscribeToMessages: (conversationId: string, onMessage: (message: Message) => void) => () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { user, userRole } = useUser();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Calculate total unread messages
    const totalUnread = conversations.reduce((sum, conv) => {
        if (userRole === 'client') {
            return sum + conv.unreadCountClient;
        } else {
            return sum + conv.unreadCountPro;
        }
    }, 0);

    // Fetch all conversations for the current user
    const refreshConversations = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        try {
            // Build query based on user role
            let query = supabase
                .from('conversations')
                .select(`
                    *,
                    client:client_id(id, full_name, avatar_url),
                    professional:professional_id(id, business_name, user_id)
                `)
                .order('last_message_at', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;

            // Transform to app format
            const transformed: Conversation[] = (data || []).map((c: any) => ({
                id: c.id,
                clientId: c.client_id,
                professionalId: c.professional_id,
                bookingId: c.booking_id,
                lastMessage: c.last_message,
                lastMessageAt: c.last_message_at,
                lastSenderId: c.last_sender_id,
                unreadCountClient: c.unread_count_client || 0,
                unreadCountPro: c.unread_count_pro || 0,
                createdAt: c.created_at,
                clientName: c.client?.full_name || 'Client',
                clientAvatar: c.client?.avatar_url,
                professionalName: c.professional?.business_name || 'Professional',
                professionalAvatar: undefined, // Professionals don't have avatar in schema
            }));

            setConversations(transformed);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    // Load conversations on mount and when user changes
    useEffect(() => {
        if (user?.id) {
            refreshConversations();

            // Subscribe to conversation updates (for real-time last message updates)
            const channel = supabase
                .channel('conversations-updates')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'conversations',
                    },
                    () => {
                        // Refresh conversations when any update occurs
                        refreshConversations();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user?.id, refreshConversations]);

    // Get or create a conversation with a professional
    const getOrCreateConversation = async (professionalId: string): Promise<string | null> => {
        if (!user?.id) return null;

        try {
            // First, check if conversation exists
            const { data: existing, error: findError } = await supabase
                .from('conversations')
                .select('id')
                .eq('client_id', user.id)
                .eq('professional_id', professionalId)
                .single();

            if (existing) {
                return existing.id;
            }

            // Create new conversation
            const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert({
                    client_id: user.id,
                    professional_id: professionalId,
                })
                .select('id')
                .single();

            if (createError) throw createError;

            await refreshConversations();
            return newConv?.id || null;
        } catch (error) {
            console.error('Error getting/creating conversation:', error);
            return null;
        }
    };

    // Get messages for a conversation
    const getMessages = async (conversationId: string): Promise<Message[]> => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            return (data || []).map((m: any) => ({
                id: m.id,
                conversationId: m.conversation_id,
                senderId: m.sender_id,
                content: m.content,
                messageType: m.message_type,
                isRead: m.is_read,
                createdAt: m.created_at,
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    };

    // Send a message
    const sendMessage = async (conversationId: string, content: string): Promise<boolean> => {
        if (!user?.id || !content.trim()) return false;

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content: content.trim(),
                    message_type: 'text',
                });

            if (error) throw error;

            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    };

    // Mark conversation as read
    const markAsRead = async (conversationId: string) => {
        if (!user?.id) return;

        try {
            // Determine which field to reset based on user role
            const updateField = userRole === 'client'
                ? { unread_count_client: 0 }
                : { unread_count_pro: 0 };

            await supabase
                .from('conversations')
                .update(updateField)
                .eq('id', conversationId);

            // Mark messages as read
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', conversationId)
                .neq('sender_id', user.id);

            // Refresh to update local state
            await refreshConversations();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // Subscribe to real-time messages for a specific conversation
    const subscribeToMessages = (conversationId: string, onMessage: (message: Message) => void) => {
        const channel = supabase
            .channel(`messages-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const m = payload.new as any;
                    onMessage({
                        id: m.id,
                        conversationId: m.conversation_id,
                        senderId: m.sender_id,
                        content: m.content,
                        messageType: m.message_type,
                        isRead: m.is_read,
                        createdAt: m.created_at,
                    });
                }
            )
            .subscribe();

        // Return unsubscribe function
        return () => {
            supabase.removeChannel(channel);
        };
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            isLoading,
            totalUnread,
            refreshConversations,
            getOrCreateConversation,
            getMessages,
            sendMessage,
            markAsRead,
            subscribeToMessages,
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
