import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Particles } from '../../components/Particles';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const AwesomeOutroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { damping: 12 },
    });

    // Shockwave effect
    const shockwave = spring({
        frame: frame - 10,
        fps,
        config: { damping: 100, mass: 3 },
    });

    const shockwaveScale = interpolate(shockwave, [0, 1], [0.8, 4]);
    const shockwaveOpacity = interpolate(shockwave, [0, 0.5, 1], [0.8, 0.5, 0]);

    const subtextOpacity = interpolate(frame, [30, 60], [0, 1]);

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            ...commonStyles.centered,
            ...commonStyles.flexColumn,
            overflow: 'hidden',
        }}>
            <Particles count={30} color={COLORS.calmingTeal} />

            {/* Shockwave Ring */}
            <div style={{
                position: 'absolute',
                width: 500,
                height: 500,
                borderRadius: '50%',
                border: `40px solid ${COLORS.vibrantPink}`,
                transform: `scale(${shockwaveScale})`,
                opacity: shockwaveOpacity,
            }} />

            <div style={{
                fontFamily,
                fontSize: 160,
                fontWeight: 900,
                color: COLORS.charcoal,
                transform: `scale(${scale})`,
                letterSpacing: -5,
                zIndex: 10,
            }}>
                LUSHY
            </div>

            <div style={{
                fontFamily,
                fontSize: 50,
                fontWeight: 600,
                color: COLORS.calmingTeal,
                marginTop: 40,
                opacity: subtextOpacity,
                letterSpacing: 20,
                zIndex: 10,
            }}>
                COMING SOON
            </div>
        </AbsoluteFill>
    );
};
