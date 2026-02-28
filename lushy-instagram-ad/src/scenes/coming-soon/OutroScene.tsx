import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const OutroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1]);

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            ...commonStyles.centered,
            flexDirection: 'column',
        }}>
            <Img
                src={staticFile('icon.png')}
                style={{
                    width: 250,
                    height: 250,
                    borderRadius: 50,
                    marginBottom: 50,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
            />

            <div style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 80,
                color: COLORS.charcoal,
                letterSpacing: -2,
                opacity,
            }}>
                COMING SOON
            </div>

            <div style={{
                marginTop: 30,
                padding: '15px 40px',
                borderRadius: 50,
                border: `3px solid ${COLORS.vibrantPink}`,
                color: COLORS.vibrantPink,
                fontFamily,
                fontWeight: 700,
                fontSize: 40,
                opacity,
            }}>
                Follow for updates
            </div>
        </AbsoluteFill>
    );
};
