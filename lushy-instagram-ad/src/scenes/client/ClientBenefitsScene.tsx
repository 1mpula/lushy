import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

const benefits = [
    { icon: "✨", title: "Browse 1000+", subtitle: "Amazing Styles", delay: 0.2 },
    { icon: "📅", title: "Book Instantly", subtitle: "No Waiting", delay: 0.6 },
    { icon: "💯", title: "Verified Stylists", subtitle: "Trusted Pros", delay: 1.0 },
];

export const ClientBenefitsScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Header animation
    const headerProgress = spring({
        frame: frame - fps * 0.1,
        fps,
        config: SPRING_CONFIG.smooth,
    });
    const headerOpacity = interpolate(headerProgress, [0, 1], [0, 1]);
    const headerScale = interpolate(headerProgress, [0, 1], [0.9, 1]);

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(180deg, #FFFFFF 0%, #FFF5F8 50%, #FFFFFF 100%)`,
            }}
        >
            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 60,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        fontSize: 56,
                        fontFamily,
                        fontWeight: 700,
                        color: COLORS.charcoal,
                        marginBottom: 60,
                        opacity: headerOpacity,
                        transform: `scale(${headerScale})`,
                        textAlign: 'center',
                    }}
                >
                    Why <span style={{ color: COLORS.vibrantPink }}>Lushy</span>?
                </div>

                {/* Benefits cards */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 35,
                        width: '100%',
                        maxWidth: 900,
                    }}
                >
                    {benefits.map((benefit, index) => {
                        const cardProgress = spring({
                            frame: frame - fps * benefit.delay,
                            fps,
                            config: SPRING_CONFIG.snappy,
                        });

                        const translateX = interpolate(
                            cardProgress,
                            [0, 1],
                            [index % 2 === 0 ? -400 : 400, 0]
                        );
                        const opacity = interpolate(cardProgress, [0, 1], [0, 1]);
                        const scale = interpolate(cardProgress, [0, 1], [0.9, 1]);

                        // Subtle float animation
                        const floatOffset = Math.sin((frame + index * 30) * 0.08) * 3;

                        return (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 30,
                                    padding: '35px 50px',
                                    borderRadius: 30,
                                    background: COLORS.white,
                                    boxShadow: '0 15px 50px rgba(255, 64, 129, 0.15)',
                                    border: '2px solid rgba(255, 64, 129, 0.1)',
                                    opacity,
                                    transform: `translateX(${translateX}px) translateY(${floatOffset}px) scale(${scale})`,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 70,
                                        width: 100,
                                        height: 100,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: 'rgba(255, 64, 129, 0.1)',
                                        borderRadius: 25,
                                    }}
                                >
                                    {benefit.icon}
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: 42,
                                            fontFamily,
                                            fontWeight: 700,
                                            color: COLORS.charcoal,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {benefit.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 32,
                                            fontFamily,
                                            fontWeight: 500,
                                            color: COLORS.vibrantPink,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {benefit.subtitle}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
