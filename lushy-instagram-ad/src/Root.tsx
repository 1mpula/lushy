import React from 'react';
import { Composition } from 'remotion';
import { LushyHyperRealisticAd } from './LushyHyperRealisticAd';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* LUSHY HYPER REALISTIC AD - 15s */}
			<Composition
				id="LushyHyperRealisticAd"
				component={LushyHyperRealisticAd}
				durationInFrames={450}
				fps={30}
				width={1080}
				height={1920}
			/>
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
