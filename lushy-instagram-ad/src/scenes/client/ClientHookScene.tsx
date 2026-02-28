import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../../styles';

const { fontFamily } = loadFont();

export const ClientHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Background gradient fade in
    const bgOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // "Tired of" text animation
    const line1Progress = spring({
        frame: frame - fps * 0.2,
        fps,
        config: SPRING_CONFIG.snappy,
    });
    const line1TranslateY = interpolate(line1Progress, [0, 1], [80, 0]);
    const line1Opacity = interpolate(line1Progress, [0, 1], [0, 1]);

    // "Bad Hair Days?" text animation (bigger, bolder)
    const line2Progress = spring({
        frame: frame - fps * 0.5,
        fps,
        config: SPRING_CONFIG.bouncy,
    });
    const line2Scale = interpolate(line2Progress, [0, 1], [0.5, 1]);
    const line2Opacity = interpolate(line2Progress, [0, 1], [0, 1]);

    // Emoji animation with bounce
    const emojiProgress = spring({
        frame: frame - fps * 0.8,
        fps,
        config: SPRING_CONFIG.bouncy,
    });
    const emojiScale = interpolate(emojiProgress, [0, 1], [0, 1]);
    const emojiRotate = interpolate(emojiProgress, [0, 1], [-30, 0]);

    // Subtle shake for emoji
    const shakeOffset = Math.sin(frame * 0.5) * 3;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(180deg, #FFF0F5 0%, #FFFFFF 50%, #FFF0F5 100%)`,
                opacity: bgOpacity,
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
                {/* "Tired of" */}
                <div
                    style={{
                        fontSize: 56,
                        fontFamily,
                        fontWeight: 500,
                        color: COLORS.mediumGray,
                        opacity: line1Opacity,
                        transform: `translateY(${line1TranslateY}px)`,
                        marginBottom: 20,
                    }}
                >
                    Tired of
                </div>

                {/* "Bad Hair Days?" */}
                <div
                    style={{
                        fontSize: 88,
                        fontFamily,
                        fontWeight: 800,
                        background: COLORS.pinkGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        opacity: line2Opacity,
                        transform: `scale(${line2Scale})`,
                        textAlign: 'center',
                        lineHeight: 1.1,
                    }}
                >
                    Bad Hair Days?
                </div>

                {/* Hair emoji with animation */}
                <div
                    style={{
                        marginTop: 60,
                        fontSize: 140,
                        transform: `scale(${emojiScale}) rotate(${emojiRotate}deg) translateX(${shakeOffset}px)`,
                    }}
                >
                    💇‍♀️
                </div>

                {/* Decorative floating elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: 200,
                        right: 80,
                        fontSize: 60,
                        opacity: line1Opacity * 0.6,
                        transform: `translateY(${Math.sin(frame * 0.1) * 10}px)`,
                    }}
                >
                    ✂️
                </div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: 300,
                        left: 60,
                        fontSize: 50,
                        opacity: line2Opacity * 0.5,
                        transform: `translateY(${Math.cos(frame * 0.08) * 8}px)`,
                    }}
                >
                    💅
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
