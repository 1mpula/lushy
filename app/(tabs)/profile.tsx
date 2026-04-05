import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Header } from '@/components/molecules/Header';
import { ServiceCard } from '@/components/molecules/ServiceCard';
import { MasonryGridFeed } from '@/components/organisms/MasonryGridFeed';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useSavedPosts } from '@/context/SavedPostsContext';
import { useServices } from '@/context/ServiceContext';
import { useUser } from '@/context/UserContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar, Grid, Heart, LogOut, MapPin, Plus, Settings, Star } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const { userRole, user, logout } = useUser();
    const { savedPosts } = useSavedPosts();
    const { getProfessionalByUserId, isLoading: proLoading } = useProfessionals();
    const { getServicesByProfessional, isLoading: servicesLoading } = useServices();

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
                className={`flex-1 flex-row items-center justify-center py-3 rounded-full mx-1 ${isActive ? 'shadow-sm' : 'bg-transparent'}`}
                style={{ backgroundColor: isActive ? (theme === 'dark' ? '#333' : '#FFFFFF') : 'transparent' }}
            >
                {/* Clone icon with color based on active state */}
                <View className="mr-2">
                    {id === 'services' && <Grid size={18} color={isActive ? '#FF4081' : '#757575'} />}
                    {id === 'reviews' && <Star size={18} color={isActive ? '#FF4081' : '#757575'} />}
                    {id === 'saved' && <Heart size={18} color={isActive ? '#FF4081' : '#757575'} />}
                    {id === 'bookings' && <Calendar size={18} color={isActive ? '#FF4081' : '#757575'} />}
                </View>
                <Text className={`font-bold ${isActive ? 'text-foreground' : 'text-mediumGray'}`}>{label}</Text>
            </TouchableOpacity>
        );
    };

    const defaultAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop';
    const currentAvatar = myProfessional?.avatarUrl || user?.avatarUrl || defaultAvatar;

    return (
        <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }}>
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
                        <TouchableOpacity onPress={handleLogout} className="bg-background/20 p-2 rounded-full backdrop-blur-md border border-border/30">
                            <LogOut size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/settings')} className="bg-background/20 p-2 rounded-full backdrop-blur-md border border-border/30">
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
                <View 
                    className="rounded-t-[48px] px-6 pt-16 pb-32 min-h-screen shadow-2xl"
                    style={{ backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }}
                >
                    {/* Avatar (Floating Overlap) */}
                    <MotiView
                        from={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="absolute -top-16 left-0 right-0 items-center"
                    >
                        <View className="relative" style={{
                            shadowColor: '#FF4081',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: theme === 'dark' ? 0.15 : 0.2,
                            shadowRadius: 20,
                            elevation: 10
                        }}>
                            <View 
                                className="p-1 rounded-full border border-border/50 backdrop-blur-md"
                                style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)' }}
                            >
                                <Image
                                    source={{ uri: currentAvatar }}
                                    className="w-32 h-32 rounded-full border-[4px]"
                                    style={{ borderColor: theme === 'dark' ? '#333' : '#FFF', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#f1f5f9' }}
                                    contentFit="cover"
                                />
                            </View>
                        </View>
                    </MotiView>

                    {/* Name & Location */}
                    <View className="items-center mb-10">
                        <View className="flex-row items-center justify-center mb-2 px-4 flex-wrap">
                            <Text className="text-2xl font-bold font-heading text-foreground text-center">
                                {userRole === 'provider'
                                    ? (myProfessional?.businessName || myProfessional?.fullName || 'Set up your business')
                                    : (user?.fullName || 'Guest')}
                            </Text>
                            {userRole === 'provider' && (
                                <View className="ml-2 px-2 py-0.5 rounded-full bg-primary">
                                    <Text className="text-white text-xs font-bold">PRO</Text>
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
                        <View 
                            className="flex-row justify-center gap-6 mb-10 p-6 rounded-3xl border mx-2"
                            style={{ 
                                backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                                shadowColor: '#FF4081',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: theme === 'dark' ? 0.05 : 0.08,
                                shadowRadius: 15,
                                elevation: 5
                            }}
                        >
                            <View className="items-center flex-1">
                                <Text className="text-xl font-bold text-foreground">{myServices.length}</Text>
                                <Text className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Services</Text>
                            </View>
                            <View className="w-[1px] h-full" style={{ backgroundColor: theme === 'dark' ? '#333' : '#F3F4F6' }} />
                            <View className="items-center flex-1">
                                <Text className="text-xl font-bold text-foreground">{myProfessional?.totalReviews || 0}</Text>
                                <Text className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Reviews</Text>
                            </View>
                            <View className="w-[1px] h-full" style={{ backgroundColor: theme === 'dark' ? '#333' : '#F3F4F6' }} />
                            <View className="items-center flex-1">
                                <Text className="text-xl font-bold text-foreground">{myProfessional?.rating || 'New'}</Text>
                                <Text className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Rating</Text>
                            </View>
                        </View>
                    )}

                    {/* Tabs Navigation */}
                    <View 
                        className="p-1.5 rounded-full flex-row mb-6"
                        style={{ backgroundColor: theme === 'dark' ? '#1A1A1A' : '#F1F5F9' }}
                    >
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
                                                <View className="w-20 h-20 bg-background shadow-sm rounded-full items-center justify-center mb-6">
                                                    <Heart size={32} color="#CBD5E1" />
                                                </View>
                                                <Text className="text-xl font-bold text-foreground">No saved posts yet</Text>
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
                                        <View className="w-20 h-20 bg-background shadow-sm rounded-full items-center justify-center mb-6">
                                            <Calendar size={32} color="#CBD5E1" />
                                        </View>
                                        <Text className="text-xl font-bold text-foreground">No bookings yet</Text>
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
                                                <View className="w-20 h-20 bg-background shadow-sm rounded-full items-center justify-center mb-6">
                                                    <Grid size={32} color="#CBD5E1" />
                                                </View>
                                                <Text className="text-xl font-bold text-foreground">No services yet</Text>
                                                <Button
                                                    title="Add Your First Service"
                                                    className="mt-8 px-10 h-14 rounded-2xl"
                                                    onPress={() => router.push('/pro/add-service')}
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
                                        <View className="w-20 h-20 bg-background shadow-sm rounded-full items-center justify-center mb-6">
                                            <Star size={32} color="#CBD5E1" />
                                        </View>
                                        <Text className="text-xl font-bold text-foreground">No reviews yet</Text>
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
                    activeOpacity={0.8}
                    onPress={() => router.push('/pro/add-service')}
                    className="absolute bottom-10 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center z-50 transition-all active:scale-95"
                    style={{
                        shadowColor: '#FF4081',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: theme === 'dark' ? 0.3 : 0.4,
                        shadowRadius: 15,
                        elevation: 8
                    }}
                >
                    <Plus color="white" size={32} />
                </TouchableOpacity>
            )}
        </View>
    );
}
