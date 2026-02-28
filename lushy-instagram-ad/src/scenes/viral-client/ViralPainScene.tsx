import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

const PainText = ({ text, rotation }: { text: string, rotation: string }) => (
    <div style={{
        ...commonStyles.absoluteFill,
        ...commonStyles.centered,
        backgroundColor: COLORS.white,
    }}>
        <div style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 90,
            color: COLORS.charcoal,
            transform: `rotate(${rotation})`,
            textAlign: 'center',
            border: `10px solid ${COLORS.charcoal}`,
            padding: '20px 40px',
        }}>
            {text}
        </div>
    </div>
);

export const ViralPainScene: React.FC = () => {
    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={15}>
                <PainText text="GHOSTED?" rotation="-5deg" />
            </Sequence>
            <Sequence from={15} durationInFrames={15}>
                <PainText text="NO REPLY?" rotation="5deg" />
            </Sequence>
            <Sequence from={30} durationInFrames={15}>
                <PainText text="FULLY BOOKED?" rotation="-5deg" />
            </Sequence>
        </AbsoluteFill>
    );
};
