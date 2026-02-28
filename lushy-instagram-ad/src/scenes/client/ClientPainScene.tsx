import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

const painPoints = [
    { text: "Endless scrolling for stylists?", icon: "📱", delay: 0.2 },
    { text: "Last-minute cancellations?", icon: "❌", delay: 0.6 },
    { text: "Not knowing who to trust?", icon: "🤷‍♀️", delay: 1.0 },
];

export const ClientPainScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill
            style={{
                background: COLORS.offWhite,
            }}
        >
            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 60,
                    gap: 50,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        fontSize: 44,
                        fontFamily,
                        fontWeight: 600,
                        color: COLORS.mediumGray,
                        marginBottom: 30,
                        opacity: interpolate(frame, [0, fps * 0.3], [0, 1], {
                            extrapolateRight: 'clamp',
                        }),
                    }}
                >
                    Sound familiar?
                </div>

                {/* Pain points */}
                {painPoints.map((point, index) => {
                    const itemProgress = spring({
                        frame: frame - fps * point.delay,
                        fps,
                        config: SPRING_CONFIG.snappy,
                    });

                    const translateX = interpolate(itemProgress, [0, 1], [-300, 0]);
                    const opacity = interpolate(itemProgress, [0, 1], [0, 1]);

                    // Subtle shake effect for frustration
                    const shakePhase = Math.sin((frame - index * 5) * 0.3) * 2;

                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 25,
                                padding: '30px 50px',
                                borderRadius: 24,
                                background: 'rgba(255, 64, 129, 0.08)',
                                border: '2px solid rgba(255, 64, 129, 0.2)',
                                opacity,
                                transform: `translateX(${translateX}px) translateX(${shakePhase}px)`,
                            }}
                        >
                            <span style={{ fontSize: 50 }}>{point.icon}</span>
                            <span
                                style={{
                                    fontSize: 36,
                                    fontFamily,
                                    fontWeight: 500,
                                    color: COLORS.charcoal,
                                }}
                            >
                                {point.text}
                            </span>
                        </div>
                    );
                })}

                {/* Frustrated emoji at bottom */}
                <div
                    style={{
                        marginTop: 40,
                        fontSize: 100,
                        opacity: interpolate(frame, [fps * 1.5, fps * 1.8], [0, 1], {
                            extrapolateRight: 'clamp',
                            extrapolateLeft: 'clamp',
                        }),
                        transform: `scale(${interpolate(frame, [fps * 1.5, fps * 2], [0.5, 1], {
                            extrapolateRight: 'clamp',
                            extrapolateLeft: 'clamp',
                        })})`,
                    }}
                >
                    😩
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
