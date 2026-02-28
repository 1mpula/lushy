import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import React from 'react';
import { AbsoluteFill } from 'remotion';

import { ViralCTAScene } from './scenes/viral-client/ViralCTAScene';
import { ViralDemoScene } from './scenes/viral-client/ViralDemoScene';
import { ViralHookScene } from './scenes/viral-client/ViralHookScene';
import { ViralPainScene } from './scenes/viral-client/ViralPainScene';
import { ViralSolutionScene } from './scenes/viral-client/ViralSolutionScene';
import { COLORS } from './styles';

export const LushyViralClientAd: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.white }}>
            <TransitionSeries>
                {/* 1. HOOK: 2s (60 frames) - BAD HAIR DAY? */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <ViralHookScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 5 })}
                />

                {/* 2. PAIN: 1.5s (45 frames) - Rapid cuts */}
                <TransitionSeries.Sequence durationInFrames={45}>
                    <ViralPainScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-bottom' })}
                    timing={linearTiming({ durationInFrames: 5 })}
                />

                {/* 3. SOLUTION: 2s (60 frames) - Logo Reveal */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <ViralSolutionScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 5 })}
                />

                {/* 4. DEMO: 2s (60 frames) - Browse, Book, Slay */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <ViralDemoScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-top' })}
                    timing={linearTiming({ durationInFrames: 5 })}
                />

                {/* 5. CTA: 2.5s (75 frames) - Get Lushy */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <ViralCTAScene />
                </TransitionSeries.Sequence>

            </TransitionSeries>
        </AbsoluteFill>
    );
};
