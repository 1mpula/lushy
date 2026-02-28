import { Button } from '@/components/atoms/Button';
import { Header } from '@/components/molecules/Header';
import { Colors } from '@/constants/theme';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useUser } from '@/context/UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bell, Briefcase, ChevronRight, FileText, HelpCircle, Moon, Shield, Star, User } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, userRole, setUserRole, logout } = useUser();
    const { getProfessionalByUserId } = useProfessionals();
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const themeColors = Colors[colorScheme ?? 'light'];
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;

    const pro = getProfessionalByUserId(user?.id || '');
    const displayName = userRole === 'provider' ? (pro?.businessName || pro?.fullName) : user?.fullName;
    const displayEmail = user?.email || 'Guest User';
    const avatarUrl = pro?.avatarUrl || user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop';

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/');
                    }
                }
            ]
        );
    };

    const handleNotificationToggle = (value: boolean) => {
        setNotificationsEnabled(value);
        if (value) {
            Alert.alert('Notifications', 'Notifications enabled!');
        }
    };

    const SettingItem = ({ icon, label, value, onPress, isDestructive = false, index, iconBg = '#F3F4F6' }: any) => (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 100 + index * 50, type: 'timing', duration: 400 }}
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                className="flex-row items-center justify-between py-4 px-2"
            >
                <View className="flex-row items-center gap-4">
                    <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: isDestructive ? '#FEE2E2' : iconBg }}
                    >
                        {icon}
                    </View>
                    <Text className={`text-base font-semibold ${isDestructive ? 'text-red-500' : 'text-charcoal'}`}>
                        {label}
                    </Text>
                </View>
                <View className="flex-row items-center gap-2">
                    {value && <Text className="text-gray-400 text-sm font-medium">{value}</Text>}
                    <ChevronRight size={18} color="#D1D5DB" />
                </View>
            </TouchableOpacity>
        </MotiView>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <Text className="px-2 mt-8 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</Text>
    );

    return (
        <View className="flex-1 bg-white">
            <Header title="Settings" />

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 + bottomPadding }}
            >
                {/* User Profile Card */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 500 }}
                    className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 items-center flex-row mb-2"
                >
                    <Image
                        source={{ uri: avatarUrl }}
                        className="w-16 h-16 rounded-2xl mr-4"
                        contentFit="cover"
                    />
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-charcoal leading-tight" numberOfLines={1}>
                            {displayName || 'Your Name'}
                        </Text>
                        <Text className="text-gray-500 font-medium text-sm" numberOfLines={1}>
                            {displayEmail}
                        </Text>
                    </View>
                </MotiView>

                {/* Account Section */}
                <SectionHeader title="Account" />
                <View className="bg-white rounded-3xl overflow-hidden">
                    {userRole === 'provider' && (
                        <>
                            <SettingItem
                                index={0}
                                icon={<Briefcase size={20} color="#FF4081" />}
                                iconBg="#FFF0F6"
                                label="Business Profile"
                                onPress={() => router.push('/settings/business-profile')}
                            />
                            <SettingItem
                                index={1}
                                icon={<Star size={20} color="#F59E0B" />}
                                iconBg="#FFFBEB"
                                label="Subscription"
                                onPress={() => router.push('/settings/subscription')}
                            />
                        </>
                    )}
                    <SettingItem
                        index={2}
                        icon={<User size={20} color="#4F46E5" />}
                        iconBg="#EEF2FF"
                        label="Personal Information"
                        onPress={() => router.push('/settings/personal-info')}
                    />
                    <SettingItem
                        index={2}
                        icon={<Shield size={20} color="#10B981" />}
                        iconBg="#ECFDF5"
                        label="Security & Privacy"
                        onPress={() => router.push('/settings/security')}
                    />
                </View>

                {/* Preferences */}
                <SectionHeader title="Preferences" />
                <View className="bg-white rounded-3xl overflow-hidden">
                    <MotiView
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: 300, type: 'timing', duration: 400 }}
                        className="flex-row items-center justify-between py-4 px-2"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-xl items-center justify-center bg-blue-50">
                                <Bell size={20} color="#3B82F6" />
                            </View>
                            <Text className="text-base font-semibold text-charcoal">Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={handleNotificationToggle}
                            trackColor={{ false: '#E5E7EB', true: '#FFB2CD' }}
                            thumbColor={notificationsEnabled ? '#FF4081' : '#F3F4F6'}
                        />
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: 350, type: 'timing', duration: 400 }}
                        className="flex-row items-center justify-between py-4 px-2"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-xl items-center justify-center bg-purple-50">
                                <Moon size={20} color="#8B5CF6" />
                            </View>
                            <Text className="text-base font-semibold text-charcoal">Dark Mode</Text>
                        </View>
                        <Switch
                            value={colorScheme === 'dark'}
                            onValueChange={toggleColorScheme}
                            trackColor={{ false: '#E5E7EB', true: '#FFB2CD' }}
                            thumbColor={colorScheme === 'dark' ? '#FF4081' : '#F3F4F6'}
                        />
                    </MotiView>
                </View>

                {/* Support */}
                <SectionHeader title="Support" />
                <View className="bg-white rounded-3xl overflow-hidden">
                    <SettingItem
                        index={6}
                        icon={<HelpCircle size={20} color="#F59E0B" />}
                        iconBg="#FFFBEB"
                        label="Help Center"
                        onPress={() => router.push('/settings/help-center')}
                    />
                    <SettingItem
                        index={7}
                        icon={<FileText size={20} color="#6B7280" />}
                        iconBg="#F3F4F6"
                        label="Terms & Privacy"
                        onPress={() => router.push('/settings/terms')}
                    />
                </View>

                {/* Logout Button */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 500, type: 'timing', duration: 500 }}
                    className="mt-12"
                >
                    <Button
                        title="Log Out"
                        variant="outline"
                        onPress={handleLogout}
                        size="lg"
                        className="border-red-500/20 bg-red-50"
                        textClassName="text-red-500 font-heading"
                    />
                </MotiView>

                <Text className="text-center text-xs font-bold text-gray-300 mt-8 mb-4 tracking-widest">
                    LUSHY VERSION 1.0.0
                </Text>

            </ScrollView>
        </View>
    );
}

