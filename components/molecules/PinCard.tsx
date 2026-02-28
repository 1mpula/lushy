import { useSavedPosts } from '@/context/SavedPostsContext';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Heart, Star } from 'lucide-react-native';
import { useMemo } from 'react';
import { Dimensions, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface PinCardProps {
    id: string;
    imageUrl: string;
    videoUrl?: string;
    width?: number;
    height?: number;
    title: string;
    providerName: string;
    providerAvatar: string;
    providerId?: string;
    price?: string;
    rating?: number;
    onBook?: () => void;
    onPress: () => void;
    style?: ViewStyle;
}

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ';

export function PinCard({
    id,
    imageUrl,
    videoUrl,
    width,
    height,
    title,
    providerName,
    providerAvatar,
    providerId,
    price,
    rating,
    onPress,
    style
}: PinCardProps) {
    const { isPostSaved, toggleSavePost } = useSavedPosts();
    const isSaved = isPostSaved(id);

    const player = useVideoPlayer(videoUrl || null, player => {
        if (videoUrl) {
            player.loop = true;
            player.muted = true;
            player.play();
        }
    });

    const { width: screenWidth } = Dimensions.get('window');
    const columnWidth = (screenWidth - 32) / 2;

    const aspectRatio = useMemo(() => {
        if (width && height && width > 0 && height > 0) {
            return width / height;
        }
        return 1; // Default to square if unknown
    }, [width, height]);

    // Calculate height based on column width and aspect ratio
    // Limit max height to prevent extremely tall images breaking the flow
    let calculatedHeight = columnWidth / aspectRatio;
    if (calculatedHeight > 450) calculatedHeight = 450;
    if (calculatedHeight < 100) calculatedHeight = 100;

    const handleSaveToggle = () => {
        toggleSavePost({ id, imageUrl, title, providerName, providerAvatar, providerId, price });
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} className="mb-4" style={style}>
            <View className="relative overflow-hidden rounded-xl bg-muted">
                {videoUrl ? (
                    <VideoView
                        player={player}
                        showsTimecodes={false}
                        allowsFullscreen={false}
                        nativeControls={false}
                        style={{ width: '100%', height: calculatedHeight }}
                        contentFit="cover"
                    />
                ) : (
                    <Image
                        source={{ uri: imageUrl }}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={200}
                        style={{ width: '100%', height: calculatedHeight }}
                        className="w-full"
                    />
                )}
                {/* Price badge */}
                {price && (
                    <View className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded-full">
                        <Text className="text-xs font-bold text-foreground">{price}</Text>
                    </View>
                )}
                <TouchableOpacity
                    onPress={handleSaveToggle}
                    className="absolute p-2 bg-black/20 backdrop-blur-md rounded-full bottom-2 right-2"
                >
                    <Heart size={16} color={isSaved ? "#FF4081" : "white"} fill={isSaved ? "#FF4081" : "transparent"} />
                </TouchableOpacity>
            </View>

            <View className="mt-2">
                <Text className="mb-1 text-sm font-bold font-heading text-foreground leading-tight" numberOfLines={2}>{title}</Text>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <Image
                            source={{ uri: providerAvatar }}
                            className="w-5 h-5 mr-1.5 rounded-full bg-muted"
                            contentFit="cover"
                        />
                        <Text className="text-xs text-muted-foreground font-body flex-1" numberOfLines={1}>{providerName}</Text>
                    </View>
                    {/* Rating */}
                    {rating !== undefined && rating > 0 && (
                        <View className="flex-row items-center ml-2">
                            <Star size={12} color="#FFB800" fill="#FFB800" />
                            <Text className="text-xs text-foreground font-bold ml-0.5">{rating.toFixed(1)}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

