import { Input } from '@/components/atoms/Input';
import { DEFAULT_FILTERS, FilterModal, FilterOptions } from '@/components/organisms/FilterModal';
import { MasonryGridFeed } from '@/components/organisms/MasonryGridFeed';
import { Colors } from '@/constants/theme';
import { useServices } from '@/context/ServiceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Filter, Search } from 'lucide-react-native';
import { Skeleton } from 'moti/skeleton';
import { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ExploreScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];
    const { services, isLoading, error, refreshServices } = useServices();
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

    // Check if any filters are active
    const hasActiveFilters = (
        filters.category !== 'All' ||
        filters.sortBy !== 'default' ||
        filters.priceRange[0] !== 0 ||
        filters.priceRange[1] !== 500 ||
        filters.minRating !== 0 ||
        filters.maxDuration !== 0
    );

    // Transform services to feed format for MasonryGridFeed
    const feedItems = useMemo(() => {
        return services.map(service => ({
            id: service.id,
            imageUrl: service.imageUrl,
            videoUrl: service.videoUrl,
            gallery: [service.imageUrl],
            title: service.name,
            description: service.description,
            providerId: service.professionalId,
            providerName: service.professionalName,
            providerAvatar: service.professionalAvatar,
            width: service.imageWidth,
            height: service.imageHeight,
            price: `P${service.price}`,
            priceNum: service.price,
            category: service.category,
            tags: [service.category.toLowerCase()],
            rating: service.professionalRating,
            durationMinutes: service.durationMinutes,
        }));

    }, [services]);

    const filteredItems = useMemo(() => {
        let items = feedItems.filter((item) => {
            // Text search
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            // Category
            const matchesCategory =
                filters.category === 'All' || item.category === filters.category;

            // Price range
            const matchesPrice =
                item.priceNum >= filters.priceRange[0] &&
                item.priceNum <= filters.priceRange[1];

            // Min rating
            const matchesRating =
                filters.minRating === 0 || (item.rating ?? 0) >= filters.minRating;

            // Duration
            const matchesDuration =
                filters.maxDuration === 0 || (item.durationMinutes ?? 0) <= filters.maxDuration;

            return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesDuration;
        });

        // Sort
        if (filters.sortBy === 'price_low') {
            items = [...items].sort((a, b) => a.priceNum - b.priceNum);
        } else if (filters.sortBy === 'price_high') {
            items = [...items].sort((a, b) => b.priceNum - a.priceNum);
        } else if (filters.sortBy === 'rating') {
            items = [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        }
        // 'newest' and 'default' keep original order (newest from API)

        return items;
    }, [feedItems, searchQuery, filters]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshServices();
        setIsRefreshing(false);
    };

    const handleItemPress = (item: any) => {
        router.push(`/product/${item.id}`);
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-background pt-16 px-5">
                <View className="mb-8">
                    <Skeleton width={180} height={40} radius={8} />
                    <View className="h-6" />
                    <Skeleton width="100%" height={52} radius={26} />
                </View>

                <View className="flex-row gap-4">
                    {/* Column 1 */}
                    <View className="flex-1 gap-4">
                        <Skeleton width="100%" height={240} radius={24} />
                        <Skeleton width="100%" height={320} radius={24} />
                        <Skeleton width="100%" height={180} radius={24} />
                    </View>
                    {/* Column 2 */}
                    <View className="flex-1 gap-4">
                        <Skeleton width="100%" height={300} radius={24} />
                        <Skeleton width="100%" height={200} radius={24} />
                        <Skeleton width="100%" height={260} radius={24} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header & Search */}
                <View className="pb-1 z-10 bg-background">
                    <View className="px-5">
                        <Text className="text-2xl font-bold font-heading text-primary mb-2 pt-0 tracking-wide">Discover</Text>
                        <View className="flex-row gap-3 items-center mb-4">
                            <View className="flex-1">
                                <Input
                                    placeholder="Search braids, nails, makeup..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    containerClassName="mb-0 shadow-sm"
                                    className="rounded-full bg-muted border-border h-12 text-[15px] px-5"
                                    leftIcon={<Search size={20} color={themeColors.icon} />}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => setFilterModalVisible(true)}
                                className="bg-primary h-12 w-12 items-center justify-center rounded-full shadow-sm shadow-pink-200"
                            >
                                <Filter size={20} color="white" />
                                {hasActiveFilters && (
                                    <View className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-teal-400 rounded-full border-2 border-white" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                {/* Feed */}
                <View className="flex-1 bg-muted/30">
                    {error ? (
                        <View className="flex-1 items-center justify-center p-6">
                            <Text className="text-red-500 mb-4">{error}</Text>
                            <TouchableOpacity onPress={refreshServices}>
                                <Text className="text-primary font-bold">Tap to retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : filteredItems.length === 0 ? (
                        <View className="flex-1 items-center justify-center p-6 bg-background">
                            <Text className="text-2xl mb-2">✨</Text>
                            <Text className="text-lg font-bold text-foreground mb-2">
                                {hasActiveFilters ? 'No matches found' : 'No services yet'}
                            </Text>
                            <Text className="text-muted-foreground text-center">
                                {hasActiveFilters
                                    ? 'Try adjusting your filters or search terms.'
                                    : "Be the first to add services!\nProfessionals can add their offerings."}
                            </Text>
                            {hasActiveFilters && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setFilters(DEFAULT_FILTERS);
                                        setSearchQuery('');
                                    }}
                                    className="mt-4 px-6 py-3 bg-primary/10 rounded-full"
                                >
                                    <Text className="text-primary font-bold text-sm">Clear All Filters</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <MasonryGridFeed
                            items={filteredItems}
                            onItemPress={handleItemPress}
                            onBookPress={handleItemPress}
                            numColumns={2}
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                        />
                    )}
                </View>
            </SafeAreaView>

            {/* Filter Modal */}
            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                filters={filters}
                onApply={setFilters}
            />
        </View>
    );
}

