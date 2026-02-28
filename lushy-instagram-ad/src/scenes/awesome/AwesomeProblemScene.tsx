import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../../styles';

const { fontFamily } = loadFont();

const StatBar = ({ label, width, color, delay }: { label: string, width: string, color: string, delay: number }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [delay, delay + 20], [0, 100], { extrapolateRight: 'clamp' });

    return (
        <div style={{ marginBottom: 40, width: '100%' }}>
            <div style={{ fontFamily, color: COLORS.charcoal, fontSize: 30, marginBottom: 10, fontWeight: 600 }}>
                {label}
            </div>
            <div style={{ width: '100%', height: 40, backgroundColor: '#eee', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{
                    width: `${width}`,
                    height: '100%',
                    backgroundColor: color,
                    transform: `translateX(${progress - 100}%)`,
                    borderRadius: 20
                }} />
            </div>
        </div>
    );
};

export const AwesomeProblemScene: React.FC = () => {
    return (
        <AbsoluteFill style={{
            backgroundColor: COLORS.white,
            padding: 80,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                fontFamily,
                fontSize: 80,
                fontWeight: 800,
                color: COLORS.charcoal,
                marginBottom: 80
            }}>
                THE REALITY
            </div>

            <StatBar label="Time Wasted Scrolling" width="90%" color={COLORS.charcoal} delay={0} />
            <StatBar label="Unanswered DMs" width="75%" color={COLORS.mediumGray} delay={15} />
            <StatBar label="Booking Stress" width="85%" color={COLORS.vibrantPink} delay={30} />

        </AbsoluteFill>
    );
};
