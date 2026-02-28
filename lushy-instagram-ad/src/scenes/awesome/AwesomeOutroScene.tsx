import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const AwesomeOutroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({ frame, fps, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            ...commonStyles.centered,
            flexDirection: 'column',
        }}>
            <Img
                src={staticFile('icon.png')}
                style={{
                    width: 300,
                    height: 300,
                    borderRadius: 60,
                    marginBottom: 60,
                    transform: `scale(${scale})`,
                    boxShadow: '0 30px 60px rgba(255, 64, 129, 0.3)',
                }}
            />

            <div style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 120,
                color: COLORS.charcoal,
                lineHeight: 1,
                textAlign: 'center',
                marginBottom: 30,
            }}>
                LUSHY
            </div>

            <div style={{
                fontFamily,
                fontWeight: 600,
                fontSize: 50,
                letterSpacing: 2,
                color: COLORS.vibrantPink,
                marginBottom: 80,
            }}>
                COMING SOON
            </div>

            <div style={{
                background: COLORS.charcoal,
                padding: '30px 80px',
                borderRadius: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
            }}>
                <div style={{
                    fontFamily,
                    fontWeight: 'bold',
                    fontSize: 40,
                    color: COLORS.white,
                }}>
                    JOIN THE WAITLIST
                </div>
            </div>
        </AbsoluteFill>
    );
};
