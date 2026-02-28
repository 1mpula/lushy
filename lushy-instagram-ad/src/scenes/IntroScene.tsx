import { loadFont } from '@remotion/google-fonts/Outfit';
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { LushyLogo } from '../components/LushyLogo';
import { COLORS } from '../styles';

const { fontFamily } = loadFont();

export const IntroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Tagline typewriter effect
    const tagline = "Find it. Book it. Love it.";
    const charsToShow = Math.floor(interpolate(frame, [fps * 0.8, fps * 1.3], [0, tagline.length], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
    }));
    const displayedTagline = tagline.slice(0, charsToShow);

    // Background gradient animation
    const bgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: COLORS.subtleGradient,
                opacity: bgOpacity,
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
                <LushyLogo size={280} delay={5} />

                {/* Tagline */}
                <div
                    style={{
                        marginTop: 60,
                        fontSize: 48,
                        fontFamily,
                        fontWeight: 500,
                        color: COLORS.mediumGray,
                        textAlign: 'center',
                        letterSpacing: 1,
                        minHeight: 60,
                    }}
                >
                    {displayedTagline}
                    <span
                        style={{
                            opacity: frame % 30 < 15 ? 1 : 0,
                            color: COLORS.vibrantPink,
                        }}
                    >
                        |
                    </span>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
