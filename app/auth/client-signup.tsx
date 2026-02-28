import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { signUp } from '@/lib/auth';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClientSignup() {
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;
    const router = useRouter();
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!termsAccepted) {
            Alert.alert('Terms Required', 'Please agree to the Terms of Service and Privacy Policy to continue.');
            return;
        }

        if (!fullName.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Weak Password', 'Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await signUp({
                email: email.trim(),
                password,
                fullName: fullName.trim(),
                role: 'client',
            });

            // Navigate to home on success
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
            <View className="px-6 py-4 border-b border-gray-50">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
                    <ArrowLeft color="#333" size={24} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 + bottomPadding }}>
                    <View className="mb-8">
                        <Text className="text-3xl font-bold font-heading text-charcoal mb-2">Create Account</Text>
                        <Text className="text-mediumGray font-body text-base">Enter your details to start booking.</Text>
                    </View>

                    <View className="mb-6 gap-4">
                        <Input
                            label="Full Name"
                            placeholder="Jane Doe"
                            value={fullName}
                            onChangeText={setFullName}
                            containerClassName="mb-0"
                        />
                        <Input
                            label="Email Address"
                            placeholder="hello@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            containerClassName="mb-0"
                        />
                        <Input
                            label="Password"
                            placeholder="Min. 8 characters"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            containerClassName="mb-0"
                        />
                    </View>

                    {/* Terms Checkbox */}
                    <TouchableOpacity
                        onPress={() => setTermsAccepted(!termsAccepted)}
                        className="flex-row items-start mb-6"
                    >
                        <View className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 mt-0.5 ${termsAccepted ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                            {termsAccepted && <Check size={14} color="white" />}
                        </View>
                        <Text className="flex-1 text-sm text-mediumGray leading-relaxed">
                            I agree to the{' '}
                            <Text
                                onPress={() => router.push('/settings/terms')}
                                className="text-primary font-bold"
                            >
                                Terms of Service
                            </Text>
                            {' '}and{' '}
                            <Text
                                onPress={() => router.push('/settings/terms')}
                                className="text-primary font-bold"
                            >
                                Privacy Policy
                            </Text>
                        </Text>
                    </TouchableOpacity>

                    <Button
                        title="Create Account"
                        onPress={handleSignup}
                        loading={loading}
                        variant="primary"
                        size="lg"
                        className="mb-6 shadow-lg shadow-pink-200"
                    />

                    <View className="flex-row items-center justify-center gap-4 mb-6">
                        <View className="h-px bg-gray-200 flex-1" />
                        <Text className="text-gray-400 font-body text-xs uppercase tracking-wider">Or continue with</Text>
                        <View className="h-px bg-gray-200 flex-1" />
                    </View>

                    {/* Social Buttons */}
                    <View className="flex-row justify-center gap-4 mb-8">
                        <TouchableOpacity className="w-14 h-14 rounded-full border border-gray-200 items-center justify-center bg-white">
                            <Text className="font-bold text-lg text-charcoal">G</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-14 h-14 rounded-full border border-gray-200 items-center justify-center bg-white">
                            <Text className="font-bold text-lg text-charcoal"></Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => router.push('/auth/login')} className="mb-4">
                        <Text className="text-center text-mediumGray font-body">
                            Already have an account? <Text className="font-bold text-primary">Log In</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
