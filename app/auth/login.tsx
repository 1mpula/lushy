import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { getProfile, signIn } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
    const router = useRouter();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please enter your email and password.');
            return;
        }

        setLoading(true);
        try {
            const { user } = await signIn(email.trim(), password);

            if (user) {
                // Get profile to determine role
                const profile = await getProfile(user.id);

                if (profile?.role === 'provider') {
                    router.replace('/(tabs)/dashboard');
                } else {
                    router.replace('/(tabs)');
                }
            }
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className="flex-1" edges={['top', 'left', 'right']} style={{ backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' }}>
            <View className="px-6 py-4 border-b border-border">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
                    <ArrowLeft color={theme === 'dark' ? '#FFF' : '#333'} size={24} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-6"
                style={{ paddingBottom: bottomPadding }}
            >
                <View className="mb-10">
                    <Text className="text-3xl font-bold font-heading text-foreground mb-2">Welcome Back</Text>
                    <Text className="text-mediumGray font-body text-base">Enter your email and password to log in.</Text>
                </View>

                <View className="gap-4 mb-2">
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
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        containerClassName="mb-0"
                    />
                </View>

                <TouchableOpacity className="mb-8 items-end">
                    <Text className="text-primary font-bold text-sm">Forgot Password?</Text>
                </TouchableOpacity>

                <Button
                    title="Log In"
                    onPress={handleLogin}
                    loading={loading}
                    variant="primary"
                    size="lg"
                    className="mb-6"
                />

                <TouchableOpacity onPress={() => router.push('/auth/role-selection')} className="items-center">
                    <Text className="text-mediumGray font-body">
                        Don't have an account? <Text className="font-bold text-primary">Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
