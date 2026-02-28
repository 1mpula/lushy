import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const ViralSolutionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { damping: 15 },
    });

    const rotate = interpolate(frame, [0, 60], [0, 360]);

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            ...commonStyles.centered,
            overflow: 'hidden',
        }}>
            {/* Background Circle */}
            <div style={{
                position: 'absolute',
                width: 1200,
                height: 1200,
                borderRadius: '50%',
                border: `4px dashed ${COLORS.vibrantPink}`,
                transform: `rotate(${rotate}deg)`,
                opacity: 0.2,
            }} />

            <div style={{
                textAlign: 'center',
                transform: `scale(${scale})`,
            }}>
                <Img
                    src={staticFile('lushy_logo.png')}
                    style={{
                        width: 400,
                        height: 'auto',
                        marginBottom: 40,
                    }}
                />
                <div style={{
                    fontFamily,
                    fontWeight: 900,
                    fontSize: 100,
                    color: COLORS.calmingTeal,
                    letterSpacing: -2,
                }}>
                    THE FIX.
                </div>
            </div>
        </AbsoluteFill>
    );
};
