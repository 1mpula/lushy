import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useServices } from '@/context/ServiceContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Clock, DollarSign } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = ['Hair', 'Nails', 'Lashes', 'Wigs', 'Makeup'];

export default function AddServiceScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { getProfessionalByUserId } = useProfessionals();
    const { refreshServices } = useServices();
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;

    interface ImageAsset {
        uri: string;
        width: number;
        height: number;
        type?: 'image' | 'video';
    }

    const [images, setImages] = useState<ImageAsset[]>([]);
    const [video, setVideo] = useState<ImageAsset | null>(null);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('60');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Hair');
    const [isLoading, setIsLoading] = useState(false);

    const professional = getProfessionalByUserId(user?.id || '');

    const pickImage = async () => {
        if (images.length >= 5) {
            Alert.alert('Limit Reached', 'You can only upload up to 5 images.');
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photo library');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'], // Update to react-native native format instead of enum to avoid type errors
            allowsEditing: false,
            quality: 0.8,
            videoMaxDuration: 60,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const isVideo = asset.type === 'video' || asset.uri.endsWith('.mp4') || asset.uri.endsWith('.mov');

            if (isVideo) {
                if (video) {
                    Alert.alert('Limit Reached', 'You can only upload 1 video per service. Please remove the existing one first.');
                    return;
                }
                setVideo({
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height,
                    type: 'video'
                });
            } else {
                setImages([...images, {
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height,
                    type: 'image'
                }]);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeVideo = () => {
        setVideo(null);
    };

    const handlePublish = async () => {
        // Validation
        if (!title.trim()) {
            Alert.alert('Missing Info', 'Please enter a service title');
            return;
        }
        if (!price.trim() || isNaN(Number(price))) {
            Alert.alert('Missing Info', 'Please enter a valid price');
            return;
        }
        if (!professional) {
            Alert.alert('Not a Provider', 'You need to be registered as a provider to add services');
            return;
        }

        setIsLoading(true);

        try {
            const uploadedUrls: string[] = [];

            // Upload images to Supabase Storage
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const uri = img.uri;

                // Skip if already a remote URL (in case of future edit mode)
                if (uri.startsWith('http')) {
                    uploadedUrls.push(uri);
                    continue;
                }

                const filename = `${selectedCategory.toLowerCase()}/${user?.id}_${Date.now()}_${i}.jpg`;
                const response = await fetch(uri);
                const arrayBuffer = await response.arrayBuffer();

                const { data, error } = await supabase
                    .storage
                    .from('services') // User created 'services' bucket
                    .upload(filename, arrayBuffer, {
                        contentType: 'image/jpeg',
                    });

                if (error) throw error;

                const { data: { publicUrl } } = supabase
                    .storage
                    .from('services')
                    .getPublicUrl(filename);

                uploadedUrls.push(publicUrl);
            }

            // Upload video to Supabase Storage if it exists
            let videoUrl = null;
            if (video) {
                if (video.uri.startsWith('http')) {
                    videoUrl = video.uri;
                } else {
                    const filename = `${selectedCategory.toLowerCase()}/${user?.id}_${Date.now()}_video.mp4`;
                    const response = await fetch(video.uri);
                    const arrayBuffer = await response.arrayBuffer();

                    const { error } = await supabase
                        .storage
                        .from('services')
                        .upload(filename, arrayBuffer, {
                            contentType: 'video/mp4',
                        });

                    if (error) throw error;

                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('services')
                        .getPublicUrl(filename);

                    videoUrl = publicUrl;
                }
            }

            // Fallback placeholder if no images
            if (uploadedUrls.length === 0) {
                uploadedUrls.push('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&fit=crop');
            }

            // Insert service to Supabase
            const { error } = await supabase
                .from('services')
                .insert({
                    professional_id: professional.id,
                    name: title.trim(),
                    description: description.trim(),
                    price: parseFloat(price),
                    duration_minutes: parseInt(duration) || 60,
                    image_urls: uploadedUrls,
                    // Save dimensions of the FIRST image (primary)
                    image_width: images.length > 0 ? images[0].width : 800,
                    image_height: images.length > 0 ? images[0].height : 800,
                    video_url: videoUrl,
                    category: selectedCategory,
                    is_active: true,
                })
                .select()
                .single();

            if (error) throw error;

            // Refresh services list
            await refreshServices();

            Alert.alert('Success! 🎉', 'Your service has been published', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (err: any) {
            console.error('Error adding service:', err);
            Alert.alert('Error', err.message || 'Failed to publish service');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-50">
                    <TouchableOpacity onPress={() => router.back()} className="-ml-2 p-2">
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold font-heading text-charcoal">Add Service</Text>
                    <View className="w-8" />
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <ScrollView className="flex-1 bg-offWhite p-6">

                        {/* Image Upload */}
                        <View className="mb-6">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                <TouchableOpacity
                                    onPress={pickImage}
                                    className="w-24 h-24 bg-gray-100 rounded-xl items-center justify-center border-2 border-dashed border-gray-300 mr-3"
                                >
                                    <Camera size={24} color="#FF4081" />
                                    <Text className="text-xs text-gray-400 mt-1">Add</Text>
                                </TouchableOpacity>

                                {images.map((img, index) => (
                                    <View key={index} className="relative mr-3">
                                        <Image source={{ uri: img.uri }} className="w-24 h-24 rounded-xl" resizeMode="cover" />
                                        <TouchableOpacity
                                            onPress={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                                        >
                                            <Text className="text-xs font-bold text-red-500">✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                {video && (
                                    <View className="relative mr-3 items-center justify-center bg-black w-24 h-24 rounded-xl">
                                        <Camera size={24} color="white" />
                                        <Text className="text-white text-xs mt-1 font-bold">Video</Text>
                                        <TouchableOpacity
                                            onPress={removeVideo}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                                        >
                                            <Text className="text-xs font-bold text-red-500">✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </ScrollView>
                            <Text className="text-xs text-gray-400 mt-2 ml-1">
                                {images.length}/5 images | {video ? '1' : '0'}/1 video selected
                            </Text>
                        </View>

                        <View className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                            {/* Title */}
                            <Input
                                label="Service Title"
                                placeholder="e.g. Silk Press, Box Braids"
                                value={title}
                                onChangeText={setTitle}
                                containerClassName="mb-6"
                            />

                            {/* Price & Duration */}
                            <View className="flex-row gap-4 mb-6">
                                <View className="flex-1">
                                    <Input
                                        label="Price"
                                        placeholder="0.00"
                                        value={price}
                                        onChangeText={setPrice}
                                        keyboardType="numeric"
                                        leftIcon={<DollarSign size={16} color="#9CA3AF" />}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Input
                                        label="Duration (min)"
                                        placeholder="60"
                                        value={duration}
                                        onChangeText={setDuration}
                                        keyboardType="numeric"
                                        leftIcon={<Clock size={16} color="#9CA3AF" />}
                                    />
                                </View>
                            </View>

                            {/* Category */}
                            <View className="mb-6">
                                <Text className="mb-2 text-sm font-bold text-charcoal font-bodyMedium">Category</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <TouchableOpacity
                                            key={cat}
                                            onPress={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`font-bold text-xs ${selectedCategory === cat ? 'text-white' : 'text-charcoal'}`}>
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Description */}
                            <Input
                                label="Description"
                                placeholder="Describe what's included, hair type, any requirements..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                className="h-32 text-top"
                                textAlignVertical="top"
                            />
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Footer */}
                <View className="p-6 bg-white border-t border-gray-100">
                    <Button
                        title={isLoading ? "Publishing..." : "Publish Service"}
                        onPress={handlePublish}
                        loading={isLoading}
                        disabled={isLoading}
                        size="lg"
                        className="shadow-lg shadow-pink-200"
                    />
                </View>
            </SafeAreaView>
            {/* Bottom padding for Android */}
            {Platform.OS === 'android' && <View style={{ height: bottomPadding }} />}
        </View>
    );
}
