import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const DualSolutionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { damping: 12 },
    });

    const opacity = interpolate(frame, [0, 20], [0, 1]);

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            ...commonStyles.centered,
            flexDirection: 'column',
        }}>
            <div style={{
                fontFamily,
                color: COLORS.charcoal,
                fontSize: 60,
                fontWeight: 600,
                opacity,
                marginBottom: 40,
            }}>
                THE PERFECT
            </div>

            <div style={{
                fontFamily,
                fontSize: 140,
                fontWeight: 900,
                background: `linear-gradient(45deg, ${COLORS.vibrantPink}, ${COLORS.calmingTeal})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transform: `scale(${scale})`,
            }}>
                MATCH
            </div>

            <div style={{
                marginTop: 60,
                display: 'flex',
                gap: 40,
                opacity: interpolate(frame, [40, 60], [0, 1]),
                transform: `translateY(${interpolate(frame, [40, 60], [20, 0])}px)`,
            }}>
                <div style={{
                    padding: '20px 40px',
                    borderRadius: 50,
                    backgroundColor: COLORS.offWhite,
                    color: COLORS.vibrantPink,
                    fontFamily,
                    fontWeight: 'bold',
                    fontSize: 32,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}>
                    FOR CLIENTS
                </div>
                <div style={{
                    padding: '20px 40px',
                    borderRadius: 50,
                    backgroundColor: COLORS.offWhite,
                    color: COLORS.calmingTeal,
                    fontFamily,
                    fontWeight: 'bold',
                    fontSize: 32,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}>
                    FOR PROS
                </div>
            </div>
        </AbsoluteFill>
    );
};
