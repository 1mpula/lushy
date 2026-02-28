import { AbsoluteFill, Sequence } from 'remotion';
import { ClientHypeScene } from './scenes/launch/ClientHypeScene';
import { FollowCTAScene } from './scenes/launch/FollowCTAScene';
import { MysteryHookScene } from './scenes/launch/MysteryHookScene';
import { ProviderMoneyScene } from './scenes/launch/ProviderMoneyScene';

export const LushyFollowLaunchAd: React.FC = () => {
    // Total duration: 20 seconds = 600 frames at 30fps
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* <Audio src={staticFile('audio.mp3')} startFrom={60} volume={0.8} /> */}

            {/* 0-4s: The Hook */}
            <Sequence from={0} durationInFrames={120}>
                <MysteryHookScene />
            </Sequence>

            {/* 4-9s: Client Value */}
            <Sequence from={120} durationInFrames={150}>
                <ClientHypeScene />
            </Sequence>

            {/* 9-14s: Provider Value */}
            <Sequence from={270} durationInFrames={150}>
                <ProviderMoneyScene />
            </Sequence>

            {/* 14-20s: CTA */}
            <Sequence from={420} durationInFrames={180}>
                <FollowCTAScene />
            </Sequence>
        </AbsoluteFill>
    );
};
