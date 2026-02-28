import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Header } from '@/components/molecules/Header';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Image as ImageIcon } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function BusinessProfileScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { getProfessionalByUserId, refreshProfessionals } = useProfessionals();

    const [businessName, setBusinessName] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);

    useEffect(() => {
        if (user) {
            const pro = getProfessionalByUserId(user.id);
            if (pro) {
                setBusinessName(pro.businessName || '');
                setLocation(pro.location || '');
                setBio(pro.bio || '');
                setBannerUrl(pro.bannerUrl || null);
            }
        }
    }, [user, getProfessionalByUserId]);

    const handlePickBanner = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            await uploadBanner(result.assets[0].uri);
        }
    };

    const uploadBanner = async (uri: string) => {
        if (!user) return;
        setIsUploadingBanner(true);
        try {
            const response = await fetch(uri);
            const arrayBuffer = await response.arrayBuffer();
            const fileExt = uri.split('.').pop() || 'jpg';
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('pro-banners')
                .upload(filePath, arrayBuffer, {
                    contentType: 'image/jpeg',
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('pro-banners').getPublicUrl(filePath);
            setBannerUrl(data.publicUrl);
        } catch (error) {
            console.error('Error uploading banner:', error);
            Alert.alert('Upload Failed', 'There was an error uploading your banner.');
        } finally {
            setIsUploadingBanner(false);
        }
    };


    const handleSave = async () => {
        if (!user) return;
        if (!businessName.trim()) {
            Alert.alert('Error', 'Business Name is required.');
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('professionals')
                .upsert({
                    user_id: user.id,
                    business_name: businessName.trim(),
                    location: location.trim(),
                    bio: bio.trim(),
                    banner_url: bannerUrl,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id' });

            if (error) {
                console.error('DEBUG: DB Update Error:', error);
                throw error;
            }

            await refreshProfessionals();
            Alert.alert('Success', 'Business profile updated!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update business profile.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Header title="Business Profile" />

            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 60 }}>
                <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400 }}
                >
                    <View className="mb-6 relative">
                        <Text className="text-gray-700 font-bold mb-2">Profile Banner</Text>
                        <TouchableOpacity
                            onPress={handlePickBanner}
                            disabled={isUploadingBanner}
                            className="w-full h-40 bg-gray-200 rounded-xl overflow-hidden justify-center items-center"
                        >
                            {bannerUrl ? (
                                <Image source={{ uri: bannerUrl }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <View className="items-center">
                                    <ImageIcon size={32} color="#9E9E9E" />
                                    <Text className="mt-2 text-mediumGray font-body text-sm">Add Banner Image (16:9)</Text>
                                </View>
                            )}

                            {bannerUrl && (
                                <View className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full">
                                    <ImageIcon size={20} color="#FFF" />
                                </View>
                            )}
                        </TouchableOpacity>
                        {isUploadingBanner && (
                            <View className="absolute inset-0 bg-white/70 justify-center items-center rounded-xl mt-6">
                                <Text className="font-bold text-pink-500">Uploading...</Text>
                            </View>
                        )}
                    </View>

                    <Input
                        label="Business Name"
                        value={businessName}
                        onChangeText={setBusinessName}
                        placeholder="e.g. Lushy Salon"
                    />

                    <Input
                        label="Location"
                        value={location}
                        onChangeText={setLocation}
                        placeholder="e.g. New York, NY"
                    />

                    <View className="mb-4">
                        <Text className="text-gray-700 font-bold mb-2">Bio</Text>
                        <TextInput
                            className="bg-white border border-gray-200 rounded-2xl p-4 text-base font-body text-charcoal min-h-[120px]"
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about your business..."
                            multiline
                            numberOfLines={4}
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

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
