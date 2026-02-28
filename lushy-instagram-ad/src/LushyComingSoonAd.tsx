import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import React from 'react';
import { AbsoluteFill } from 'remotion';

import { ExplainerScene } from './scenes/coming-soon/ExplainerScene';
import { OutroScene } from './scenes/coming-soon/OutroScene';
import { ProblemScene } from './scenes/coming-soon/ProblemScene';
import { TransitionScene } from './scenes/coming-soon/TransitionScene';
import { COLORS } from './styles';

export const LushyComingSoonAd: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.white }}>
            <TransitionSeries>
                {/* 1. PROBLEM: 2s (60 frames) - The chaos of old booking */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <ProblemScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-top' })}
                    timing={linearTiming({ durationInFrames: 5 })}
                />

                {/* 2. STOP: 1s (30 frames) - Hard stop */}
                <TransitionSeries.Sequence durationInFrames={30}>
                    <TransitionScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-bottom' })}
                    timing={linearTiming({ durationInFrames: 5 })}
                />

                {/* 3. EXPLAIN: 4s (120 frames) - Find, Book, Relax */}
                <TransitionSeries.Sequence durationInFrames={120}>
                    <ExplainerScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 10 })}
                />

                {/* 4. OUTRO: 3s (90 frames) - Coming Soon */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <OutroScene />
                </TransitionSeries.Sequence>

            </TransitionSeries>
        </AbsoluteFill>
    );
};
