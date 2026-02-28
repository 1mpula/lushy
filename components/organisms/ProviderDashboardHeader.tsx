import { Image } from 'expo-image';
import { Upload } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Button } from '../atoms/Button';

interface ProviderStats {
    bookings: number;
    views: number;
    rating: number;
}

interface ProviderDashboardHeaderProps {
    providerName: string;
    providerAvatar: string;
    stats: ProviderStats;
    onUploadPress: () => void;
}

export function ProviderDashboardHeader({
    providerName,
    providerAvatar,
    stats,
    onUploadPress
}: ProviderDashboardHeaderProps) {
    return (
        <View className="p-4 bg-white border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                    <Image
                        source={providerAvatar}
                        className="w-16 h-16 mr-4 rounded-full"
                        contentFit="cover"
                    />
                    <View>
                        <Text className="text-xl font-bold font-heading text-charcoal">{providerName}</Text>
                        <Text className="text-sm rounded-full text-secondary font-bodyMedium">Verified Pro</Text>
                    </View>
                </View>
                <Button
                    title="Upload"
                    onPress={onUploadPress}
                    size="sm"
                    variant="secondary"
                    icon={<Upload size={16} color="#333" />}
                />
            </View>

            <View className="flex-row justify-between px-2 py-4 rounded-lg bg-offWhite">
                <View className="items-center flex-1 border-r border-gray-200">
                    <Text className="text-lg font-bold text-primary font-heading">{stats.bookings}</Text>
                    <Text className="text-xs text-mediumGray font-body">Bookings</Text>
                </View>
                <View className="items-center flex-1 border-r border-gray-200">
                    <Text className="text-lg font-bold text-charcoal font-heading">{stats.views}</Text>
                    <Text className="text-xs text-mediumGray font-body">Views</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-lg font-bold text-charcoal font-heading">{stats.rating}</Text>
                    <Text className="text-xs text-mediumGray font-body">Rating</Text>
                </View>
            </View>
        </View>
    );
}
