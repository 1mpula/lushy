import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { signUpAsProvider } from '@/lib/auth';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProSignup() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;
    const [step, setStep] = useState(1);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        password: '',
        location: '',
    });
    const [expertise, setExpertise] = useState<string[]>([]);

    const toggleExpertise = (item: string) => {
        if (expertise.includes(item)) {
            setExpertise(expertise.filter(i => i !== item));
        } else {
            setExpertise([...expertise, item]);
        }
    };

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (!formData.email.trim() || !formData.password.trim()) {
            Alert.alert('Missing Fields', 'Please fill in email and password.');
            return;
        }
        if (formData.password.length < 8) {
            Alert.alert('Weak Password', 'Password must be at least 8 characters.');
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
        else router.back();
    };

    const handleSignup = async () => {
        if (!termsAccepted) {
            Alert.alert('Terms Required', 'Please agree to the Terms of Service and Privacy Policy to continue.');
            return;
        }

        if (!formData.businessName.trim()) {
            Alert.alert('Missing Fields', 'Please enter your business name.');
            return;
        }

        setLoading(true);
        try {
            await signUpAsProvider({
                email: formData.email.trim(),
                password: formData.password,
                fullName: formData.businessName.trim(),
                role: 'provider',
                businessName: formData.businessName.trim(),
                expertise: expertise,
                location: formData.location.trim(),
            });

            // Navigate to dashboard on success
            router.replace('/(tabs)/dashboard');
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
            <View className="px-6 py-4 border-b border-gray-50 flex-row justify-between items-center">
                <TouchableOpacity onPress={handleBack} className="w-10 h-10 items-center justify-center -ml-2">
                    <ArrowLeft color="#333" size={24} />
                </TouchableOpacity>
                <Text className="font-bold text-mediumGray">Step {step} of 2</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 + bottomPadding }}>
                    <View className="mb-8">
                        <Text className="text-3xl font-bold font-heading text-primary mb-2">
                            {step === 1 ? 'Create Account' : 'Business Details'}
                        </Text>
                        <Text className="text-mediumGray font-body text-base">
                            {step === 1 ? 'Start by setting up your login credentials.' : 'Tell us about your services.'}
                        </Text>
                    </View>

                    {step === 1 && (
                        <View className="mb-8 gap-4">
                            <Input
                                label="Email Address"
                                placeholder="hello@business.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={(t) => updateField('email', t)}
                                containerClassName="mb-0"
                            />
                            <Input
                                label="Password"
                                placeholder="Min. 8 characters"
                                secureTextEntry
                                value={formData.password}
                                onChangeText={(t) => updateField('password', t)}
                                containerClassName="mb-0"
                            />
                        </View>
                    )}

                    {step === 2 && (
                        <View className="mb-8 gap-4">
                            <Input
                                label="Business Name"
                                placeholder="e.g. Divine Braids"
                                value={formData.businessName}
                                onChangeText={(t) => updateField('businessName', t)}
                                containerClassName="mb-0"
                            />

                            <View>
                                <Text className="mb-2 text-sm font-bold text-charcoal font-bodyMedium">Expertise</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {['Hair', 'Nails', 'Wigs', 'Makeup', 'Lashes'].map((item) => {
                                        const selected = expertise.includes(item);
                                        return (
                                            <TouchableOpacity
                                                key={item}
                                                onPress={() => toggleExpertise(item)}
                                                className={`px-4 py-2 rounded-full border flex-row items-center ${selected ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                                            >
                                                {selected && <Check size={12} color="white" className="mr-1" />}
                                                <Text className={`${selected ? 'text-white' : 'text-charcoal'} font-bodyMedium`}>{item}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>

                            <Input
                                label="Location"
                                placeholder="City"
                                value={formData.location}
                                onChangeText={(t) => updateField('location', t)}
                                containerClassName="mb-0"
                            />

                            {/* Terms Checkbox */}
                            <TouchableOpacity
                                onPress={() => setTermsAccepted(!termsAccepted)}
                                className="flex-row items-start mt-4"
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
                        </View>
                    )}

                    <Button
                        title={step === 1 ? "Next Step" : "Complete Profile"}
                        onPress={step === 1 ? handleNext : handleSignup}
                        loading={loading}
                        variant="primary"
                        size="lg"
                        className="mb-6 shadow-xl shadow-pink-200"
                        icon={step === 1 ? <ChevronRight size={20} color="white" /> : undefined}
                    />

                    {step === 1 && (
                        <TouchableOpacity onPress={() => router.push('/auth/login')} className="mb-4">
                            <Text className="text-center text-mediumGray font-body">
                                Already have an account? <Text className="font-bold text-primary">Log In</Text>
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
