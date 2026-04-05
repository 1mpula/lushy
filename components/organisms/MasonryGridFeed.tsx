import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { PinCard } from '../molecules/PinCard';

interface Item {
    id: string;
    imageUrl: string;
    videoUrl?: string;
    title: string;
    providerName: string;
    providerAvatar: string;
    providerId?: string;
    price?: string;
    rating?: number;
    width?: number;
    height?: number;
}

interface MasonryGridFeedProps {
    items: Item[];
    onRefresh?: () => void;
    refreshing?: boolean;
    onItemPress: (item: Item) => void;
    onBookPress: (item: Item) => void;
    numColumns?: number;
    scrollEnabled?: boolean;
    showTitle?: boolean;
    showRating?: boolean;
}

export function MasonryGridFeed({
    items,
    onRefresh,
    refreshing = false,
    onItemPress,
    onBookPress,
    numColumns = 2,
    scrollEnabled = true,
    showTitle = true,
    showRating = true
}: MasonryGridFeedProps) {

    const columns = useMemo(() => {
        const cols: Item[][] = Array.from({ length: numColumns }, () => []);

        items.forEach((item, index) => {
            cols[index % numColumns].push(item);
        });

        return cols;
    }, [items, numColumns]);

    return (
        <ScrollView
            contentContainerClassName="p-2 pb-20"
            scrollEnabled={scrollEnabled}
            refreshControl={
                onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF4081" /> : undefined
            }
        >
            <View className="flex-row gap-2">
                {columns.map((colItems, colIndex) => (
                    <View key={colIndex} className="flex-1">
                        {colItems.map((item) => (
                            <PinCard
                                key={item.id}
                                id={item.id}
                                imageUrl={item.imageUrl}
                                videoUrl={item.videoUrl}
                                width={item.width}
                                height={item.height}
                                title={item.title}
                                providerName={item.providerName}
                                providerAvatar={item.providerAvatar}
                                providerId={item.providerId}
                                price={item.price}
                                rating={item.rating}
                                showTitle={showTitle}
                                showRating={showRating}
                                onPress={() => onItemPress(item)}
                                onBook={() => onBookPress(item)}
                                style={{ height: undefined }}
                            />
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

