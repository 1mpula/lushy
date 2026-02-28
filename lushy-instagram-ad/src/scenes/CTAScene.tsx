import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LushyLogo } from '../components/LushyLogo';
import { COLORS, SPRING_CONFIG } from '../styles';

const { fontFamily } = loadFont();

export const CTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo animation
    const logoProgress = spring({
        frame: frame - 5,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    // Button pulse animation
    const pulsePhase = (frame % 30) / 30;
    const buttonScale = 1 + Math.sin(pulsePhase * Math.PI * 2) * 0.03;

    // Button entrance
    const buttonProgress = spring({
        frame: frame - fps * 0.5,
        fps,
        config: SPRING_CONFIG.snappy,
    });

    const buttonTranslateY = interpolate(buttonProgress, [0, 1], [50, 0]);
    const buttonOpacity = interpolate(buttonProgress, [0, 1], [0, 1]);

    // App store badges
    const badgeProgress = spring({
        frame: frame - fps * 0.8,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);
    const badgeTranslateY = interpolate(badgeProgress, [0, 1], [30, 0]);

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
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Logo */}
                <div style={{ transform: `scale(${logoProgress})` }}>
                    <LushyLogo size={220} delay={0} />
                </div>

                {/* CTA Button */}
                <div
                    style={{
                        marginTop: 80,
                        opacity: buttonOpacity,
                        transform: `translateY(${buttonTranslateY}px) scale(${buttonScale})`,
                    }}
                >
                    <div
                        style={{
                            padding: '28px 80px',
                            borderRadius: 60,
                            background: COLORS.vibrantPink,
                            color: COLORS.white,
                            fontSize: 40,
                            fontFamily,
                            fontWeight: 700,
                            boxShadow: '0 15px 40px rgba(255, 64, 129, 0.4)',
                            cursor: 'pointer',
                        }}
                    >
                        Download Now
                    </div>
                </div>

                {/* App Store badges placeholder */}
                <div
                    style={{
                        marginTop: 50,
                        display: 'flex',
                        gap: 20,
                        opacity: badgeOpacity,
                        transform: `translateY(${badgeTranslateY}px)`,
                    }}
                >
                    {/* App Store badge */}
                    <div
                        style={{
                            padding: '16px 30px',
                            borderRadius: 12,
                            background: COLORS.charcoal,
                            color: COLORS.white,
                            fontSize: 18,
                            fontFamily,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <span style={{ fontSize: 28 }}>🍎</span>
                        <div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>Download on the</div>
                            <div style={{ fontWeight: 600 }}>App Store</div>
                        </div>
                    </div>

                    {/* Google Play badge */}
                    <div
                        style={{
                            padding: '16px 30px',
                            borderRadius: 12,
                            background: COLORS.charcoal,
                            color: COLORS.white,
                            fontSize: 18,
                            fontFamily,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <span style={{ fontSize: 28 }}>▶️</span>
                        <div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>GET IT ON</div>
                            <div style={{ fontWeight: 600 }}>Google Play</div>
                        </div>
                    </div>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 120,
                        fontSize: 28,
                        fontFamily,
                        color: COLORS.mediumGray,
                        opacity: badgeOpacity,
                    }}
                >
                    Your perfect hairstyle awaits
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
