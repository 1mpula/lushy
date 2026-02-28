import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Header } from '@/components/molecules/Header';
import { ServiceCard } from '@/components/molecules/ServiceCard';
import { MasonryGridFeed } from '@/components/organisms/MasonryGridFeed';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useSavedPosts } from '@/context/SavedPostsContext';
import { useServices } from '@/context/ServiceContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useUser } from '@/context/UserContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar, Grid, Heart, LogOut, MapPin, Plus, Settings, Star } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const { userRole, user, logout } = useUser();
    const { savedPosts } = useSavedPosts();
    const { getProfessionalByUserId, isLoading: proLoading } = useProfessionals();
    const { getServicesByProfessional, isLoading: servicesLoading } = useServices();
    const { isPro } = useSubscription();

    // Tab State
    const [activeTab, setActiveTab] = useState(userRole === 'provider' ? 'services' : 'saved');

    // Get pro data from Supabase
    const myProfessional = getProfessionalByUserId(user?.id || '');
    const myServices = getServicesByProfessional(myProfessional?.id || '');

    // Convert savedPosts to feed format
    const savedItems = savedPosts.map(post => ({ ...post, height: 250 }));

    const myFeedItems = myServices.map(service => ({
        id: service.id,
        imageUrl: service.imageUrl,
        videoUrl: service.videoUrl || undefined,
        title: service.name,
        providerName: myProfessional?.businessName || myProfessional?.fullName || 'Professional',
        providerAvatar: myProfessional?.avatarUrl || user?.avatarUrl || '',
        providerId: myProfessional?.id,
        price: `P${service.price}`,
        rating: myProfessional?.rating,
        width: service.imageWidth,
        height: service.imageHeight,
    }));

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        // Use setTimeout to ensure navigation happens after state updates
                        setTimeout(() => {
                            router.replace('/');
                        }, 100);
                    }
                }
            ]
        );
    };

    const TabButton = ({ id, label, icon }: any) => {
        const isActive = activeTab === id;
        return (
            <TouchableOpacity
                onPress={() => setActiveTab(id)}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-full mx-1 ${isActive ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            >
                {/* Clone icon with color based on active state */}
                <View className="mr-2">
                    {id === 'services' && <Grid size={18} color={isActive ? '#FF4081' : '#757575'} />}
                    {id === 'reviews' && <Star size={18} color={isActive ? '#FF4081' : '#757575'} />}
                    {id === 'saved' && <Heart size={18} color={isActive ? '#FF4081' : '#757575'} />}
                    {id === 'bookings' && <Calendar size={18} color={isActive ? '#FF4081' : '#757575'} />}
                </View>
                <Text className={`font-bold ${isActive ? 'text-charcoal' : 'text-mediumGray'}`}>{label}</Text>
            </TouchableOpacity>
        );
    };

    const defaultAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop';
    const currentAvatar = myProfessional?.avatarUrl || user?.avatarUrl || defaultAvatar;

    return (
        <View className="flex-1 bg-white">
            {/* 1. Header Background (Fixed) */}
            <View style={{ width: '100%', height: 224, position: 'absolute', top: 0, left: 0 }}>
                <Image
                    source={{ uri: myProfessional?.bannerUrl || currentAvatar }}
                    style={{ width: '100%', height: '100%' }}
                    blurRadius={myProfessional?.bannerUrl ? 0 : 80}
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                />
            </View>

            {/* 2. Standardized Header Overlay */}
            <Header
                variant="overlay"
                showBack={false}
                rightElement={
                    <View className="flex-row gap-3">
                        <TouchableOpacity onPress={handleLogout} className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/30">
                            <LogOut size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/settings')} className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/30">
                            <Settings size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* 3. Main Scrolling Content */}
            <ScrollView
                className="flex-1 z-10"
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[2]}
            >
                {/* Spacer (Reduced) */}
                <View className="h-40" />

                {/* White Body Container */}
                <View className="bg-slate-50 rounded-t-[48px] px-6 pt-16 pb-32 min-h-screen shadow-2xl">
                    {/* Avatar (Floating Overlap) */}
                    <MotiView
                        from={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="absolute -top-16 left-0 right-0 items-center"
                    >
                        <View className="relative shadow-2xl shadow-pink-200">
                            <View className="p-1 rounded-full bg-white/40 border border-white/50 backdrop-blur-md">
                                <Image
                                    source={{ uri: currentAvatar }}
                                    className="w-32 h-32 rounded-full border-[4px] border-white bg-slate-100"
                                    contentFit="cover"
                                />
                            </View>
                        </View>
                    </MotiView>

                    {/* Name & Location */}
                    <View className="items-center mb-10">
                        <View className="flex-row items-center justify-center mb-2 px-4 flex-wrap">
                            <Text className="text-2xl font-bold font-heading text-charcoal text-center">
                                {userRole === 'provider'
                                    ? (myProfessional?.businessName || myProfessional?.fullName || 'Set up your business')
                                    : (user?.fullName || 'Guest')}
                            </Text>
                            {userRole === 'provider' && (
                                <View className={`ml-2 px-2 py-0.5 rounded-full ${isPro ? 'bg-primary' : 'bg-gray-300'}`}>
                                    <Text className="text-white text-xs font-bold">{isPro ? 'PRO' : 'BASIC'}</Text>
                                </View>
                            )}
                        </View>

                        <View className="flex-row items-center justify-center">
                            {userRole === 'provider' ? (
                                <>
                                    <MapPin size={16} color="#94A3B8" className="mr-1" />
                                    <Text className="text-gray-500 font-medium">
                                        {myProfessional?.location || 'Add your location'}
                                    </Text>
                                </>
                            ) : (
                                <Text className="text-gray-500 font-medium">{user?.email || ''}</Text>
                            )}
                        </View>
                    </View>

                    {/* Stats Card (Provider Only) */}
                    {userRole === 'provider' && (
                        <View className="flex-row justify-center gap-6 mb-10 bg-white p-6 rounded-3xl shadow-xl shadow-pink-100/40 border border-white mx-2">
                            <View className="items-center flex-1">
                                <Text className="text-xl font-bold text-charcoal">{myServices.length}</Text>
                                <Text className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Services</Text>
                            </View>
                            <View className="w-[1px] bg-gray-100 h-full" />
                            <View className="items-center flex-1">
                                <Text className="text-xl font-bold text-charcoal">{myProfessional?.totalReviews || 0}</Text>
                                <Text className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Reviews</Text>
                            </View>
                            <View className="w-[1px] bg-gray-100 h-full" />
                            <View className="items-center flex-1">
                                <Text className="text-xl font-bold text-charcoal">{myProfessional?.rating || 'New'}</Text>
                                <Text className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Rating</Text>
                            </View>
                        </View>
                    )}

                    {/* Tabs Navigation */}
                    <View className="bg-slate-200/60 p-1.5 rounded-full flex-row mb-6">
                        {userRole === 'client' || userRole === null ? (
                            <>
                                <TabButton id="saved" label="Saved" />
                                <TabButton id="bookings" label="Bookings" />
                            </>
                        ) : (
                            <>
                                <TabButton id="services" label="Services" />
                                <TabButton id="reviews" label="Reviews" />
                            </>
                        )}
                    </View>

                    {/* Tab Content Components */}
                    <View className="min-h-[400px]">
                        {proLoading || servicesLoading ? (
                            <View className="flex-row flex-wrap justify-between mt-4">
                                <View style={{ width: '48%' }} className="mb-4 gap-2">
                                    <Skeleton width="100%" height={150} />
                                    <Skeleton width="80%" height={20} />
                                </View>
                                <View style={{ width: '48%' }} className="mb-4 gap-2">
                                    <Skeleton width="100%" height={150} />
                                    <Skeleton width="80%" height={20} />
                                </View>
                            </View>
                        ) : (
                            <>
                                {activeTab === 'saved' && (
                                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {savedItems.length === 0 ? (
                                            <View className="items-center justify-center py-24">
                                                <View className="w-20 h-20 bg-white shadow-sm rounded-full items-center justify-center mb-6">
                                                    <Heart size={32} color="#CBD5E1" />
                                                </View>
                                                <Text className="text-xl font-bold text-charcoal">No saved posts yet</Text>
                                                <Text className="text-gray-400 text-center mt-3 px-10 leading-relaxed font-medium">
                                                    Tap the heart on services you love to save them here for later.
                                                </Text>
                                            </View>
                                        ) : (
                                            <View className="flex-row flex-wrap justify-between">
                                                {savedItems.map((item, index) => (
                                                    <ServiceCard
                                                        key={item.id}
                                                        index={index}
                                                        title={item.title}
                                                        price={item.price || '0'}
                                                        imageUrl={item.imageUrl}
                                                        onPress={() => router.push(`/product/${item.id}`)}
                                                    />
                                                ))}
                                            </View>
                                        )}
                                    </MotiView>
                                )}

                                {activeTab === 'bookings' && (
                                    <MotiView
                                        from={{ opacity: 0, translateY: 10 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        className="items-center justify-center py-20"
                                    >
                                        <View className="w-20 h-20 bg-white shadow-sm rounded-full items-center justify-center mb-6">
                                            <Calendar size={32} color="#CBD5E1" />
                                        </View>
                                        <Text className="text-xl font-bold text-charcoal">No bookings yet</Text>
                                        <Button
                                            title="Explore Services"
                                            variant="secondary"
                                            className="mt-8 px-12 h-14 rounded-2xl"
                                            onPress={() => router.push('/(tabs)')}
                                        />
                                    </MotiView>
                                )}

                                {activeTab === 'services' && (
                                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {myServices.length === 0 ? (
                                            <View className="items-center justify-center py-24">
                                                <View className="w-20 h-20 bg-white shadow-sm rounded-full items-center justify-center mb-6">
                                                    <Grid size={32} color="#CBD5E1" />
                                                </View>
                                                <Text className="text-xl font-bold text-charcoal">No services yet</Text>
                                                <Button
                                                    title="Add Your First Service"
                                                    className="mt-8 px-10 h-14 rounded-2xl shadow-lg shadow-pink-200"
                                                    onPress={() => {
                                                        if (isPro) {
                                                            router.push('/pro/add-service');
                                                        } else {
                                                            Alert.alert('Subscription Required', 'You must be a Lushy Pro to add services.', [
                                                                { text: 'Cancel', style: 'cancel' },
                                                                { text: 'Subscribe', onPress: () => router.push('/pro/paywall') }
                                                            ]);
                                                        }
                                                    }}
                                                />
                                            </View>
                                        ) : (
                                            <View className="-mx-2">
                                                <MasonryGridFeed
                                                    items={myFeedItems}
                                                    onItemPress={(item) => router.push(`/product/${item.id}`)}
                                                    onBookPress={(item) => router.push(`/product/${item.id}`)}
                                                    scrollEnabled={false}
                                                />
                                            </View>
                                        )}
                                    </MotiView>
                                )}

                                {activeTab === 'reviews' && (
                                    <MotiView
                                        from={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="items-center justify-center py-24"
                                    >
                                        <View className="w-20 h-20 bg-white shadow-sm rounded-full items-center justify-center mb-6">
                                            <Star size={32} color="#CBD5E1" />
                                        </View>
                                        <Text className="text-xl font-bold text-charcoal">No reviews yet</Text>
                                        <Text className="text-gray-400 text-center mt-3 font-medium">Your reviews will appear here.</Text>
                                    </MotiView>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* 4. FAB (Above ScrollView) */}
            {userRole === 'provider' && activeTab === 'services' && (
                <TouchableOpacity
                    onPress={() => {
                        if (isPro) {
                            router.push('/pro/add-service');
                        } else {
                            Alert.alert('Subscription Required', 'You must be a Lushy Pro to add services.', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Subscribe', onPress: () => router.push('/pro/paywall') }
                            ]);
                        }
                    }}
                    className="absolute bottom-10 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-2xl shadow-pink-400 z-50 transition-all active:scale-95"
                >
                    <Plus color="white" size={32} />
                </TouchableOpacity>
            )}
        </View>
    );
}
