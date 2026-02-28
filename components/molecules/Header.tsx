import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightElement?: React.ReactNode;
    variant?: 'default' | 'overlay';
    className?: string;
}

export const Header = ({
    title,
    showBack = true,
    onBack,
    rightElement,
    variant = 'default',
    className = ""
}: HeaderProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    if (variant === 'overlay') {
        return (
            <SafeAreaView edges={['top']} className={`absolute top-0 left-0 z-30 w-full pointer-events-box-none ${className}`}>
                <View className="px-6 py-4 flex-row items-center justify-between pointer-events-box-none">
                    {showBack ? (
                        <TouchableOpacity
                            onPress={handleBack}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/30"
                        >
                            <ChevronLeft size={24} color="white" />
                        </TouchableOpacity>
                    ) : <View className="w-10" />}

                    {title && (
                        <Text className="text-xl font-bold font-heading text-white">
                            {title}
                        </Text>
                    )}

                    {rightElement || <View className="w-10" />}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View className={`bg-white ${className}`}>
            <SafeAreaView edges={['top']}>
                <View className="px-6 py-4 flex-row items-center justify-between">
                    {showBack ? (
                        <TouchableOpacity
                            onPress={handleBack}
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                        >
                            <ChevronLeft size={24} color="#FF4081" />
                        </TouchableOpacity>
                    ) : <View className="w-10" />}

                    {title && (
                        <Text className="text-xl font-bold font-heading text-charcoal">
                            {title}
                        </Text>
                    )}

                    {rightElement || <View className="w-10" />}
                </View>
            </SafeAreaView>
        </View>
    );
};
