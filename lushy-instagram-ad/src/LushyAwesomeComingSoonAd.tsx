import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import React from 'react';
import { AbsoluteFill } from 'remotion';

import { AwesomeDemoScene } from './scenes/awesome/AwesomeDemoScene';
import { AwesomeHookScene } from './scenes/awesome/AwesomeHookScene';
import { AwesomeOutroScene } from './scenes/awesome/AwesomeOutroScene';
import { AwesomeProblemScene } from './scenes/awesome/AwesomeProblemScene';
import { AwesomeTrustScene } from './scenes/awesome/AwesomeTrustScene';
import { COLORS } from './styles';

export const LushyAwesomeComingSoonAd: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.white }}>
            <TransitionSeries>
                {/* 1. HOOK: 4s (120f) - Imagine... */}
                <TransitionSeries.Sequence durationInFrames={120}>
                    <AwesomeHookScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 2. PROBLEM: 4s (120f) - The Reality data */}
                <TransitionSeries.Sequence durationInFrames={120}>
                    <AwesomeProblemScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
                />

                {/* 3. DEMO: 8s (240f) - App Walkthrough */}
                <TransitionSeries.Sequence durationInFrames={240}>
                    <AwesomeDemoScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-bottom' })}
                    timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
                />

                {/* 4. TRUST: 5s (150f) - Verified/Secure */}
                <TransitionSeries.Sequence durationInFrames={150}>
                    <AwesomeTrustScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* 5. OUTRO: 5s (150f) - Join Waitlist */}
                <TransitionSeries.Sequence durationInFrames={150}>
                    <AwesomeOutroScene />
                </TransitionSeries.Sequence>

            </TransitionSeries>
        </AbsoluteFill>
    );
};
