// Supabase Database Types for Lushy

export type UserRole = 'client' | 'provider';
export type LocationType = 'house_call' | 'salon_visit';
export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'paid' | 'completed' | 'cancelled';

export interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface Provider {
    id: string;
    user_id: string;
    salon_name: string | null;
    bio: string | null;
    location: string | null;
    rating: number;
    total_reviews: number;
    is_verified: boolean;
    blocked_dates: string[] | null; // Array of ISO date strings for blocked dates
    created_at: string;
    updated_at: string;
    // Joined fields
    profile?: Profile;
}

export interface Service {
    id: string;
    provider_id: string;
    name: string;
    description: string | null;
    price: number;
    duration_minutes: number;
    image_url: string | null; // Deprecated, kept for types if needed temporarily
    image_urls: string[] | null;
    image_width: number | null;
    image_height: number | null;
    category: string;
    is_active: boolean;
    created_at: string;
    // Joined fields
    provider?: Provider;
}

export interface Booking {
    id: string;
    client_id: string | null;
    provider_id: string | null;
    service_id: string | null;
    client_name: string;
    provider_name: string;
    service_name: string;
    price: number;
    booking_date: string;
    booking_time: string;
    location_type: LocationType;
    address: string | null;
    status: BookingStatus;
    created_at: string;
    updated_at: string;
    // Joined fields
    client?: Profile;
    provider?: Provider;
    service?: Service;
}

// Database schema type for Supabase client
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
            };
            providers: {
                Row: Provider;
                Insert: Omit<Provider, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_reviews'>;
                Update: Partial<Omit<Provider, 'id' | 'created_at'>>;
            };
            services: {
                Row: Service;
                Insert: Omit<Service, 'id' | 'created_at'>;
                Update: Partial<Omit<Service, 'id' | 'created_at'>>;
            };
            bookings: {
                Row: Booking;
                Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Booking, 'id' | 'created_at'>>;
            };
        };
    };
}
