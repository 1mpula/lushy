import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const ViralHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { stiffness: 200, damping: 10 },
    });

    // Flashing background effect
    const isPink = Math.floor(frame / 5) % 2 === 0;
    const bg = isPink ? COLORS.vibrantPink : COLORS.charcoal;
    const textColor = isPink ? COLORS.white : COLORS.vibrantPink;

    return (
        <AbsoluteFill style={{
            backgroundColor: bg,
            ...commonStyles.centered,
        }}>
            <div style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 120,
                color: textColor,
                textAlign: 'center',
                lineHeight: 1,
                transform: `scale(${scale})`,
            }}>
                BAD<br />HAIR<br />DAY?
            </div>
        </AbsoluteFill>
    );
};
