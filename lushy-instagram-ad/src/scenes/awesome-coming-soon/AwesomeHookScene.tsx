import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Particles } from '../../components/Particles';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

const Word: React.FC<{ text: string; delay: number; color: string }> = ({ text, delay, color }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 10, stiffness: 200 },
    });

    const opacity = interpolate(frame - delay, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
    const blur = interpolate(frame - delay, [0, 10], [20, 0], { extrapolateRight: 'clamp' });

    return (
        <div style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: color,
            transform: `scale(${scale})`,
            opacity,
            filter: `blur(${blur}px)`,
            margin: '20px 0',
            textShadow: '0 0 30px rgba(0,0,0,0.5)',
        }}>
            {text}
        </div>
    );
};

export const AwesomeHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Pulsing background
    const bgScale = interpolate(frame, [0, 180], [1, 1.2]);
    const bgRotate = interpolate(frame, [0, 180], [0, 5]);

    return (
        <AbsoluteFill style={{
            ...commonStyles.centered,
            ...commonStyles.flexColumn,
            backgroundColor: COLORS.charcoal,
            overflow: 'hidden',
        }}>
            {/* Background Texture */}
            <AbsoluteFill style={{
                background: `radial-gradient(circle at center, ${COLORS.vibrantPink}22 0%, transparent 70%)`,
                transform: `scale(${bgScale}) rotate(${bgRotate}deg)`,
            }} />

            <Particles count={30} color={COLORS.mediumGray} />

            <div style={{ zIndex: 1, ...commonStyles.flexColumn }}>
                <Word text="SOMETHING" delay={10} color={COLORS.white} />
                <Word text="NEW" delay={40} color={COLORS.vibrantPink} />
                <Word text="IS" delay={70} color={COLORS.white} />
                <Word text="COMING" delay={90} color={COLORS.calmingTeal} />
            </div>
        </AbsoluteFill>
    );
};
