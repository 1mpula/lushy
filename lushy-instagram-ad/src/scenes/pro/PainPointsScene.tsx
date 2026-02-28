import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

type PainPointProps = {
    text: string;
    delay: number;
    index: number;
};

const PainPoint: React.FC<PainPointProps> = ({ text, delay, index }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entryProgress = spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIG.snappy,
    });

    const strikeProgress = interpolate(frame, [delay + 20, delay + 35], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
    });

    const shakeX = frame > delay && frame < delay + 10
        ? Math.sin(frame * 3) * 5
        : 0;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                opacity: entryProgress,
                transform: `translateX(${interpolate(entryProgress, [0, 1], [-100, 0]) + shakeX}px)`,
                marginBottom: 50,
            }}
        >
            {/* X icon */}
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 48,
                    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
                }}
            >
                ✕
            </div>

            {/* Text with strikethrough */}
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        fontSize: 52,
                        fontFamily,
                        fontWeight: 600,
                        color: COLORS.charcoal,
                    }}
                >
                    {text}
                </div>
                {/* Animated strikethrough */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        height: 6,
                        width: `${strikeProgress * 100}%`,
                        background: '#FF6B6B',
                        borderRadius: 3,
                        transform: 'translateY(-50%)',
                    }}
                />
            </div>
        </div>
    );
};

export const PainPointsScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const painPoints = [
        { text: 'No-shows eating your time', delay: 5 },
        { text: 'Bookings everywhere', delay: 25 },
        { text: 'Clients can\'t find you', delay: 45 },
    ];

    // Title entrance
    const titleProgress = spring({
        frame,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    return (
        <AbsoluteFill
            style={{
                background: COLORS.white,
            }}
        >
            {/* Red gradient accent */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 8,
                    background: 'linear-gradient(90deg, #FF6B6B 0%, #FF4081 100%)',
                }}
            />

            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 80,
                }}
            >
                {/* Title */}
                <div
                    style={{
                        fontSize: 56,
                        fontFamily,
                        fontWeight: 700,
                        color: COLORS.charcoal,
                        marginBottom: 80,
                        opacity: titleProgress,
                        transform: `translateY(${interpolate(titleProgress, [0, 1], [-20, 0])}px)`,
                    }}
                >
                    Sound familiar?
                </div>

                {/* Pain points */}
                {painPoints.map((point, index) => (
                    <PainPoint
                        key={index}
                        text={point.text}
                        delay={point.delay}
                        index={index}
                    />
                ))}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
