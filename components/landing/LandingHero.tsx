
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiText, MotiView } from 'moti';
import { Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface LandingHeroProps {
    heading: string;
    subheading: string;
}

export function LandingHero({ heading, subheading }: LandingHeroProps) {
    return (
        <View className="absolute top-0 left-0 right-0 h-[65%] overflow-hidden rounded-b-[60px] bg-white z-0">
            {/* Background Image with absolute positioning */}
            <MotiView
                from={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'timing', duration: 10000, loop: true, repeatReverse: true }}
                className="absolute inset-0 w-full h-full"
            >
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1000&q=80' }} // High quality salon/hair image
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
            </MotiView>

            {/* Gradient Overlay for Text Readability */}
            <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.8)', '#FFFFFF']}
                locations={[0, 0.4, 0.7, 1]}
                className="absolute inset-0 w-full h-full"
            />

            <View className="absolute bottom-0 left-0 right-0 px-8 pb-12 items-center text-center">
                <MotiText
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 300, type: 'timing', duration: 800 }}
                    className="text-5xl font-heading font-extrabold text-charcoal text-center leading-[1.1] mb-4"
                >
                    {heading}
                </MotiText>

                <MotiText
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 500, type: 'timing', duration: 800 }}
                    className="text-lg font-body text-mediumGray text-center max-w-xs leading-relaxed"
                >
                    {subheading}
                </MotiText>
            </View>
        </View>
    );
}
