import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const ProviderMoneyScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 15 }
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}> {/* Dark premium background */}
            <AbsoluteFill style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    fontSize: 120,
                    transform: `scale(${entrance})`,
                }}>
                    💸
                </div>

                <div style={{
                    marginTop: 40,
                    fontSize: 50,
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: interpolate(frame, [10, 30], [0, 1])
                }}>
                    HAIRDRESSERS:
                </div>

                <div style={{
                    fontSize: 80,
                    color: '#00E676', // Money Green
                    fontWeight: '900',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    opacity: interpolate(frame, [20, 40], [0, 1]),
                    transform: `translateY(${spring({ frame: frame - 20, fps, config: { damping: 10 }, from: 50, to: 0 })}px)`
                }}>
                    SECURE THE BAG
                </div>

                <div style={{
                    marginTop: 60,
                    backgroundColor: '#FF4081',
                    padding: '20px 40px',
                    borderRadius: 50,
                    color: 'white',
                    fontSize: 30,
                    fontWeight: 'bold',
                    opacity: interpolate(frame, [50, 70], [0, 1])
                }}>
                    0% FEES FOR FOUNDERS
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
