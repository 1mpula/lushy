import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../styles';

type PhoneMockupProps = {
    children: React.ReactNode;
    delay?: number;
    direction?: 'left' | 'right';
};

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
    children,
    delay = 0,
    direction = 'right'
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const adjustedFrame = frame - delay;

    // Slide in animation
    const slideProgress = spring({
        frame: adjustedFrame,
        fps,
        config: SPRING_CONFIG.smooth,
    });

    const translateX = interpolate(
        slideProgress,
        [0, 1],
        [direction === 'right' ? 400 : -400, 0]
    );

    const opacity = interpolate(adjustedFrame, [0, fps * 0.3], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
    });

    return (
        <div
            style={{
                opacity,
                transform: `translateX(${translateX}px)`,
            }}
        >
            {/* Phone Frame */}
            <div
                style={{
                    width: 340,
                    height: 700,
                    borderRadius: 50,
                    background: COLORS.charcoal,
                    padding: 12,
                    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                }}
            >
                {/* Notch */}
                <div
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 120,
                        height: 30,
                        borderRadius: 20,
                        background: COLORS.charcoal,
                        zIndex: 10,
                    }}
                />

                {/* Screen */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 40,
                        background: COLORS.white,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};
