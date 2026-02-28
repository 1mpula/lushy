import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PhoneMockup } from '../components/PhoneMockup';
import { COLORS, SPRING_CONFIG } from '../styles';

const { fontFamily } = loadFont();

// Simulated hairstyle cards for masonry grid
const hairstyleCards = [
    { color: '#FFB6C1', height: 160 },
    { color: '#DDA0DD', height: 200 },
    { color: '#E6E6FA', height: 140 },
    { color: '#FFDAB9', height: 180 },
    { color: '#B0E0E6', height: 150 },
    { color: '#98FB98', height: 170 },
];

export const BrowseScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Text animation
    const textProgress = spring({
        frame: frame - fps * 0.3,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    const textTranslateY = interpolate(textProgress, [0, 1], [50, 0]);
    const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);

    return (
        <AbsoluteFill
            style={{
                background: COLORS.offWhite,
            }}
        >
            {/* Headline */}
            <div
                style={{
                    position: 'absolute',
                    top: 180,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    opacity: textOpacity,
                    transform: `translateY(${textTranslateY}px)`,
                }}
            >
                <div
                    style={{
                        fontSize: 64,
                        fontFamily,
                        fontWeight: 700,
                        color: COLORS.charcoal,
                        lineHeight: 1.2,
                    }}
                >
                    Discover
                </div>
                <div
                    style={{
                        fontSize: 64,
                        fontFamily,
                        fontWeight: 700,
                        background: COLORS.pinkGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1.2,
                    }}
                >
                    Amazing Styles
                </div>
            </div>

            {/* Phone with masonry grid */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 100,
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <PhoneMockup delay={10}>
                    <div style={{ padding: 20, paddingTop: 50 }}>
                        {/* App header */}
                        <div
                            style={{
                                fontSize: 24,
                                fontFamily,
                                fontWeight: 600,
                                color: COLORS.charcoal,
                                marginBottom: 20,
                            }}
                        >
                            Explore Styles
                        </div>

                        {/* Masonry grid simulation */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                            }}
                        >
                            {hairstyleCards.map((card, index) => {
                                const cardDelay = fps * 0.5 + index * 5;
                                const cardProgress = spring({
                                    frame: frame - cardDelay,
                                    fps,
                                    config: SPRING_CONFIG.snappy,
                                });

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            height: card.height,
                                            borderRadius: 16,
                                            background: card.color,
                                            opacity: cardProgress,
                                            transform: `scale(${interpolate(cardProgress, [0, 1], [0.8, 1])})`,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </PhoneMockup>
            </div>
        </AbsoluteFill>
    );
};
