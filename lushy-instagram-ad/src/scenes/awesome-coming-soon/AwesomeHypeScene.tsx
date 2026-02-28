import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Particles } from '../../components/Particles';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const AwesomeHypeScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideUp = spring({
        frame,
        fps,
        config: { damping: 100, mass: 2 },
    });

    const slideDown = spring({
        frame: frame - 20,
        fps,
        config: { damping: 100, mass: 2 },
    });

    const yUp = interpolate(slideUp, [0, 1], [100, 0]);
    const yDown = interpolate(slideDown, [0, 1], [-100, 0]);

    // Background animated gradient
    const gradientPos = interpolate(frame, [0, 180], [0, 100]);

    return (
        <AbsoluteFill style={{
            background: `linear-gradient(135deg, ${COLORS.charcoal} 0%, #1a1a1a 100%)`,
            ...commonStyles.centered,
            ...commonStyles.flexColumn,
        }}>
            <Particles count={40} color={COLORS.lightPink} />
            <div style={{
                marginBottom: 20,
                overflow: 'hidden',
                padding: 20,
            }}>
                <div style={{
                    fontFamily,
                    fontSize: 100,
                    fontWeight: 300,
                    color: COLORS.white,
                    transform: `translateY(${yUp}%)`,
                }}>
                    CHANGE
                </div>
            </div>

            <div style={{
                overflow: 'hidden',
                padding: 20,
            }}>
                <div style={{
                    fontFamily,
                    fontSize: 120,
                    fontWeight: 900,
                    background: COLORS.pinkGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transform: `translateY(${yDown}%)`,
                    textTransform: 'uppercase',
                }}>
                    YOUR GAME
                </div>
            </div>
        </AbsoluteFill>
    );
};
