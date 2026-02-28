import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

export const HookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Background pulse animation
    const bgPulse = 1 + Math.sin(frame * 0.1) * 0.02;

    // Main text entrance
    const stillProgress = spring({
        frame: frame - 10,
        fps,
        config: SPRING_CONFIG.bouncy,
    });

    const missingProgress = spring({
        frame: frame - 20,
        fps,
        config: SPRING_CONFIG.snappy,
    });

    const clientsProgress = spring({
        frame: frame - 30,
        fps,
        config: SPRING_CONFIG.heavy,
    });

    // Question mark animation
    const questionScale = spring({
        frame: frame - 45,
        fps,
        config: { damping: 5, stiffness: 100 },
    });

    const questionRotation = interpolate(frame, [45, 75], [-15, 0], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
    });

    // Subtle glow pulse
    const glowIntensity = 0.3 + Math.sin(frame * 0.15) * 0.1;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.lightPink} 100%)`,
                transform: `scale(${bgPulse})`,
            }}
        >
            {/* Decorative circles */}
            <div
                style={{
                    position: 'absolute',
                    top: 200,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: COLORS.vibrantPink,
                    opacity: 0.1,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 300,
                    left: -150,
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: COLORS.calmingTeal,
                    opacity: 0.08,
                }}
            />

            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 60,
                }}
            >
                {/* "Still" */}
                <div
                    style={{
                        fontSize: 72,
                        fontFamily,
                        fontWeight: 400,
                        color: COLORS.mediumGray,
                        opacity: stillProgress,
                        transform: `translateY(${interpolate(stillProgress, [0, 1], [30, 0])}px)`,
                    }}
                >
                    Still
                </div>

                {/* "Missing" */}
                <div
                    style={{
                        fontSize: 120,
                        fontFamily,
                        fontWeight: 800,
                        color: COLORS.vibrantPink,
                        opacity: missingProgress,
                        transform: `translateY(${interpolate(missingProgress, [0, 1], [40, 0])}px)`,
                        textShadow: `0 0 ${60 * glowIntensity}px rgba(255, 64, 129, ${glowIntensity})`,
                    }}
                >
                    MISSING
                </div>

                {/* "Clients?" */}
                <div
                    style={{
                        fontSize: 100,
                        fontFamily,
                        fontWeight: 700,
                        color: COLORS.charcoal,
                        opacity: clientsProgress,
                        transform: `translateY(${interpolate(clientsProgress, [0, 1], [50, 0])}px)`,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    Clients
                    <span
                        style={{
                            color: COLORS.vibrantPink,
                            transform: `scale(${questionScale}) rotate(${questionRotation}deg)`,
                            display: 'inline-block',
                            marginLeft: 10,
                        }}
                    >
                        ?
                    </span>
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        marginTop: 80,
                        fontSize: 36,
                        fontFamily,
                        fontWeight: 500,
                        color: COLORS.mediumGray,
                        opacity: interpolate(frame, [55, 70], [0, 1], { extrapolateRight: 'clamp' }),
                        textAlign: 'center',
                    }}
                >
                    There's a better way...
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
