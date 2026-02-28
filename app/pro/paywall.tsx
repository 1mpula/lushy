import { useSubscription } from '@/context/SubscriptionContext';
import { useUser } from '@/context/UserContext';
import { router } from 'expo-router';
import { Check, ShieldCheck } from 'lucide-react-native';
import { default as React, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaywallScreen() {
    const { packages, purchasePackage, restorePurchases, isLoading, isPro } = useSubscription();
    const { userRole } = useUser();
    const [localLoading, setLocalLoading] = useState(false);

    // If the user isn't a provider, or they are already securely pro,
    // they don't need to be here.
    if (userRole !== 'provider') {
        router.replace('/(tabs)');
        return null;
    }

    if (isPro) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
                <View className="bg-green-100 p-4 rounded-full mb-6">
                    <ShieldCheck size={48} color="#16a34a" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">You're Subscribed!</Text>
                <Text className="text-center text-gray-500 mb-8">
                    Your Lushy Pro subscription is active. You can manage your
                    settings and accept bookings freely.
                </Text>
                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)/profile')}
                    className="bg-primary w-full py-4 rounded-xl items-center"
                >
                    <Text className="text-white font-bold text-lg">Return to Profile</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handlePurchase = async (pkg: any) => {
        setLocalLoading(true);
        const success = await purchasePackage(pkg);
        setLocalLoading(false);
        if (success) {
            Alert.alert("Success!", "Your subscription is now active.");
            router.replace('/(tabs)/profile');
        }
    };

    const handleRestore = async () => {
        setLocalLoading(true);
        const success = await restorePurchases();
        setLocalLoading(false);

        if (success) {
            Alert.alert("Restored", "Your purchases have been restored successfully.");
            router.replace('/(tabs)/profile');
        } else {
            Alert.alert("No Purchases Found", "We couldn't find an active subscription for this account.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>

                {/* Header */}
                <View className="items-center mb-8 mt-4">
                    <View className="bg-pink-100 p-4 rounded-full mb-6">
                        <ShieldCheck size={48} color="#FF4081" />
                    </View>
                    <Text className="text-3xl font-bold text-charcoal mb-3 text-center">Unleash Your Business</Text>
                    <Text className="text-base text-secondary text-center leading-relaxed">
                        Become a Lushy Pro to accept bookings, showcase your portfolio, and handle your schedule flawlessly.
                    </Text>
                </View>

                {/* Features List */}
                <View className="mb-10 w-full space-y-4">
                    {[
                        'Accept unlimited client bookings',
                        'Showcase your portfolio and services',
                        'In-app chat with your clients',
                        'Verified Professional badge'
                    ].map((feature, i) => (
                        <View key={i} className="flex-row items-center">
                            <View className="bg-green-100 p-1.5 rounded-full mr-3">
                                <Check size={16} color="#16a34a" />
                            </View>
                            <Text className="text-charcoal font-medium">{feature}</Text>
                        </View>
                    ))}
                </View>

                {/* Loading State or Packages */}
                {(isLoading || localLoading) ? (
                    <View className="py-8 items-center justify-center">
                        <ActivityIndicator size="large" color="#FF4081" />
                        <Text className="mt-4 text-secondary">Loading secure checkout...</Text>
                    </View>
                ) : (
                    <View className="w-full">
                        {packages.length === 0 ? (
                            <View className="p-4 bg-gray-50 rounded-xl items-center border border-gray-200">
                                <Text className="text-secondary text-center mb-2">
                                    Subscriptions are currently unavailable. Ensure you have network connectivity.
                                </Text>
                            </View>
                        ) : (
                            packages.map((pkg) => (
                                <TouchableOpacity
                                    key={pkg.identifier}
                                    onPress={() => handlePurchase(pkg)}
                                    className="w-full bg-primary rounded-2xl p-5 shadow-sm mb-4 border border-pink-200 flex-row justify-between items-center"
                                >
                                    <View>
                                        <Text className="text-white font-bold text-lg">{pkg.product.title}</Text>
                                        <Text className="text-pink-100 mt-1">{pkg.product.description}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-white font-bold text-xl">{pkg.product.priceString}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}

                {/* Footer Links required by App Store */}
                <View className="mt-12 items-center w-full">
                    <TouchableOpacity onPress={handleRestore} className="p-2 mb-4">
                        <Text className="text-blue-500 font-medium">Restore Purchases</Text>
                    </TouchableOpacity>

                    <Text className="text-xs text-gray-400 text-center mb-2">
                        Payment will be charged to your Apple/Google account at confirmation of purchase.
                        Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
                    </Text>
                    <View className="flex-row items-center justify-center">
                        <TouchableOpacity onPress={() => {/* In reality open a webview */ }}>
                            <Text className="text-xs text-blue-400">Terms of Service</Text>
                        </TouchableOpacity>
                        <Text className="text-gray-300 mx-2">•</Text>
                        <TouchableOpacity onPress={() => {/* In reality open a webview */ }}>
                            <Text className="text-xs text-blue-400">Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
