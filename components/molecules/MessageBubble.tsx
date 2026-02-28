// Message Bubble Component - Premium UI (Light Theme)
// Displays a single message with beautiful sender-appropriate styling

import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MessageBubbleProps {
    content: string;
    senderId: string;
    createdAt: string;
    isRead?: boolean;
}

export function MessageBubble({ content, senderId, createdAt, isRead }: MessageBubbleProps) {
    const { user } = useUser();
    const isOwn = senderId === user?.id;

    // Format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isOwn) {
        return (
            <View style={[styles.container, styles.ownContainer]}>
                <LinearGradient
                    colors={['#FF4081', '#FF6B9D']}
                    style={[styles.bubble, styles.ownBubble]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={[styles.content, styles.ownContent]}>
                        {content}
                    </Text>
                    <View style={styles.meta}>
                        <Text style={[styles.time, styles.ownTime]}>
                            {formatTime(createdAt)}
                        </Text>
                        <Text style={styles.readStatus}>
                            {isRead ? '✓✓' : '✓'}
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={[styles.container, styles.otherContainer]}>
            <View style={[styles.bubble, styles.otherBubble]}>
                <Text style={[styles.content, styles.otherContent]}>
                    {content}
                </Text>
                <View style={styles.meta}>
                    <Text style={[styles.time, styles.otherTime]}>
                        {formatTime(createdAt)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    ownContainer: {
        alignItems: 'flex-end',
    },
    otherContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '78%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    ownBubble: {
        borderBottomRightRadius: 6,
    },
    otherBubble: {
        backgroundColor: '#F5F5F5',
        borderBottomLeftRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },
    content: {
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0.2,
    },
    ownContent: {
        color: '#FFFFFF',
    },
    otherContent: {
        color: '#333333',
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 6,
        gap: 4,
    },
    time: {
        fontSize: 11,
        fontWeight: '500',
    },
    ownTime: {
        color: 'rgba(255, 255, 255, 0.75)',
    },
    otherTime: {
        color: '#757575',
    },
    readStatus: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.75)',
    },
});
