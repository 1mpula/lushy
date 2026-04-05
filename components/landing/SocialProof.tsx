
import { Review } from '@/data/landing-page';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface SocialProofProps {
    reviews: Review[];
    rating: string;
    count: string;
}

export function SocialProof({ reviews, rating, count }: SocialProofProps) {
    return (
        <View className="flex-row items-center justify-center bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-border self-center mx-auto mb-6">
            <View className="flex-row mr-3">
                {reviews.map((review, i) => (
                    <Image
                        key={review.id}
                        source={{ uri: review.avatar }}
                        className={`w-8 h-8 rounded-full border-2 border-border ${i > 0 ? '-ml-3' : ''}`}
                    />
                ))}
            </View>
            <View>
                <View className="flex-row items-center">
                    <Text className="font-bold text-foreground mr-1">{rating}</Text>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                </View>
                <Text className="text-xs text-mediumGray font-medium">{count} Happy Clients</Text>
            </View>
        </View>
    );
}
