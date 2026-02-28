import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

const FeatureCard = ({ title, icon, color }: { title: string, icon: string, color: string }) => (
    <AbsoluteFill style={{ backgroundColor: color, ...commonStyles.centered }}>
        <div style={{
            fontFamily,
            color: COLORS.white,
            fontSize: 100,
            fontWeight: 900,
        }}>
            {title}
        </div>
    </AbsoluteFill>
);

export const ViralDemoScene: React.FC = () => {
    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={20}>
                <FeatureCard title="BROWSE" icon="👀" color={COLORS.vibrantPink} />
            </Sequence>
            <Sequence from={20} durationInFrames={20}>
                <FeatureCard title="BOOK" icon="📅" color={COLORS.calmingTeal} />
            </Sequence>
            <Sequence from={40} durationInFrames={20}>
                <FeatureCard title="SLAY" icon="✨" color={COLORS.charcoal} />
            </Sequence>
        </AbsoluteFill>
    );
};
