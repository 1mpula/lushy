import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const DualHookScene: React.FC = () => {
    const frame = useCurrentFrame();

    // Split screen animation
    const splitProgress = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Text reveal animation
    const textOpacity = interpolate(frame, [20, 40], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const textY = interpolate(frame, [20, 40], [20, 0], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
            {/* Left Side: Client (Pink) */}
            <AbsoluteFill
                style={{
                    backgroundColor: COLORS.vibrantPink,
                    clipPath: `polygon(0 0, ${50 * splitProgress}% 0, ${50 * splitProgress}% 100%, 0 100%)`,
                    ...commonStyles.centered,
                    alignItems: 'flex-end', // Align text to the right of this container
                    paddingRight: '20px',
                    width: '100%',
                }}
            >
                <div style={{
                    fontFamily,
                    color: COLORS.white,
                    fontSize: 70,
                    fontWeight: 800,
                    textAlign: 'right',
                    width: '45%', // Take up left side
                    opacity: textOpacity,
                    transform: `translateY(${textY}px)`,
                    paddingRight: 60,
                }}>
                    NEED A<br />FRESH<br />LOOK?
                </div>
            </AbsoluteFill>

            {/* Right Side: Pro (Teal) */}
            <AbsoluteFill
                style={{
                    backgroundColor: COLORS.calmingTeal,
                    clipPath: `polygon(${100 - (50 * splitProgress)}% 0, 100% 0, 100% 100%, ${100 - (50 * splitProgress)}% 100%)`,
                    ...commonStyles.centered,
                    alignItems: 'flex-start', // Align text to the left of this container
                    width: '100%',
                }}
            >
                <div style={{
                    fontFamily,
                    color: COLORS.white,
                    fontSize: 70,
                    fontWeight: 800,
                    textAlign: 'left',
                    width: '45%', // Offset to right side
                    marginLeft: '55%',
                    opacity: textOpacity,
                    transform: `translateY(${textY}px)`,
                    paddingLeft: 60,
                }}>
                    NEED<br />NEW<br />CLIENTS?
                </div>
            </AbsoluteFill>

            {/* Center Line visual */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: COLORS.white,
                opacity: splitProgress,
                transform: 'translateX(-50%)',
            }} />

        </AbsoluteFill>
    );
};
