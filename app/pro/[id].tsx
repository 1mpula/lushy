import { Button } from '@/components/atoms/Button';
import { useTheme } from '@/context/ThemeContext';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Header } from '@/components/molecules/Header';
import { BookingModal } from '@/components/organisms/BookingModal';
import { MasonryGridFeed } from '@/components/organisms/MasonryGridFeed';
import { useChat } from '@/context/ChatContext';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useServices } from '@/context/ServiceContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Briefcase, Grid, MapPin, MessageCircle, Star } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProProfile() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { getProfessionalById, isLoading: proLoading } = useProfessionals();
    const { theme } = useTheme();
    const { getServicesByProfessional, isLoading: servicesLoading } = useServices();
    const { getOrCreateConversation } = useChat();

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [isStartingChat, setIsStartingChat] = useState(false);

    const pro = getProfessionalById(id as string);
    const services = getServicesByProfessional(id as string);

    // Transform services to feed format for MasonryGridFeed
    const feedItems = services.map(service => ({
        id: service.id,
        imageUrl: service.imageUrl,
        videoUrl: service.videoUrl,
        title: service.name,
        providerName: pro?.businessName || pro?.fullName || 'Professional',
        providerAvatar: pro?.avatarUrl || '',
        providerId: pro?.id,
        price: `P${service.price}`,
        rating: pro?.rating,
        width: service.imageWidth,
        height: service.imageHeight,
    }));

    const handleServicePress = (item: any) => {
        setSelectedItem({
            title: item.title,
            imageUrl: item.imageUrl,
            price: item.price,
            providerName: item.providerName,
            providerId: item.providerId,
            providerAddress: pro?.location || undefined,
        });
        setBookingModalVisible(true);
    };

    const handleMessage = async () => {
        if (!pro?.id || isStartingChat) return;

        setIsStartingChat(true);
        try {
            const conversationId = await getOrCreateConversation(pro.id);
            if (conversationId) {
                router.push(`/chat/${conversationId}`);
            } else {
                Alert.alert('Error', 'Could not start conversation. Please try again.');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
            Alert.alert('Error', 'Could not start conversation. Please try again.');
        } finally {
            setIsStartingChat(false);
        }
    };

    if (proLoading || servicesLoading) {
        return (
            <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }}>
                <View className="h-56" style={{ backgroundColor: theme === 'dark' ? '#1A1A1A' : '#F9FAFB' }} />
                <View className="px-6 -mt-12">
                    <Skeleton width={100} height={100} radius={50} />
                    <View className="mt-4 gap-2">
                        <Skeleton width="60%" height={32} />
                        <Skeleton width="40%" height={20} />
                    </View>
                    <View className="mt-6 gap-2">
                        <Skeleton width="100%" height={16} />
                        <Skeleton width="100%" height={16} />
                        <Skeleton width="80%" height={16} />
                    </View>
                </View>
                <View className="flex-row gap-4 px-6 mt-10">
                    <View className="flex-1">
                        <Skeleton width="100%" height={150} />
                    </View>
                    <View className="flex-1">
                        <Skeleton width="100%" height={150} />
                    </View>
                </View>
            </View>
        );
    }

    if (!pro) {
        return (
            <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }}>
                <Text className="text-lg font-bold mb-2" style={{ color: theme === 'dark' ? '#FFFFFF' : '#2D2D2D' }}>Professional not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-primary font-bold">Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }}>
            {/* Header Background (Fixed) */}
            <View style={{ width: '100%', height: 224, position: 'absolute', top: 0, left: 0 }}>
                <Image
                    source={{ uri: pro.bannerUrl || pro.avatarUrl }}
                    style={{ width: '100%', height: '100%' }}
                    blurRadius={pro.bannerUrl ? 0 : 80}
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                />
            </View>

            {/* Standardized Floating Back Button */}
            <Header variant="overlay" showBack={true} />

            {/* Main Scrolling Content */}
            <ScrollView
                className="flex-1 z-10"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Spacer for gradient header */}
                <View className="h-40" />

                {/* Body Container */}
                <View className="rounded-t-[48px] px-0 pt-16 pb-32 min-h-screen shadow-2xl" style={{ backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF' }}>
                    {/* Avatar (Floating Overlap) */}
                    <MotiView
                        from={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 14 }}
                        className="absolute -top-16 left-0 right-0 items-center"
                    >
                        <View className="relative" style={{
                            shadowColor: '#FF4081',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: theme === 'dark' ? 0.15 : 0.2,
                            shadowRadius: 20,
                            elevation: 10
                        }}>
                            <View className="p-1 rounded-full backdrop-blur-md" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)', borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)' }}>
                                <Image
                                    source={{ uri: pro.avatarUrl }}
                                    className="w-32 h-32 rounded-full border-[4px]"
                                    style={{ borderColor: theme === 'dark' ? '#2A2A2A' : '#FFFFFF', backgroundColor: theme === 'dark' ? '#1A1A1A' : '#F3F4F6' }}
                                    contentFit="cover"
                                />
                            </View>
                        </View>
                    </MotiView>

                    {/* Name & Location - Centered */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200, type: 'timing', duration: 600 }}
                        className="items-center px-6 mb-6"
                    >
                        <View className="flex-row items-center justify-center mb-2 px-4 flex-wrap">
                            <Text className="text-2xl font-bold font-outfit text-deepCharcoal text-center">
                                {pro.businessName || pro.fullName}
                            </Text>
                            <Star size={20} color="#FF4081" fill="#FF4081" className="ml-2 mb-1" />
                        </View>

                        <View className="flex-row items-center mb-4">
                            <MapPin size={14} color="#FF4081" />
                            <Text className="text-mediumGray font-inter ml-1.5">{pro.location || 'Location not set'}</Text>
                        </View>

                        {/* Rating Badge */}
                        <View className="flex-row items-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100">
                            <Star size={14} color="#FFB800" fill="#FFB800" />
                            <Text className="font-bold text-deepCharcoal ml-1.5 text-sm">{pro.rating || 'New'}</Text>
                            <View className="w-[1px] h-4 bg-yellow-200 mx-3" />
                            <Text className="text-sm text-mediumGray font-bold">{pro.totalReviews} Reviews</Text>
                        </View>
                    </MotiView>

                    {/* Bio Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 300, type: 'timing', duration: 600 }}
                        className="mx-6 mb-6 p-5 rounded-3xl border border-border"
                        style={{ 
                            backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                            shadowColor: '#FF4081',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: theme === 'dark' ? 0.05 : 0.08,
                            shadowRadius: 20,
                            elevation: 5
                        }}
                    >
                        <View className="flex-row items-center mb-3">
                            <Briefcase size={16} color="#FF4081" />
                            <Text className="text-base font-bold font-outfit ml-2" style={{ color: theme === 'dark' ? '#FFFFFF' : '#2D2D2D' }}>About</Text>
                        </View>
                        <Text className="font-inter leading-6" style={{ color: theme === 'dark' ? '#A0A0A0' : '#8E8E93' }}>
                            {pro.bio || 'No bio yet.'}
                        </Text>
                    </MotiView>

                    {/* Expertise Chips */}
                    {(pro.expertise || []).length > 0 && (
                        <MotiView
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 400, type: 'timing', duration: 600 }}
                            className="px-6 mb-8"
                        >
                            <View className="flex-row gap-2 flex-wrap">
                                {(pro.expertise || []).map((exp: string) => (
                                    <View key={exp} className="bg-primary/10 px-4 py-2 rounded-full">
                                        <Text className="text-primary text-xs font-bold tracking-wide">{exp}</Text>
                                    </View>
                                ))}
                            </View>
                        </MotiView>
                    )}

                    {/* Services Section */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 500 }}
                        className="pt-8 pb-32 min-h-[400px] rounded-t-[40px] border-t border-border/50"
                        style={{ 
                            backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -4 },
                            shadowOpacity: theme === 'dark' ? 0.1 : 0.03,
                            shadowRadius: 10,
                            elevation: 2
                        }}
                    >
                        <View className="px-6 flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-xl font-bold font-outfit" style={{ color: theme === 'dark' ? '#FFFFFF' : '#2D2D2D' }}>Services</Text>
                                <Text className="text-gray-400 text-xs font-medium font-inter uppercase tracking-widest mt-0.5">Available Now</Text>
                            </View>
                            <View className="flex-row items-center px-4 py-2 rounded-full shadow-sm border border-border" style={{ backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF' }}>
                                <Grid size={14} color="#FF4081" />
                                <Text className="text-xs font-bold ml-2" style={{ color: theme === 'dark' ? '#FFFFFF' : '#2D2D2D' }}>{services.length}</Text>
                            </View>
                        </View>

                        {services.length === 0 ? (
                            <View className="items-center justify-center p-12">
                                <View className="w-20 h-20 bg-card border border-border rounded-full items-center justify-center mb-4 shadow-sm">
                                    <Grid size={32} color="#CBD5E1" />
                                </View>
                                <Text className="text-gray-400 font-bold font-inter">No services listed yet.</Text>
                            </View>
                        ) : (
                            <MasonryGridFeed
                                items={feedItems}
                                onItemPress={handleServicePress}
                                onBookPress={handleServicePress}
                                scrollEnabled={false}
                            />
                        )}
                    </MotiView>
                </View>
            </ScrollView>

            {/* Bottom Floating Action Bar */}
            <View className="absolute bottom-0 w-full px-6 py-4 backdrop-blur-xl border-t border-border z-20" style={{ backgroundColor: theme === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
                <SafeAreaView edges={['bottom']}>
                    <View className="flex-row gap-3">
                        <Button
                            title={isStartingChat ? "Opening..." : "Message"}
                            variant="secondary"
                            onPress={handleMessage}
                            className="flex-1 rounded-full"
                            icon={<MessageCircle size={18} color={theme === 'dark' ? '#FFF' : '#333'} />}
                            disabled={isStartingChat}
                        />
                        <Button
                            title="Book Now"
                            onPress={() => {
                                if (services.length > 0) {
                                    handleServicePress(services[0]);
                                } else {
                                    // Handle no services case
                                }
                            }}
                            className="flex-[2] rounded-full"
                        />
                    </View>
                </SafeAreaView>
            </View>

            <BookingModal
                visible={bookingModalVisible}
                onClose={() => setBookingModalVisible(false)}
                serviceItem={selectedItem}
            />
        </View>
    );
}
