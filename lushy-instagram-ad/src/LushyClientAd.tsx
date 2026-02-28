import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import React from 'react';
import { AbsoluteFill } from 'remotion';

import { ClientBenefitsScene } from './scenes/client/ClientBenefitsScene';
import { ClientCTAScene } from './scenes/client/ClientCTAScene';
import { ClientHookScene } from './scenes/client/ClientHookScene';
import { ClientPainScene } from './scenes/client/ClientPainScene';
import { ClientSolutionScene } from './scenes/client/ClientSolutionScene';
import { COLORS } from './styles';

/**
 * LushyClientAd - 15-second persuasive ad targeting clients
 * 
 * Scene breakdown (450 frames @ 30fps = 15 seconds):
 * - Hook: 75 frames (2.5s) - "Tired of Bad Hair Days?"
 * - Pain Points: 75 frames (2.5s) - Client frustrations
 * - Solution: 90 frames (3s) - Lushy app reveal
 * - Benefits: 105 frames (3.5s) - Key benefits
 * - CTA: 105 frames (3.5s) - Download Now
 * 
 * With 4 transitions @ 15 frames each = 60 frames overlap
 * Total: 75 + 75 + 90 + 105 + 105 - 60 = 390 frames
 * Added extra frames to scenes to hit 450 total
 */
export const LushyClientAd: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.white }}>
            <TransitionSeries>
                {/* Scene 1: Hook - Attention grabber */}
                <TransitionSeries.Sequence durationInFrames={80}>
                    <ClientHookScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
                />

                {/* Scene 2: Pain Points - Client frustrations */}
                <TransitionSeries.Sequence durationInFrames={85}>
                    <ClientPainScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* Scene 3: Solution - Lushy app reveal */}
                <TransitionSeries.Sequence durationInFrames={100}>
                    <ClientSolutionScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* Scene 4: Benefits - Key value props */}
                <TransitionSeries.Sequence durationInFrames={110}>
                    <ClientBenefitsScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
                />

                {/* Scene 5: CTA - Download Now */}
                <TransitionSeries.Sequence durationInFrames={135}>
                    <ClientCTAScene />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
