import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useServices } from '@/context/ServiceContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Camera, Clock, DollarSign } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = ['Hair', 'Nails', 'Lashes', 'Wigs', 'Makeup'];

interface ImageAsset {
    uri: string;
    width: number;
    height: number;
    isRemote?: boolean; // Flag to distinguish already-uploaded images
}

export default function EditServiceScreen() {
    const router = useRouter();
    const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
    const { user } = useUser();
    const { getProfessionalByUserId } = useProfessionals();
    const { getServiceById, updateService, refreshServices, isLoading: contextLoading } = useServices();
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;

    const [images, setImages] = useState<ImageAsset[]>([]);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('60');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Hair');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const professional = getProfessionalByUserId(user?.id || '');
    const service = getServiceById(serviceId || '');

    // Pre-populate form with existing service data
    useEffect(() => {
        if (service && !isInitialized) {
            setTitle(service.name);
            setPrice(service.price.toString());
            setDuration(service.durationMinutes.toString());
            setDescription(service.description || '');
            setSelectedCategory(service.category || 'Hair');

            // Convert existing image URLs to ImageAsset format
            const existingImages: ImageAsset[] = (service.imageUrls || []).map((url, index) => ({
                uri: url,
                width: index === 0 ? (service.imageWidth || 800) : 800,
                height: index === 0 ? (service.imageHeight || 800) : 800,
                isRemote: true,
            }));
            setImages(existingImages);
            setIsInitialized(true);
        }
    }, [service, isInitialized]);

    const pickImage = async () => {
        if (images.length >= 5) {
            Alert.alert('Limit Reached', 'You can only have up to 5 images.');
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photo library');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setImages([...images, {
                uri: asset.uri,
                width: asset.width,
                height: asset.height,
                isRemote: false,
            }]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleUpdate = async () => {
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
            Alert.alert('Not a Provider', 'You need to be registered as a provider to edit services');
            return;
        }
        if (!serviceId) {
            Alert.alert('Error', 'Service ID not found');
            return;
        }

        setIsLoading(true);

        try {
            const uploadedUrls: string[] = [];

            // Process images - keep remote URLs, upload new ones
            for (let i = 0; i < images.length; i++) {
                const img = images[i];

                // If already a remote URL (existing image), keep it
                if (img.isRemote || img.uri.startsWith('http')) {
                    uploadedUrls.push(img.uri);
                    continue;
                }

                // Upload new local image
                const filename = `${selectedCategory.toLowerCase()}/${user?.id}_${Date.now()}_${i}.jpg`;
                const response = await fetch(img.uri);
                const arrayBuffer = await response.arrayBuffer();

                const { data, error } = await supabase
                    .storage
                    .from('services')
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

            // Fallback placeholder if no images
            if (uploadedUrls.length === 0) {
                uploadedUrls.push('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&fit=crop');
            }

            // Update service in Supabase via context - use serviceId from params
            await updateService(serviceId, {
                name: title.trim(),
                description: description.trim(),
                price: parseFloat(price),
                durationMinutes: parseInt(duration) || 60,
                imageUrls: uploadedUrls,
                // Save dimensions of the FIRST image (primary)
                imageWidth: images.length > 0 ? images[0].width : 800,
                imageHeight: images.length > 0 ? images[0].height : 800,
                category: selectedCategory,
            });

            Alert.alert('Success! 🎉', 'Your service has been updated', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (err: any) {
            console.error('Error updating service:', err);
            Alert.alert('Error', err.message || 'Failed to update service');
        } finally {
            setIsLoading(false);
        }
    };

    // Determine what to show - but NEVER do early returns to avoid hooks issues
    const showLoading = !isInitialized && contextLoading;
    const showNotFound = !isInitialized && !contextLoading && !service;

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header - Always shown */}
                <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-50">
                    <TouchableOpacity onPress={() => router.back()} className="-ml-2 p-2">
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold font-heading text-charcoal">Edit Service</Text>
                    <View className="w-8" />
                </View>

                {/* Content - Conditional rendering INSIDE the main return */}
                {showLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500">Loading...</Text>
                    </View>
                ) : showNotFound ? (
                    <View className="flex-1 items-center justify-center p-6">
                        <Text className="text-lg font-bold text-charcoal mb-2">Service not found</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-primary font-bold">Go back</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
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
                                    </ScrollView>
                                    <Text className="text-xs text-gray-400 mt-2 ml-1">
                                        {images.length}/5 images selected
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
                                title={isLoading ? "Updating..." : "Update Service"}
                                onPress={handleUpdate}
                                loading={isLoading}
                                disabled={isLoading}
                                size="lg"
                                className="shadow-lg shadow-pink-200"
                            />
                        </View>
                    </>
                )}
            </SafeAreaView>
            {/* Bottom padding for Android */}
            {Platform.OS === 'android' && <View style={{ height: bottomPadding }} />}
        </View>
    );
}
