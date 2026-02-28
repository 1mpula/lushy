import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const DualCTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoScale = spring({
        frame,
        fps,
        config: { damping: 12 },
    });

    const logoY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' });
    const textOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

    // Pulse effect for button
    const pulse = Math.sin(frame / 10) * 0.05 + 1;

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            ...commonStyles.centered,
            flexDirection: 'column',
        }}>

            {/* Logo Placeholder - assuming we have an image or just text for now */}
            {/* Using text representation if image fails, but user mentioned logo asset exists */}
            {/* We will use the lushy_logo.png if available in public, otherwise text backup */}

            <div style={{
                transform: `scale(${logoScale}) translateY(${logoY}px)`,
                marginBottom: 40,
            }}>
                <Img
                    src={staticFile('lushy_logo.png')}
                    style={{ width: 300, height: 'auto' }}
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                />
            </div>

            <div style={{
                fontFamily,
                fontSize: 80,
                fontWeight: 900,
                color: COLORS.charcoal,
                opacity: textOpacity,
                marginBottom: 20,
                textAlign: 'center',
            }}>
                GET LUSHY
            </div>

            <div style={{
                fontFamily,
                fontSize: 32,
                color: COLORS.mediumGray,
                opacity: textOpacity,
                marginBottom: 60,
                textAlign: 'center',
            }}>
                Available on iOS
            </div>

            <div style={{
                padding: '24px 64px',
                background: COLORS.charcoal,
                borderRadius: 100,
                opacity: textOpacity,
                transform: `scale(${pulse})`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}>
                <div style={{
                    fontFamily,
                    fontSize: 36,
                    fontWeight: 700,
                    color: COLORS.white,
                }}>
                    DOWNLOAD NOW
                </div>
            </div>

        </AbsoluteFill>
    );
};
