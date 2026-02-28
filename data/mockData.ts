export interface Product {
    id: string;
    imageUrl: string;
    gallery: string[];
    title: string;
    description: string;
    providerId: string;
    providerName: string;
    providerAvatar: string;
    height: number;
    price: string;
    category: string;
    tags: string[];
}

export interface ProProfile {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    specialties: string[];
    location: string;
    rating: number;
    bookings: number;
    views: number;
    reviews: { id: string; user: string; text: string; rating: number }[];
    portfolio: string[];
}

export const MOCK_FEED_ITEMS: Product[] = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ],
        title: 'Textured Bob Cut',
        description: 'A chic and modern textured bob cut suitable for all face shapes. Includes wash, cut, and style.',
        providerId: 'pro1',
        providerName: 'Sarah Jenkins',
        providerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        height: 300,
        price: 'P65',
        category: 'Hair',
        tags: ['haircut', 'bob', 'short hair'],
    },
    {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ],
        title: 'Gel Manicure Art',
        description: 'Long-lasting gel manicure with custom nail art. Choose from our wide range of colors and designs.',
        providerId: 'pro2',
        providerName: 'Nails by Lisa',
        providerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        height: 220,
        price: 'P45',
        category: 'Nails',
        tags: ['nails', 'gel', 'art'],
    },
    {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        ],
        title: 'Box Braids - Waist Length',
        description: 'Protective style using synthetic hair. Waist length box braids. Hair included in price.',
        providerId: 'pro3',
        providerName: 'Braids Queen',
        providerAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        height: 350,
        price: 'P120',
        category: 'Hair',
        tags: ['braids', 'protective style', 'long hair'],
    },
    {
        id: '4',
        imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ],
        title: 'Balayage Color',
        description: 'Hand-painted highlights for a natural, sun-kissed look. Includes toner and blow-dry.',
        providerId: 'pro4',
        providerName: 'Color Studio',
        providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        height: 280,
        price: 'P180',
        category: 'Hair',
        tags: ['color', 'balayage', 'blonde'],
    },
    {
        id: '5',
        imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        gallery: ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        title: 'Acrylic Set - Pink',
        description: 'Full set of acrylic nails with pink powder. Durable and stylish.',
        providerId: 'pro2',
        providerName: 'Nails by Lisa',
        providerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        height: 240,
        price: 'P55',
        category: 'Nails',
        tags: ['nails', 'acrylic', 'pink'],
    },
    {
        id: '6',
        imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        gallery: ['https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        title: 'Silk Press',
        description: 'Silky smooth straightening for natural hair without chemical relaxers.',
        providerId: 'pro5',
        providerName: 'Natural Hair Heaven',
        providerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        height: 260,
        price: 'P75',
        category: 'Hair',
        tags: ['natural hair', 'silk press', 'straight'],
    },
];

export const MOCK_PROS: Record<string, ProProfile> = {
    'pro1': {
        id: 'pro1',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Professional hair stylist with 10 years of experience. Specializing in precision cuts and modern coloring techniques.',
        specialties: ['Haircuts', 'Coloring', 'Styling'],
        location: 'Downtown Studio',
        rating: 4.8,
        bookings: 142,
        views: 3500,
        reviews: [
            { id: 'r1', user: 'Jessica M.', text: 'Sarah is amazing! My bob looks perfect.', rating: 5 },
            { id: 'r2', user: 'Ashley T.', text: 'Great atmosphere and skilled stylist.', rating: 4.5 }
        ],
        portfolio: [
            'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        ]
    },
    'pro2': {
        id: 'pro2',
        name: 'Nails by Lisa',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Certified nail technician passionate about nail art and healthy nail care.',
        specialties: ['Gel', 'Acrylic', 'Nail Art'],
        location: 'Uptown Salon',
        rating: 4.9,
        bookings: 215,
        views: 5200,
        reviews: [],
        portfolio: []
    },
    'pro3': {
        id: 'pro3',
        name: 'Braids Queen',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'The best braids in the city. Neat, tight, and painless.',
        specialties: ['Box Braids', 'Cornrows', 'Twists'],
        location: 'Southside',
        rating: 5.0,
        bookings: 300,
        views: 8000,
        reviews: [],
        portfolio: []
    },
    'pro4': {
        id: 'pro4',
        name: 'Color Studio',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Expert colorists transforming your hair into a masterpiece.',
        specialties: ['Balayage', 'Ombre', 'Highlights'],
        location: 'City Center',
        rating: 4.7,
        bookings: 180,
        views: 4100,
        reviews: [],
        portfolio: []
    },
    'pro5': {
        id: 'pro5',
        name: 'Natural Hair Heaven',
        providerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Dedicated to the health and beauty of natural textured hair.',
        specialties: ['Silk Press', 'Treatment', 'Trims'],
        location: 'Westside',
        rating: 4.9,
        bookings: 220,
        views: 4800,
        reviews: [],
        portfolio: []
    }
};

export const MOCK_PROVIDER_STATS = {
    bookings: 142,
    views: 3500,
    rating: 4.8,
};
