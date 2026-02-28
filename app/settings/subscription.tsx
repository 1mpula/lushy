import { Button } from '@/components/atoms/Button';
import { Header } from '@/components/molecules/Header';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useUser } from '@/context/UserContext';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { AlertCircle, CheckCircle, CreditCard, ShieldAlert } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SubscriptionScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { getProfessionalByUserId, saveProfessional } = useProfessionals();

    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;

    const professional = getProfessionalByUserId(user?.id || '');
    const [isLoading, setIsLoading] = useState(false);

    // Dummy data if professional is missing
    const status = professional?.subscriptionStatus || 'trial';
    const dueDate = professional?.subscriptionDueDate
        ? new Date(professional.subscriptionDueDate).toLocaleDateString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

    const amount = 29.99; // Basic monthly subscription

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            // Call our Edge Function to generate the DPO token
            // In a real app, you'd fetch the SUPABASE_URL and SUPABASE_ANON_KEY fromenv
            const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
            const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

            const response = await fetch(`${SUPABASE_URL}/functions/v1/dpo-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    action: 'createToken',
                    professionalId: professional?.id,
                    email: user?.email,
                    amount: amount,
                }),
            });

            const data = await response.json();

            if (data.transToken) {
                // Redirect user to DPO payment page
                const paymentUrl = `https://secure.3gdirectpay.com/payv3.php?ID=${data.transToken}`;
                Linking.openURL(paymentUrl);

                Alert.alert(
                    "Redirecting to Payment",
                    "You are being redirected to our secure payment gateway. After payment, return to the app to verify.",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push({
                                pathname: '/settings/subscription-verify',
                                params: { token: data.transToken, ref: data.companyRef }
                            })
                        }
                    ]
                );
            } else {
                throw new Error(data.explanation || 'Failed to generate payment token');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            // Fallback for demo if edge function isn't fully set up yet
            Alert.alert(
                "Demo Payment Mode",
                "Simulating a successful payment since backend might not be fully configured yet.",
                [
                    {
                        text: "Simulate Success",
                        onPress: async () => {
                            if (professional) {
                                await saveProfessional({
                                    ...professional,
                                    subscriptionStatus: 'active',
                                    subscriptionDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                                });
                                router.replace('/settings');
                                Alert.alert('Success', 'Subscription renewed via demo mode!');
                            }
                        }
                    },
                    { text: "Cancel", style: "cancel" }
                ]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusConfig = () => {
        switch (status) {
            case 'active':
                return {
                    color: 'text-green-500',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    icon: <CheckCircle size={24} color="#10B981" />,
                    text: 'Active',
                    message: `Your subscription is active until ${dueDate}.`
                };
            case 'past_due':
                return {
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    icon: <AlertCircle size={24} color="#F59E0B" />,
                    text: 'Past Due',
                    message: 'Your payment is past due. Please pay to avoid account suspension.'
                };
            case 'suspended':
                return {
                    color: 'text-red-500',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    icon: <ShieldAlert size={24} color="#EF4444" />,
                    text: 'Suspended',
                    message: 'Your account is suspended. Your profile and services are hidden. Renew now.'
                };
            default: // trial
                return {
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    icon: <ShieldAlert size={24} color="#3B82F6" />,
                    text: 'Free Trial',
                    message: `Your trial period ends on ${dueDate}.`
                };
        }
    };

    const config = getStatusConfig();

    return (
        <View className="flex-1 bg-white">
            <Header title="Subscription" />

            <ScrollView
                className="flex-1 px-6 pt-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 + bottomPadding }}
            >
                {/* Status Card */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400 }}
                    className={`p-6 rounded-3xl border ${config.borderColor} ${config.bgColor} items-center mb-8`}
                >
                    <View className="mb-4">
                        {config.icon}
                    </View>
                    <Text className={`text-xl font-bold ${config.color} mb-2 uppercase tracking-widest`}>
                        {config.text}
                    </Text>
                    <Text className="text-gray-600 text-center font-medium leading-relaxed px-4">
                        {config.message}
                    </Text>
                </MotiView>

                {/* Plan Details */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 100, type: 'timing', duration: 400 }}
                    className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8"
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-lg font-bold text-charcoal">Pro Monthly</Text>
                            <Text className="text-gray-400 font-medium">Auto-renews</Text>
                        </View>
                        <Text className="text-2xl font-bold font-heading text-primary">
                            ${amount}<Text className="text-sm font-normal text-gray-500">/mo</Text>
                        </Text>
                    </View>

                    <View className="space-y-4">
                        {[
                            'Unlimited bookings and clients',
                            'Featured placement in search',
                            'Automated reminders (SMS & Email)',
                            'Priority 24/7 Support'
                        ].map((feature, i) => (
                            <View key={i} className="flex-row items-center">
                                <CheckCircle size={16} color="#FF4081" className="mr-3" />
                                <Text className="text-gray-600 font-medium">{feature}</Text>
                            </View>
                        ))}
                    </View>
                </MotiView>

                {/* Secure Gateway Notice */}
                <View className="flex-row items-center justify-center bg-gray-50 p-4 rounded-2xl mb-8">
                    <ShieldAlert size={20} color="#9CA3AF" className="mr-3" />
                    <Text className="text-gray-400 text-sm font-medium">Secure payments powered by DPO Group</Text>
                </View>

                {/* Action Buttons */}
                <View className="mb-12 space-y-4">
                    <Button
                        title={status === 'active' ? "Manage Billing" : "Pay Subscription via DPO"}
                        onPress={handlePayment}
                        disabled={isLoading}
                        size="lg"
                        icon={isLoading ? <ActivityIndicator color="white" /> : <CreditCard size={20} color="white" />}
                        className="h-14 rounded-2xl shadow-lg shadow-pink-200"
                    />

                    {(status === 'past_due' || status === 'suspended') && (
                        <Text className="text-center text-sm text-gray-400 mt-2 font-medium">
                            It may take a few minutes for payment to reflect.
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
