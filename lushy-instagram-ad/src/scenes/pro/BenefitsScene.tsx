import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

type BenefitStatProps = {
    icon: string;
    stat: string;
    label: string;
    delay: number;
    accentColor: string;
};

const BenefitStat: React.FC<BenefitStatProps> = ({ icon, stat, label, delay, accentColor }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entryProgress = spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIG.snappy,
    });

    const iconPop = spring({
        frame: frame - delay - 5,
        fps,
        config: { damping: 6, stiffness: 200 },
    });

    // Animated counter effect for stats
    const numberProgress = interpolate(frame, [delay, delay + 30], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 40,
                background: COLORS.white,
                borderRadius: 30,
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.08)',
                width: 280,
                opacity: entryProgress,
                transform: `scale(${entryProgress}) translateY(${interpolate(entryProgress, [0, 1], [40, 0])}px)`,
                border: `3px solid ${accentColor}30`,
            }}
        >
            {/* Icon */}
            <div
                style={{
                    fontSize: 60,
                    marginBottom: 20,
                    transform: `scale(${iconPop})`,
                }}
            >
                {icon}
            </div>

            {/* Stat number */}
            <div
                style={{
                    fontSize: 56,
                    fontFamily,
                    fontWeight: 800,
                    color: accentColor,
                    marginBottom: 10,
                }}
            >
                {stat}
            </div>

            {/* Label */}
            <div
                style={{
                    fontSize: 24,
                    fontFamily,
                    fontWeight: 500,
                    color: COLORS.mediumGray,
                    textAlign: 'center',
                }}
            >
                {label}
            </div>
        </div>
    );
};

export const BenefitsScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const benefits = [
        {
            icon: '📈',
            stat: '3x',
            label: 'More Visibility',
            accentColor: COLORS.vibrantPink,
            delay: 5,
        },
        {
            icon: '⏰',
            stat: '80%',
            label: 'Less No-shows',
            accentColor: COLORS.calmingTeal,
            delay: 20,
        },
        {
            icon: '💼',
            stat: '24/7',
            label: 'Booking Power',
            accentColor: '#9C27B0',
            delay: 35,
        },
    ];

    // Title entrance
    const titleProgress = spring({
        frame,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    // Background shine effect
    const shinePosition = interpolate(frame, [0, 90], [-100, 200], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.offWhite} 100%)`,
                overflow: 'hidden',
            }}
        >
            {/* Animated shine */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: `${shinePosition}%`,
                    width: 200,
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    transform: 'skewX(-20deg)',
                }}
            />

            {/* Teal accent bar */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 8,
                    background: `linear-gradient(90deg, ${COLORS.calmingTeal} 0%, ${COLORS.vibrantPink} 100%)`,
                }}
            />

            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 60,
                }}
            >
                {/* Title */}
                <div
                    style={{
                        fontSize: 64,
                        fontFamily,
                        fontWeight: 800,
                        color: COLORS.charcoal,
                        marginBottom: 20,
                        opacity: titleProgress,
                        transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0])}px)`,
                        textAlign: 'center',
                    }}
                >
                    Real Results
                </div>

                <div
                    style={{
                        fontSize: 32,
                        fontFamily,
                        fontWeight: 500,
                        color: COLORS.mediumGray,
                        marginBottom: 80,
                        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' }),
                    }}
                >
                    for Real Professionals
                </div>

                {/* Benefits grid */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 30,
                        alignItems: 'center',
                    }}
                >
                    {/* First row */}
                    <div style={{ display: 'flex', gap: 30 }}>
                        <BenefitStat
                            icon={benefits[0].icon}
                            stat={benefits[0].stat}
                            label={benefits[0].label}
                            accentColor={benefits[0].accentColor}
                            delay={benefits[0].delay}
                        />
                        <BenefitStat
                            icon={benefits[1].icon}
                            stat={benefits[1].stat}
                            label={benefits[1].label}
                            accentColor={benefits[1].accentColor}
                            delay={benefits[1].delay}
                        />
                    </div>
                    {/* Second row */}
                    <BenefitStat
                        icon={benefits[2].icon}
                        stat={benefits[2].stat}
                        label={benefits[2].label}
                        accentColor={benefits[2].accentColor}
                        delay={benefits[2].delay}
                    />
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
