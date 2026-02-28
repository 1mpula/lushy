import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LandingPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, userRole } = useUser();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace(userRole === 'provider' ? '/(tabs)/profile' : '/(tabs)');
        }
    }, [isAuthenticated, isLoading, userRole]);

    if (isLoading || isAuthenticated) return null;

    return (
        <LinearGradient
            colors={['#FFF0F5', '#FFDEE9', '#FFD1DC', '#FFC1CC']}
            locations={[0, 0.35, 0.7, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
        >
            <StatusBar style="dark" />

            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top + 16,
                    paddingBottom: insets.bottom + 16,
                    paddingHorizontal: 28,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Top spacer for balanced layout */}
                <View style={{ height: 40 }} />

                {/* Center content — Logo + Text */}
                <View style={{ alignItems: 'center' }}>
                    {/* Lushy Logo */}
                    <Image
                        source={require('@/assets/images/lushy-logo.png')}
                        style={{
                            width: 280,
                            height: 100,
                            marginBottom: 32,
                        }}
                        resizeMode="contain"
                    />

                    {/* Tagline */}
                    <Text
                        style={{
                            fontFamily: 'Outfit_700Bold',
                            fontSize: 30,
                            color: '#2D2D2D',
                            textAlign: 'center',
                            lineHeight: 38,
                            letterSpacing: -0.3,
                        }}
                    >
                        Book your best look
                    </Text>

                    <Text
                        style={{
                            fontFamily: 'Inter_400Regular',
                            fontSize: 15,
                            color: '#8E8E93',
                            textAlign: 'center',
                            marginTop: 12,
                            lineHeight: 22,
                            maxWidth: 260,
                        }}
                    >
                        Hair, nails, makeup & more{'\n'}— anytime, anywhere.
                    </Text>
                </View>

                {/* Bottom CTA buttons */}
                <View style={{ width: '100%', gap: 14 }}>
                    {/* Get Started */}
                    <TouchableOpacity
                        onPress={() => router.push('/auth/role-selection')}
                        activeOpacity={0.85}
                        style={{
                            backgroundColor: '#FF4081',
                            paddingVertical: 18,
                            borderRadius: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#FF4081',
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.2,
                            shadowRadius: 16,
                            elevation: 6,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Outfit_700Bold',
                                fontSize: 17,
                                color: '#FFFFFF',
                                letterSpacing: 0.3,
                            }}
                        >
                            Get Started
                        </Text>
                    </TouchableOpacity>

                    {/* Sign In */}
                    <TouchableOpacity
                        onPress={() => router.push('/auth/login')}
                        activeOpacity={0.85}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.65)',
                            paddingVertical: 18,
                            borderRadius: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: 'rgba(255, 64, 129, 0.15)',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Outfit_700Bold',
                                fontSize: 17,
                                color: '#FF4081',
                                letterSpacing: 0.3,
                            }}
                        >
                            I already have an account
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}
