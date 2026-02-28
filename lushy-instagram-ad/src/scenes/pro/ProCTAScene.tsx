import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LushyLogo } from '../../components/LushyLogo';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

export const ProCTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Background gradient animation
    const bgHue = interpolate(frame, [0, 90], [0, 10], {
        extrapolateRight: 'clamp',
    });

    // Logo animation
    const logoProgress = spring({
        frame: frame - 5,
        fps,
        config: SPRING_CONFIG.bouncy,
    });

    // Tagline entrance
    const taglineProgress = spring({
        frame: frame - 15,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    // Button animations
    const buttonProgress = spring({
        frame: frame - 30,
        fps,
        config: SPRING_CONFIG.snappy,
    });

    const buttonScale = 1 + Math.sin(frame * 0.15) * 0.03;

    // Secondary text
    const secondaryProgress = spring({
        frame: frame - 45,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    // App badges
    const badgeProgress = spring({
        frame: frame - 55,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    // Sparkle animations
    const sparkle1 = Math.sin(frame * 0.2) * 10;
    const sparkle2 = Math.cos(frame * 0.15) * 15;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${COLORS.lightPink} 0%, ${COLORS.white} 50%, ${COLORS.offWhite} 100%)`,
            }}
        >
            {/* Decorative elements */}
            <div
                style={{
                    position: 'absolute',
                    top: 150 + sparkle1,
                    left: 80,
                    fontSize: 48,
                    opacity: 0.6,
                    transform: `rotate(${frame * 2}deg)`,
                }}
            >
                ✨
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: 300 + sparkle2,
                    right: 100,
                    fontSize: 40,
                    opacity: 0.5,
                    transform: `rotate(${-frame * 1.5}deg)`,
                }}
            >
                💇
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: 400 - sparkle1,
                    left: 120,
                    fontSize: 36,
                    opacity: 0.5,
                    transform: `rotate(${frame}deg)`,
                }}
            >
                💅
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: 500 + sparkle2,
                    right: 80,
                    fontSize: 44,
                    opacity: 0.6,
                    transform: `rotate(${-frame * 2}deg)`,
                }}
            >
                ⭐
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
                    <LushyLogo size={200} delay={0} />
                </div>

                {/* Main CTA text */}
                <div
                    style={{
                        marginTop: 60,
                        fontSize: 56,
                        fontFamily,
                        fontWeight: 800,
                        color: COLORS.charcoal,
                        textAlign: 'center',
                        opacity: taglineProgress,
                        transform: `translateY(${interpolate(taglineProgress, [0, 1], [30, 0])}px)`,
                    }}
                >
                    Join Lushy Today
                </div>

                {/* Sub tagline */}
                <div
                    style={{
                        marginTop: 15,
                        fontSize: 36,
                        fontFamily,
                        fontWeight: 500,
                        color: COLORS.vibrantPink,
                        opacity: taglineProgress,
                        transform: `translateY(${interpolate(taglineProgress, [0, 1], [20, 0])}px)`,
                    }}
                >
                    Grow Your Business 🚀
                </div>

                {/* CTA Button */}
                <div
                    style={{
                        marginTop: 60,
                        opacity: buttonProgress,
                        transform: `translateY(${interpolate(buttonProgress, [0, 1], [40, 0])}px) scale(${buttonScale})`,
                    }}
                >
                    <div
                        style={{
                            padding: '28px 70px',
                            borderRadius: 60,
                            background: COLORS.vibrantPink,
                            color: COLORS.white,
                            fontSize: 38,
                            fontFamily,
                            fontWeight: 700,
                            boxShadow: '0 15px 50px rgba(255, 64, 129, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 15,
                        }}
                    >
                        <span>Get Started Free</span>
                        <span style={{ fontSize: 32 }}>→</span>
                    </div>
                </div>

                {/* Secondary text */}
                <div
                    style={{
                        marginTop: 40,
                        fontSize: 26,
                        fontFamily,
                        fontWeight: 500,
                        color: COLORS.mediumGray,
                        opacity: secondaryProgress,
                    }}
                >
                    No credit card required
                </div>

                {/* App Store badges */}
                <div
                    style={{
                        marginTop: 50,
                        display: 'flex',
                        gap: 20,
                        opacity: badgeProgress,
                        transform: `translateY(${interpolate(badgeProgress, [0, 1], [30, 0])}px)`,
                    }}
                >
                    {/* App Store badge */}
                    <div
                        style={{
                            padding: '14px 28px',
                            borderRadius: 12,
                            background: COLORS.charcoal,
                            color: COLORS.white,
                            fontSize: 16,
                            fontFamily,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <span style={{ fontSize: 26 }}>🍎</span>
                        <div>
                            <div style={{ fontSize: 11, opacity: 0.7 }}>Download on the</div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>App Store</div>
                        </div>
                    </div>

                    {/* Google Play badge */}
                    <div
                        style={{
                            padding: '14px 28px',
                            borderRadius: 12,
                            background: COLORS.charcoal,
                            color: COLORS.white,
                            fontSize: 16,
                            fontFamily,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <span style={{ fontSize: 26 }}>▶️</span>
                        <div>
                            <div style={{ fontSize: 11, opacity: 0.7 }}>GET IT ON</div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>Google Play</div>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
