import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

const BlitzWord = ({ text, bg, color }: { text: string, bg: string, color: string }) => (
    <AbsoluteFill style={{
        backgroundColor: bg,
        ...commonStyles.centered,
    }}>
        <div style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 140,
            color: color,
            textTransform: 'uppercase',
            letterSpacing: -5,
        }}>
            {text}
        </div>
    </AbsoluteFill>
);

export const LaunchFeatureBlitzScene: React.FC = () => {
    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={15}>
                <BlitzWord text="FIND." bg={COLORS.white} color={COLORS.charcoal} />
            </Sequence>
            <Sequence from={15} durationInFrames={15}>
                <BlitzWord text="BOOK." bg={COLORS.calmingTeal} color={COLORS.white} />
            </Sequence>
            <Sequence from={30} durationInFrames={15}>
                <BlitzWord text="SLAY." bg={COLORS.vibrantPink} color={COLORS.white} />
            </Sequence>
        </AbsoluteFill>
    );
};
