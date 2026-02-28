import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../styles';

const { fontFamily } = loadFont();

// Confetti particle
const Particle: React.FC<{ delay: number; x: number; color: string }> = ({ delay, x, color }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 80 },
    });

    const y = interpolate(progress, [0, 1], [-50, 300]);
    const rotation = interpolate(progress, [0, 1], [0, 360]);
    const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 0]);

    return (
        <div
            style={{
                position: 'absolute',
                top: 600,
                left: `${x}%`,
                width: 16,
                height: 16,
                borderRadius: 4,
                background: color,
                transform: `translateY(${y}px) rotate(${rotation}deg)`,
                opacity,
            }}
        />
    );
};

export const ConfirmScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Checkmark animation
    const checkProgress = spring({
        frame: frame - fps * 0.2,
        fps,
        config: SPRING_CONFIG.bouncy,
    });

    const checkScale = interpolate(checkProgress, [0, 1], [0, 1]);
    const checkOpacity = interpolate(checkProgress, [0, 0.5], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Text animation
    const textProgress = spring({
        frame: frame - fps * 0.5,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    const textTranslateY = interpolate(textProgress, [0, 1], [30, 0]);
    const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);

    // Confetti colors
    const confettiColors = [
        COLORS.vibrantPink,
        COLORS.calmingTeal,
        '#FFD700',
        '#FF6B6B',
        '#4ECDC4',
        '#9B59B6',
    ];

    return (
        <AbsoluteFill
            style={{
                background: COLORS.white,
            }}
        >
            {/* Confetti particles */}
            {confettiColors.map((color, i) => (
                <React.Fragment key={i}>
                    <Particle delay={fps * 0.3 + i * 2} x={10 + i * 15} color={color} />
                    <Particle delay={fps * 0.4 + i * 2} x={15 + i * 15} color={confettiColors[(i + 1) % confettiColors.length]} />
                </React.Fragment>
            ))}

            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Success checkmark */}
                <div
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        background: COLORS.calmingTeal,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: `scale(${checkScale})`,
                        opacity: checkOpacity,
                        boxShadow: '0 20px 60px rgba(0, 150, 136, 0.4)',
                    }}
                >
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                        <path
                            d="M25 50 L42 67 L75 33"
                            stroke="white"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray={100}
                            strokeDashoffset={interpolate(checkProgress, [0, 1], [100, 0])}
                        />
                    </svg>
                </div>

                {/* Success text */}
                <div
                    style={{
                        marginTop: 60,
                        opacity: textOpacity,
                        transform: `translateY(${textTranslateY}px)`,
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: 72,
                            fontFamily,
                            fontWeight: 700,
                            color: COLORS.charcoal,
                        }}
                    >
                        You're All Set!
                    </div>
                    <div
                        style={{
                            fontSize: 36,
                            fontFamily,
                            fontWeight: 400,
                            color: COLORS.mediumGray,
                            marginTop: 20,
                        }}
                    >
                        Booking confirmed ✨
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
