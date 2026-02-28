import { Skeleton as MotiSkeleton } from 'moti/skeleton';
import React from 'react';
import { View } from 'react-native';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    radius?: number | 'round';
    colorMode?: 'light' | 'dark';
    className?: string;
}

export const Skeleton = ({
    width,
    height,
    radius = 12,
    colorMode = 'light',
    className = "",
    style = {}
}: SkeletonProps & { style?: any }) => {
    // Convert percentage strings to numbers if needed, or pass directly if Moti supports it
    // Most MotiSkeleton props for size expect numbers or specific "Size" types.
    return (
        <View className={className} style={style}>
            <MotiSkeleton
                colorMode={colorMode}
                width={width as any}
                height={height as any}
                radius={radius}
                colors={colorMode === 'light' ? ['#F3F4F6', '#E5E7EB'] : ['#1F2937', '#111827']}
            />
        </View>
    );
};
