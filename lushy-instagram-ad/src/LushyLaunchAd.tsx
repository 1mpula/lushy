import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import React from 'react';
import { AbsoluteFill } from 'remotion';

import { LaunchFeatureBlitzScene } from './scenes/launch/LaunchFeatureBlitzScene';
import { LaunchFinalDropScene } from './scenes/launch/LaunchFinalDropScene';
import { LaunchIconRevealScene } from './scenes/launch/LaunchIconRevealScene';
import { LaunchPulseScene } from './scenes/launch/LaunchPulseScene';
import { COLORS } from './styles';

export const LushyLaunchAd: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.charcoal }}>
            <TransitionSeries>
                {/* 1. BUILD UP: 3s (90 frames) - The Wait Is Over */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <LaunchPulseScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 5 })}
                />

                {/* 2. REVEAL: 2s (60 frames) - Icon Shockwave */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <LaunchIconRevealScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={wipe({ direction: 'from-top' })}
                    timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
                />

                {/* 3. BLITZ: 1.5s (45 frames) - Find. Book. Slay. */}
                <TransitionSeries.Sequence durationInFrames={45}>
                    <LaunchFeatureBlitzScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 5 })}
                />

                {/* 4. DROP: 3s (90 frames) - Final Brand Lockup */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <LaunchFinalDropScene />
                </TransitionSeries.Sequence>

            </TransitionSeries>
        </AbsoluteFill>
    );
};
