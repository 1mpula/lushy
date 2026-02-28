import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPRING_CONFIG } from '../styles';

type LushyLogoProps = {
    delay?: number;
    size?: number;
};

export const LushyLogo: React.FC<LushyLogoProps> = ({ delay = 0, size = 200 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const adjustedFrame = frame - delay;

    // Scale animation with bounce
    const scale = spring({
        frame: adjustedFrame,
        fps,
        config: SPRING_CONFIG.bouncy,
    });

    // Opacity fade in
    const opacity = interpolate(adjustedFrame, [0, fps * 0.3], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity,
                transform: `scale(${scale})`,
            }}
        >
            {/* Logo Circle */}
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    background: COLORS.pinkGradient,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 20px 60px rgba(255, 64, 129, 0.4)',
                }}
            >
                {/* Inner Icon - Stylized "L" */}
                <svg
                    width={size * 0.5}
                    height={size * 0.5}
                    viewBox="0 0 100 100"
                    fill="none"
                >
                    <path
                        d="M25 20 L25 80 L75 80"
                        stroke="white"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="70" cy="35" r="12" fill="white" opacity="0.8" />
                </svg>
            </div>

            {/* Logo Text */}
            <div
                style={{
                    marginTop: 30,
                    fontSize: size * 0.4,
                    fontWeight: 800,
                    color: COLORS.charcoal,
                    letterSpacing: -2,
                    fontFamily: 'Outfit, system-ui, sans-serif',
                }}
            >
                Lushy
            </div>
        </div>
    );
};
