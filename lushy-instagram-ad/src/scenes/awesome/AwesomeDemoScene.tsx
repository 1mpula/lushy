import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const AwesomeDemoScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Scroll animation
    const scrollY = interpolate(frame, [0, 100], [0, -600], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{
            backgroundColor: '#F0F2F5',
            ...commonStyles.centered,
        }}>
            {/* Phone Container */}
            <div style={{
                width: 600,
                height: 1000,
                backgroundColor: COLORS.white,
                borderRadius: 60,
                boxShadow: '0 50px 100px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden',
                border: '15px solid #fff',
            }}>
                {/* Header */}
                <div style={{
                    height: 120,
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 40px',
                    justifyContent: 'space-between',
                    zIndex: 10,
                    backgroundColor: COLORS.white,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }}>
                    <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' }} />
                    <div style={{ fontFamily, fontWeight: 800, fontSize: 32, color: COLORS.vibrantPink }}>LUSHY</div>
                    <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' }} />
                </div>

                {/* Content Scrolling */}
                <div style={{
                    marginTop: 120,
                    transform: `translateY(${scrollY}px)`,
                    padding: 30,
                }}>
                    {/* Search Bar */}
                    <div style={{ height: 80, backgroundColor: '#f8f8f8', borderRadius: 20, marginBottom: 30, display: 'flex', alignItems: 'center', padding: '0 30px' }}>
                        <div style={{ fontFamily, color: '#aaa', fontSize: 24 }}>Find a stylist...</div>
                    </div>

                    {/* Filter Chips */}
                    <div style={{ display: 'flex', gap: 15, marginBottom: 40 }}>
                        {['Braids', 'Makeup', 'Barber', 'Nails'].map((tag, i) => (
                            <div key={i} style={{ padding: '15px 30px', backgroundColor: i === 0 ? COLORS.charcoal : '#eee', borderRadius: 40, color: i === 0 ? '#fff' : '#333', fontFamily, fontSize: 20 }}>
                                {tag}
                            </div>
                        ))}
                    </div>

                    {/* Cards */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ marginBottom: 30, borderRadius: 30, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', backgroundColor: '#fff', padding: 20 }}>
                            <div style={{ height: 250, backgroundColor: '#eee', borderRadius: 20, marginBottom: 20, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 20, right: 20, padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, fontFamily, fontWeight: 'bold' }}>
                                    ⭐️ 5.0
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontFamily, fontWeight: 'bold', fontSize: 28 }}>Stylist Name</div>
                                    <div style={{ fontFamily, color: '#888', fontSize: 20 }}>Braids & Locs</div>
                                </div>
                                <div style={{ padding: '15px 30px', backgroundColor: COLORS.calmingTeal, color: '#fff', borderRadius: 20, fontFamily, fontWeight: 'bold' }}>
                                    Book
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simulated Click */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '70%',
                    width: 80,
                    height: 80,
                    backgroundColor: 'rgba(255, 64, 129, 0.5)',
                    borderRadius: 40,
                    transform: `scale(${interpolate(frame, [40, 50, 60], [0, 1, 0])})`,
                }} />
            </div>

            <div style={{
                position: 'absolute',
                bottom: 100,
                fontFamily,
                fontWeight: 900,
                fontSize: 80,
                color: COLORS.charcoal,
                textShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}>
                BROWSE. BOOK.
            </div>

        </AbsoluteFill>
    );
};
