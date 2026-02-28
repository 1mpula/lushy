
import { Calendar, LucideIcon, Search, Sparkles } from 'lucide-react-native';

export interface LandingStep {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    gradient: [string, string, string];
    color: string;
}

export interface Review {
    id: number;
    name: string;
    role: string;
    text: string;
    avatar: string;
    rating: number;
}

export const LANDING_DATA = {
    hero: {
        heading: "Book Your\nBest Look",
        subheading: "Discover top-rated stylists, makeup artists, and barbers near you.",
        primaryCta: "Get Started",
        secondaryCta: "Log In",
    },
    steps: [
        {
            id: 1,
            title: "Discover",
            description: "Browse thousands of styles and find the perfect look for you.",
            icon: Search,
            gradient: ['#FF9A9E', '#FECFEF', '#FECFEF'] as [string, string, string],
            color: '#FF4081',
        },
        {
            id: 2,
            title: "Book",
            description: "Connect with top-rated professionals and book instantly.",
            icon: Calendar,
            gradient: ['#a18cd1', '#fbc2eb', '#fbc2eb'] as [string, string, string],
            color: '#9C27B0',
        },
        {
            id: 3,
            title: "Glow Up",
            description: "Show up, get pampered, and leave feeling confident.",
            icon: Sparkles,
            gradient: ['#84fab0', '#8fd3f4', '#8fd3f4'] as [string, string, string],
            color: '#009688',
        },
    ] as LandingStep[],
    stats: {
        clients: "10k+",
        pros: "500+",
        rating: "4.9",
    },
    reviews: [
        {
            id: 1,
            name: "Sarah J.",
            role: "Client",
            text: "Lushy made it so easy to find a braider last minute!",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            rating: 5,
        },
        {
            id: 2,
            name: "David K.",
            role: "Barber",
            text: "My bookings have doubled since joining Lushy.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
            rating: 5,
        },
    ] as Review[],
};
