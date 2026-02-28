import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    textClassName?: string;
    icon?: React.ReactNode;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className,
    textClassName,
    icon
}: ButtonProps) {

    const baseStyles = "flex-row items-center justify-center rounded-full active:opacity-80";

    const variants = {
        primary: "bg-primary shadow-md shadow-pink-200",
        secondary: "bg-offWhite border border-gray-200",
        outline: "bg-transparent border border-primary",
    };

    const sizes = {
        sm: "px-4 py-2",
        md: "px-6 py-3",
        lg: "px-8 py-4 w-full",
    };

    const textBaseStyles = "font-heading font-bold text-center";

    const textVariants = {
        primary: "text-white",
        secondary: "text-charcoal",
        outline: "text-primary",
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                disabled && "opacity-50",
                className
            )}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : '#FF4081'} />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    <Text className={twMerge(
                        textBaseStyles,
                        textVariants[variant],
                        textSizes[size],
                        textClassName
                    )}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}
