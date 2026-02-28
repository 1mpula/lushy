import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LushyLogo } from '../../components/LushyLogo';
import { PhoneMockup } from '../../components/PhoneMockup';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

// Simulated app content cards
const appCards = [
    { color: '#FFB6C1', height: 100 },
    { color: '#DDA0DD', height: 130 },
    { color: '#E6E6FA', height: 90 },
    { color: '#FFDAB9', height: 110 },
    { color: '#B0E0E6', height: 95 },
    { color: '#98FB98', height: 115 },
];

export const ClientSolutionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // "There's a better way" text
    const textProgress = spring({
        frame: frame - fps * 0.1,
        fps,
        config: SPRING_CONFIG.smooth,
    });
    const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
    const textTranslateY = interpolate(textProgress, [0, 1], [30, 0]);

    // Logo reveal
    const logoProgress = spring({
        frame: frame - fps * 0.5,
        fps,
        config: SPRING_CONFIG.bouncy,
    });
    const logoScale = interpolate(logoProgress, [0, 1], [0, 1]);

    // Sparkle effect around logo
    const sparkleOpacity = interpolate(
        Math.sin((frame - fps * 0.8) * 0.2),
        [-1, 1],
        [0.3, 1]
    );

    return (
        <AbsoluteFill
            style={{
                background: COLORS.subtleGradient,
            }}
        >
            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: 140,
                }}
            >
                {/* "There's a better way" */}
                <div
                    style={{
                        fontSize: 52,
                        fontFamily,
                        fontWeight: 600,
                        color: COLORS.charcoal,
                        opacity: textOpacity,
                        transform: `translateY(${textTranslateY}px)`,
                        marginBottom: 10,
                    }}
                >
                    There's a better way...
                </div>

                {/* Lushy logo with sparkles */}
                <div
                    style={{
                        marginTop: 30,
                        transform: `scale(${logoScale})`,
                        position: 'relative',
                    }}
                >
                    {/* Sparkle decorations */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -30,
                            right: -40,
                            fontSize: 40,
                            opacity: sparkleOpacity * logoScale,
                        }}
                    >
                        ✨
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: -50,
                            fontSize: 35,
                            opacity: sparkleOpacity * 0.8 * logoScale,
                        }}
                    >
                        ✨
                    </div>
                    <LushyLogo size={180} delay={0} />
                </div>

                {/* Phone mockup with app preview */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 50,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <PhoneMockup delay={fps * 0.8}>
                        <div style={{ padding: 15, paddingTop: 45 }}>
                            {/* App header */}
                            <div
                                style={{
                                    fontSize: 20,
                                    fontFamily,
                                    fontWeight: 600,
                                    color: COLORS.charcoal,
                                    marginBottom: 15,
                                }}
                            >
                                ✨ Discover Your Look
                            </div>

                            {/* Masonry grid simulation */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 8,
                                }}
                            >
                                {appCards.map((card, index) => {
                                    const cardDelay = fps * 1.2 + index * 4;
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
                                                borderRadius: 12,
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
        </AbsoluteFill>
    );
};
