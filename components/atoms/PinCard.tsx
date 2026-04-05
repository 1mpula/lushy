import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

// Screen width / 2 (columns) - padding
const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = (SCREEN_WIDTH / 2) - 24; // Assuming approx 16px padding on container and 16px gap -> roughly

interface PinCardProps {
    imageUrl: string;
    id: string;
    onPress?: () => void;
}

export const PinCard = ({ imageUrl, id, onPress }: PinCardProps) => {
    const [aspectRatio, setAspectRatio] = useState(1);
    const router = useRouter();

    useEffect(() => {
        if (imageUrl) {
            Image.getSize(imageUrl, (width, height) => {
                if (width > 0 && height > 0) {
                    setAspectRatio(width / height);
                }
            }, (error) => {
                console.error("Failed to get image size", error);
            });
        }
    }, [imageUrl]);

    // Calculate height based on column width and aspect ratio
    // Height = Width / AspectRatio
    let calculatedHeight = COLUMN_WIDTH / aspectRatio;

    // Visual Bug Fix: Constraint max height to 300px
    if (calculatedHeight > 300) {
        calculatedHeight = 300;
    }

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push(`/service/${id}` as any);
        }
    };

    const { theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.9}
            style={[styles.card, { height: calculatedHeight, width: '100%', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#f0f0f0' }]}
        >
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        // Shadow for depth
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
