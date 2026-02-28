import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const LaunchPulseScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity1 = interpolate(frame, [0, 20, 50], [0, 1, 0]);
    const opacity2 = interpolate(frame, [50, 70], [0, 1]);

    const scale = spring({
        frame: frame - 50,
        fps,
        config: { damping: 12 },
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.charcoal,
            ...commonStyles.centered,
        }}>
            {/* Phase 1: THE WAIT... */}
            <div style={{
                position: 'absolute',
                fontFamily,
                fontWeight: 300,
                fontSize: 80,
                color: COLORS.mediumGray,
                opacity: opacity1,
                letterSpacing: 10,
            }}>
                THE WAIT...
            </div>

            {/* Phase 2: IS OVER */}
            <div style={{
                position: 'absolute',
                fontFamily,
                fontWeight: 900,
                fontSize: 120,
                color: COLORS.white,
                opacity: opacity2,
                transform: `scale(${scale})`,
                textShadow: `0 0 20px ${COLORS.vibrantPink}`,
                letterSpacing: -2,
            }}>
                IS OVER.
            </div>
        </AbsoluteFill>
    );
};
