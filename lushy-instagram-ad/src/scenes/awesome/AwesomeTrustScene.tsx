import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

const TrustBadge = ({ text, subtext, icon, x, y, delay }: any) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: frame - delay,
        fps,
        config: { stiffness: 200, damping: 12 },
    });

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            backgroundColor: COLORS.white,
            padding: 40,
            borderRadius: 30,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            transform: `scale(${scale})`,
            width: 600,
        }}>
            <div style={{ fontSize: 80 }}>{icon}</div>
            <div>
                <div style={{ fontFamily, fontWeight: 800, fontSize: 40, color: COLORS.charcoal }}>{text}</div>
                <div style={{ fontFamily, color: COLORS.mediumGray, fontSize: 28 }}>{subtext}</div>
            </div>
        </div>
    )
}

export const AwesomeTrustScene: React.FC = () => {
    return (
        <AbsoluteFill style={{
            backgroundColor: '#E0F2F1', // Light teal
            // ...commonStyles.centered,
        }}>
            <AbsoluteFill style={{ ...commonStyles.centered }}>
                <div style={{
                    fontFamily,
                    fontWeight: 900,
                    fontSize: 100,
                    color: COLORS.calmingTeal,
                    marginBottom: 800, // Push top
                }}>
                    THE NEW STANDARD
                </div>
            </AbsoluteFill>

            <TrustBadge
                icon="✅"
                text="VERIFIED PROS"
                subtext="Vetted for quality"
                x={100}
                y={400}
                delay={0}
            />

            <TrustBadge
                icon="⭐️"
                text="REAL REVIEWS"
                subtext="From verified clients"
                x={300}
                y={700}
                delay={15}
            />

            <TrustBadge
                icon="🔒"
                text="SECURE PAYMENTS"
                subtext="No sketchy transfers"
                x={150}
                y={1000}
                delay={30}
            />
        </AbsoluteFill>
    );
};
