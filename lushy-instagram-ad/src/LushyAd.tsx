import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import React from 'react';
import { AbsoluteFill } from 'remotion';

import { BookScene } from './scenes/BookScene';
import { BrowseScene } from './scenes/BrowseScene';
import { ConfirmScene } from './scenes/ConfirmScene';
import { CTAScene } from './scenes/CTAScene';
import { IntroScene } from './scenes/IntroScene';
import { COLORS } from './styles';

export const LushyAd: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.white }}>
            <TransitionSeries>
                {/* Scene 1: Intro with logo and tagline */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <IntroScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* Scene 2: Browse hairstyles */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <BrowseScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* Scene 3: Book appointment */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <BookScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* Scene 4: Confirmation */}
                <TransitionSeries.Sequence durationInFrames={60}>
                    <ConfirmScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* Scene 5: Call to Action */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <CTAScene />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
