import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const ClientHypeScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideUp = spring({
        frame,
        fps,
        config: { damping: 12 },
        from: 100,
        to: 0
    });

    const scaleText = spring({
        frame: frame - 20,
        fps,
        config: { damping: 10 },
    });


    return (
        <AbsoluteFill style={{ backgroundColor: '#F5F5F5' }}>
            <AbsoluteFill style={{
                justifyContent: 'center',
                alignItems: 'center',
                transform: `translateY(${slideUp}%)`
            }}>
                {/* Placeholder for App Screen Mockup using CSS/Divs if no image available */}
                <div style={{
                    width: '80%',
                    height: '60%',
                    backgroundColor: 'white',
                    borderRadius: 40,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <div style={{ width: '100%', height: '50%', backgroundColor: '#eee' }}>
                        {/* Mock Image Area */}
                        <div style={{
                            width: '100%', height: '100%',
                            background: 'linear-gradient(45deg, #eee 25%, #ddd 25%, #ddd 50%, #eee 50%, #eee 75%, #ddd 75%, #ddd 100%)',
                            backgroundSize: '40px 40px'
                        }} />
                    </div>
                    <div style={{ padding: 30, width: '100%' }}>
                        <div style={{ width: '60%', height: 30, backgroundColor: '#333', borderRadius: 15, marginBottom: 20 }} />
                        <div style={{ width: '90%', height: 20, backgroundColor: '#ccc', borderRadius: 10, marginBottom: 10 }} />
                        <div style={{ width: '80%', height: 20, backgroundColor: '#ccc', borderRadius: 10 }} />

                        <div style={{
                            marginTop: 40,
                            padding: '15px 30px',
                            backgroundColor: '#FF4081',
                            color: 'white',
                            borderRadius: 15,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 24
                        }}>
                            Book Now
                        </div>
                    </div>
                </div>
            </AbsoluteFill>

            <AbsoluteFill style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 200
            }}>
                <div style={{
                    fontSize: 70,
                    fontWeight: 900,
                    textAlign: 'center',
                    color: 'black',
                    transform: `scale(${Math.max(0, scaleText)})`,
                    textShadow: '0 4px 10px rgba(255, 64, 129, 0.3)'
                }}>
                    BOOK YOUR<br />
                    <span style={{ color: '#FF4081' }}>BEST LOOK</span>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
