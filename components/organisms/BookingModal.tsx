import { useBookings } from '@/context/BookingContext';
import { useUser } from '@/context/UserContext';
import { getBlockedDates } from '@/lib/availability';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { AwaitingConfirmationPopup } from '../molecules/AwaitingConfirmationPopup';
import { DateTimePicker } from '../molecules/DateTimePicker';
import { LocationSelector } from '../molecules/LocationSelector';

interface BookingModalProps {
    readonly visible: boolean;
    readonly onClose: () => void;
    readonly serviceItem?: {
        title: string;
        imageUrl: string;
        price: string;
        providerName: string;
        providerId?: string;
        providerAddress?: string;
    };
}

export function BookingModal({ visible, onClose, serviceItem }: BookingModalProps) {
    const router = useRouter();
    const { createBooking } = useBookings();
    const { user } = useUser();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [payWithCash, setPayWithCash] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [locationType, setLocationType] = useState<'house_call' | 'salon_visit'>('salon_visit');
    const [address, setAddress] = useState('123 Main Street, Cape Town'); // Default provider address
    const [blockedDates, setBlockedDates] = useState<string[]>([]);

    // Fetch blocked dates when modal opens
    useEffect(() => {
        if (visible && serviceItem?.providerId) {
            getBlockedDates(serviceItem.providerId).then(setBlockedDates).catch(() => setBlockedDates([]));
        }
    }, [visible, serviceItem?.providerId]);

    if (!serviceItem) return null;

    const handleLocationSelect = (type: 'house_call' | 'salon_visit', addr: string) => {
        setLocationType(type);
        setAddress(addr);
    };

    const handleRequestBooking = async () => {
        if (!date || !time) {
            Alert.alert('Missing Info', 'Please select a date and time.');
            return;
        }
        if (!payWithCash) {
            Alert.alert('Payment', 'Please select a payment method.');
            return;
        }
        if (locationType === 'house_call' && !address.trim()) {
            Alert.alert('Missing Info', 'Please enter your address for house call.');
            return;
        }

        setIsLoading(true);

        // Parse price from string (e.g., "P85" to 85)
        const priceNumber = parseFloat(serviceItem.price.replace(/[^0-9.]/g, '')) || 0;

        const result = await createBooking({
            clientId: user?.id || 'anonymous',
            clientName: user?.fullName || 'Guest',
            clientPhone: user?.phone || '',
            professionalId: serviceItem.providerId || 'provider-mock',
            professionalName: serviceItem.providerName,
            serviceName: serviceItem.title,
            date,
            time,
            price: priceNumber,
            locationType,
            address,
        });

        setIsLoading(false);

        if (result.success) {
            onClose();
            setShowConfirmation(true);
        } else {
            Alert.alert('Booking Failed', 'Could not create booking. Please try again.');
        }
    };

    const handleConfirmationDismiss = () => {
        setShowConfirmation(false);
        setDate('');
        setTime('');
        router.push('/(tabs)/bookings');
    };

    return (
        <>
            <Modal visible={visible} animationType="slide" transparent>
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-offWhite h-[85%] rounded-t-3xl overflow-hidden">

                        {/* Header */}
                        <View className="flex-row items-center justify-between p-6 bg-background border-b border-border">
                            <View>
                                <Text className="text-2xl font-bold font-heading text-foreground">Confirm Booking</Text>
                                <Text className="text-mediumGray font-body">Complete your reservation</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} className="p-2 bg-card rounded-full">
                                <X size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1 p-6">

                            {/* Service Summary Card */}
                            <View className="flex-row p-4 mb-6 bg-background shadow-sm rounded-2xl">
                                <Image
                                    source={{ uri: serviceItem.imageUrl }}
                                    className="w-20 h-24 rounded-xl"
                                    contentFit="cover"
                                />
                                <View className="ml-4 justify-center flex-1">
                                    <Text className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Service</Text>
                                    <Text className="text-lg font-bold text-foreground font-heading leading-tight mb-1">{serviceItem.title}</Text>
                                    <Text className="text-mediumGray font-body text-sm mb-2">by {serviceItem.providerName}</Text>
                                    <Text className="text-xl font-bold text-primary">{serviceItem.price}</Text>
                                </View>
                            </View>


                            {/* Date & Time Selection */}
                            <View className="mb-6">
                                <Text className="mb-3 text-sm font-bold text-foreground uppercase tracking-wider">Date & Time</Text>
                                <DateTimePicker
                                    onDateSelect={setDate}
                                    onTimeSelect={setTime}
                                    blockedDates={blockedDates}
                                />
                            </View>

                            {/* Location Selection */}
                            <View className="mb-6">
                                <LocationSelector
                                    providerAddress={serviceItem.providerAddress}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </View>

                            {/* Notes */}
                            <View className="mb-4">
                                <Text className="mb-3 text-sm font-bold text-foreground uppercase tracking-wider">Notes</Text>
                                <Input
                                    placeholder="Any allergies or special requests?"
                                    multiline
                                    numberOfLines={3}
                                    containerClassName="mb-0"
                                    className="h-24 bg-background border-0 shadow-sm"
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Payment Method */}
                            <View className="mb-6">
                                <Text className="mb-3 text-sm font-bold text-foreground uppercase tracking-wider">Payment Method</Text>
                                <TouchableOpacity
                                    onPress={() => setPayWithCash(!payWithCash)}
                                    className="flex-row items-center bg-background p-4 rounded-xl shadow-sm"
                                >
                                    <View className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${payWithCash ? 'bg-primary border-primary' : 'border-gray-300 bg-background'}`}>
                                        {payWithCash && <Check size={14} color="white" />}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-base font-bold text-foreground">Pay with Cash</Text>
                                        <Text className="text-sm text-mediumGray">Pay the provider directly after service</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Price Breakdown */}
                            <View className="mb-8 p-4 bg-background rounded-xl shadow-sm">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-mediumGray">Service Total</Text>
                                    <Text className="text-foreground font-bold">{serviceItem.price}</Text>
                                </View>
                                <View className="h-px bg-card my-2" />
                                <View className="flex-row justify-between">
                                    <Text className="text-lg font-bold text-foreground">Total Due (Cash)</Text>
                                    <Text className="text-lg font-bold text-primary">{serviceItem.price}</Text>
                                </View>
                            </View>

                        </ScrollView>

                        {/* Footer */}
                        <View className="p-6 bg-background border-t border-border safe-bottom">
                            <Button
                                title={isLoading ? "Booking..." : "Request Booking"}
                                onPress={handleRequestBooking}
                                loading={isLoading}
                                disabled={isLoading}
                                size="lg"
                                className="w-full shadow-lg shadow-pink-200"
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <AwaitingConfirmationPopup
                visible={showConfirmation}
                providerName={serviceItem.providerName}
                onDismiss={handleConfirmationDismiss}
            />
        </>
    );
}

