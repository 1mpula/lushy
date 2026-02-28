import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const MysteryHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity1 = interpolate(frame, [0, 20], [0, 1]);
    const opacity2 = interpolate(frame, [40, 60], [0, 1]);

    const scale = spring({
        frame: frame - 40,
        fps,
        config: {
            damping: 200,
        },
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#FF4081', // Lushy Pink
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    fontSize: 80,
                    fontWeight: '900',
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif',
                    opacity: opacity1,
                }}
            >
                WHEN IS THE
                <br />
                DROP?
            </div>

            <div
                style={{
                    marginTop: 50,
                    fontSize: 60,
                    fontWeight: 'bold',
                    color: 'black',
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif',
                    opacity: opacity2,
                    transform: `scale(${Math.max(0, scale)})`,
                }}
            >
                IT DEPENDS
                <br />
                ON YOU.
            </div>
        </AbsoluteFill>
    );
};
