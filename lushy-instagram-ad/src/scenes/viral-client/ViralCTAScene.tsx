import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const ViralCTAScene: React.FC = () => {
    const frame = useCurrentFrame();

    // Zoom in effect
    const scale = interpolate(frame, [0, 60], [1, 1.5]);

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.vibrantPink,
            ...commonStyles.centered,
            overflow: 'hidden',
        }}>
            <AbsoluteFill style={{
                backgroundImage: `linear-gradient(45deg, ${COLORS.vibrantPink} 25%, #ff5c93 25%, #ff5c93 50%, ${COLORS.vibrantPink} 50%, ${COLORS.vibrantPink} 75%, #ff5c93 75%, #ff5c93 100%)`,
                backgroundSize: '100px 100px',
                opacity: 0.2,
            }} />

            <div style={{
                textAlign: 'center',
                transform: `scale(${scale})`,
            }}>
                <div style={{
                    fontFamily,
                    fontSize: 80,
                    fontWeight: 900,
                    color: COLORS.white,
                    marginBottom: 20,
                    textShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                }}>
                    DON'T WAIT.
                </div>

                <div style={{
                    backgroundColor: COLORS.white,
                    color: COLORS.vibrantPink,
                    padding: '20px 60px',
                    borderRadius: 100,
                    fontSize: 50,
                    fontWeight: 800,
                    fontFamily,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                }}>
                    GET LUSHY
                </div>
            </div>
        </AbsoluteFill>
    );
};
