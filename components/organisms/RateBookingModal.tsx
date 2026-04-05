import { useRatings } from '@/context/RatingContext';
import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../atoms/Button';

interface RateBookingModalProps {
    visible: boolean;
    onClose: () => void;
    bookingId: string;
    professionalId: string;
    professionalName: string;
    serviceName: string;
    onRated?: () => void;
}

export function RateBookingModal({
    visible,
    onClose,
    bookingId,
    professionalId,
    professionalName,
    serviceName,
    onRated,
}: RateBookingModalProps) {
    const { submitRating, isSubmitting } = useRatings();
    const [selectedRating, setSelectedRating] = useState(0);

    const handleSubmit = async () => {
        if (selectedRating === 0) {
            Alert.alert('Select a rating', 'Please tap the stars to rate your experience');
            return;
        }

        try {
            await submitRating(bookingId, professionalId, selectedRating);
            Alert.alert('Thanks! 🌟', 'Your rating has been submitted');
            setSelectedRating(0);
            onRated?.();
            onClose();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to submit rating');
        }
    };

    const handleClose = () => {
        setSelectedRating(0);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-end bg-black/60">
                <View className="bg-background rounded-t-3xl p-6">
                    {/* Header */}
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-secondary/10 rounded-full items-center justify-center mb-4">
                            <Star size={32} color="#FF4081" fill="#FF4081" />
                        </View>
                        <Text className="text-2xl font-bold font-heading text-foreground mb-2">
                            Rate Your Experience
                        </Text>
                        <Text className="text-mediumGray text-center">
                            How was your {serviceName} with {professionalName}?
                        </Text>
                    </View>

                    {/* Star Rating */}
                    <View className="flex-row justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setSelectedRating(star)}
                                className="p-2"
                            >
                                <Star
                                    size={40}
                                    color="#FFB800"
                                    fill={star <= selectedRating ? "#FFB800" : "transparent"}
                                    strokeWidth={2}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Rating Label */}
                    <View className="items-center mb-6">
                        <Text className="text-lg font-bold text-foreground">
                            {selectedRating === 0 && 'Tap to rate'}
                            {selectedRating === 1 && 'Poor'}
                            {selectedRating === 2 && 'Fair'}
                            {selectedRating === 3 && 'Good'}
                            {selectedRating === 4 && 'Great'}
                            {selectedRating === 5 && 'Excellent!'}
                        </Text>
                    </View>

                    {/* Buttons */}
                    <View className="gap-3">
                        <Button
                            title={isSubmitting ? "Submitting..." : "Submit Rating"}
                            onPress={handleSubmit}
                            loading={isSubmitting}
                            disabled={isSubmitting || selectedRating === 0}
                            size="lg"
                            className="shadow-lg shadow-pink-200"
                        />
                        <Button
                            title="Maybe Later"
                            onPress={handleClose}
                            variant="secondary"
                            size="lg"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
