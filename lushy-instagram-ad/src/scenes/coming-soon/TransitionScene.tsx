import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const TransitionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { stiffness: 300, damping: 10 },
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.charcoal,
            ...commonStyles.centered,
        }}>
            <div style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 150,
                color: COLORS.white,
                transform: `scale(${scale})`,
                letterSpacing: 20,
            }}>
                STOP.
            </div>
        </AbsoluteFill>
    );
};
