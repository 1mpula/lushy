import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const AwesomeHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 30], [0, 1]);
    const scale = spring({ frame, fps, config: { damping: 200 } });

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.charcoal,
            ...commonStyles.centered,
        }}>
            <AbsoluteFill style={{
                background: `radial-gradient(circle at center, ${COLORS.charcoal} 0%, #000000 100%)`,
            }} />

            <div style={{
                fontFamily,
                fontWeight: 300,
                fontSize: 60,
                color: COLORS.mediumGray,
                marginBottom: 40,
                opacity,
                letterSpacing: 4,
            }}>
                IMAGINE IF...
            </div>

            <div style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 100,
                color: COLORS.white,
                textAlign: 'center',
                lineHeight: 1.1,
                transform: `scale(${scale})`,
                opacity,
            }}>
                FINDING A<br />
                <span style={{ color: COLORS.vibrantPink }}>STYLIST</span><br />
                WAS EASY?
            </div>
        </AbsoluteFill>
    );
};
