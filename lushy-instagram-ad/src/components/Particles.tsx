import React, { useMemo } from 'react';
import { random, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../styles';

export const Particles: React.FC<{ count?: number; color?: string }> = ({ count = 50, color = COLORS.white }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const particles = useMemo(() => {
        return new Array(count).fill(0).map((_, i) => {
            const x = random(i) * width;
            const y = random(i + 1) * height;
            const size = random(i + 2) * 4 + 1;
            const speed = random(i + 3) * 2 + 0.5;
            return { x, y, size, speed };
        });
    }, [count, width, height]);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
            {particles.map((p, i) => {
                const y = (p.y - frame * p.speed) % height;
                const finalY = y < 0 ? y + height : y;

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: p.x,
                            top: finalY,
                            width: p.size,
                            height: p.size,
                            borderRadius: '50%',
                            backgroundColor: color,
                            opacity: random(i + 4) * 0.5 + 0.2,
                        }}
                    />
                );
            })}
        </div>
    );
};
