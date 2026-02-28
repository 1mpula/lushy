import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Header } from '@/components/molecules/Header';
import { BookingModal } from '@/components/organisms/BookingModal';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useServices } from '@/context/ServiceContext';
import { useUser } from '@/context/UserContext';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Trash2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useUser();
    const { getProfessionalByUserId } = useProfessionals();
    const { getServiceById, deleteService, isLoading } = useServices();

    // ALL useState hooks MUST be at the top before any conditional returns
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [viewerVisible, setViewerVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const service = getServiceById(id as string);

    // Check ownership
    const professionalProfile = user ? getProfessionalByUserId(user.id) : null;
    const isOwner = professionalProfile?.id === service?.professionalId;

    // Reset error when service changes
    const mainImage = imageError
        ? 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&fit=crop'
        : service?.imageUrl;

    const handleDelete = () => {
        Alert.alert(
            "Delete Service",
            "Are you sure you want to delete this service? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (!service) return;
                        try {
                            setIsDeleting(true);
                            await deleteService(service.id, service.imageUrls);
                            Alert.alert('Deleted', 'Service removed successfully', [
                                { text: 'OK', onPress: () => router.back() }
                            ]);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete');
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    const { width: screenWidth } = Dimensions.get('window');

    // Blurhash for placeholders
    const blurhash =
        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ';

    if (isLoading || isDeleting) {
        return (
            <View className="flex-1 bg-white">
                <View style={{ width: screenWidth, aspectRatio: 4 / 3 }}>
                    <Skeleton width="100%" height="100%" radius={0} />
                </View>
                <View className="p-6 gap-4">
                    <Skeleton width={100} height={24} radius={12} />
                    <Skeleton width="80%" height={32} />
                    <Skeleton width={80} height={20} />
                    <View className="h-4" />
                    <Skeleton width="100%" height={100} />
                </View>
            </View>
        );
    }

    if (!service) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-6">
                <Text className="text-lg font-bold text-charcoal mb-2">Service not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-primary font-bold">Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const serviceItem = {
        title: service.name,
        imageUrl: service.imageUrl,
        price: `P${service.price}`,
        providerName: service.professionalName,
        providerId: service.professionalId,
        providerAddress: service.professionalLocation || undefined,
    };

    return (
        <View className="flex-1 bg-white">
            <Header
                variant="overlay"
                className="bg-transparent"
                rightElement={isOwner ? (
                    <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="w-10 h-10 items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30"
                        >
                            <Trash2 color="white" size={20} />
                        </TouchableOpacity>
                    </MotiView>
                ) : undefined}
            />


            <ScrollView className="flex-1">
                {/* Main Image Gallery */}
                <View style={{ width: screenWidth, aspectRatio: 4 / 3, backgroundColor: '#f3f4f6' }}>
                    {service.imageUrls && service.imageUrls.length > 1 ? (
                        <>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                scrollEventThrottle={16}
                            >
                                {service.imageUrls.map((url, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            setSelectedImageIndex(index);
                                            setViewerVisible(true);
                                        }}
                                    >
                                        <Image
                                            source={{ uri: url }}
                                            style={{ width: screenWidth, aspectRatio: 4 / 3 }}
                                            contentFit="cover"
                                            placeholder={blurhash}
                                            transition={200}
                                            onError={() => {
                                                console.log('Image load error for URL:', url);
                                            }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <View className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs font-bold">
                                    {service.imageUrls.length} photos
                                </Text>
                            </View>
                        </>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                setSelectedImageIndex(0);
                                setViewerVisible(true);
                            }}
                        >
                            <Image
                                source={{ uri: mainImage }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                                placeholder={blurhash}
                                transition={200}
                                onError={(e) => {
                                    console.log('Main image load error:', e);
                                    setImageError(true);
                                }}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View className="p-6">
                    {/* Category Chip */}
                    <View className="bg-secondary/10 px-3 py-1 rounded-full self-start mb-3">
                        <Text className="text-primary text-xs font-bold">{service.category}</Text>
                    </View>

                    {/* Title & Price */}
                    <Text className="text-2xl font-bold font-heading text-charcoal mb-2">
                        {service.name}
                    </Text>
                    <Text className="text-3xl font-bold text-primary mb-4">
                        P{service.price}
                    </Text>

                    {/* Duration & Location */}
                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-row items-center">
                            <Clock size={16} color="#757575" />
                            <Text className="text-mediumGray ml-2">{service.durationMinutes} min</Text>
                        </View>
                        {service.professionalLocation && (
                            <View className="flex-row items-center">
                                <MapPin size={16} color="#757575" />
                                <Text className="text-mediumGray ml-2">{service.professionalLocation}</Text>
                            </View>
                        )}
                    </View>

                    {/* Description */}
                    <Text className="text-lg font-bold text-charcoal mb-2">Description</Text>
                    <Text className="text-mediumGray leading-6 mb-6">
                        {service.description || 'No description provided.'}
                    </Text>

                    {/* Provider Card */}
                    <TouchableOpacity
                        onPress={() => router.push(`/pro/${service.professionalId}`)}
                        className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-6"
                    >
                        <Image
                            source={{ uri: service.professionalAvatar }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <View className="flex-1">
                            <Text className="font-bold text-charcoal">{service.professionalName}</Text>
                            <Text className="text-mediumGray text-sm">View profile →</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Footer */}
            <SafeAreaView edges={['bottom']} className="bg-white border-t border-gray-100">
                <View className="p-6">
                    <Button
                        title={isOwner ? "Edit Service" : "Book Now"}
                        onPress={() => {
                            if (isOwner) {
                                router.push(`/pro/edit-service?serviceId=${id}`);
                            } else {
                                setBookingModalVisible(true);
                            }
                        }}
                        size="lg"
                        className="w-full shadow-lg shadow-pink-200"
                    />
                </View>
            </SafeAreaView>

            <BookingModal
                visible={bookingModalVisible}
                onClose={() => setBookingModalVisible(false)}
                serviceItem={serviceItem}
            />

            {/* Custom Full Screen Image Viewer Modal */}
            <Modal
                visible={viewerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setViewerVisible(false)}
            >
                <SafeAreaView className="flex-1 bg-black">
                    <TouchableOpacity
                        onPress={() => setViewerVisible(false)}
                        className="absolute top-12 left-4 z-50 w-10 h-10 bg-black/50 items-center justify-center rounded-full"
                    >
                        <ArrowLeft color="white" size={24} />
                    </TouchableOpacity>

                    <View className="flex-1 items-center justify-center">
                        <Image
                            source={{
                                uri: (service?.imageUrls && service.imageUrls.length > 0)
                                    ? service.imageUrls[selectedImageIndex]
                                    : mainImage
                            }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="contain"
                            transition={200}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
}
