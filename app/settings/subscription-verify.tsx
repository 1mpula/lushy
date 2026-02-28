import { Button } from '@/components/atoms/Button';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useUser } from '@/context/UserContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SubscriptionVerifyScreen() {
    const router = useRouter();
    const { token, ref } = useLocalSearchParams();
    const { user } = useUser();
    const { getProfessionalByUserId, saveProfessional } = useProfessionals();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;

    const professional = getProfessionalByUserId(user?.id || '');

    useEffect(() => {
        let isMounted = true;

        const verifyPayment = async () => {
            if (!token) {
                if (isMounted) {
                    setStatus('failed');
                    setMessage('No transaction token provided.');
                }
                return;
            }

            try {
                const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
                const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

                const response = await fetch(`${SUPABASE_URL}/functions/v1/dpo-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        action: 'verifyToken',
                        transactionToken: token,
                        companyRef: ref,
                        professionalId: professional?.id
                    }),
                });

                const data = await response.json();

                if (isMounted) {
                    if (data.isPaid) {
                        setStatus('success');
                        setMessage('Payment successful! Your subscription is now active.');

                        // Update local context
                        if (professional) {
                            await saveProfessional({
                                ...professional,
                                subscriptionStatus: 'active',
                                subscriptionDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                            });
                        }
                    } else {
                        setStatus('failed');
                        setMessage(data.explanation || 'Transaction not paid or declined.');
                    }
                }
            } catch (error) {
                console.error('Verification Error:', error);
                if (isMounted) {
                    setStatus('failed');
                    setMessage('An error occurred during verification. Please try again or contact support.');
                }
            }
        };

        verifyPayment();

        return () => {
            isMounted = false;
        };
    }, [token, ref, professional, saveProfessional]);

    return (
        <View
            className="flex-1 bg-white items-center justify-center px-6"
            style={{ paddingBottom: bottomPadding }}
        >
            {status === 'verifying' && (
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="items-center"
                >
                    <ActivityIndicator size="large" color="#FF4081" className="mb-6" />
                    <Text className="text-xl font-bold text-charcoal mb-2">Verifying Payment</Text>
                    <Text className="text-gray-500 text-center font-medium">Please wait while we confirm your transaction securely...</Text>
                </MotiView>
            )}

            {status === 'success' && (
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="items-center"
                >
                    <View className="w-24 h-24 bg-green-50 justify-center items-center rounded-full mb-6 relative">
                        <View className="absolute inset-0 bg-green-100/50 rounded-full animate-ping" />
                        <CheckCircle size={48} color="#10B981" />
                    </View>
                    <Text className="text-2xl font-bold text-charcoal mb-2">Payment Successful!</Text>
                    <Text className="text-gray-500 text-center font-medium mb-10 leading-relaxed px-4">
                        {message}
                    </Text>

                    <Button
                        title="Return to Settings"
                        onPress={() => router.replace('/settings')}
                        className="w-full h-14 rounded-2xl shadow-lg shadow-pink-200"
                    />
                </MotiView>
            )}

            {status === 'failed' && (
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="items-center"
                >
                    <View className="w-24 h-24 bg-red-50 justify-center items-center rounded-full mb-6">
                        <XCircle size={48} color="#EF4444" />
                    </View>
                    <Text className="text-2xl font-bold text-charcoal mb-2">Payment Failed</Text>
                    <Text className="text-gray-500 text-center font-medium mb-10 leading-relaxed px-4">
                        {message}
                    </Text>

                    <View className="w-full space-y-4">
                        <Button
                            title="Try Again"
                            onPress={() => router.back()}
                            className="w-full h-14 rounded-2xl shadow-lg shadow-pink-200"
                        />
                        <Button
                            title="Cancel"
                            variant="outline"
                            onPress={() => router.replace('/settings')}
                            className="w-full h-14 rounded-2xl mt-4"
                        />
                    </View>
                </MotiView>
            )}
        </View>
    );
}
