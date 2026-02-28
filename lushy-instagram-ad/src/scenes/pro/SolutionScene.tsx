import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LushyLogo } from '../../components/LushyLogo';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

type FeatureCardProps = {
    icon: string;
    title: string;
    description: string;
    delay: number;
    color: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay, color }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entryProgress = spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIG.snappy,
    });

    const iconBounce = spring({
        frame: frame - delay - 10,
        fps,
        config: { damping: 6, stiffness: 150 },
    });

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                padding: '30px 40px',
                background: COLORS.white,
                borderRadius: 24,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                marginBottom: 30,
                opacity: entryProgress,
                transform: `translateX(${interpolate(entryProgress, [0, 1], [150, 0])}px)`,
                border: `2px solid ${color}20`,
            }}
        >
            {/* Icon container */}
            <div
                style={{
                    width: 90,
                    height: 90,
                    borderRadius: 22,
                    background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 44,
                    transform: `scale(${iconBounce})`,
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>

            {/* Text content */}
            <div style={{ flex: 1 }}>
                <div
                    style={{
                        fontSize: 36,
                        fontFamily,
                        fontWeight: 700,
                        color: COLORS.charcoal,
                        marginBottom: 8,
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: 24,
                        fontFamily,
                        fontWeight: 400,
                        color: COLORS.mediumGray,
                    }}
                >
                    {description}
                </div>
            </div>
        </div>
    );
};

export const SolutionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const features = [
        {
            icon: '📅',
            title: 'Smart Booking',
            description: 'Clients book 24/7',
            color: COLORS.vibrantPink,
            delay: 15,
        },
        {
            icon: '👥',
            title: 'Client Management',
            description: 'All in one place',
            color: COLORS.calmingTeal,
            delay: 30,
        },
        {
            icon: '📸',
            title: 'Portfolio Showcase',
            description: 'Get discovered',
            color: '#9C27B0',
            delay: 45,
        },
    ];

    // Header entrance
    const headerProgress = spring({
        frame,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    const logoScale = spring({
        frame: frame - 5,
        fps,
        config: SPRING_CONFIG.bouncy,
    });

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(180deg, ${COLORS.lightPink} 0%, ${COLORS.white} 50%, ${COLORS.white} 100%)`,
            }}
        >
            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 60,
                }}
            >
                {/* Header with Logo */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 25,
                        marginBottom: 50,
                        opacity: headerProgress,
                        transform: `translateY(${interpolate(headerProgress, [0, 1], [-30, 0])}px)`,
                    }}
                >
                    <div style={{ transform: `scale(${logoScale * 0.35})` }}>
                        <LushyLogo size={200} delay={0} />
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: 36,
                                fontFamily,
                                fontWeight: 500,
                                color: COLORS.mediumGray,
                            }}
                        >
                            Introducing
                        </div>
                        <div
                            style={{
                                fontSize: 64,
                                fontFamily,
                                fontWeight: 800,
                                color: COLORS.charcoal,
                                marginTop: -5,
                            }}
                        >
                            Lushy
                        </div>
                    </div>
                </div>

                {/* Tag line */}
                <div
                    style={{
                        fontSize: 40,
                        fontFamily,
                        fontWeight: 600,
                        color: COLORS.vibrantPink,
                        marginBottom: 50,
                        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
                    }}
                >
                    The Pro's Secret Weapon 🚀
                </div>

                {/* Feature cards */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            color={feature.color}
                            delay={feature.delay}
                        />
                    ))}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
