import { LandingStep } from '@/data/landing-page';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_SPACING = 20;

interface TutorialCarouselProps {
    steps: LandingStep[];
}

export function TutorialCarousel({ steps }: TutorialCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / (CARD_WIDTH + CARD_SPACING));
        setActiveIndex(index);
    };

    return (
        <View className="py-8">
            <ScrollView
                horizontal
                pagingEnabled={false}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {steps.map((step, index) => {
                    const isActive = index === activeIndex;
                    const Icon = step.icon;

                    return (
                        <MotiView
                            key={step.id}
                            animate={{
                                scale: isActive ? 1 : 0.95,
                                opacity: isActive ? 1 : 0.7,
                            }}
                            transition={{ type: 'spring', damping: 15 }}
                            style={{
                                width: CARD_WIDTH,
                                marginRight: CARD_SPACING,
                            }}
                        >
                            <LinearGradient
                                colors={step.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="rounded-[32px] p-8 h-[360px] justify-between shadow-2xl"
                                style={{
                                    shadowColor: step.color,
                                    shadowOffset: { width: 0, height: 12 },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 24,
                                    elevation: 12,
                                }}
                            >
                                <View className="flex-row justify-between items-start">
                                    <View className="w-16 h-16 bg-background/20 rounded-2xl items-center justify-center backdrop-blur-md border border-border/20">
                                        <Icon size={32} color="white" strokeWidth={2.5} />
                                    </View>
                                    <Text className="text-white/60 font-bold text-6xl opacity-20">0{step.id}</Text>
                                </View>

                                <View>
                                    <Text className="text-white font-heading font-bold text-3xl mb-3 tracking-tight">
                                        {step.title}
                                    </Text>
                                    <View className="h-1 w-12 bg-background/30 rounded-full mb-4" />
                                    <Text className="text-white font-body font-medium text-lg leading-7 opacity-90">
                                        {step.description}
                                    </Text>
                                </View>
                            </LinearGradient>
                        </MotiView>
                    );
                })}
            </ScrollView>

            {/* Pagination Dots */}
            <View className="flex-row justify-center mt-8 gap-3">
                {steps.map((step, index) => (
                    <MotiView
                        key={index}
                        animate={{
                            width: activeIndex === index ? 32 : 8,
                            backgroundColor: activeIndex === index ? step.color : '#E5E7EB',
                        }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="h-2 rounded-full"
                    />
                ))}
            </View>
        </View>
    );
}
