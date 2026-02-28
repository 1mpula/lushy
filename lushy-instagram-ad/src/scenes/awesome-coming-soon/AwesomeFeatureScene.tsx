import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Series, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

const ImpactWord: React.FC<{ text: string; bg: string; color: string }> = ({ text, bg, color }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 200, mass: 0.5 },
    });

    // Slight shake effect
    const shake = Math.sin(frame * 0.5) * 10 * Math.exp(-frame / 10);

    return (
        <AbsoluteFill style={{
            backgroundColor: bg,
            ...commonStyles.centered,
        }}>
            <div style={{
                fontFamily,
                fontSize: 180,
                fontWeight: 900,
                color: color,
                transform: `scale(${scale}) translateX(${shake}px)`,
                lineHeight: 0.9,
                textAlign: 'center',
            }}>
                {text}
            </div>
        </AbsoluteFill>
    );
};

export const AwesomeFeatureScene: React.FC = () => {
    return (
        <Series>
            <Series.Sequence durationInFrames={30}>
                <ImpactWord text="STYLE" bg={COLORS.vibrantPink} color={COLORS.white} />
            </Series.Sequence>
            <Series.Sequence durationInFrames={30}>
                <ImpactWord text="BOOK" bg={COLORS.calmingTeal} color={COLORS.white} />
            </Series.Sequence>
            <Series.Sequence durationInFrames={30}>
                <ImpactWord text="GROW" bg={COLORS.white} color={COLORS.charcoal} />
            </Series.Sequence>
            <Series.Sequence durationInFrames={90}>
                <ImpactWord text="THE FUTURE" bg={COLORS.charcoal} color={COLORS.vibrantPink} />
            </Series.Sequence>
        </Series>
    );
};
