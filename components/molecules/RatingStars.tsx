import { Star } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface RatingStarsProps {
    rating: number;
    size?: number;
    showCount?: boolean;
    count?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
}

export function RatingStars({
    rating,
    size = 16,
    showCount = false,
    count = 0,
    interactive = false,
    onRate,
}: RatingStarsProps) {
    const stars = [1, 2, 3, 4, 5];

    const handlePress = (starValue: number) => {
        if (interactive && onRate) {
            onRate(starValue);
        }
    };

    return (
        <View className="flex-row items-center">
            {stars.map((star) => {
                const filled = star <= Math.floor(rating);
                const halfFilled = !filled && star === Math.ceil(rating) && rating % 1 >= 0.5;

                const StarComponent = interactive ? TouchableOpacity : View;

                return (
                    <StarComponent
                        key={star}
                        onPress={() => handlePress(star)}
                        className={interactive ? "p-1" : ""}
                    >
                        <Star
                            size={size}
                            color="#FFB800"
                            fill={filled || halfFilled ? "#FFB800" : "transparent"}
                            strokeWidth={2}
                        />
                    </StarComponent>
                );
            })}

            {showCount && count > 0 && (
                <Text className="ml-2 text-mediumGray text-xs">
                    {rating.toFixed(1)} ({count})
                </Text>
            )}

            {showCount && count === 0 && (
                <Text className="ml-2 text-mediumGray text-xs">
                    New
                </Text>
            )}
        </View>
    );
}
