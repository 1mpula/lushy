import { n8nApi } from '@/lib/n8n';
import { supabase } from '@/lib/supabase';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type LocationType = 'house_call' | 'salon_visit';

export interface Booking {
    id: string;
    clientId?: string;
    clientName: string;
    clientPhone?: string;
    professionalId?: string;
    professionalName: string;
    professionalPhone?: string;
    serviceName: string;
    serviceId?: string;
    date: string;
    time: string;
    price: number;
    status: BookingStatus;
    locationType: LocationType;
    address?: string;
    createdAt?: string;
}

interface CreateBookingData {
    clientId: string;
    clientName: string;
    clientPhone?: string;
    professionalId: string;
    professionalName: string;
    professionalPhone?: string;
    serviceId?: string;
    serviceName: string;
    date: string;
    time: string;
    price: number;
    locationType: LocationType;
    address?: string;
}

interface BookingContextType {
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;
    createBooking: (data: CreateBookingData) => Promise<{ success: boolean; bookingId?: string }>;
    respondToBooking: (bookingId: string, status: 'accepted' | 'rejected') => Promise<boolean>;
    refreshBookings: () => Promise<void>;
    getBookingsByStatus: (status: BookingStatus) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch bookings directly from Supabase
    const refreshBookings = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            // Transform to app format
            const transformed: Booking[] = (data || []).map((b: any) => ({
                id: b.id,
                clientId: b.client_id,
                clientName: b.client_name,
                clientPhone: b.client_phone,
                professionalId: b.professional_id,
                professionalName: b.professional_name,
                professionalPhone: b.professional_phone,
                serviceId: b.service_id,
                serviceName: b.service_name,
                date: b.booking_date,
                time: b.booking_time,
                price: b.price,
                status: b.status,
                locationType: b.location_type || 'salon_visit',
                address: b.address,
                createdAt: b.created_at,
            }));

            setBookings(transformed);
        } catch (err: any) {
            console.error('Error fetching bookings:', err);
            setError(err.message || 'Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshBookings();
    }, [refreshBookings]);

    // Create booking: App → Supabase (DB trigger sends push notification automatically)
    const createBooking = async (data: CreateBookingData) => {
        try {
            // Helper to check if a string looks like a UUID
            const isValidUUID = (str: string) => {
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                return uuidRegex.test(str);
            };

            // Insert booking to Supabase
            // The database trigger automatically notifies the professional via Edge Function
            const { data: newBooking, error: insertError } = await supabase
                .from('bookings')
                .insert({
                    // Only include UUID fields if they're valid UUIDs
                    ...(isValidUUID(data.clientId) ? { client_id: data.clientId } : {}),
                    ...(isValidUUID(data.professionalId) ? { professional_id: data.professionalId } : {}),
                    ...(data.serviceId && isValidUUID(data.serviceId) ? { service_id: data.serviceId } : {}),
                    // Always include these string fields
                    client_name: data.clientName,
                    client_phone: data.clientPhone || '',
                    professional_name: data.professionalName,
                    professional_phone: data.professionalPhone || '',
                    service_name: data.serviceName,
                    booking_date: data.date,
                    booking_time: data.time,
                    price: data.price,
                    location_type: data.locationType,
                    address: data.address || '',
                    status: 'pending',
                })
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            // No need to call notifyNewBooking - DB trigger handles it automatically!

            // Refresh to get updated list
            await refreshBookings();

            return { success: true, bookingId: newBooking?.id };
        } catch (err: any) {
            console.error('Error creating booking:', err);
            return { success: false };
        }
    };

    // Professional responds: App → Supabase Edge Function (updates DB + notifies client)
    const respondToBooking = async (bookingId: string, status: 'accepted' | 'rejected') => {
        try {
            // Call Edge Function to handle the response
            // It will: 1) Update Supabase, 2) Notify the client via push
            const result = await n8nApi.respondToBooking(bookingId, status);

            if (result.success) {
                // Refresh to get updated status
                await refreshBookings();
                return true;
            }

            return false;
        } catch (err) {
            console.error('Error responding to booking:', err);
            return false;
        }
    };

    const getBookingsByStatus = (status: BookingStatus) => {
        return bookings.filter(b => b.status === status);
    };

    return (
        <BookingContext.Provider value={{
            bookings,
            isLoading,
            error,
            createBooking,
            respondToBooking,
            refreshBookings,
            getBookingsByStatus,
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBookings() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBookings must be used within a BookingProvider');
    }
    return context;
}

// Convenience hooks
export function usePendingBookings() {
    const { getBookingsByStatus } = useBookings();
    return getBookingsByStatus('pending');
}

export function useAcceptedBookings() {
    const { getBookingsByStatus } = useBookings();
    return getBookingsByStatus('accepted');
}
