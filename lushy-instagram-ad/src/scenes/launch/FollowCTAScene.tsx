import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const FollowCTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Counter animation 0 -> 1000
    const counterValue = interpolate(frame, [0, 60], [0, 1000], {
        extrapolateRight: 'clamp'
    });

    // Pulse animation for the heart
    const pulse = Math.sin(frame / 5) * 0.1 + 1;

    return (
        <AbsoluteFill style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>

            <div style={{
                position: 'absolute',
                top: 200,
                fontSize: 40,
                fontWeight: 'bold',
                color: '#333'
            }}>
                WE LAUNCH AT
            </div>

            <div style={{
                fontSize: 180,
                fontWeight: '900',
                color: '#FF4081',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: -5
            }}>
                {Math.floor(counterValue)}
            </div>

            <div style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 100
            }}>
                FOLLOWERS
            </div>

            <div style={{
                transform: `scale(${pulse})`,
                backgroundColor: 'black',
                padding: '30px 60px',
                borderRadius: 60,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    color: 'white',
                    fontSize: 30,
                    marginBottom: 10
                }}>
                    FOLLOW NOW
                </div>
                <div style={{
                    color: '#FF4081',
                    fontSize: 50,
                    fontWeight: '900'
                }}>
                    @LUSHY_APP
                </div>
            </div>

        </AbsoluteFill>
    );
};
