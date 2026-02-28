import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

const GlitchText = ({ text, top, left, rotation }: { text: string, top: number, left: number, rotation: string }) => (
    <div style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, -50%) rotate(${rotation})`,
        fontFamily,
        fontWeight: 700,
        fontSize: 60,
        color: COLORS.mediumGray,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '10px 20px',
    }}>
        {text}
    </div>
);

export const ProblemScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#eeeeee' }}>
            <Sequence from={0} durationInFrames={60}>
                <div style={{ ...commonStyles.centered, ...commonStyles.absoluteFill }}>
                    <div style={{ fontFamily, fontSize: 80, fontWeight: 900, color: COLORS.charcoal }}>
                        STILL DM-ING?
                    </div>
                </div>
            </Sequence>

            {/* Chaos Overlay */}
            <Sequence from={20} durationInFrames={40}>
                <GlitchText text="No reply..." top={20} left={20} rotation="-10deg" />
            </Sequence>
            <Sequence from={25} durationInFrames={35}>
                <GlitchText text="Is 2pm ok??" top={70} left={80} rotation="15deg" />
            </Sequence>
            <Sequence from={30} durationInFrames={30}>
                <GlitchText text="Price??" top={80} left={30} rotation="-5deg" />
            </Sequence>
            <Sequence from={35} durationInFrames={25}>
                <GlitchText text="Read 2 days ago" top={30} left={70} rotation="5deg" />
            </Sequence>
        </AbsoluteFill>
    );
};
