import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PhoneMockup } from '../components/PhoneMockup';
import { COLORS, SPRING_CONFIG } from '../styles';

const { fontFamily } = loadFont();

export const BookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Text animation
    const textProgress = spring({
        frame: frame - fps * 0.2,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    const textTranslateY = interpolate(textProgress, [0, 1], [50, 0]);
    const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);

    // Calendar days animation
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const times = ['9:00', '11:00', '14:00', '16:00'];

    return (
        <AbsoluteFill
            style={{
                background: COLORS.white,
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
                        fontSize: 56,
                        fontFamily,
                        fontWeight: 700,
                        color: COLORS.charcoal,
                        lineHeight: 1.2,
                    }}
                >
                    Book Your
                </div>
                <div
                    style={{
                        fontSize: 56,
                        fontFamily,
                        fontWeight: 700,
                        background: COLORS.tealGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1.2,
                    }}
                >
                    Hairdresser
                </div>
                <div
                    style={{
                        fontSize: 40,
                        fontFamily,
                        fontWeight: 500,
                        color: COLORS.mediumGray,
                        marginTop: 10,
                    }}
                >
                    Instantly
                </div>
            </div>

            {/* Phone with booking UI */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 100,
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <PhoneMockup delay={5} direction="left">
                    <div style={{ padding: 20, paddingTop: 50 }}>
                        {/* Calendar header */}
                        <div
                            style={{
                                fontSize: 22,
                                fontFamily,
                                fontWeight: 600,
                                color: COLORS.charcoal,
                                marginBottom: 20,
                            }}
                        >
                            Select Date & Time
                        </div>

                        {/* Days row */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                            {days.map((day, index) => {
                                const isSelected = index === 2;
                                const dayProgress = spring({
                                    frame: frame - (fps * 0.4 + index * 3),
                                    fps,
                                    config: SPRING_CONFIG.snappy,
                                });

                                return (
                                    <div
                                        key={day}
                                        style={{
                                            flex: 1,
                                            padding: '12px 8px',
                                            borderRadius: 12,
                                            background: isSelected ? COLORS.calmingTeal : COLORS.offWhite,
                                            color: isSelected ? COLORS.white : COLORS.charcoal,
                                            textAlign: 'center',
                                            fontSize: 14,
                                            fontFamily,
                                            fontWeight: 600,
                                            opacity: dayProgress,
                                            transform: `scale(${interpolate(dayProgress, [0, 1], [0.8, 1])})`,
                                        }}
                                    >
                                        {day}
                                        <div style={{ fontSize: 18, marginTop: 4 }}>{15 + index}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Time slots */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {times.map((time, index) => {
                                const isSelected = index === 1;
                                const timeProgress = spring({
                                    frame: frame - (fps * 0.6 + index * 4),
                                    fps,
                                    config: SPRING_CONFIG.snappy,
                                });

                                return (
                                    <div
                                        key={time}
                                        style={{
                                            padding: 16,
                                            borderRadius: 12,
                                            background: isSelected ? COLORS.vibrantPink : COLORS.offWhite,
                                            color: isSelected ? COLORS.white : COLORS.charcoal,
                                            fontSize: 18,
                                            fontFamily,
                                            fontWeight: 500,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            opacity: timeProgress,
                                            transform: `translateX(${interpolate(timeProgress, [0, 1], [30, 0])}px)`,
                                        }}
                                    >
                                        <span>{time}</span>
                                        <span style={{ fontSize: 14, opacity: 0.8 }}>Available</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </PhoneMockup>
            </div>
        </AbsoluteFill>
    );
};
