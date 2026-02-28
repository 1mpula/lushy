import { Clock } from 'lucide-react-native';
import { Modal, Text, View } from 'react-native';
import { Button } from '../atoms/Button';

interface AwaitingConfirmationPopupProps {
    readonly visible: boolean;
    readonly providerName: string;
    readonly onDismiss: () => void;
}

export function AwaitingConfirmationPopup({ visible, providerName, onDismiss }: AwaitingConfirmationPopupProps) {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View className="flex-1 justify-center items-center bg-black/60 px-6">
                <View className="bg-white w-full rounded-3xl p-8 items-center shadow-xl">
                    {/* Icon */}
                    <View className="w-20 h-20 bg-yellow-100 rounded-full items-center justify-center mb-6">
                        <Clock size={40} color="#F59E0B" />
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold font-heading text-charcoal text-center mb-2">
                        Request Sent!
                    </Text>

                    {/* Message */}
                    <Text className="text-base text-mediumGray text-center leading-relaxed mb-6">
                        Awaiting <Text className="font-bold text-primary">{providerName}</Text> to accept your booking request.
                    </Text>

                    {/* Info Box */}
                    <View className="bg-gray-50 p-4 rounded-xl w-full mb-6">
                        <Text className="text-sm text-charcoal text-center">
                            You'll receive a notification when the provider responds to your request.
                        </Text>
                    </View>

                    {/* Action Button */}
                    <Button
                        title="View My Bookings"
                        onPress={onDismiss}
                        size="lg"
                        className="w-full shadow-lg shadow-pink-200"
                    />
                </View>
            </View>
        </Modal>
    );
}
