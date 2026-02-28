import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

const Step = ({ number, title, sub, color }: { number: string, title: string, sub: string, color: string }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Slide up
    const y = spring({ frame, fps, from: 100, to: 0 });
    const opacity = spring({ frame, fps, from: 0, to: 1 });

    return (
        <AbsoluteFill style={{
            ...commonStyles.centered,
            backgroundColor: color
        }}>
            <div style={{
                textAlign: 'center',
                transform: `translateY(${y}px)`,
                opacity,
            }}>
                <div style={{
                    fontFamily,
                    fontWeight: 900,
                    fontSize: 180,
                    color: 'rgba(255,255,255,0.2)',
                    lineHeight: 0.8,
                }}>
                    {number}
                </div>
                <div style={{
                    fontFamily,
                    fontWeight: 800,
                    fontSize: 100,
                    color: COLORS.white,
                }}>
                    {title}
                </div>
                <div style={{
                    fontFamily,
                    fontWeight: 500,
                    fontSize: 50,
                    color: COLORS.white,
                    marginTop: 20,
                }}>
                    {sub}
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const ExplainerScene: React.FC = () => {
    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={40}>
                <Step number="01" title="FIND" sub="Top Stylists" color={COLORS.calmingTeal} />
            </Sequence>
            <Sequence from={40} durationInFrames={40}>
                <Step number="02" title="BOOK" sub="In Seconds" color={COLORS.vibrantPink} />
            </Sequence>
            <Sequence from={80} durationInFrames={40}>
                <Step number="03" title="RELAX" sub="It's handled" color={COLORS.charcoal} />
            </Sequence>
        </AbsoluteFill>
    );
};
