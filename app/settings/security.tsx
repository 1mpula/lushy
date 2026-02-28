import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Header } from '@/components/molecules/Header';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SecurityScreen() {
    const router = useRouter();
    const { user, signOut } = useUser();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all password fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters.');
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;

            Alert.alert('Success', 'Your password has been updated!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update password.');
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (!user?.id) return;

                        setIsDeleting(true);
                        try {
                            // Delete user's profile data
                            await supabase.from('profiles').delete().eq('id', user.id);

                            // Delete from professionals table if exists
                            await supabase.from('professionals').delete().eq('user_id', user.id);

                            // Sign out the user
                            await signOut();

                            Alert.alert(
                                'Account Deleted',
                                'Your account and data have been deleted.',
                                [{ text: 'OK', onPress: () => router.replace('/') }]
                            );
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete account.');
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Header title="Security & Privacy" />

            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
                <Text className="text-lg font-bold font-heading text-charcoal mb-4">Change Password</Text>

                <View className="relative">
                    <Input
                        label="Current Password"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Enter current password"
                        secureTextEntry={!showCurrentPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-10"
                    >
                        {showCurrentPassword ? <EyeOff size={20} color="#757575" /> : <Eye size={20} color="#757575" />}
                    </TouchableOpacity>
                </View>

                <View className="relative">
                    <Input
                        label="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-10"
                    >
                        {showNewPassword ? <EyeOff size={20} color="#757575" /> : <Eye size={20} color="#757575" />}
                    </TouchableOpacity>
                </View>

                <Input
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry
                />

                <Button
                    title="Update Password"
                    onPress={handleChangePassword}
                    size="lg"
                    className="mt-4"
                />

                {/* Danger Zone */}
                <View className="mt-10 pt-6 border-t border-gray-200">
                    <Text className="text-lg font-bold text-red-500 mb-2">Danger Zone</Text>
                    <Text className="text-sm text-mediumGray mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </Text>
                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        className="border border-red-200 p-4 rounded-xl items-center"
                    >
                        <Text className="text-red-500 font-bold">Delete My Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
