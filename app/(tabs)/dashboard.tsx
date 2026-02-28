import { Skeleton } from '@/components/atoms/Skeleton';
import { DatePickerModule } from '@/components/molecules/DatePickerModule';
import { Header } from '@/components/molecules/Header';
import { useProfessionals } from '@/context/ProfessionalContext';
import { useUser } from '@/context/UserContext';
import { getBlockedDates, toggleBlockedDate } from '@/lib/availability';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Check, MapPin, Pencil, Plus, Settings, TrendingUp, Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { getProfessionalByUserId, refreshProfessionals, updateLocation } = useProfessionals();
    const professional = getProfessionalByUserId(user?.id || '');

    // Location State
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [locationInput, setLocationInput] = useState('');
    const [isSavingLocation, setIsSavingLocation] = useState(false);
    const [isLoadingGPS, setIsLoadingGPS] = useState(false);

    // Availability State
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
    const [isSavingAvailability, setIsSavingAvailability] = useState(false);

    // Dashboard State
    const [refreshing, setRefreshing] = useState(false);

    // Load blocked dates
    const loadBlockedDates = useCallback(async () => {
        if (!professional?.id) {
            setIsLoadingAvailability(false);
            return;
        }

        try {
            const dates = await getBlockedDates(professional.id);
            setBlockedDates(dates);
        } catch (error) {
            console.error('Error loading blocked dates:', error);
        } finally {
            setIsLoadingAvailability(false);
        }
    }, [professional?.id]);

    useEffect(() => {
        loadBlockedDates();
    }, [loadBlockedDates]);

    const onDateSelect = async (day: any) => {
        if (!professional?.id || isSavingAvailability) return;

        const dateStr = day.dateString;
        setIsSavingAvailability(true);

        try {
            const newBlockedDates = await toggleBlockedDate(professional.id, dateStr);
            setBlockedDates(newBlockedDates);
        } catch (error) {
            console.error('Error toggling date:', error);
        } finally {
            setIsSavingAvailability(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            refreshProfessionals?.(),
            loadBlockedDates()
        ]);
        setRefreshing(false);
    }, [refreshProfessionals, loadBlockedDates]);

    // Build marked dates for calendar
    const markedDates = blockedDates.reduce((acc: any, date) => {
        acc[date] = {
            selected: true,
            selectedColor: '#9E9E9E', // Gray = blocked
        };
        return acc;
    }, {});

    const stats = [
        { title: 'Total Bookings', value: '12', icon: <TrendingUp size={20} color="#FF4081" /> },
        { title: 'New Clients', value: '5', icon: <Users size={20} color="#FF4081" /> },
    ];

    if (!professional) {
        return (
            <View className="flex-1 bg-white">
                <Header title="Dashboard" showBack={false} />
                <View className="p-6 gap-6">
                    <View className="flex-row gap-4">
                        <Skeleton width="48%" height={120} />
                        <Skeleton width="48%" height={120} />
                    </View>
                    <Skeleton width="100%" height={100} />
                    <Skeleton width="100%" height={300} />
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50">
            {/* Dynamic Background Header */}
            <LinearGradient
                colors={['#FF4081', '#FF80AB', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ width: '100%', height: 280, position: 'absolute', top: 0, left: 0, opacity: 0.15 }}
            />

            <SafeAreaView className="flex-1" edges={['top']}>
                <Header
                    title="Dashboard"
                    showBack={false}
                    rightElement={
                        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white">
                            <Settings size={20} color="#333" />
                        </TouchableOpacity>
                    }
                    variant="overlay"
                />

                <ScrollView
                    className="flex-1 z-10"
                    contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF4081" />}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="mb-8"
                    >
                        <Text className="text-sm font-body text-mediumGray mb-1">Welcome back,</Text>
                        <Text className="text-3xl font-bold font-heading text-charcoal">
                            {professional.businessName || 'Professional'}
                        </Text>
                    </MotiView>

                    {/* Stats Grid */}
                    <View className="flex-row gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <View key={index} className="flex-1 bg-white p-5 rounded-3xl shadow-xl shadow-pink-100/40 border border-white">
                                <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mb-4">
                                    {stat.icon}
                                </View>
                                <Text className="text-3xl font-bold font-heading text-charcoal mb-1">{stat.value}</Text>
                                <Text className="text-sm text-mediumGray font-body">{stat.title}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Quick Actions */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold font-heading text-charcoal mb-4">Quick Actions</Text>
                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => router.push('/pro/add-service')}
                                className="flex-1 bg-primary p-5 rounded-3xl shadow-xl shadow-pink-200/50 items-center justify-center border border-pink-400"
                            >
                                <Plus size={28} color="white" className="mb-2" />
                                <Text className="text-white font-bold font-body text-center">Add Service</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/bookings')}
                                className="flex-1 bg-white p-5 rounded-3xl shadow-xl shadow-gray-200/50 items-center justify-center border border-white"
                            >
                                <Users size={24} color="#333" className="mb-2" />
                                <Text className="text-charcoal font-bold text-center">Bookings</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Salon Location */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold font-heading text-charcoal mb-4">Salon Location</Text>
                        <View className="bg-white p-5 rounded-3xl shadow-xl shadow-pink-100/40 border border-white">
                            {isEditingLocation ? (
                                <View>
                                    <TextInput
                                        value={locationInput}
                                        onChangeText={setLocationInput}
                                        placeholder="Enter your salon address..."
                                        className="bg-gray-50 p-4 rounded-xl text-charcoal border border-gray-200 mb-3"
                                        placeholderTextColor="#9CA3AF"
                                        autoFocus
                                    />
                                    <TouchableOpacity
                                        onPress={async () => {
                                            setIsLoadingGPS(true);
                                            try {
                                                const { status } = await Location.requestForegroundPermissionsAsync();
                                                if (status !== 'granted') {
                                                    Alert.alert('Permission Needed', 'Allow location access to use this feature.');
                                                    return;
                                                }
                                                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
                                                const [result] = await Location.reverseGeocodeAsync(loc.coords);
                                                if (result) {
                                                    const parts = [result.streetNumber, result.street, result.district || result.subregion, result.city].filter(Boolean);
                                                    setLocationInput(parts.join(', ') || `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`);
                                                }
                                            } catch {
                                                Alert.alert('Error', 'Could not get location.');
                                            } finally {
                                                setIsLoadingGPS(false);
                                            }
                                        }}
                                        disabled={isLoadingGPS}
                                        className="flex-row items-center justify-center py-3 bg-teal-50 rounded-xl border border-teal-200 mb-3"
                                    >
                                        {isLoadingGPS ? (
                                            <ActivityIndicator size="small" color="#009688" />
                                        ) : (
                                            <MapPin size={16} color="#009688" />
                                        )}
                                        <Text className="ml-2 text-sm font-bold text-teal-700">
                                            {isLoadingGPS ? 'Getting location...' : 'Use Current Location'}
                                        </Text>
                                    </TouchableOpacity>
                                    <View className="flex-row gap-3">
                                        <TouchableOpacity
                                            onPress={() => setIsEditingLocation(false)}
                                            className="flex-1 py-3 rounded-xl bg-gray-100 items-center"
                                        >
                                            <Text className="font-bold text-charcoal">Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                if (!locationInput.trim() || !professional?.id) return;
                                                setIsSavingLocation(true);
                                                try {
                                                    await updateLocation(professional.id, locationInput.trim());
                                                    setIsEditingLocation(false);
                                                } catch {
                                                    Alert.alert('Error', 'Could not save location.');
                                                } finally {
                                                    setIsSavingLocation(false);
                                                }
                                            }}
                                            disabled={isSavingLocation || !locationInput.trim()}
                                            className="flex-1 py-3 rounded-xl bg-primary items-center flex-row justify-center gap-2"
                                        >
                                            {isSavingLocation ? (
                                                <ActivityIndicator size="small" color="white" />
                                            ) : (
                                                <Check size={16} color="white" />
                                            )}
                                            <Text className="font-bold text-white">Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => {
                                        setLocationInput(professional?.location || '');
                                        setIsEditingLocation(true);
                                    }}
                                    className="flex-row items-center"
                                >
                                    <View className="w-10 h-10 bg-pink-50 rounded-full items-center justify-center mr-3">
                                        <MapPin size={20} color="#FF4081" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-bold text-charcoal">
                                            {professional?.location || 'No location set'}
                                        </Text>
                                        <Text className="text-xs text-mediumGray">
                                            {professional?.location ? 'Tap to update' : 'Tap to add your salon address'}
                                        </Text>
                                    </View>
                                    <Pencil size={16} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Availability Calendar */}
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-bold font-heading text-charcoal">Availability</Text>
                            {isSavingAvailability && <Skeleton width={64} height={20} radius={10} />}
                        </View>

                        <View className="bg-white rounded-3xl shadow-xl shadow-pink-100/40 border border-white overflow-hidden">
                            {isLoadingAvailability ? (
                                <View className="p-8">
                                    <Skeleton width="100%" height={280} />
                                </View>
                            ) : (
                                <>
                                    <DatePickerModule
                                        onDateSelect={onDateSelect}
                                        markedDates={markedDates}
                                    />
                                    <View className="p-4 bg-gray-50 border-t border-gray-100 flex-row items-center gap-4">
                                        <View className="flex-row items-center">
                                            <View className="w-3 h-3 bg-gray-400 rounded-full mr-2" />
                                            <Text className="text-xs text-mediumGray">Blocked</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <View className="w-3 h-3 bg-white border border-gray-300 rounded-full mr-2" />
                                            <Text className="text-xs text-mediumGray">Available</Text>
                                        </View>
                                        <Text className="ml-auto text-xs text-mediumGray italic">
                                            Tap to toggle
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
