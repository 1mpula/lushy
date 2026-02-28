// Lushy Design System Colors and Styles
export const COLORS = {
    // Primary colors
    vibrantPink: '#FF4081',
    calmingTeal: '#009688',

    // Backgrounds
    white: '#FFFFFF',
    offWhite: '#F5F5F5',
    lightPink: '#FFF0F5',

    // Text
    charcoal: '#333333',
    mediumGray: '#757575',

    // Gradients
    pinkGradient: 'linear-gradient(135deg, #FF4081 0%, #FF80AB 100%)',
    tealGradient: 'linear-gradient(135deg, #009688 0%, #4DB6AC 100%)',
    subtleGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFF0F5 100%)',
};

// Video dimensions for Instagram Reel
export const VIDEO = {
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 300, // 10 seconds
};

// Professional Ad - 15 seconds (450 frames @ 30fps)
export const PRO_VIDEO = {
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 450, // 15 seconds
};

// Scene timings for professional ad (30fps, accounting for transition overlaps)
export const PRO_SCENES = {
    hook: { start: 0, duration: 75 },           // 0-2.5s
    painPoints: { start: 75, duration: 90 },    // 2.5-5.5s
    solution: { start: 165, duration: 105 },    // 5.5-9s
    benefits: { start: 270, duration: 90 },     // 9-12s
    cta: { start: 360, duration: 90 },          // 12-15s
};

// Scene timings in frames (30fps)
export const SCENES = {
    intro: { start: 0, duration: 45 },        // 0-1.5s
    browse: { start: 45, duration: 60 },      // 1.5-3.5s
    book: { start: 105, duration: 60 },       // 3.5-5.5s
    confirm: { start: 165, duration: 60 },    // 5.5-7.5s
    cta: { start: 225, duration: 75 },        // 7.5-10s
};

// Animation configs
export const SPRING_CONFIG = {
    smooth: { damping: 200 },
    snappy: { damping: 20, stiffness: 200 },
    bouncy: { damping: 8 },
    heavy: { damping: 15, stiffness: 80, mass: 2 },
};

// Common styles
export const commonStyles = {
    absoluteFill: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
};
