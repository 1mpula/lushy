import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

export const LaunchIconRevealScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Shockwave effect
    const waveScale = interpolate(frame, [0, 20], [0, 3], { extrapolateRight: 'clamp' });
    const waveOpacity = interpolate(frame, [0, 20], [0.8, 0], { extrapolateRight: 'clamp' });

    // Icon Pop
    const scale = spring({
        frame,
        fps,
        config: { stiffness: 200, damping: 10 },
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            ...commonStyles.centered,
            overflow: 'hidden',
        }}>
            {/* Shockwave Ring */}
            <div style={{
                position: 'absolute',
                width: 500,
                height: 500,
                borderRadius: '50%',
                border: `50px solid ${COLORS.vibrantPink}`,
                transform: `scale(${waveScale})`,
                opacity: waveOpacity,
            }} />

            {/* The Icon */}
            <div style={{
                transform: `scale(${scale})`,
                boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                borderRadius: 90,
            }}>
                <Img
                    src={staticFile('icon.png')}
                    style={{
                        width: 450,
                        height: 450,
                        borderRadius: 90
                    }}
                    onError={(e: any) => {
                        // Fallback purely for dev/safety
                        e.target.style.display = 'none';
                    }}
                />
            </div>
        </AbsoluteFill>
    );
};
