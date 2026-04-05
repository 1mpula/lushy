import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
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
    const { theme } = useTheme();

    const baseStyles = "flex-row items-center justify-center rounded-full";

    const variants = {
        primary: "bg-primary",
        secondary: theme === 'dark' ? "bg-[#1E1E1E] border border-border" : "bg-offWhite border border-border",
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
        secondary: "text-foreground",
        outline: "text-primary",
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || loading}
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                disabled && "opacity-50",
                className
            )}
            style={[
                variant === 'primary' && {
                    shadowColor: '#FF4081',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: theme === 'dark' ? 0.2 : 0.15,
                    shadowRadius: 8,
                    elevation: 3,
                },
                typeof className === 'object' ? className : {}
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : (theme === 'dark' ? '#FFF' : '#FF4081')} />
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
