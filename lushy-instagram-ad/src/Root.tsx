import React from 'react';
import { Composition } from 'remotion';
import { LushyFollowLaunchAd } from './LushyFollowLaunchAd';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* LUSHY FOLLOW TO LAUNCH AD - 20s */}
            <Composition
                id="LushyFollowLaunchAd"
                component={LushyFollowLaunchAd}
                durationInFrames={600}
                fps={30}
                width={1080}
                height={1920}
            />
        </>
    );
};
