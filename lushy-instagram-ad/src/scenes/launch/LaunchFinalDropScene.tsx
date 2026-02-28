import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const LaunchFinalDropScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { damping: 15 },
    });

    const opacity = interpolate(frame, [15, 30], [0, 1]);

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            ...commonStyles.centered,
            flexDirection: 'column',
        }}>
            <div style={{
                transform: `scale(${scale})`,
                marginBottom: 40,
            }}>
                <Img
                    src={staticFile('icon.png')}
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: 40,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }}
                />
            </div>

            <div style={{
                fontFamily,
                fontSize: 100,
                fontWeight: 900,
                color: COLORS.charcoal,
                lineHeight: 1,
                textAlign: 'center',
                marginBottom: 20,
            }}>
                LUSHY
            </div>

            <div style={{
                fontFamily,
                fontSize: 40,
                fontWeight: 600,
                color: COLORS.vibrantPink,
                opacity: opacity,
                letterSpacing: 2,
            }}>
                FINALLY HERE
            </div>
        </AbsoluteFill>
    );
};
