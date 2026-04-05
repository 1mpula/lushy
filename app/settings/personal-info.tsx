import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Header } from '@/components/molecules/Header';
import { useUser } from '@/context/UserContext';
import { updateProfile } from '@/lib/auth';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const { user, refreshUser } = useUser();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Pre-fill with user data
    useEffect(() => {
        if (user) {
            setName(user.fullName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required.');
            return;
        }
        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to update your profile.');
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile(user.id, {
                fullName: name.trim(),
                phone: phone.trim(),
            });
            await refreshUser();
            Alert.alert('Success', 'Your information has been updated!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-card">
            <Header title="Personal Information" />

            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 60 }}>
                <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400 }}
                >
                    <Input
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Your full name"
                    />
                    <Input
                        label="Email Address"
                        value={email}
                        onChangeText={() => { }}
                        placeholder="your@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={false}
                    />
                    <Text className="text-xs text-mediumGray -mt-2 mb-4">
                        Email cannot be changed. Contact support if needed.
                    </Text>
                    <Input
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+1 (555) 000-0000"
                        keyboardType="phone-pad"
                    />

                    <Button
                        title={isSaving ? "Saving..." : "Save Changes"}
                        onPress={handleSave}
                        size="lg"
                        className="mt-6 shadow-lg shadow-pink-100"
                        disabled={isSaving}
                        loading={isSaving}
                    />
                </MotiView>
            </ScrollView>
        </View>
    );
}
