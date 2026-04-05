import React from 'react';
import {
	AbsoluteFill,
	InterpolateOptions,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Img,
	Sequence,
	staticFile,
} from 'remotion';
import { COLORS, SPRING_CONFIG } from './styles';

const Title: React.FC<{
	text: string;
	color?: string;
	bottom?: number;
	fontSize?: number;
}> = ({ text, color = COLORS.white, bottom = 200, fontSize = 100 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const opacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	const translateY = spring({
		frame,
		fps,
		config: SPRING_CONFIG.snappy,
	}) * -50 + 50;

	return (
		<div
			style={{
				position: 'absolute',
				bottom: `${bottom}px`,
				width: '100%',
				textAlign: 'center',
				color,
				fontSize: `${fontSize}px`,
				fontFamily: 'Outfit, sans-serif',
				fontWeight: 900,
				textTransform: 'uppercase',
				letterSpacing: '5px',
				opacity,
				transform: `translateY(${translateY}px)`,
				textShadow: '0 10px 30px rgba(0,0,0,0.5)',
				padding: '0 40px',
				lineHeight: 1.1,
				zIndex: 10,
			}}
		>
			{text}
		</div>
	);
};

export const LushyHyperRealisticAd: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.charcoal }}>
			{/* SCENE 1: MACRO BEAUTY (0-3s) */}
			<Sequence from={0} durationInFrames={105}>
				<AbsoluteFill>
					<Img
						src={staticFile('scene1_braids.png')}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							transform: `scale(${1 + frame * 0.001})`,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)',
						}}
					/>
					<Title text="The Search Ends Here." />
				</AbsoluteFill>
			</Sequence>

			{/* SCENE 2: APP MOCKUP (3-6s) */}
			<Sequence from={90} durationInFrames={105}>
				<AbsoluteFill>
					<Img
						src={staticFile('scene2_app.png')}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							transform: `scale(${1.1 - (frame - 90) * 0.001})`,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)',
						}}
					/>
					<Title text="Infinite Styles. One App." />
				</AbsoluteFill>
			</Sequence>

			{/* SCENE 3: SUCCESS (6-9s) */}
			<Sequence from={180} durationInFrames={105}>
				<AbsoluteFill>
					<Img
						src={staticFile('scene3_success.png')}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)',
						}}
					/>
					<Title text="Book. Glow. Repeat." />
				</AbsoluteFill>
			</Sequence>

			{/* SCENE 4: HERO COMMUNITY (9-12s) */}
			<Sequence from={270} durationInFrames={105}>
				<AbsoluteFill>
					<Img
						src={staticFile('scene4_hero.png')}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: 'linear-gradient(to top, rgba(255,64,129,0.3) 0%, transparent 100%)',
						}}
					/>
					<Title text="Elite Beauty Unified." />
				</AbsoluteFill>
			</Sequence>

			{/* SCENE 5: CTA (12-15s) */}
			<Sequence from={360} durationInFrames={90}>
				<AbsoluteFill
					style={{
						background: COLORS.pinkGradient,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							fontSize: '180px',
							fontWeight: 900,
							color: COLORS.white,
							fontFamily: 'Outfit, sans-serif',
							letterSpacing: '-5px',
						}}
					>
						LUSHY
					</div>
					<div
						style={{
							fontSize: '50px',
							fontWeight: 700,
							color: COLORS.white,
							marginTop: '40px',
							letterSpacing: '10px',
						}}
					>
						COMING SOON
					</div>

					<div
						style={{
							position: 'absolute',
							bottom: '150px',
							background: COLORS.white,
							padding: '30px 60px',
							borderRadius: '100px',
							boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
						}}
					>
						<span
							style={{
								fontSize: '40px',
								fontWeight: 900,
								color: COLORS.vibrantPink,
							}}
						>
							@lushy_app
						</span>
					</div>

					<div
						style={{
							position: 'absolute',
							bottom: '80px',
							color: COLORS.white,
							fontSize: '24px',
							fontWeight: 500,
							opacity: 0.8,
						}}
					>
						Countdown starts at 200 followers
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
