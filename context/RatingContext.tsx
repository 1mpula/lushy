import { supabase } from '@/lib/supabase';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export interface Rating {
    id: string;
    clientId: string;
    professionalId: string;
    bookingId: string;
    rating: number;
    createdAt: string;
}

interface RatingContextType {
    submitRating: (bookingId: string, professionalId: string, rating: number) => Promise<boolean>;
    getRatingForBooking: (bookingId: string) => Promise<Rating | null>;
    getAverageRating: (professionalId: string) => Promise<{ average: number; count: number }>;
    isSubmitting: boolean;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export function RatingProvider({ children }: { children: ReactNode }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitRating = useCallback(async (
        bookingId: string,
        professionalId: string,
        rating: number
    ): Promise<boolean> => {
        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Must be logged in to rate');
            }

            const { error } = await supabase
                .from('ratings')
                .insert({
                    client_id: user.id,
                    professional_id: professionalId,
                    booking_id: bookingId,
                    rating: rating,
                });

            if (error) {
                if (error.code === '23505') {
                    // Unique constraint violation - already rated
                    throw new Error('You have already rated this booking');
                }
                throw error;
            }

            return true;
        } catch (err: any) {
            console.error('Error submitting rating:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const getRatingForBooking = useCallback(async (bookingId: string): Promise<Rating | null> => {
        try {
            const { data, error } = await supabase
                .from('ratings')
                .select('*')
                .eq('booking_id', bookingId)
                .single();

            if (error || !data) {
                return null;
            }

            return {
                id: data.id,
                clientId: data.client_id,
                professionalId: data.professional_id,
                bookingId: data.booking_id,
                rating: data.rating,
                createdAt: data.created_at,
            };
        } catch (err) {
            console.error('Error fetching rating:', err);
            return null;
        }
    }, []);

    const getAverageRating = useCallback(async (professionalId: string): Promise<{ average: number; count: number }> => {
        try {
            const { data, error } = await supabase
                .from('ratings')
                .select('rating')
                .eq('professional_id', professionalId);

            if (error || !data || data.length === 0) {
                return { average: 0, count: 0 };
            }

            const total = data.reduce((sum, r) => sum + r.rating, 0);
            const average = Math.round((total / data.length) * 10) / 10;

            return { average, count: data.length };
        } catch (err) {
            console.error('Error fetching average rating:', err);
            return { average: 0, count: 0 };
        }
    }, []);

    return (
        <RatingContext.Provider value={{
            submitRating,
            getRatingForBooking,
            getAverageRating,
            isSubmitting,
        }}>
            {children}
        </RatingContext.Provider>
    );
}

export function useRatings() {
    const context = useContext(RatingContext);
    if (!context) {
        throw new Error('useRatings must be used within a RatingProvider');
    }
    return context;
}
