// Chat Input Component - Premium UI (Light Theme)
// Text input with animated send button

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Type a message..." }: ChatInputProps) {
    const { theme } = useTheme();
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSend = () => {
        if (!message.trim() || disabled) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSend(message.trim());
        setMessage('');
    };

    const canSend = message.trim().length > 0 && !disabled;

    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer,
                { 
                    backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                    borderColor: isFocused 
                        ? 'rgba(255, 64, 129, 0.4)' 
                        : (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
                    shadowOpacity: isFocused ? 0.1 : 0.04
                }
            ]}>
                {/* Emoji/Attachment button */}
                <Pressable style={styles.attachButton}>
                    <Ionicons name="add-circle" size={26} color={theme === 'dark' ? '#9CA3AF' : '#757575'} />
                </Pressable>

                <TextInput
                    style={[styles.input, { color: theme === 'dark' ? '#FFFFFF' : '#333333' }]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder={placeholder}
                    placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    multiline
                    maxLength={1000}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {/* Send button with animation */}
                <MotiView
                    animate={{
                        scale: canSend ? 1 : 0.8,
                        opacity: canSend ? 1 : 0.5,
                    }}
                    transition={{ type: 'spring', damping: 15 }}
                >
                    <Pressable
                        onPress={handleSend}
                        disabled={!canSend}
                        style={({ pressed }) => [
                            styles.sendButtonOuter,
                            pressed && { transform: [{ scale: 0.95 }] }
                        ]}
                    >
                        {canSend ? (
                            <LinearGradient
                                colors={['#FF4081', '#FF6B9D']}
                                style={styles.sendButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="send" size={18} color="#FFFFFF" />
                            </LinearGradient>
                        ) : (
                            <View style={[styles.sendButton, { backgroundColor: theme === 'dark' ? '#333333' : '#F0F0F0' }]}>
                                <Ionicons name="send" size={18} color={theme === 'dark' ? '#666666' : '#9CA3AF'} />
                            </View>
                        )}
                    </Pressable>
                </MotiView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderRadius: 24,
        paddingLeft: 4,
        paddingRight: 4,
        paddingVertical: 4,
        minHeight: 52,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    attachButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        maxHeight: 100,
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 4,
    },
    sendButtonOuter: {
        marginLeft: 4,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
