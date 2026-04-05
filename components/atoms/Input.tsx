import { Text, TextInput, TextInputProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
    leftIcon?: React.ReactNode;
}

export function Input({
    label,
    error,
    containerClassName,
    className,
    leftIcon,
    ...props
}: InputProps) {
    return (
        <View className={twMerge("w-full mb-4", containerClassName)}>
            {label && (
                <Text className="mb-1 text-sm font-bodyMedium text-foreground">
                    {label}
                </Text>
            )}
            <View className="relative justify-center">
                {leftIcon && (
                    <View className="absolute left-4 z-10">
                        {leftIcon}
                    </View>
                )}
                <TextInput
                    placeholderTextColor="#9CA3AF"
                    className={twMerge(
                        "w-full px-4 py-3 bg-background border border-border rounded-xl font-body text-foreground focus:border-primary focus:border-2",
                        className,
                        leftIcon && "pl-12",
                        error && "border-red-500"
                    )}
                    {...props}
                />
            </View>
            {error && (
                <Text className="mt-1 text-xs text-red-500 font-body">
                    {error}
                </Text>
            )}
        </View>
    );
}
