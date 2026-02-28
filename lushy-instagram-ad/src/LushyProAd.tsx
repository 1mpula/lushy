import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import React from 'react';
import { AbsoluteFill } from 'remotion';

import { BenefitsScene } from './scenes/pro/BenefitsScene';
import { HookScene } from './scenes/pro/HookScene';
import { PainPointsScene } from './scenes/pro/PainPointsScene';
import { ProCTAScene } from './scenes/pro/ProCTAScene';
import { SolutionScene } from './scenes/pro/SolutionScene';
import { COLORS } from './styles';

/**
 * LushyProAd - 15 second professional advertisement
 * Target audience: Hairdressers, stylists, and salon owners
 * 
 * Scene breakdown (450 frames @ 30fps = 15 seconds):
 * 1. Hook: "Still Missing Clients?" - 75 frames (2.5s)
 * 2. Pain Points: Problems professionals face - 90 frames (3s)
 * 3. Solution: Lushy feature showcase - 105 frames (3.5s)
 * 4. Benefits: Stats and value props - 90 frames (3s)
 * 5. CTA: Download prompt - 90 frames (3s)
 */
export const LushyProAd: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.white }}>
            <TransitionSeries>
                {/* Scene 1: Hook - attention-grabbing question */}
                <TransitionSeries.Sequence durationInFrames={75}>
                    <HookScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 12 })}
                />

                {/* Scene 2: Pain Points - problems professionals face */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <PainPointsScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
                />

                {/* Scene 3: Solution - Lushy features */}
                <TransitionSeries.Sequence durationInFrames={105}>
                    <SolutionScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={wipe({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 12 })}
                />

                {/* Scene 4: Benefits - stats and value propositions */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <BenefitsScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 12 })}
                />

                {/* Scene 5: CTA - call to action */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <ProCTAScene />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
