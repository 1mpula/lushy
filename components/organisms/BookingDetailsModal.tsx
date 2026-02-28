import { Booking } from '@/context/BookingContext';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useUser } from '@/context/UserContext';
import { Image } from 'expo-image';
import { Calendar, Clock, Home, MapPin, Phone, Store, X } from 'lucide-react-native';
import { Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../atoms/Button';
import { RatingStars } from '../molecules/RatingStars';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop';

interface BookingDetailsModalProps {
    readonly visible: boolean;
    readonly onClose: () => void;
    readonly booking: Booking | null;
    readonly onAccept?: (bookingId: string) => void;
    readonly onReject?: (bookingId: string) => void;
    readonly onMarkComplete?: (bookingId: string) => void;
    readonly isCompletingId?: string | null;
}

export function BookingDetailsModal({
    visible,
    onClose,
    booking,
    onAccept,
    onReject,
    onMarkComplete,
    isCompletingId,
}: BookingDetailsModalProps) {
    const { userRole } = useUser();
    const { getProfessionalById } = useProfessionals();
    const isProvider = userRole === 'provider';

    if (!booking) return null;

    const pro = booking.professionalId ? getProfessionalById(booking.professionalId) : null;
    const isHouseCall = booking.locationType === 'house_call';

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending' };
            case 'accepted': return { bg: 'bg-blue-100', text: 'text-blue-800', label: '✓ Confirmed' };
            case 'rejected': return { bg: 'bg-red-100', text: 'text-red-800', label: '✗ Declined' };
            case 'completed': return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: '✓ Completed' };
            case 'cancelled': return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
        }
    };

    const statusStyle = getStatusStyle(booking.status);

    const handleCall = (phone: string) => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        }
    };

    const handleNavigate = (addressToUse?: string | null) => {
        const address = addressToUse || booking.address;
        if (address) {
            // Open in maps app
            const encodedAddress = encodeURIComponent(address);
            Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-end bg-black/60">
                <View className="bg-offWhite h-[85%] rounded-t-3xl overflow-hidden">

                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 bg-white border-b border-gray-100">
                        <View>
                            <Text className="text-2xl font-bold font-heading text-charcoal">Booking Details</Text>
                            <View className={`px-3 py-1 rounded-full mt-2 self-start ${statusStyle.bg}`}>
                                <Text className={`text-sm font-bold ${statusStyle.text}`}>{statusStyle.label}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-50 rounded-full">
                            <X size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6">

                        {/* Service Info */}
                        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                            <Text className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Service</Text>
                            <Text className="text-xl font-bold text-charcoal font-heading">{booking.serviceName}</Text>
                            <Text className="text-2xl font-bold text-primary mt-2">P{booking.price}</Text>
                        </View>

                        {/* Date & Time */}
                        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                            <Text className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Appointment</Text>
                            <View className="flex-row gap-6">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                                        <Calendar size={18} color="#FF4081" />
                                    </View>
                                    <View className="ml-3">
                                        <Text className="text-xs text-mediumGray">Date</Text>
                                        <Text className="text-base font-bold text-charcoal">{booking.date}</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                                        <Clock size={18} color="#FF4081" />
                                    </View>
                                    <View className="ml-3">
                                        <Text className="text-xs text-mediumGray">Time</Text>
                                        <Text className="text-base font-bold text-charcoal">{booking.time}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Location */}
                        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                            <Text className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Location</Text>

                            <View className="flex-row items-center mb-3">
                                <View className={`w-10 h-10 rounded-full items-center justify-center ${isHouseCall ? 'bg-blue-50' : 'bg-pink-50'}`}>
                                    {isHouseCall ? <Home size={18} color="#3B82F6" /> : <Store size={18} color="#FF4081" />}
                                </View>
                                <View className="ml-3">
                                    <Text className="text-base font-bold text-charcoal">
                                        {isHouseCall ? 'House Call' : 'Salon Visit'}
                                    </Text>
                                    <Text className="text-sm text-mediumGray">
                                        {isHouseCall ? 'Provider comes to you' : 'Visit the salon'}
                                    </Text>
                                </View>
                            </View>

                            {booking.address && (
                                <View className="bg-gray-50 p-3 rounded-xl flex-row items-start">
                                    <MapPin size={16} color="#FF4081" className="mt-0.5" />
                                    <Text className="flex-1 text-sm text-charcoal ml-2">{booking.address}</Text>
                                </View>
                            )}

                            {/* Navigate button based on role and location type */}
                            {booking.status === 'accepted' && (
                                (isProvider && isHouseCall && booking.address) ||
                                (!isProvider && !isHouseCall && (booking.address || pro?.location))
                            ) ? (
                                <TouchableOpacity
                                    onPress={() => handleNavigate(isHouseCall ? booking.address : (booking.address || pro?.location))}
                                    className="mt-3 bg-blue-500 py-3 px-4 rounded-xl flex-row items-center justify-center"
                                >
                                    <MapPin size={18} color="white" />
                                    <Text className="text-white font-bold ml-2">Get Directions</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>

                        {/* Contact Info */}
                        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                            <Text className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">
                                {isProvider ? 'Client' : 'Professional'}
                            </Text>

                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: DEFAULT_AVATAR }}
                                    className="w-14 h-14 rounded-full"
                                />
                                <View className="ml-3 flex-1">
                                    <Text className="text-lg font-bold text-charcoal">
                                        {isProvider ? booking.clientName : booking.professionalName}
                                    </Text>
                                    {!isProvider && pro && pro.rating > 0 && (
                                        <View className="flex-row items-center mt-1">
                                            <RatingStars rating={pro.rating} size={14} />
                                            <Text className="text-sm text-mediumGray ml-1">({pro.totalReviews} reviews)</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Call button */}
                            {(isProvider ? booking.clientPhone : booking.professionalPhone) && (
                                <TouchableOpacity
                                    onPress={() => handleCall(isProvider ? booking.clientPhone || '' : booking.professionalPhone || '')}
                                    className="mt-3 bg-emerald-500 py-3 px-4 rounded-xl flex-row items-center justify-center"
                                >
                                    <Phone size={18} color="white" />
                                    <Text className="text-white font-bold ml-2">
                                        Call {isProvider ? 'Client' : 'Professional'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Spacer for bottom buttons */}
                        <View className="h-24" />

                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 safe-bottom">
                        {/* Provider: Accept/Reject pending bookings */}
                        {isProvider && booking.status === 'pending' && (
                            <View className="flex-row gap-3">
                                <Button
                                    title="Accept"
                                    variant="primary"
                                    size="lg"
                                    className="flex-1"
                                    onPress={() => {
                                        onAccept?.(booking.id);
                                        onClose();
                                    }}
                                />
                                <Button
                                    title="Decline"
                                    variant="outline"
                                    size="lg"
                                    className="flex-1 border-red-300"
                                    onPress={() => {
                                        onReject?.(booking.id);
                                        onClose();
                                    }}
                                />
                            </View>
                        )}

                        {/* Provider: Mark Complete for accepted bookings */}
                        {isProvider && booking.status === 'accepted' && (
                            <Button
                                title={isCompletingId === booking.id ? "Completing..." : "Mark as Complete"}
                                variant="primary"
                                size="lg"
                                className="w-full"
                                loading={isCompletingId === booking.id}
                                onPress={() => {
                                    onMarkComplete?.(booking.id);
                                    onClose();
                                }}
                            />
                        )}

                        {/* Close button for other statuses */}
                        {(booking.status === 'completed' || booking.status === 'rejected' || booking.status === 'cancelled' || (!isProvider && booking.status !== 'completed')) && (
                            <Button
                                title="Close"
                                variant="outline"
                                size="lg"
                                className="w-full"
                                onPress={onClose}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
