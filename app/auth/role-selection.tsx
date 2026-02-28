import { Button } from '@/components/atoms/Button';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RoleSelection() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                {/* Header */}
                <View className="px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 mb-2">
                        <ArrowLeft color="#333" size={24} />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold font-heading text-charcoal mb-2">How will you use Lushy?</Text>
                    <Text className="text-mediumGray font-body text-base">Select your account type to get started.</Text>
                </View>

                {/* Options */}
                <View className="flex-1 px-6 justify-center gap-6">
                    {/* Client Option */}
                    <TouchableOpacity
                        onPress={() => router.push('/auth/client-signup')}
                        className="flex-1 rounded-3xl overflow-hidden shadow-sm active:opacity-90"
                        style={{ backgroundColor: '#FFF0F5' }}
                    >
                        <View className="flex-1 justify-end p-6">
                            <Text className="text-2xl font-bold font-heading text-charcoal mb-1">Book a Service</Text>
                            <Text className="text-mediumGray font-body leading-tight">
                                Find top-rated beauty professionals near you.
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Pro Option */}
                    <TouchableOpacity
                        onPress={() => router.push('/auth/pro-signup')}
                        className="flex-1 rounded-3xl overflow-hidden shadow-sm active:opacity-90"
                        style={{ backgroundColor: '#F0FFF4' }}
                    >
                        <View className="flex-1 justify-end p-6">
                            <Text className="text-2xl font-bold font-heading text-charcoal mb-1">Offer Services</Text>
                            <Text className="text-mediumGray font-body leading-tight">
                                Manage appointments and grow your business.
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="p-6" style={{ paddingBottom: 24 + bottomPadding }}>
                    <Button
                        title="Already have an account? Log In"
                        onPress={() => router.push('/auth/login')}
                        variant="secondary"
                        className="bg-transparent border-0"
                        textClassName="text-mediumGray"
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
