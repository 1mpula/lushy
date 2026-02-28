import { loadFont } from "@remotion/google-fonts/Outfit";
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, commonStyles } from '../../styles';

const { fontFamily } = loadFont();

export const DualFeatureScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Slide logic
    const slideOffset = interpolate(frame, [0, 20, 100, 120], [width, 0, 0, -width], {
        extrapolateRight: 'clamp',
    });

    // Content Opacity for scene 1 (Client)
    const clientOpacity = interpolate(frame, [0, 20, 80, 100], [0, 1, 1, 0]);
    // Content Opacity for scene 2 (Pro) starts later? 
    // Actually, let's do a timed switch within this scene or just two separate beats.

    // Let's do a fast flip style or top/bottom split
    const topProgress = interpolate(frame, [0, 30], [-100, 0], { extrapolateRight: 'clamp' });
    const bottomProgress = interpolate(frame, [0, 30], [100, 0], { extrapolateRight: 'clamp' });


    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
            {/* Top Half: Client - Booking */}
            <AbsoluteFill style={{
                height: '50%',
                top: 0,
                backgroundColor: COLORS.lightPink,
                transform: `translateY(${topProgress}%)`,
                ...commonStyles.centered,
                overflow: 'hidden',
                borderBottom: `4px solid ${COLORS.white}`,
            }}>
                <div style={{
                    position: 'absolute',
                    left: 100,
                    fontFamily,
                    color: COLORS.vibrantPink,
                    fontSize: 60,
                    fontWeight: 800,
                    textAlign: 'left',
                    zIndex: 10,
                }}>
                    BOOK IN<br />SECONDS
                </div>
                {/* Abstract UI Representation */}
                <div style={{
                    position: 'absolute',
                    right: -50,
                    bottom: -100,
                    width: 400,
                    height: 700,
                    backgroundColor: COLORS.white,
                    borderRadius: 40,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    transform: 'rotate(-15deg)',
                }}>
                    {/* UI Elements Mockup */}
                    <div style={{ padding: 30 }}>
                        <div style={{ width: '60%', height: 20, background: '#eee', borderRadius: 10, marginBottom: 20 }}></div>
                        <div style={{ width: '100%', height: 150, background: '#f8f8f8', borderRadius: 20, marginBottom: 20 }}></div>
                        <div style={{ width: '80%', height: 40, background: COLORS.vibrantPink, borderRadius: 10 }}></div>
                    </div>
                </div>
            </AbsoluteFill>

            {/* Bottom Half: Pro - Schedule/Earnings */}
            <AbsoluteFill style={{
                height: '50%',
                top: '50%',
                backgroundColor: '#E0F2F1', // Very light teal
                transform: `translateY(${bottomProgress}%)`,
                ...commonStyles.centered,
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    right: 100,
                    fontFamily,
                    color: COLORS.calmingTeal,
                    fontSize: 60,
                    fontWeight: 800,
                    textAlign: 'right',
                    zIndex: 10,
                }}>
                    GROW YOUR<br />BUSINESS
                </div>
                {/* Abstract UI Representation */}
                <div style={{
                    position: 'absolute',
                    left: -50,
                    top: -50,
                    width: 400,
                    height: 700,
                    backgroundColor: COLORS.white,
                    borderRadius: 40,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    transform: 'rotate(15deg)',
                }}>
                    <div style={{ padding: 30 }}>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            <div style={{ flex: 1, height: 80, background: '#f8f8f8', borderRadius: 15 }}></div>
                            <div style={{ flex: 1, height: 80, background: '#f8f8f8', borderRadius: 15 }}></div>
                        </div>
                        <div style={{ width: '100%', height: 200, background: COLORS.white, border: `2px solid ${COLORS.calmingTeal}`, borderRadius: 20 }}></div>
                    </div>
                </div>
            </AbsoluteFill>

        </AbsoluteFill>
    );
};
