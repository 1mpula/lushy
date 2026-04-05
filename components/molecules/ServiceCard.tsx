import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ServiceCardProps {
    title: string;
    price: string | number;
    imageUrl: string;
    duration?: string;
    onPress: () => void;
    index?: number;
    width?: number;
    height?: number;
}

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ';

export const ServiceCard = ({
    title,
    price,
    imageUrl,
    duration,
    onPress,
    index = 0,
    width,
    height
}: ServiceCardProps) => {
    // Calculate aspect ratio similar to PinCard
    const aspectRatio = React.useMemo(() => {
        if (width && height && width > 0 && height > 0) {
            return width / height;
        }
        return 0.85; // Slightly taller than square for services
    }, [width, height]);

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: 'timing',
                duration: 400,
                delay: index * 50,
            }}
            style={{ width: '48%', marginBottom: 20 }}
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border"
            >
                <View className="relative">
                    <Image
                        source={{ uri: imageUrl }}
                        placeholder={blurhash}
                        style={{ width: '100%', aspectRatio }}
                        contentFit="cover"
                        transition={300}
                        className="bg-card"
                    />
                    <View className="absolute top-2.5 right-2.5 bg-background/95 px-2.5 py-1 rounded-full shadow-sm">
                        <Text className="text-primary font-bold text-xs">P{price}</Text>
                    </View>
                </View>

                <View className="p-3">
                    <Text className="font-bold text-foreground text-[13px] leading-tight mb-1" numberOfLines={2}>
                        {title}
                    </Text>
                    <View className="flex-row items-center justify-between mt-1">
                        {duration && (
                            <Text className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                {duration}
                            </Text>
                        )}
                        <View className="bg-card p-1.5 rounded-full border border-border">
                            <ChevronRight size={10} color="#94A3B8" />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </MotiView>
    );
};
