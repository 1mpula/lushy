import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import React from 'react';
import { AbsoluteFill } from 'remotion';

import { DualCTAScene } from './scenes/dual/DualCTAScene';
import { DualFeatureScene } from './scenes/dual/DualFeatureScene';
import { DualHookScene } from './scenes/dual/DualHookScene';
import { DualSolutionScene } from './scenes/dual/DualSolutionScene';
import { COLORS } from './styles';

/**
 * LushyDualAd - 15-18 second unified ad
 * Target: Clients AND Professionals
 */
export const LushyDualAd: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.white }}>
            <TransitionSeries>
                {/* Scene 1: Hook - Split screen "Fresh Look" vs "New Clients" */}
                {/* Duration: 2.5s = 75 frames */}
                <TransitionSeries.Sequence durationInFrames={75}>
                    <DualHookScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={wipe({ direction: 'from-top' })}
                    timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
                />

                {/* Scene 2: The Perfect Match - Unifying concept */}
                {/* Duration: 3s = 90 frames */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <DualSolutionScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
                />

                {/* Scene 3: Features - Split visuals of app usage */}
                {/* Duration: 4s = 120 frames */}
                <TransitionSeries.Sequence durationInFrames={120}>
                    <DualFeatureScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* Scene 4: CTA - "Get Lushy" */}
                {/* Duration: 3.5s+ = 105 frames + buffer */}
                <TransitionSeries.Sequence durationInFrames={120}>
                    <DualCTAScene />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
