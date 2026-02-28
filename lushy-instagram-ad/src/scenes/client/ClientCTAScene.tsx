import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LushyLogo } from '../../components/LushyLogo';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

export const ClientCTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo animation
    const logoProgress = spring({
        frame: frame - 5,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    // Button pulse animation
    const pulsePhase = (frame % 25) / 25;
    const buttonScale = 1 + Math.sin(pulsePhase * Math.PI * 2) * 0.04;
    const buttonGlow = 0.3 + Math.sin(pulsePhase * Math.PI * 2) * 0.2;

    // Button entrance
    const buttonProgress = spring({
        frame: frame - fps * 0.4,
        fps,
        config: SPRING_CONFIG.bouncy,
    });
    const buttonTranslateY = interpolate(buttonProgress, [0, 1], [60, 0]);
    const buttonOpacity = interpolate(buttonProgress, [0, 1], [0, 1]);

    // App store badges
    const badgeProgress = spring({
        frame: frame - fps * 0.7,
        fps,
        config: SPRING_CONFIG.smooth,
    });
    const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);
    const badgeTranslateY = interpolate(badgeProgress, [0, 1], [40, 0]);

    // Tagline animation
    const taglineProgress = spring({
        frame: frame - fps * 1.0,
        fps,
        config: SPRING_CONFIG.smooth,
    });
    const taglineOpacity = interpolate(taglineProgress, [0, 1], [0, 1]);

    // Floating sparkles
    const sparkle1Y = Math.sin(frame * 0.1) * 15;
    const sparkle2Y = Math.cos(frame * 0.08) * 12;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(180deg, #FFF0F5 0%, #FFFFFF 40%, #FFF0F5 100%)`,
            }}
        >
            {/* Decorative sparkles */}
            <div
                style={{
                    position: 'absolute',
                    top: 180,
                    right: 100,
                    fontSize: 50,
                    opacity: logoProgress * 0.7,
                    transform: `translateY(${sparkle1Y}px)`,
                }}
            >
                ✨
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: 350,
                    left: 80,
                    fontSize: 40,
                    opacity: logoProgress * 0.6,
                    transform: `translateY(${sparkle2Y}px)`,
                }}
            >
                💖
            </div>

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
                    <LushyLogo size={240} delay={0} />
                </div>

                {/* CTA Button with glow */}
                <div
                    style={{
                        marginTop: 70,
                        opacity: buttonOpacity,
                        transform: `translateY(${buttonTranslateY}px) scale(${buttonScale})`,
                    }}
                >
                    <div
                        style={{
                            padding: '32px 90px',
                            borderRadius: 60,
                            background: COLORS.pinkGradient,
                            color: COLORS.white,
                            fontSize: 46,
                            fontFamily,
                            fontWeight: 700,
                            boxShadow: `0 20px 50px rgba(255, 64, 129, ${buttonGlow + 0.2})`,
                            cursor: 'pointer',
                        }}
                    >
                        Download Now
                    </div>
                </div>

                {/* App Store badges */}
                <div
                    style={{
                        marginTop: 50,
                        display: 'flex',
                        gap: 25,
                        opacity: badgeOpacity,
                        transform: `translateY(${badgeTranslateY}px)`,
                    }}
                >
                    {/* App Store badge */}
                    <div
                        style={{
                            padding: '18px 35px',
                            borderRadius: 14,
                            background: COLORS.charcoal,
                            color: COLORS.white,
                            fontSize: 20,
                            fontFamily,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <span style={{ fontSize: 32 }}>🍎</span>
                        <div>
                            <div style={{ fontSize: 13, opacity: 0.7 }}>Download on the</div>
                            <div style={{ fontWeight: 600, fontSize: 18 }}>App Store</div>
                        </div>
                    </div>

                    {/* Google Play badge */}
                    <div
                        style={{
                            padding: '18px 35px',
                            borderRadius: 14,
                            background: COLORS.charcoal,
                            color: COLORS.white,
                            fontSize: 20,
                            fontFamily,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <span style={{ fontSize: 32 }}>▶️</span>
                        <div>
                            <div style={{ fontSize: 13, opacity: 0.7 }}>GET IT ON</div>
                            <div style={{ fontWeight: 600, fontSize: 18 }}>Google Play</div>
                        </div>
                    </div>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 140,
                        fontSize: 34,
                        fontFamily,
                        fontWeight: 500,
                        color: COLORS.mediumGray,
                        opacity: taglineOpacity,
                        textAlign: 'center',
                    }}
                >
                    Your perfect look awaits ✨
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
