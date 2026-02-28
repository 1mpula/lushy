import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Header } from '@/components/molecules/Header';
import { RatingStars } from '@/components/molecules/RatingStars';
import { BookingDetailsModal } from '@/components/organisms/BookingDetailsModal';
import { RateBookingModal } from '@/components/organisms/RateBookingModal';
import { useBookings } from '@/context/BookingContext';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useRatings } from '@/context/RatingContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar, Check, Clock, HelpCircle, MapPin, RefreshCw, Star } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop';

export default function BookingsScreen() {
    const router = useRouter();
    const { bookings, isLoading, error, refreshBookings, respondToBooking } = useBookings();
    const { userRole } = useUser();
    const { isPro } = useSubscription();
    const { getRatingForBooking } = useRatings();
    const { getProfessionalById } = useProfessionals();
    const isProvider = userRole === 'provider';

    const [ratingModalVisible, setRatingModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [ratedBookings, setRatedBookings] = useState<Set<string>>(new Set());
    const [completingId, setCompletingId] = useState<string | null>(null);
    const [detailModalBooking, setDetailModalBooking] = useState<any>(null);

    // Check which bookings have been rated
    useEffect(() => {
        const checkRatings = async () => {
            const rated = new Set<string>();
            for (const booking of bookings) {
                if (booking.status === 'completed') {
                    const existingRating = await getRatingForBooking(booking.id);
                    if (existingRating) {
                        rated.add(booking.id);
                    }
                }
            }
            setRatedBookings(rated);
        };
        checkRatings();
    }, [bookings]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
            case 'accepted': return { bg: 'bg-blue-100', text: 'text-blue-800' };
            case 'rejected': return { bg: 'bg-red-100', text: 'text-red-800' };
            case 'completed': return { bg: 'bg-emerald-100', text: 'text-emerald-800' };
            case 'cancelled': return { bg: 'bg-gray-100', text: 'text-gray-800' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-800' };
        }
    };

    const handleAccept = async (bookingId: string) => {
        if (isProvider && !isPro) {
            Alert.alert(
                'Subscription Required',
                'You need an active Lushy Pro subscription to accept new bookings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Subscribe', onPress: () => router.push('/pro/paywall') }
                ]
            );
            return;
        }
        await respondToBooking(bookingId, 'accepted');
    };

    const handleReject = async (bookingId: string) => {
        await respondToBooking(bookingId, 'rejected');
    };

    const handleNavigate = (address: string | undefined | null) => {
        if (!address) {
            Alert.alert('Location Missing', 'No exact address is available for this booking.');
            return;
        }
        const encodedAddress = encodeURIComponent(address);
        Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
    };

    const handleMarkComplete = async (bookingId: string) => {
        setCompletingId(bookingId);
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'completed' })
                .eq('id', bookingId);

            if (error) throw error;

            Alert.alert('Success! ✓', 'Booking marked as completed');
            await refreshBookings();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to complete booking');
        } finally {
            setCompletingId(null);
        }
    };

    const handleRate = (booking: any) => {
        setSelectedBooking(booking);
        setRatingModalVisible(true);
    };

    const handleRated = () => {
        if (selectedBooking) {
            setRatedBookings(prev => new Set([...prev, selectedBooking.id]));
        }
        refreshBookings();
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-slate-50">
                <LinearGradient
                    colors={['#FF4081', '#FF80AB', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ width: '100%', height: 280, position: 'absolute', top: 0, left: 0, opacity: 0.15 }}
                />
                <SafeAreaView className="flex-1" edges={['top']}>
                    <Header title={isProvider ? 'Requests' : 'My Bookings'} showBack={false} variant="overlay" />
                    <View className="px-6 gap-4 pt-32">
                        <Skeleton width="100%" height={120} />
                        <Skeleton width="100%" height={120} />
                        <Skeleton width="100%" height={120} />
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50">
            <LinearGradient
                colors={['#FF4081', '#FF80AB', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ width: '100%', height: 280, position: 'absolute', top: 0, left: 0, opacity: 0.15 }}
            />
            <SafeAreaView className="flex-1" edges={['top']}>
                <Header
                    title={isProvider ? 'Requests' : 'My Bookings'}
                    showBack={false}
                    variant="overlay"
                    rightElement={
                        <TouchableOpacity onPress={refreshBookings} className="p-2 bg-white/80 backdrop-blur-md rounded-full border border-white shadow-sm">
                            <RefreshCw size={18} color="#757575" />
                        </TouchableOpacity>
                    }
                />

                {error && (
                    <View className="mx-6 mt-4 p-4 bg-red-50 rounded-lg">
                        <Text className="text-red-600">{error}</Text>
                        <TouchableOpacity onPress={refreshBookings} className="mt-2">
                            <Text className="text-primary font-bold">Tap to retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <FlatList
                    data={bookings}
                    keyExtractor={item => item.id}
                    contentContainerClassName="pt-32 pb-24 px-6"
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refreshBookings} tintColor="#FF4081" />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center py-10 px-6 z-10 pt-24">
                            <MotiView
                                from={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                className="w-32 h-32 bg-white rounded-full items-center justify-center mb-6 shadow-xl shadow-pink-100/50 border border-pink-50"
                            >
                                <Calendar size={48} color="#FF4081" strokeWidth={1.5} />
                            </MotiView>
                            <Text className="text-center text-2xl font-bold font-heading text-charcoal tracking-tight mb-2">
                                {isProvider ? 'No Requests Yet' : 'No Bookings Yet'}
                            </Text>
                            <Text className="text-center text-base font-body text-mediumGray leading-relaxed max-w-[280px]">
                                {isProvider
                                    ? 'When clients book your services, they will appear here.'
                                    : 'Your upcoming appointments and history will be tracked right here.'}
                            </Text>
                        </View>
                    }
                    renderItem={({ item, index }) => {
                        const statusStyle = getStatusColor(item.status);
                        const isRated = ratedBookings.has(item.id);
                        const pro = item.professionalId ? getProfessionalById(item.professionalId) : null;

                        const isHouseCall = item.locationType === 'house_call';
                        // For House Calls, we MUST use the booking address (where client is).
                        // For Salon Visits, the professional's address is best if available, but if not we can use booking.address as fallback. 
                        const locationToNavigate = isHouseCall
                            ? item.address
                            : (pro?.location || item.address);

                        const shouldProviderNavigate = isProvider && isHouseCall && item.status === 'accepted';
                        const shouldClientNavigate = !isProvider && !isHouseCall && item.status === 'accepted';

                        // We do not have direct access to client avatar in bookings currently without joining profiles,
                        // so we fallback to DEFAULT_AVATAR for now if client, and pro.avatarUrl if pro.
                        const avatarToShow = isProvider ? DEFAULT_AVATAR : (pro?.avatarUrl || DEFAULT_AVATAR);

                        return (
                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: index * 100, type: 'timing', duration: 400 }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setDetailModalBooking(item)}
                                    className="mb-4 bg-white border border-white rounded-[24px] shadow-sm shadow-pink-100/50 p-5"
                                >
                                    <View className="flex-row justify-between items-start mb-4">
                                        <View className="flex-row items-center flex-1 pr-2">
                                            <Image
                                                source={{ uri: avatarToShow }}
                                                className="w-14 h-14 rounded-full mr-3 border-2 border-slate-50"
                                                contentFit="cover"
                                            />
                                            <View className="flex-1">
                                                <Text className="font-bold text-lg text-charcoal font-heading leading-tight mb-0.5">
                                                    {item.serviceName}
                                                </Text>
                                                <Text className="text-sm text-mediumGray font-body mb-1">
                                                    {isProvider ? `Client: ${item.clientName}` : `w/ ${item.professionalName}`}
                                                </Text>
                                                {/* Show provider rating */}
                                                {!isProvider && pro && pro.rating > 0 && (
                                                    <View className="flex-row items-center">
                                                        <RatingStars rating={pro.rating} size={12} />
                                                        <Text className="text-[11px] font-bold text-mediumGray ml-1">({pro.totalReviews})</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        <View className={`px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
                                            <Text className={`text-[10px] tracking-wider font-bold uppercase ${statusStyle.text}`}>
                                                {item.status}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="bg-slate-50 p-4 rounded-2xl flex-row justify-between items-center mb-1">
                                        <View className="flex-row items-center gap-5">
                                            <View className="flex-row items-center">
                                                <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-sm shadow-gray-200 mr-2">
                                                    <Calendar size={14} color="#FF4081" strokeWidth={2.5} />
                                                </View>
                                                <Text className="text-[13px] text-charcoal font-bold">{item.date}</Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-sm shadow-gray-200 mr-2">
                                                    <Clock size={14} color="#0EA5E9" strokeWidth={2.5} />
                                                </View>
                                                <Text className="text-[13px] text-charcoal font-bold">{item.time}</Text>
                                            </View>
                                        </View>
                                        <Text className="font-bold font-heading text-primary text-base tracking-tight">
                                            P{item.price}
                                        </Text>
                                    </View>

                                    {/* Actions based on role and status */}
                                    <View className="mt-4 flex-row gap-3">
                                        {/* Provider: Accept/Reject pending bookings */}
                                        {isProvider && item.status === 'pending' && (
                                            <>
                                                <Button
                                                    title="Accept"
                                                    variant="primary"
                                                    size="sm"
                                                    className="flex-1 shadow-md shadow-pink-200"
                                                    onPress={() => handleAccept(item.id)}
                                                />
                                                <Button
                                                    title="Decline"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 border-gray-200 bg-white"
                                                    textClassName="text-charcoal"
                                                    onPress={() => handleReject(item.id)}
                                                />
                                            </>
                                        )}

                                        {/* Provider: Mark Complete for accepted bookings */}
                                        {isProvider && item.status === 'accepted' && (
                                            <>
                                                {shouldProviderNavigate && (
                                                    <Button
                                                        title="Navigate"
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 bg-blue-50 border-blue-100"
                                                        textClassName="text-blue-600"
                                                        icon={<MapPin size={16} color="#2563EB" />}
                                                        onPress={() => handleNavigate(locationToNavigate)}
                                                    />
                                                )}
                                                <Button
                                                    title={completingId === item.id ? "Completing..." : "Complete"}
                                                    variant="primary"
                                                    size="sm"
                                                    className="flex-1 shadow-md shadow-pink-200"
                                                    icon={completingId !== item.id ? <Check size={16} color="white" /> : undefined}
                                                    loading={completingId === item.id}
                                                    onPress={() => handleMarkComplete(item.id)}
                                                />
                                            </>
                                        )}

                                        {/* Client: See status for pending */}
                                        {!isProvider && item.status === 'pending' && (
                                            <View className="flex-1 bg-yellow-50/80 border border-yellow-100/50 p-2.5 rounded-xl items-center flex-row justify-center">
                                                <HelpCircle size={14} color="#A16207" className="mr-1.5" />
                                                <Text className="text-yellow-700 font-bold text-xs tracking-wide">Awaiting Response</Text>
                                            </View>
                                        )}

                                        {/* Client: Confirmed for accepted */}
                                        {!isProvider && item.status === 'accepted' && (
                                            <>
                                                {shouldClientNavigate && (
                                                    <Button
                                                        title="Navigate"
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 bg-blue-50 border-blue-100"
                                                        textClassName="text-blue-600"
                                                        icon={<MapPin size={16} color="#2563EB" />}
                                                        onPress={() => handleNavigate(locationToNavigate)}
                                                    />
                                                )}
                                                <View className="flex-[1.5] bg-blue-50/80 border border-blue-100/50 p-2.5 rounded-xl items-center flex-row justify-center">
                                                    <Check size={14} color="#1D4ED8" className="mr-1.5" />
                                                    <Text className="text-blue-700 font-bold text-xs tracking-wide">Confirmed</Text>
                                                </View>
                                            </>
                                        )}

                                        {item.status === 'rejected' && (
                                            <View className="flex-1 bg-red-50/80 border border-red-100/50 p-2.5 rounded-xl items-center flex-row justify-center">
                                                <Text className="text-red-700 font-bold text-xs tracking-wide">✗ Declined</Text>
                                            </View>
                                        )}

                                        {/* Completed: Show rate button for clients, completed badge for providers */}
                                        {item.status === 'completed' && (
                                            <>
                                                {!isProvider && !isRated && (
                                                    <Button
                                                        title="Rate Experience"
                                                        variant="primary"
                                                        size="sm"
                                                        className="flex-1 shadow-md shadow-pink-200"
                                                        onPress={() => handleRate(item)}
                                                        icon={<Star size={14} color="white" fill="white" />}
                                                    />
                                                )}
                                                {!isProvider && isRated && (
                                                    <View className="flex-1 bg-emerald-50/80 border border-emerald-100/50 p-2.5 rounded-xl flex-row items-center justify-center">
                                                        <Star size={14} color="#10B981" fill="#10B981" />
                                                        <Text className="text-emerald-700 font-bold text-xs ml-1.5 tracking-wide">Rated</Text>
                                                    </View>
                                                )}
                                                {isProvider && (
                                                    <View className="flex-1 bg-emerald-50/80 border border-emerald-100/50 p-2.5 rounded-xl flex-row items-center justify-center">
                                                        <Check size={14} color="#10B981" strokeWidth={3} />
                                                        <Text className="text-emerald-700 font-bold text-xs ml-1.5 tracking-wide">Completed</Text>
                                                    </View>
                                                )}
                                            </>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </MotiView>
                        );
                    }}
                />
            </SafeAreaView>

            {/* Rating Modal */}
            {selectedBooking && (
                <RateBookingModal
                    visible={ratingModalVisible}
                    onClose={() => setRatingModalVisible(false)}
                    bookingId={selectedBooking.id}
                    professionalId={selectedBooking.professionalId || ''}
                    professionalName={selectedBooking.professionalName}
                    serviceName={selectedBooking.serviceName}
                    onRated={handleRated}
                />
            )}

            {/* Booking Details Modal */}
            <BookingDetailsModal
                visible={!!detailModalBooking}
                onClose={() => setDetailModalBooking(null)}
                booking={detailModalBooking}
                onAccept={handleAccept}
                onReject={handleReject}
                onMarkComplete={handleMarkComplete}
                isCompletingId={completingId}
            />
        </View>
    );
}
