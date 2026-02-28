import * as Location from 'expo-location';
import { Crosshair, Home, MapPin, Store } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

type LocationType = 'house_call' | 'salon_visit';

interface LocationSelectorProps {
    readonly providerAddress?: string;
    readonly onLocationSelect: (locationType: LocationType, address: string) => void;
}

export function LocationSelector({ providerAddress = '123 Main Street, Cape Town', onLocationSelect }: LocationSelectorProps) {
    const [locationType, setLocationType] = useState<LocationType>('salon_visit');
    const [clientAddress, setClientAddress] = useState('');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const handleTypeChange = (type: LocationType) => {
        setLocationType(type);
        if (type === 'salon_visit') {
            onLocationSelect(type, providerAddress);
        } else {
            onLocationSelect(type, clientAddress);
        }
    };

    const handleAddressChange = (address: string) => {
        setClientAddress(address);
        if (locationType === 'house_call') {
            onLocationSelect(locationType, address);
        }
    };

    const handleUseCurrentLocation = async () => {
        setIsLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Needed',
                    'Please allow location access in your device settings to use this feature.'
                );
                setIsLoadingLocation(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            const [result] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (result) {
                const parts = [
                    result.streetNumber,
                    result.street,
                    result.district || result.subregion,
                    result.city,
                ].filter(Boolean);
                const address = parts.join(', ') || `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;

                setClientAddress(address);
                onLocationSelect('house_call', address);
            }
        } catch (err) {
            Alert.alert('Location Error', 'Could not get your current location. Please enter it manually.');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    return (
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
                <MapPin size={18} color="#FF4081" />
                <Text className="ml-2 text-sm font-bold text-charcoal uppercase tracking-wider">Appointment Location</Text>
            </View>

            {/* Location Type Options */}
            <View className="gap-3 mb-4">
                {/* House Call Option */}
                <TouchableOpacity
                    onPress={() => handleTypeChange('house_call')}
                    className={`flex-row items-center p-4 rounded-xl border-2 ${locationType === 'house_call'
                        ? 'border-primary bg-pink-50'
                        : 'border-gray-200 bg-white'
                        }`}
                >
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${locationType === 'house_call' ? 'bg-primary' : 'bg-gray-100'
                        }`}>
                        <Home size={20} color={locationType === 'house_call' ? 'white' : '#757575'} />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className={`text-base font-bold ${locationType === 'house_call' ? 'text-primary' : 'text-charcoal'
                            }`}>House Call</Text>
                        <Text className="text-sm text-mediumGray">Provider comes to your location</Text>
                    </View>
                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${locationType === 'house_call'
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                        }`}>
                        {locationType === 'house_call' && (
                            <View className="w-2 h-2 rounded-full bg-white" />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Salon Visit Option */}
                <TouchableOpacity
                    onPress={() => handleTypeChange('salon_visit')}
                    className={`flex-row items-center p-4 rounded-xl border-2 ${locationType === 'salon_visit'
                        ? 'border-primary bg-pink-50'
                        : 'border-gray-200 bg-white'
                        }`}
                >
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${locationType === 'salon_visit' ? 'bg-primary' : 'bg-gray-100'
                        }`}>
                        <Store size={20} color={locationType === 'salon_visit' ? 'white' : '#757575'} />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className={`text-base font-bold ${locationType === 'salon_visit' ? 'text-primary' : 'text-charcoal'
                            }`}>Salon Visit</Text>
                        <Text className="text-sm text-mediumGray">Visit provider's location</Text>
                    </View>
                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${locationType === 'salon_visit'
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                        }`}>
                        {locationType === 'salon_visit' && (
                            <View className="w-2 h-2 rounded-full bg-white" />
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Address Display/Input */}
            {locationType === 'house_call' ? (
                <View>
                    <Text className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Your Address</Text>
                    <TextInput
                        placeholder="Enter your address..."
                        value={clientAddress}
                        onChangeText={handleAddressChange}
                        className="bg-gray-50 p-4 rounded-xl text-charcoal border border-gray-200"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Use Current Location Button */}
                    <TouchableOpacity
                        onPress={handleUseCurrentLocation}
                        disabled={isLoadingLocation}
                        className="flex-row items-center justify-center mt-3 py-3 bg-teal-50 rounded-xl border border-teal-200 active:opacity-70"
                    >
                        {isLoadingLocation ? (
                            <ActivityIndicator size="small" color="#009688" />
                        ) : (
                            <Crosshair size={16} color="#009688" />
                        )}
                        <Text className="ml-2 text-sm font-bold text-teal-700">
                            {isLoadingLocation ? 'Getting location...' : 'Use Current Location'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Text className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Provider's Location</Text>
                    <View className="flex-row items-center">
                        <MapPin size={14} color="#FF4081" />
                        <Text className="ml-2 text-mediumGray">{providerAddress}</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

