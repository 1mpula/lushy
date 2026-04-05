import { Button } from '@/components/atoms/Button';
import { ArrowUpDown, Clock, DollarSign, Grid, RotateCcw, Star, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface FilterOptions {
    category: string;
    sortBy: 'default' | 'price_low' | 'price_high' | 'rating' | 'newest';
    priceRange: [number, number]; // [min, max]
    minRating: number; // 0 = any, 1-5
    maxDuration: number; // 0 = any, in minutes
}

export const DEFAULT_FILTERS: FilterOptions = {
    category: 'All',
    sortBy: 'default',
    priceRange: [0, 500],
    minRating: 0,
    maxDuration: 0,
};

const CATEGORIES = ['All', 'Hair', 'Nails', 'Lashes', 'Wigs', 'Makeup'];

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    filters: FilterOptions;
    onApply: (filters: FilterOptions) => void;
}

const SORT_OPTIONS = [
    { id: 'default', label: 'Recommended', icon: <ArrowUpDown size={16} color="#757575" /> },
    { id: 'price_low', label: 'Price: Low → High', icon: <DollarSign size={16} color="#10B981" /> },
    { id: 'price_high', label: 'Price: High → Low', icon: <DollarSign size={16} color="#FF4081" /> },
    { id: 'rating', label: 'Highest Rated', icon: <Star size={16} color="#FFB800" /> },
    { id: 'newest', label: 'Newest First', icon: <Clock size={16} color="#8B5CF6" /> },
] as const;

const PRICE_RANGES = [
    { label: 'Any', value: [0, 500] as [number, number] },
    { label: 'Under P25', value: [0, 25] as [number, number] },
    { label: 'P25 – P50', value: [25, 50] as [number, number] },
    { label: 'P50 – P100', value: [50, 100] as [number, number] },
    { label: 'P100 – P200', value: [100, 200] as [number, number] },
    { label: 'P200+', value: [200, 500] as [number, number] },
];

const RATING_OPTIONS = [
    { label: 'Any', value: 0 },
    { label: '4+ ★', value: 4 },
    { label: '3+ ★', value: 3 },
    { label: '2+ ★', value: 2 },
];

const DURATION_OPTIONS = [
    { label: 'Any', value: 0 },
    { label: '30 min or less', value: 30 },
    { label: '1 hour or less', value: 60 },
    { label: '2 hours or less', value: 120 },
];

export function FilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
    const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

    // Reset local when modal opens
    const handleOpen = () => {
        setLocalFilters(filters);
    };

    const handleReset = () => {
        setLocalFilters(DEFAULT_FILTERS);
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const isFilterActive = (
        localFilters.category !== 'All' ||
        localFilters.sortBy !== 'default' ||
        localFilters.priceRange[0] !== 0 ||
        localFilters.priceRange[1] !== 500 ||
        localFilters.minRating !== 0 ||
        localFilters.maxDuration !== 0
    );

    const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
        <View className="flex-row items-center gap-2 mb-4 mt-2">
            {icon}
            <Text className="text-base font-bold font-outfit text-deepCharcoal">{title}</Text>
        </View>
    );

    const ChipOption = ({
        label,
        selected,
        onPress,
    }: {
        label: string;
        selected: boolean;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-2.5 rounded-full border mr-2 mb-2 ${selected
                ? 'bg-primary border-primary'
                : 'bg-card border-border'
                }`}
        >
            <Text
                className={`text-xs font-bold ${selected ? 'text-white' : 'text-deepCharcoal'
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
            onShow={handleOpen}
        >
            <SafeAreaView className="flex-1 bg-background" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
                    <TouchableOpacity
                        onPress={onClose}
                        className="w-10 h-10 bg-card rounded-full items-center justify-center"
                    >
                        <X size={20} color="#333" />
                    </TouchableOpacity>

                    <Text className="text-lg font-bold font-outfit text-deepCharcoal">Filters</Text>

                    <TouchableOpacity
                        onPress={handleReset}
                        className="flex-row items-center gap-1.5 px-3 py-2 rounded-full bg-card"
                    >
                        <RotateCcw size={14} color="#FF4081" />
                        <Text className="text-xs font-bold text-primary">Reset</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}
                >
                    {/* Category */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 50 }}
                    >
                        <SectionTitle
                            icon={<Grid size={18} color="#3B82F6" />}
                            title="Category"
                        />
                        <View className="flex-row flex-wrap mb-6">
                            {CATEGORIES.map((cat) => (
                                <ChipOption
                                    key={cat}
                                    label={cat}
                                    selected={localFilters.category === cat}
                                    onPress={() =>
                                        setLocalFilters({ ...localFilters, category: cat })
                                    }
                                />
                            ))}
                        </View>
                    </MotiView>

                    {/* Sort By */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 100 }}
                    >
                        <SectionTitle
                            icon={<ArrowUpDown size={18} color="#FF4081" />}
                            title="Sort By"
                        />
                        <View className="gap-2 mb-6">
                            {SORT_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => setLocalFilters({ ...localFilters, sortBy: option.id })}
                                    className={`flex-row items-center p-4 rounded-2xl border ${localFilters.sortBy === option.id
                                        ? 'bg-primary/5 border-primary/30'
                                        : 'bg-card border-border'
                                        }`}
                                >
                                    <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${localFilters.sortBy === option.id ? 'bg-primary/10' : 'bg-background'
                                        }`}>
                                        {option.icon}
                                    </View>
                                    <Text className={`font-semibold text-sm ${localFilters.sortBy === option.id ? 'text-primary' : 'text-deepCharcoal'
                                        }`}>
                                        {option.label}
                                    </Text>
                                    {localFilters.sortBy === option.id && (
                                        <View className="ml-auto w-5 h-5 bg-primary rounded-full items-center justify-center">
                                            <Text className="text-white text-[10px] font-bold">✓</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </MotiView>

                    {/* Price Range */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200 }}
                    >
                        <SectionTitle
                            icon={<DollarSign size={18} color="#10B981" />}
                            title="Price Range"
                        />
                        <View className="flex-row flex-wrap mb-6">
                            {PRICE_RANGES.map((range) => (
                                <ChipOption
                                    key={range.label}
                                    label={range.label}
                                    selected={
                                        localFilters.priceRange[0] === range.value[0] &&
                                        localFilters.priceRange[1] === range.value[1]
                                    }
                                    onPress={() =>
                                        setLocalFilters({ ...localFilters, priceRange: range.value })
                                    }
                                />
                            ))}
                        </View>
                    </MotiView>

                    {/* Minimum Rating */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 300 }}
                    >
                        <SectionTitle
                            icon={<Star size={18} color="#FFB800" />}
                            title="Minimum Rating"
                        />
                        <View className="flex-row flex-wrap mb-6">
                            {RATING_OPTIONS.map((option) => (
                                <ChipOption
                                    key={option.label}
                                    label={option.label}
                                    selected={localFilters.minRating === option.value}
                                    onPress={() =>
                                        setLocalFilters({ ...localFilters, minRating: option.value })
                                    }
                                />
                            ))}
                        </View>
                    </MotiView>

                    {/* Duration */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 400 }}
                    >
                        <SectionTitle
                            icon={<Clock size={18} color="#8B5CF6" />}
                            title="Duration"
                        />
                        <View className="flex-row flex-wrap mb-6">
                            {DURATION_OPTIONS.map((option) => (
                                <ChipOption
                                    key={option.label}
                                    label={option.label}
                                    selected={localFilters.maxDuration === option.value}
                                    onPress={() =>
                                        setLocalFilters({ ...localFilters, maxDuration: option.value })
                                    }
                                />
                            ))}
                        </View>
                    </MotiView>
                </ScrollView>

                {/* Footer */}
                <View className="px-6 py-4 border-t border-border">
                    <SafeAreaView edges={['bottom']}>
                        <Button
                            title={isFilterActive ? 'Apply Filters' : 'Show All Results'}
                            onPress={handleApply}
                            size="lg"
                            className="shadow-lg shadow-pink-200"
                        />
                    </SafeAreaView>
                </View>
            </SafeAreaView>
        </Modal>
    );
}
