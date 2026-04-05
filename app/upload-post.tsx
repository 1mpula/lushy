import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Image as ImageIcon, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function UploadPostScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { getProfessionalByUserId } = useProfessionals();
    const { theme } = useTheme();

    const [image, setImage] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);

    const professional = user ? getProfessionalByUserId(user.id) : null;

    useEffect(() => {
        if (user && !professional && !isUploading) {
            // Wait for professional context to load or redirect if not a pro
            // Ideally should check userRole but let's assume if they got here they might be a pro
        }
    }, [user, professional]);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setImage(asset.uri);
            setImageWidth(asset.width);
            setImageHeight(asset.height);
        }
    };

    const uploadImage = async (uri: string): Promise<string | null> => {
        try {
            const response = await fetch(uri);
            const arrayBuffer = await response.arrayBuffer();
            const fileExt = uri.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user?.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('services')
                .upload(filePath, arrayBuffer, {
                    contentType: 'image/jpeg', // Force jpeg or infer from extension if needed, but arrayBuffer needs type
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('services').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Upload Failed', 'There was an error uploading your image.');
            return null;
        }
    };

    const handlePost = async () => {
        if (!image || !description || !price) {
            Alert.alert("Missing Fields", "Please fill in all fields and select an image.");
            return;
        }

        if (!professional) {
            Alert.alert("Error", "Could not find your professional profile. Please try logging in again.");
            return;
        }

        setIsUploading(true);

        try {
            // 1. Upload Image
            const publicUrl = await uploadImage(image);
            if (!publicUrl) {
                setIsUploading(false);
                return;
            }

            // 2. Insert into Database
            const { error } = await supabase.from('services').insert({
                professional_id: professional.id,
                name: description.split(' ')[0] + '...', // Simple name generation or add name field
                description: description,
                price: parseFloat(price),
                image_url: publicUrl,
                image_urls: [publicUrl],
                image_width: imageWidth,
                image_height: imageHeight,
                category: 'Hair', // Default or add picker
                is_active: true
            });

            if (error) throw error;

            Alert.alert("Success", "Your look has been posted!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Post error:', error);
            Alert.alert("Error", error.message || "Failed to create post.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-row items-center justify-between p-4 border-b border-border">
                <Text className="text-xl font-bold font-heading text-foreground">New Post</Text>
                <TouchableOpacity onPress={() => router.back()} disabled={isUploading}>
                    <X size={24} color={theme === 'dark' ? '#FFF' : '#333'} />
                </TouchableOpacity>
            </View>

            <ScrollView className="p-4">
                <TouchableOpacity
                    onPress={handlePickImage}
                    className="items-center justify-center w-full h-64 mb-6 bg-card rounded-xl"
                    disabled={isUploading}
                >
                    {image ? (
                        <Image source={{ uri: image }} className="w-full h-full rounded-xl" resizeMode="contain" />
                    ) : (
                        <View className="items-center">
                            <ImageIcon size={48} color="#9E9E9E" />
                            <Text className="mt-2 text-mediumGray">Tap to select photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View className="gap-4">
                    <Input
                        label="Description"
                        placeholder="Describe the look (e.g. 'Silk Press & Trim')"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        editable={!isUploading}
                    />

                    <Input
                        label="Price (BWP)"
                        placeholder="0.00"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        editable={!isUploading}
                    />

                    <Button
                        title={isUploading ? "Posting..." : "Post Look"}
                        onPress={handlePost}
                        size="lg"
                        className="mt-4"
                        disabled={isUploading}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
